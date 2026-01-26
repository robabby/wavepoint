/**
 * Calendar feature Zod schemas for validation.
 */

import { z } from "zod";

// =============================================================================
// Date Validation
// =============================================================================

/**
 * ISO date string in YYYY-MM-DD format.
 */
export const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "Date must be in YYYY-MM-DD format",
});

/**
 * ISO month string in YYYY-MM format.
 */
export const monthStringSchema = z.string().regex(/^\d{4}-\d{2}$/, {
  message: "Month must be in YYYY-MM format",
});

/**
 * IANA timezone string.
 */
export const timezoneSchema = z.string().min(1).max(64);

// =============================================================================
// Journal Entry Schemas
// =============================================================================

/**
 * Valid journal entry types.
 */
export const journalEntryTypeSchema = z.enum(["reflection", "milestone", "note"]);

/**
 * Schema for creating a journal entry.
 */
export const createJournalEntrySchema = z.object({
  entryDate: dateStringSchema,
  content: z.string().min(1).max(500),
  eventType: journalEntryTypeSchema.default("note"),
  tz: timezoneSchema.optional(),
});

/**
 * Schema for updating a journal entry.
 */
export const updateJournalEntrySchema = z.object({
  content: z.string().min(1).max(500).optional(),
  eventType: journalEntryTypeSchema.optional(),
});

// =============================================================================
// API Query Schemas
// =============================================================================

/**
 * Schema for ephemeris single day query.
 */
export const ephemerisDayQuerySchema = z.object({
  date: dateStringSchema,
});

/**
 * Schema for ephemeris date range query.
 */
export const ephemerisRangeQuerySchema = z.object({
  start: dateStringSchema,
  end: dateStringSchema,
});

/**
 * Schema for ephemeris query (supports both single day and range).
 */
export const ephemerisQuerySchema = z.union([
  ephemerisDayQuerySchema,
  ephemerisRangeQuerySchema,
]);

/**
 * Schema for journal list query.
 */
export const journalListQuerySchema = z.object({
  start: dateStringSchema,
  end: dateStringSchema,
  tz: timezoneSchema.optional(),
});

/**
 * Schema for transits query.
 */
export const transitsQuerySchema = z.object({
  date: dateStringSchema,
});

// =============================================================================
// Type exports
// =============================================================================

export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntrySchema>;
export type JournalEntryType = z.infer<typeof journalEntryTypeSchema>;
