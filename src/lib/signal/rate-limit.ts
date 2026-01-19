/**
 * In-memory rate limiting.
 * Sufficient for feature-flagged beta; upgrade to Redis when scaling.
 */

const rateLimits = new Map<string, { count: number; resetAt: number }>();

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
 * Check if a request is allowed under rate limiting.
 */
export function checkRateLimit(
  userId: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { limit = 30, windowMs = 60000 } = options;
  const now = Date.now();
  const record = rateLimits.get(userId);

  // First request or window expired
  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    rateLimits.set(userId, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  // Within window but over limit
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  // Within window and under limit
  record.count++;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

// Cleanup old entries periodically to prevent memory leak
// Note: In serverless, this only runs while the instance is warm
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [userId, record] of rateLimits.entries()) {
      if (now > record.resetAt) {
        rateLimits.delete(userId);
      }
    }
  }, 60000);
}
