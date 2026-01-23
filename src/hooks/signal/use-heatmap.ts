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
  const res = await fetch("/api/signal/heatmap");
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
  });

  return {
    dailyCounts: data?.dailyCounts ?? [],
    streaks: data?.streaks ?? defaultStreaks,
    isLoading,
    isError: !!error,
    refetch,
  };
}
