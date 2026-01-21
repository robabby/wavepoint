/**
 * Query key factory for Numbers React Query hooks.
 * Following the same pattern as Signal hooks.
 */

import type { NumberCategory } from "@/lib/numbers";

export const numbersKeys = {
  all: ["numbers"] as const,

  // Patterns
  patterns: () => [...numbersKeys.all, "patterns"] as const,
  patternsList: (filters?: { category?: NumberCategory; featured?: boolean }) =>
    [...numbersKeys.patterns(), filters] as const,
  pattern: (pattern: string) => [...numbersKeys.patterns(), pattern] as const,

  // Stats (authenticated)
  stats: () => [...numbersKeys.all, "stats"] as const,
  allStats: () => [...numbersKeys.stats(), "all"] as const,
  patternStat: (pattern: string) => [...numbersKeys.stats(), pattern] as const,
};
