// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { parse, serialize } from "cookie";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies["refresh_token"];
  if (token) {
    // attempt to find and remove the refresh token from DB (compare by hash)
    // simpler: delete all refresh tokens for user (or only the matching one if validated)
    // For safety, keep it simple: decode token -> userId -> delete tokens
    try {
      const decoded: any = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      const userId = decoded.userId;
      await prisma.refreshToken.deleteMany({ where: { userId } });
    } catch (e) {
      /* noop */
    }
  }

  const res = NextResponse.json({ ok: true });
  // clear cookies
  res.headers.append(
    "Set-Cookie",
    serialize("refresh_token", "", { httpOnly: true, path: "/", maxAge: 0 })
  );
  res.headers.append(
    "Set-Cookie",
    serialize("access_token", "", { httpOnly: true, path: "/", maxAge: 0 })
  );
  return res;
}
