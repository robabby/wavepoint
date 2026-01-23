/**
 * Rate limiting with Upstash Redis (production) or in-memory fallback (development).
 *
 * Uses @upstash/ratelimit for atomic rate limiting via Lua scripts to prevent race conditions.
 * Falls back to in-memory limiting when Upstash is not configured.
 */

import { env } from "@/env";

// In-memory fallback for local development without Upstash
const localLimits = new Map<string, { count: number; resetAt: number }>();

import type { Ratelimit } from "@upstash/ratelimit";

// Cache of ratelimiters by configuration (limit:windowMs)
const ratelimiters = new Map<string, Ratelimit>();

interface RateLimitOptions {
  /** Max requests per window (default: 30) */
  limit?: number;
  /** Window duration in ms (default: 60000 = 1 minute) */
  windowMs?: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Get or create a ratelimiter for the given configuration.
 * Caches instances to avoid recreating for the same limit/window.
 */
async function getRatelimiter(limit: number, windowMs: number) {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  const configKey = `${limit}:${windowMs}`;
  const cached = ratelimiters.get(configKey);
  if (cached) {
    return cached;
  }

  const { Ratelimit } = await import("@upstash/ratelimit");
  const { Redis } = await import("@upstash/redis");

  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Convert ms to seconds for sliding window (minimum 1 second)
  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));

  // Sliding window algorithm - more accurate than fixed window
  const ratelimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    analytics: true, // Track usage in Upstash dashboard
    prefix: "wavepoint:ratelimit",
  });

  ratelimiters.set(configKey, ratelimiter);
  return ratelimiter;
}

/**
 * Check if a request is allowed under rate limiting.
 *
 * @param key - Unique identifier for the rate limit bucket (e.g., `${userId}:sighting:create`)
 * @param options - Rate limit configuration
 * @returns Promise resolving to rate limit result
 */
export async function checkRateLimit(
  key: string,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const { limit = 30, windowMs = 60000 } = options;
  const now = Date.now();

  // Try Upstash first with fail-open pattern
  try {
    const limiter = await getRatelimiter(limit, windowMs);

    if (limiter) {
      const result = await limiter.limit(key);
      return {
        allowed: result.success,
        remaining: result.remaining,
        resetAt: result.reset,
      };
    }
  } catch (error) {
    // Fail open - log error but don't block requests
    console.error("[rate-limit] Upstash error, failing open:", error);
    return { allowed: true, remaining: -1, resetAt: now + windowMs };
  }

  // Fallback: In-memory (local dev without Upstash)
  const record = localLimits.get(key);

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    localLimits.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetAt: record.resetAt,
  };
}

// Cleanup old entries periodically to prevent memory leak (in-memory fallback only)
// Note: In serverless, this only runs while the instance is warm
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, record] of localLimits.entries()) {
        if (now > record.resetAt) {
          localLimits.delete(key);
        }
      }
    },
    60000
  );
}
