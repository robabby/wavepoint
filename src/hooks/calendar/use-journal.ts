"use client";

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { calendarKeys } from "./query-keys";
import type {
  CalendarJournalEntry,
  JournalEntriesResponse,
  JournalEntryResponse,
  CreateJournalEntryInput,
  UpdateJournalEntryInput,
} from "@/lib/calendar";

// =============================================================================
// API Functions
// =============================================================================

/**
 * Fetch journal entries for a date range.
 */
async function fetchJournalEntries(
  start: string,
  end: string
): Promise<JournalEntriesResponse> {
  const response = await fetch(
    `/api/calendar/journal?start=${start}&end=${end}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? "Failed to fetch journal entries");
  }

  return response.json();
}

/**
 * Create a new journal entry.
 */
async function createJournalEntry(
  input: CreateJournalEntryInput
): Promise<JournalEntryResponse> {
  const response = await fetch("/api/calendar/journal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? "Failed to create journal entry");
  }

  return response.json();
}

/**
 * Update an existing journal entry.
 */
async function updateJournalEntry(
  id: string,
  input: UpdateJournalEntryInput
): Promise<JournalEntryResponse> {
  const response = await fetch(`/api/calendar/journal/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? "Failed to update journal entry");
  }

  return response.json();
}

/**
 * Delete a journal entry.
 */
async function deleteJournalEntry(id: string): Promise<{ success: boolean; id: string }> {
  const response = await fetch(`/api/calendar/journal/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? "Failed to delete journal entry");
  }

  return response.json();
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to fetch journal entries for a date range.
 *
 * @param start - Start date in YYYY-MM-DD format
 * @param end - End date in YYYY-MM-DD format
 */
export function useJournalEntries(start: string, end: string) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: calendarKeys.journalRange(start, end),
    queryFn: () => fetchJournalEntries(start, end),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // Keep adjacent months in cache longer
    placeholderData: keepPreviousData,
    enabled: !!start && !!end,
  });

  return {
    entries: data?.entries ?? [],
    isLoading,
    isFetching,
    isError,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

/**
 * Hook to fetch journal entry for a specific date.
 *
 * @param date - Date in YYYY-MM-DD format
 */
export function useJournalEntry(date: string) {
  const { entries, isLoading, isFetching, isError, error } = useJournalEntries(
    date,
    date
  );

  return {
    entry: entries[0] ?? null,
    isLoading,
    isFetching,
    isError,
    error,
  };
}

/**
 * Hook to create a new journal entry.
 */
export function useCreateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJournalEntry,
    onSuccess: (data) => {
      // Invalidate journal queries to refetch
      queryClient.invalidateQueries({ queryKey: calendarKeys.journal() });

      // Optionally set the new entry in cache
      const entry = data.entry;
      const dateStr =
        entry.entryDate instanceof Date
          ? entry.entryDate.toISOString().split("T")[0]
          : String(entry.entryDate).split("T")[0];

      if (dateStr) {
        queryClient.setQueryData<JournalEntriesResponse>(
          calendarKeys.journalRange(dateStr, dateStr),
          { entries: [entry] }
        );
      }
    },
  });
}

/**
 * Hook to update an existing journal entry.
 */
export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateJournalEntryInput }) =>
      updateJournalEntry(id, input),
    onSuccess: () => {
      // Invalidate journal queries to refetch
      queryClient.invalidateQueries({ queryKey: calendarKeys.journal() });
    },
  });
}

/**
 * Hook to delete a journal entry.
 */
export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJournalEntry,
    onSuccess: () => {
      // Invalidate journal queries to refetch
      queryClient.invalidateQueries({ queryKey: calendarKeys.journal() });
    },
  });
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Map of journal entries keyed by date string (YYYY-MM-DD).
 */
export type JournalEntriesMap = Map<string, CalendarJournalEntry>;

/**
 * Create a map of journal entries keyed by date for efficient lookup.
 */
export function createJournalEntriesMap(
  entries: CalendarJournalEntry[]
): JournalEntriesMap {
  const map = new Map<string, CalendarJournalEntry>();

  for (const entry of entries) {
    const dateStr =
      entry.entryDate instanceof Date
        ? entry.entryDate.toISOString().split("T")[0]
        : String(entry.entryDate).split("T")[0];

    if (dateStr) {
      map.set(dateStr, entry);
    }
  }

  return map;
}
