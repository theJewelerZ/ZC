import { createHash, randomBytes } from "node:crypto";

type RateRecord = {
  count: number;
  resetAt: number;
};

const records = new Map<string, RateRecord>();
const runtimeSalt = randomBytes(16).toString("hex");

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function createRequestFingerprint(address: string, userAgent: string) {
  const secret = process.env.CONTACT_RATE_LIMIT_SECRET || runtimeSalt;
  return createHash("sha256")
    .update(`${secret}:${address}:${userAgent.slice(0, 180)}`)
    .digest("hex");
}

export function checkRateLimit(key: string, now = Date.now()) {
  const maximum = positiveInteger(process.env.CONTACT_RATE_LIMIT_MAX, 5);
  const windowMs = positiveInteger(
    process.env.CONTACT_RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1_000,
  );
  const existing = records.get(key);

  if (!existing || existing.resetAt <= now) {
    records.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maximum - 1, resetAt: now + windowMs };
  }

  if (existing.count >= maximum) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;

  if (records.size > 500) {
    for (const [recordKey, record] of records) {
      if (record.resetAt <= now) {
        records.delete(recordKey);
      }
    }
  }

  return {
    allowed: true,
    remaining: maximum - existing.count,
    resetAt: existing.resetAt,
  };
}

