/**
 * React Query hooks for fetching user number statistics.
 * These hooks require authentication (Signal feature enabled).
 */

import { useQuery } from "@tanstack/react-query";

import type { PatternStat } from "@/lib/numbers";
import { numbersKeys } from "./query-keys";

// ============================================================================
// Types
// ============================================================================

interface AllStatsResponse {
  stats: PatternStat[];
  totalSightings: number;
  uniquePatterns: number;
}

interface PatternStatResponse {
  pattern: string;
  stats: PatternStat | null;
}

// ============================================================================
// Fetch Functions
// ============================================================================

async function fetchAllStats(): Promise<AllStatsResponse> {
  const res = await fetch("/api/numbers/stats");
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch stats");
  }
  return res.json() as Promise<AllStatsResponse>;
}

async function fetchPatternStat(pattern: string): Promise<PatternStatResponse> {
  const res = await fetch(`/api/numbers/stats?pattern=${pattern}`);
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch pattern stat");
  }
  return res.json() as Promise<PatternStatResponse>;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Fetch all number stats for the authenticated user.
 *
 * @example
 * ```tsx
 * const { stats, totalSightings, uniquePatterns, isLoading } = useNumberStats();
 * ```
 */
export function useNumberStats(options?: { enabled?: boolean }) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: numbersKeys.allStats(),
    queryFn: fetchAllStats,
    enabled: options?.enabled ?? true,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message === "Unauthorized") {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    stats: data?.stats ?? [],
    totalSightings: data?.totalSightings ?? 0,
    uniquePatterns: data?.uniquePatterns ?? 0,
    isLoading,
    isError: !!error,
    isUnauthorized:
      error instanceof Error && error.message === "Unauthorized",
    error,
    refetch,
  };
}

/**
 * Fetch stats for a specific pattern for the authenticated user.
 *
 * @example
 * ```tsx
 * const { stat, hasLogged, count, isLoading } = useNumberStat("444");
 * ```
 */
export function useNumberStat(pattern: string, options?: { enabled?: boolean }) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: numbersKeys.patternStat(pattern),
    queryFn: () => fetchPatternStat(pattern),
    enabled: (options?.enabled ?? true) && !!pattern,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message === "Unauthorized") {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    stat: data?.stats ?? null,
    hasLogged: !!data?.stats,
    count: data?.stats?.count ?? 0,
    firstSeen: data?.stats?.firstSeen ?? null,
    lastSeen: data?.stats?.lastSeen ?? null,
    isLoading,
    isError: !!error,
    isUnauthorized:
      error instanceof Error && error.message === "Unauthorized",
    error,
    refetch,
  };
}
