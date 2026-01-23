/**
 * Rate limiting for Signal API routes.
 * Uses Upstash Redis in production, falls back to in-memory locally.
 *
 * Re-exported from @/lib/rate-limit for backwards compatibility.
 */
export { checkRateLimit } from "@/lib/rate-limit";
