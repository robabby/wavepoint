import { z } from "zod";
import { ARCHETYPE_SLUGS } from "@/lib/archetypes";
import { MAJOR_ARCANA_SLUGS } from "@/lib/tarot";

const systemSchema = z.enum(["jungian", "tarot"]);
const statusSchema = z.enum(["active", "dismissed"]);

const allIdentifiers = [...ARCHETYPE_SLUGS, ...MAJOR_ARCANA_SLUGS] as [
  string,
  ...string[],
];

/**
 * Schema for updating a constellation entry's status
 */
export const updateConstellationSchema = z.object({
  system: systemSchema,
  identifier: z.enum(allIdentifiers),
  status: statusSchema,
});

/**
 * Schema for adding a user-chosen constellation entry
 */
export const addConstellationSchema = z.object({
  system: systemSchema,
  identifier: z.enum(allIdentifiers),
});
