/**
 * Calendar feature types.
 */

import type { CosmicContext, DashboardCosmicContext } from "@/lib/signal/cosmic-context";

// =============================================================================
// Journal Entry Types
// =============================================================================

/**
 * Journal entry type classification.
 */
export type JournalEntryType = "reflection" | "milestone" | "note";

/**
 * Cosmic snapshot stored with journal entries.
 */
export interface CosmicSnapshot {
  moonPhase: string;
  moonSign: string;
  sunSign: string;
}

/**
 * Calendar journal entry from database.
 */
export interface CalendarJournalEntry {
  id: string;
  userId: string;
  entryDate: Date;
  tz: string | null;
  content: string | null;
  eventType: JournalEntryType;
  cosmicSnapshot: CosmicSnapshot | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

/**
 * Input for creating a new journal entry.
 */
export interface CreateJournalEntryInput {
  entryDate: string; // YYYY-MM-DD
  content: string;
  eventType: JournalEntryType;
  tz?: string;
}

/**
 * Input for updating an existing journal entry.
 */
export interface UpdateJournalEntryInput {
  content?: string;
  eventType?: JournalEntryType;
}

// =============================================================================
// Ephemeris Types
// =============================================================================

/**
 * Ephemeris data for a single day.
 * Uses DashboardCosmicContext for full planetary info.
 */
export type EphemerisDay = DashboardCosmicContext;

/**
 * Ephemeris data for a date range (month view).
 */
export interface EphemerisRange {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  days: Record<string, EphemerisDay>; // Keyed by YYYY-MM-DD
}

// =============================================================================
// Calendar View Types
// =============================================================================

/**
 * Day cell data for month view.
 */
export interface CalendarDayData {
  date: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
  isToday: boolean;
  moonPhase: string;
  moonSign: string;
  hasSightings: boolean;
  hasJournal: boolean;
  sightingCount: number;
}

/**
 * Month view data.
 */
export interface CalendarMonthData {
  year: number;
  month: number; // 1-indexed
  days: CalendarDayData[];
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * Response from /api/calendar/ephemeris for single day.
 */
export interface EphemerisDayResponse {
  date: string;
  data: EphemerisDay;
}

/**
 * Response from /api/calendar/ephemeris for date range.
 */
export interface EphemerisRangeResponse {
  start: string;
  end: string;
  data: EphemerisRange;
}

/**
 * Response from /api/calendar/journal GET.
 */
export interface JournalEntriesResponse {
  entries: CalendarJournalEntry[];
}

/**
 * Response from /api/calendar/journal POST/PATCH.
 */
export interface JournalEntryResponse {
  entry: CalendarJournalEntry;
}

// Re-export cosmic context types for convenience
export type { CosmicContext, DashboardCosmicContext };
