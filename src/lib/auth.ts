// lib/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";

export function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
}
export function verifyPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export function signAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}
export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}

// store hashed refresh token in DB
export async function storeRefreshToken(userId: string, token: string) {
  const tokenHash = bcrypt.hashSync(token, 12);
  const decoded: any = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);
  return await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt
    }
  });
}

// validate refresh token by checking signature + matching hashed token in DB
export async function validateRefreshToken(userId: string, token: string) {
  try {
    const dbTokens = await prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    for (const t of dbTokens) {
      if (bcrypt.compareSync(token, t.tokenHash)) {
        if (t.expiresAt < new Date()) return null;
        return t;
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}
