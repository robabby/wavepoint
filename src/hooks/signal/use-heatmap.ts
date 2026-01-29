import { useQuery } from "@tanstack/react-query";
import { signalKeys } from "./query-keys";

interface DailyCount {
  date: string; // 'YYYY-MM-DD'
  count: number;
}

interface Streaks {
  current: number;
  longest: number;
  totalActiveDays: number;
  lastActiveDate: string | null;
}

interface HeatmapResponse {
  dailyCounts: DailyCount[];
  streaks: Streaks;
}

async function fetchHeatmap(): Promise<HeatmapResponse> {
  // Get client's timezone for timezone-aware date grouping
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const res = await fetch(`/api/signal/heatmap?tz=${encodeURIComponent(tz)}`);
  if (!res.ok) throw new Error("Failed to fetch heatmap data");
  return res.json() as Promise<HeatmapResponse>;
}

const defaultStreaks: Streaks = {
  current: 0,
  longest: 0,
  totalActiveDays: 0,
  lastActiveDate: null,
};

export function useHeatmap() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: signalKeys.heatmap(),
    queryFn: fetchHeatmap,
    staleTime: 10 * 60 * 1000, // 10 minutes — heatmap data changes infrequently
    gcTime: 30 * 60 * 1000,
  });

  return {
    dailyCounts: data?.dailyCounts ?? [],
    streaks: data?.streaks ?? defaultStreaks,
    isLoading,
    isError: !!error,
    refetch,
  };
}
