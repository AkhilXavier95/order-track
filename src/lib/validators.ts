// lib/validators.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().min(1).email(),
  password: z
    .string()
    .min(8)
    .max(128)
    .refine((p) => /[A-Z]/.test(p), "must contain an uppercase letter")
    .refine((p) => /[a-z]/.test(p), "must contain a lowercase letter")
    .refine((p) => /[0-9]/.test(p), "must contain a digit")
    .refine((p) => /[^A-Za-z0-9]/.test(p), "must contain a special character"),
  name: z.string().max(100).optional()
});

export const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1)
});
