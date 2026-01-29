/**
 * In-memory cache for ephemeris day results.
 *
 * Ephemeris data is deterministic (same date + timezone = same result),
 * so cached values never go stale. Module-level Map follows the same
 * pattern as src/lib/rate-limit/index.ts (localLimits).
 */

import type { DashboardCosmicContext } from "@/lib/signal/cosmic-context";

const MAX_ENTRIES = 400;
const cache = new Map<string, DashboardCosmicContext>();

export function makeEphemerisKey(dateStr: string, tz: string): string {
  return `${dateStr}:${tz}`;
}

export function getCachedEphemeris(key: string): DashboardCosmicContext | undefined {
  return cache.get(key);
}

export function setCachedEphemeris(key: string, value: DashboardCosmicContext): void {
  if (cache.size >= MAX_ENTRIES) {
    cache.clear();
  }
  cache.set(key, value);
}
