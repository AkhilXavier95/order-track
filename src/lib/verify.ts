// lib/verify.ts
import crypto from "crypto";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "./email";

export async function signVerificationTokenAndStore(
  userId: string,
  email: string
) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = bcrypt.hashSync(token, 12);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  await prisma.verificationToken.create({
    data: { tokenHash, userId, expiresAt }
  });
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}&id=${userId}`;
  const html = `<p>Click to verify: <a href="${url}">${url}</a></p>`;
  await sendEmail(email, "Verify your email", html);
}
