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
] as const;

export type MoodOption = (typeof MOOD_OPTIONS)[number];

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
});

export type CreateSightingInput = z.infer<typeof createSightingSchema>;
