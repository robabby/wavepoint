"use client";

import { useQuery } from "@tanstack/react-query";
import { calendarKeys } from "./query-keys";
import type { Transit } from "@/lib/transits";

interface TransitsResponse {
  date: string;
  transits: Transit[];
  totalCount: number;
}

interface TransitsErrorResponse {
  error: "no_profile" | "incomplete_profile" | string;
  message: string;
}

/**
 * Fetch transits for a specific day
 */
async function fetchTransits(date: string): Promise<TransitsResponse> {
  const response = await fetch(`/api/calendar/transits?date=${date}`);

  if (!response.ok) {
    const errorData = (await response.json()) as TransitsErrorResponse;
    throw new Error(errorData.error ?? "Failed to fetch transits");
  }

  return response.json();
}

/**
 * Hook to fetch personal transits for a specific day.
 *
 * Returns transits showing which current planets are aspecting the user's natal chart.
 * Requires the user to have a spiritual profile with chart data.
 *
 * @param date - Date string in YYYY-MM-DD format
 * @returns Transits data with loading/error states
 */
export function useTransits(date: string) {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: calendarKeys.transitsDay(date),
    queryFn: () => fetchTransits(date),
    staleTime: 60 * 60 * 1000, // 1 hour - transits change slowly
    enabled: !!date,
    retry: (failureCount, error) => {
      // Don't retry for missing profile errors
      if (error instanceof Error &&
          (error.message === "no_profile" || error.message === "incomplete_profile")) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Determine if error is due to missing profile
  const hasNoProfile = error instanceof Error && error.message === "no_profile";
  const hasIncompleteProfile = error instanceof Error && error.message === "incomplete_profile";

  return {
    transits: data?.transits ?? [],
    totalCount: data?.totalCount ?? 0,
    isLoading,
    isFetching,
    isError: !!error && !hasNoProfile && !hasIncompleteProfile,
    hasNoProfile,
    hasIncompleteProfile,
    error: error instanceof Error ? error.message : null,
  };
}
