import { z } from "zod";

/**
 * Schema for recording resonance feedback.
 * Resonated can be:
 * - true: "Yes, this resonated"
 * - false: "No, this didn't resonate"
 * - null: "Not sure yet"
 */
export const recordResonanceSchema = z.object({
  sightingId: z.string().uuid("Invalid sighting ID"),
  resonated: z.boolean().nullable(),
});

export type RecordResonanceInput = z.infer<typeof recordResonanceSchema>;

/**
 * Schema for querying resonance by sighting ID
 */
export const getResonanceSchema = z.object({
  sightingId: z.string().uuid("Invalid sighting ID"),
});
