import { useQuery } from "@tanstack/react-query";
import type { NumberCount } from "@/lib/signal/types";
import { signalKeys } from "./query-keys";

interface StatsResponse {
  totalSightings: number;
  uniqueNumbers: number;
  numberCounts: NumberCount[];
}

async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch("/api/signal/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json() as Promise<StatsResponse>;
}

export function useStats() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: signalKeys.stats(),
    queryFn: fetchStats,
  });

  return {
    totalSightings: data?.totalSightings ?? 0,
    uniqueNumbers: data?.uniqueNumbers ?? 0,
    numberCounts: data?.numberCounts ?? [],
    isLoading,
    isError: !!error,
    refetch,
  };
}
