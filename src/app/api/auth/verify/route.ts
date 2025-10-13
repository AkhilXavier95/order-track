// app/api/auth/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, id } = await req.json();
  if (!token || !id)
    return NextResponse.json({ error: "Missing token or id" }, { status: 400 });

  // find tokens for user
  const tokens = await prisma.verificationToken.findMany({
    where: { userId: id }
  });
  for (const t of tokens) {
    if (bcrypt.compareSync(token, t.tokenHash)) {
      if (t.expiresAt < new Date())
        return NextResponse.json({ error: "Token expired" }, { status: 400 });

      await prisma.user.update({
        where: { id },
        data: { isEmailVerified: true }
      });
      await prisma.verificationToken.deleteMany({ where: { userId: id } });
      return NextResponse.json({ ok: true });
    }
  }
  return NextResponse.json({ error: "Invalid token" }, { status: 400 });
}
