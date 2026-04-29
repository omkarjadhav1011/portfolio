import "server-only";

// In-memory token bucket — best-effort, per-server-instance only.
// Buckets are lost on cold starts and not shared across instances.
// If the site sees real traffic, move this to Upstash / Redis.

const CAPACITY = 10; // burst size
const REFILL_PER_MS = 10 / 60_000; // 10 tokens per 60s → ~1 token / 6s

interface Bucket {
  tokens: number;
  updatedAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds?: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);
  const bucket: Bucket = existing
    ? {
        tokens: Math.min(
          CAPACITY,
          existing.tokens + (now - existing.updatedAt) * REFILL_PER_MS
        ),
        updatedAt: now,
      }
    : { tokens: CAPACITY, updatedAt: now };

  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    const retryAfterMs = Math.ceil((1 - bucket.tokens) / REFILL_PER_MS);
    return { ok: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return { ok: true };
}

export function clientIpFrom(headers: Headers): string {
  // x-forwarded-for is "client, proxy1, proxy2" — first entry is the client.
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
