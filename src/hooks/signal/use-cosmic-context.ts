"use client";

import { useQuery } from "@tanstack/react-query";
import { signalKeys } from "./query-keys";
import type { DashboardCosmicContext } from "@/lib/signal";

/**
 * Fetch current cosmic context from API
 */
async function fetchCosmicContext(): Promise<DashboardCosmicContext> {
  const response = await fetch("/api/signal/cosmic-context");
  if (!response.ok) {
    throw new Error("Failed to fetch cosmic context");
  }
  return response.json();
}

/**
 * Hook to fetch current cosmic context for the dashboard.
 *
 * Features:
 * - 5 minute stale time (cosmos changes slowly)
 * - No refetch on window focus (user controls refresh)
 * - Manual refetch via returned function
 *
 * @returns Current cosmic context with loading/error states and refetch function
 */
export function useCurrentCosmicContext() {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: signalKeys.cosmicContext(),
    queryFn: fetchCosmicContext,
    staleTime: 5 * 60 * 1000, // 5 minutes before considered stale
    refetchOnWindowFocus: false, // User controls refresh
  });

  return {
    cosmicContext: data ?? null,
    isLoading,
    isFetching,
    isError: !!error,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
