import { z } from "zod";

import { PLATONIC_SOLID_SLUGS } from "./types";

/**
 * Valid Platonic solid slugs enum for Zod validation
 */
export const platonicSolidSlugSchema = z.enum(PLATONIC_SOLID_SLUGS, {
  errorMap: () => ({
    message: `Invalid geometry slug. Must be one of: ${PLATONIC_SOLID_SLUGS.join(", ")}`,
  }),
});

/**
 * Affinity score schema (1-5 range)
 */
export const affinityScoreSchema = z
  .number()
  .int()
  .min(1, "Affinity score must be at least 1")
  .max(5, "Affinity score must be at most 5");

/**
 * Schema for upserting a geometry affinity.
 * When affinityScore is null, the affinity record is deleted.
 */
export const upsertGeometryAffinitySchema = z.object({
  geometrySlug: platonicSolidSlugSchema,
  affinityScore: affinityScoreSchema.nullable(),
});

export type UpsertGeometryAffinityInput = z.infer<typeof upsertGeometryAffinitySchema>;
