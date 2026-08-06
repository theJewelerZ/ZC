import "server-only";

import { createHash, randomBytes } from "node:crypto";

type RateRecord = { count: number; resetAt: number };

const records = new Map<string, RateRecord>();
const runtimeSalt = randomBytes(16).toString("hex");

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function checkAdminAuthRateLimit(
  address: string,
  userAgent: string,
  action: "login" | "recovery" | "password-update",
  now = Date.now(),
) {
  const secret = process.env.CONTACT_RATE_LIMIT_SECRET || runtimeSalt;
  const key = createHash("sha256")
    .update(`${secret}:${action}:${address}:${userAgent.slice(0, 180)}`)
    .digest("hex");
  const maximum = positiveInteger(process.env.ADMIN_AUTH_RATE_LIMIT_MAX, 8);
  const windowMs = positiveInteger(
    process.env.ADMIN_AUTH_RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1_000,
  );
  const existing = records.get(key);

  if (!existing || existing.resetAt <= now) {
    records.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, resetAt: now + windowMs };
  }
  if (existing.count >= maximum) {
    return { allowed: false, resetAt: existing.resetAt };
  }
  existing.count += 1;
  return { allowed: true, resetAt: existing.resetAt };
}
