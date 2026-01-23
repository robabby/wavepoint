import { useQuery } from "@tanstack/react-query";
import type { NumberCount } from "@/lib/signal/types";
import { signalKeys } from "./query-keys";

interface ActivityStats {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  lastActiveDate: string | null;
}

interface StatsResponse {
  totalSightings: number;
  uniqueNumbers: number;
  numberCounts: NumberCount[];
  activity: ActivityStats;
}

async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch("/api/signal/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json() as Promise<StatsResponse>;
}

const defaultActivity: ActivityStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalActiveDays: 0,
  lastActiveDate: null,
};

export function useStats() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: signalKeys.stats(),
    queryFn: fetchStats,
  });

  return {
    totalSightings: data?.totalSightings ?? 0,
    uniqueNumbers: data?.uniqueNumbers ?? 0,
    numberCounts: data?.numberCounts ?? [],
    activity: data?.activity ?? defaultActivity,
    isLoading,
    isError: !!error,
    refetch,
  };
}
