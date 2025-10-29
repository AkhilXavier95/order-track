// lib/rateLimit.ts
const bucket: Record<string, { count: number; last: number }> = {};
const WINDOW_MS = 60_000; // 1 minute
const MAX = 10;

export function checkRateLimit(key: string) {
  const now = Date.now();
  const entry = bucket[key] ?? { count: 0, last: now };
  if (now - entry.last > WINDOW_MS) {
    bucket[key] = { count: 1, last: now };
    return { ok: true, remaining: MAX - 1 };
  }
  entry.count += 1;
  entry.last = now;
  bucket[key] = entry;
  if (entry.count > MAX) return { ok: false, retryAfter: WINDOW_MS };
  return { ok: true, remaining: MAX - entry.count };
}
