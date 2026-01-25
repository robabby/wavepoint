/**
 * Query key factory for Archetypes React Query hooks.
 * Following the same pattern as Numbers hooks.
 */

import type { AttributionType } from "@/lib/archetypes";

export const archetypesKeys = {
  all: ["archetypes"] as const,

  // Archetypes list
  archetypes: () => [...archetypesKeys.all, "list"] as const,
  archetypesList: (filters?: { attribution?: AttributionType }) =>
    [...archetypesKeys.archetypes(), filters] as const,

  // Single archetype
  archetype: (slug: string) => [...archetypesKeys.all, "detail", slug] as const,

  // Search
  search: (query: string) => [...archetypesKeys.all, "search", query] as const,
};
