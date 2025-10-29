// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import {
  verifyPassword,
  signAccessToken,
  signRefreshToken,
  storeRefreshToken
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "unknown").toString();
    const rate = checkRateLimit(`login:${ip}`);
    if (!rate.ok)
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const ok = verifyPassword(password, user.passwordHash);
    if (!ok)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    // Optionally check email verified
    // if (!user.isEmailVerified) return NextResponse.json({ error: "Email not verified" }, { status: 403 });

    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });

    // store refresh token hashed in DB
    await storeRefreshToken(user.id, refreshToken);

    // set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/"
    };

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email }
    });
    res.headers.append(
      "Set-Cookie",
      serialize("refresh_token", refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })
    );
    res.headers.append(
      "Set-Cookie",
      serialize("access_token", accessToken, {
        ...cookieOptions,
        maxAge: 60 * 15 // 15 mins
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
