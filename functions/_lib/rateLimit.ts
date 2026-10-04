/**
 * Best-effort per-IP rate limiting for /api/advise.
 *
 * HONEST LIMITATION: this lives in a module-level Map, so it is accurate only
 * per Cloudflare isolate. It does NOT provide global protection; the real
 * safeguard must be a Cloudflare WAF rate-limiting rule on /api/advise
 * (Security → WAF → Rate limiting rules). If a KV namespace is later bound,
 * this limiter could be backed by KV for near-global accuracy. No KV required
 * now.
 */

const PER_MINUTE = 12;
const PER_DAY = 120;
const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * 60_000;
/** Prune when the map grows past this to keep memory bounded. */
const MAX_TRACKED_IPS = 5_000;

export interface Bucket {
  minuteStart: number;
  minuteCount: number;
  dayStart: number;
  dayCount: number;
}

const buckets = new Map<string, Bucket>();

// Cloudflare Workers forbid timers/async I/O in global scope, so any pruning
// happens lazily on request, never via setInterval at module load.
const state = { requests: 0 };

export function emptyBucket(now: number): Bucket {
  return { minuteStart: now, minuteCount: 0, dayStart: now, dayCount: 0 };
}

function pruneExpired(now: number): void {
  if (buckets.size < MAX_TRACKED_IPS) return;
  for (const [ip, bucket] of buckets) {
    if (now - bucket.minuteStart >= MINUTE_MS && now - bucket.dayStart >= DAY_MS) {
      buckets.delete(ip);
    }
  }
}

export function clientIp(request: Request): string {
  const cfIp = request.headers.get("CF-Connecting-IP");
  if (cfIp && cfIp.trim().length > 0) return cfIp.trim();
  // Non-Cloudflare local dev fallback; X-Forwarded-For is spoofable, so this is
  // best-effort by design.
  const xff = request.headers.get("X-Forwarded-For");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return "unknown";
}

export type RateLimitResult = "allowed" | "minute" | "day";

/**
 * Pure decision helper: whether a request is allowed given the bucket state at
 * `now`. Window rollovers are handled by the caller (hitRateLimit), so a bucket
 * whose windows have not expired is judged by its counts. Unit-tested.
 */
export function evaluateLimit(
  bucket: Bucket,
  now: number,
  perMinute = PER_MINUTE,
  perDay = PER_DAY,
): RateLimitResult {
  const minuteActive = now - bucket.minuteStart < MINUTE_MS;
  const dayActive = now - bucket.dayStart < DAY_MS;
  if (minuteActive && bucket.minuteCount >= perMinute) return "minute";
  if (dayActive && bucket.dayCount >= perDay) return "day";
  return "allowed";
}

/**
 * Records one request for `ip` and returns whether it is allowed. Resets a
 * window when it has rolled over. Returns the window that was hit so the
 * caller can set Retry-After sensibly.
 */
export function hitRateLimit(
  ip: string,
  now = Date.now(),
): { result: RateLimitResult; retryAfter: number } {
  state.requests += 1;
  // Lazy pruning keeps memory bounded without global-scope timers.
  if (state.requests % 100 === 0) pruneExpired(now);
  const bucket = buckets.get(ip) ?? emptyBucket(now);

  if (now - bucket.minuteStart >= MINUTE_MS) {
    bucket.minuteStart = now;
    bucket.minuteCount = 0;
  }
  if (now - bucket.dayStart >= DAY_MS) {
    bucket.dayStart = now;
    bucket.dayCount = 0;
  }

  const verdict = evaluateLimit(bucket, now);
  if (verdict !== "allowed") {
    const windowStart = verdict === "minute" ? bucket.minuteStart : bucket.dayStart;
    const windowMs = verdict === "minute" ? MINUTE_MS : DAY_MS;
    buckets.set(ip, bucket);
    return { result: verdict, retryAfter: Math.max(1, Math.ceil((windowStart + windowMs - now) / 1000)) };
  }

  bucket.minuteCount += 1;
  bucket.dayCount += 1;
  buckets.set(ip, bucket);
  return { result: "allowed", retryAfter: 0 };
}

/** Visible to tests: clear all state. */
export function resetRateLimiter(): void {
  buckets.clear();
}
