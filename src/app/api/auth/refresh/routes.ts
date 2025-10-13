// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { parse } from "cookie";
import {
  verifyRefreshToken,
  validateRefreshToken,
  signAccessToken,
  signRefreshToken,
  storeRefreshToken
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = parse(cookieHeader);
    const token = cookies["refresh_token"];
    if (!token)
      return NextResponse.json({ error: "No token" }, { status: 401 });

    let decoded: any;
    try {
      decoded = verifyRefreshToken(token) as any;
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = decoded.userId;
    const valid = await validateRefreshToken(userId, token);
    if (!valid)
      return NextResponse.json(
        { error: "Invalid or revoked token" },
        { status: 401 }
      );

    // rotate refresh token: create new one, delete old DB entry
    await prisma.refreshToken.deleteMany({ where: { id: valid.id } });

    const newRefresh = signRefreshToken({ userId });
    await storeRefreshToken(userId, newRefresh);
    const newAccess = signAccessToken({ userId });

    const res = NextResponse.json({ ok: true });
    res.headers.append(
      "Set-Cookie",
      serialize("refresh_token", newRefresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30
      })
    );
    res.headers.append(
      "Set-Cookie",
      serialize("access_token", newAccess, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15
      })
    );
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
