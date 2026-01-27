import { useQuery } from "@tanstack/react-query";
import type { ResonanceSummary } from "@/lib/resonance";
import { resonanceKeys } from "./query-keys";

interface ResonanceSummaryResponse {
  summary: ResonanceSummary;
}

async function fetchResonanceSummary(): Promise<ResonanceSummaryResponse> {
  const res = await fetch("/api/profile/resonance-summary");
  if (!res.ok) throw new Error("Failed to fetch resonance summary");
  return res.json() as Promise<ResonanceSummaryResponse>;
}

/**
 * Hook to get aggregate resonance stats for the current user.
 * Returns total responses, resonance rate (%), and trend direction.
 */
export function useResonanceSummary() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: resonanceKeys.summary(),
    queryFn: fetchResonanceSummary,
  });

  return {
    summary: data?.summary ?? null,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}
