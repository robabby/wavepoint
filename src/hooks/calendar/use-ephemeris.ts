"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { calendarKeys } from "./query-keys";
import type { EphemerisDay, EphemerisRange } from "@/lib/calendar";

/**
 * Get the user's IANA timezone (e.g., "America/Los_Angeles")
 */
function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Fetch ephemeris data for a single day
 */
async function fetchEphemerisDay(date: string, tz: string): Promise<EphemerisDay> {
  const response = await fetch(`/api/calendar/ephemeris?date=${date}&tz=${encodeURIComponent(tz)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch ephemeris data");
  }
  const result = await response.json();
  return result.data;
}

/**
 * Fetch ephemeris data for a date range
 */
async function fetchEphemerisRange(
  start: string,
  end: string,
  tz: string
): Promise<EphemerisRange> {
  const response = await fetch(
    `/api/calendar/ephemeris?start=${start}&end=${end}&tz=${encodeURIComponent(tz)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch ephemeris data");
  }
  const result = await response.json();
  return result.data;
}

/**
 * Hook to fetch ephemeris data for a single day.
 *
 * @param date - Date string in YYYY-MM-DD format
 * @returns Ephemeris data for the day
 */
export function useEphemeris(date: string) {
  const tz = getUserTimezone();

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: calendarKeys.ephemerisDay(date, tz),
    queryFn: () => fetchEphemerisDay(date, tz),
    staleTime: 60 * 60 * 1000, // 1 hour - cosmic data changes slowly
    enabled: !!date,
  });

  return {
    ephemeris: data ?? null,
    isLoading,
    isFetching,
    isError: !!error,
    error: error instanceof Error ? error.message : null,
  };
}

/**
 * Hook to fetch ephemeris data for a date range (typically a month).
 *
 * @param start - Start date in YYYY-MM-DD format
 * @param end - End date in YYYY-MM-DD format
 * @returns Ephemeris data for each day in the range
 */
export function useEphemerisRange(start: string, end: string) {
  const tz = getUserTimezone();

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: calendarKeys.ephemerisRange(start, end, tz),
    queryFn: () => fetchEphemerisRange(start, end, tz),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 30 * 60 * 1000, // Keep adjacent months in cache longer
    placeholderData: keepPreviousData, // Show previous month while next loads
    enabled: !!start && !!end,
  });

  return {
    ephemeris: data ?? null,
    isLoading,
    isFetching,
    isError: !!error,
    error: error instanceof Error ? error.message : null,
  };
}
