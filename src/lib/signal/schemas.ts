import { z } from "zod";

/**
 * Available mood options for sighting captures.
 * Users can select up to 3 moods per sighting.
 */
export const MOOD_OPTIONS = [
  "calm",
  "energized",
  "reflective",
  "anxious",
  "grateful",
  "inspired",
  "curious",
  "hopeful",
  "peaceful",
  "confused",
  "excited",
  "uncertain",
] as const;

export type MoodOption = (typeof MOOD_OPTIONS)[number];

/**
 * Available activity options for sighting captures.
 * Single-select (unlike moods which are multi-select).
 */
export const ACTIVITY_OPTIONS = [
  "working",
  "transit",
  "resting",
  "socializing",
  "other",
] as const;

export type ActivityOption = (typeof ACTIVITY_OPTIONS)[number];

/**
 * IANA timezone regex - matches patterns like "America/Los_Angeles" or "Europe/London"
 * Allows for sub-regions like "America/Indiana/Indianapolis"
 */
const IANA_TZ_REGEX = /^[A-Za-z_]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)?$/;

/**
 * Schema for creating a new sighting.
 * Used for API validation and form handling.
 */
export const createSightingSchema = z.object({
  number: z
    .string()
    .min(1, "Number is required")
    .max(10, "Number too long")
    .regex(/^\d+$/, "Must contain only digits"),
  note: z.string().max(500, "Note too long").optional(),
  moodTags: z.array(z.enum(MOOD_OPTIONS)).max(3, "Maximum 3 moods").optional(),
  activity: z.enum(ACTIVITY_OPTIONS).optional(),
  tz: z.string().regex(IANA_TZ_REGEX, "Invalid timezone format").optional(),
});

export type CreateSightingInput = z.infer<typeof createSightingSchema>;

/**
 * Schema for updating a sighting.
 * Only note and moodTags can be updated (not the number).
 */
export const updateSightingSchema = z.object({
  note: z.string().max(500, "Note too long").optional(),
  moodTags: z.array(z.enum(MOOD_OPTIONS)).max(3, "Maximum 3 moods").optional(),
  activity: z.enum(ACTIVITY_OPTIONS).optional(),
});

export type UpdateSightingInput = z.infer<typeof updateSightingSchema>;
