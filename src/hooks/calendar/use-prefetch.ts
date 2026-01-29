"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { calendarKeys } from "./query-keys";
import type { EphemerisRange } from "@/lib/calendar";

function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function formatDateString(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

/**
 * Compute the date range for a month's calendar grid (with -6/+7 day buffer).
 */
function getMonthDateRange(year: number, month: number) {
  const start = new Date(year, month, 1);
  start.setDate(start.getDate() - 6);
  const end = new Date(year, month + 1, 0);
  end.setDate(end.getDate() + 7);
  return {
    start: formatDateString(start),
    end: formatDateString(end),
  };
}

async function fetchEphemerisRange(
  start: string,
  end: string,
  tz: string,
): Promise<EphemerisRange> {
  const response = await fetch(
    `/api/calendar/ephemeris?start=${start}&end=${end}&tz=${encodeURIComponent(tz)}`,
  );
  if (!response.ok) throw new Error("Failed to fetch ephemeris data");
  const result = await response.json();
  return result.data;
}

async function fetchJournalEntries(start: string, end: string) {
  const response = await fetch(`/api/calendar/journal?start=${start}&end=${end}`);
  if (!response.ok) throw new Error("Failed to fetch journal entries");
  return response.json();
}

/**
 * Prefetch ephemeris and journal data for adjacent months.
 * Fires after the current month data loads.
 */
export function usePrefetchAdjacentMonths(year: number, month: number) {
  const queryClient = useQueryClient();
  const tz = getUserTimezone();

  useEffect(() => {
    const prevRange = getMonthDateRange(year, month - 1);
    const nextRange = getMonthDateRange(year, month + 1);

    // Prefetch previous month ephemeris
    queryClient.prefetchQuery({
      queryKey: calendarKeys.ephemerisRange(prevRange.start, prevRange.end, tz),
      queryFn: () => fetchEphemerisRange(prevRange.start, prevRange.end, tz),
      staleTime: 60 * 60 * 1000,
    });

    // Prefetch next month ephemeris
    queryClient.prefetchQuery({
      queryKey: calendarKeys.ephemerisRange(nextRange.start, nextRange.end, tz),
      queryFn: () => fetchEphemerisRange(nextRange.start, nextRange.end, tz),
      staleTime: 60 * 60 * 1000,
    });

    // Prefetch previous month journal
    queryClient.prefetchQuery({
      queryKey: calendarKeys.journalRange(prevRange.start, prevRange.end),
      queryFn: () => fetchJournalEntries(prevRange.start, prevRange.end),
      staleTime: 5 * 60 * 1000,
    });

    // Prefetch next month journal
    queryClient.prefetchQuery({
      queryKey: calendarKeys.journalRange(nextRange.start, nextRange.end),
      queryFn: () => fetchJournalEntries(nextRange.start, nextRange.end),
      staleTime: 5 * 60 * 1000,
    });
  }, [year, month, tz, queryClient]);
}
