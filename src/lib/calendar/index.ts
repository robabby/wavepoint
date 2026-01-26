/**
 * Calendar Feature
 *
 * Multi-scale cosmic calendar synthesizing astrology, numerology, and sacred geometry.
 *
 * @module calendar
 */

// Feature flag
export { isCalendarEnabled } from "./feature-flags";

// Types
export type {
  JournalEntryType,
  CosmicSnapshot,
  CalendarJournalEntry,
  CreateJournalEntryInput,
  UpdateJournalEntryInput,
  EphemerisDay,
  EphemerisRange,
  CalendarDayData,
  CalendarMonthData,
  EphemerisDayResponse,
  EphemerisRangeResponse,
  JournalEntriesResponse,
  JournalEntryResponse,
  CosmicContext,
  DashboardCosmicContext,
} from "./types";

// Schemas
export {
  dateStringSchema,
  monthStringSchema,
  timezoneSchema,
  journalEntryTypeSchema,
  createJournalEntrySchema,
  updateJournalEntrySchema,
  ephemerisDayQuerySchema,
  ephemerisRangeQuerySchema,
  ephemerisQuerySchema,
  journalListQuerySchema,
  transitsQuerySchema,
} from "./schemas";
