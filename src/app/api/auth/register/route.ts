// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/auth";
import { signVerificationTokenAndStore } from "@/lib/verify"; // helper we'll add
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = (
      req.headers.get("x-forwarded-for") ??
      req.headers.get("host") ??
      "unknown"
    ).toString();
    const rate = checkRateLimit(`register:${ip}`);
    if (!rate.ok)
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.message },
        { status: 400 }
      );

    const { email, password, name } = parsed.data;

    // Check duplicate email (race: use unique constraint + try/catch)
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing)
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );

    const passwordHash = hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name }
    });

    // create email verification token (single-use stored hashed)
    await signVerificationTokenAndStore(user.id, email);

    // respond with minimal user info
    return NextResponse.json(
      { ok: true, user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (err: any) {
    // Unique constraint race condition catch
    if (err?.code === "P2002")
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
