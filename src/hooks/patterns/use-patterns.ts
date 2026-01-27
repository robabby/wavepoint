import { useQuery } from "@tanstack/react-query";
import type { ComputedPatterns } from "@/lib/patterns";
import { patternsKeys } from "./query-keys";

async function fetchPatterns(): Promise<ComputedPatterns> {
  const res = await fetch("/api/signal/patterns");
  if (!res.ok) throw new Error("Failed to fetch patterns");
  return res.json() as Promise<ComputedPatterns>;
}

/**
 * Hook to get computed pattern insights for the current user.
 * Automatically triggers recomputation if patterns are stale.
 */
export function usePatterns() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: patternsKeys.user(),
    queryFn: fetchPatterns,
    staleTime: 1000 * 60 * 5, // Consider fresh for 5 minutes
  });

  return {
    patterns: data ?? null,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}
