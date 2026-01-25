/**
 * Archetypes module - 12 Jungian psychological archetypes.
 *
 * This module provides the data layer for the /archetypes section.
 * It's designed to be framework-agnostic and can be imported by:
 * - Pages and components
 * - API routes
 * - Synthesis (for correspondence mapping)
 *
 * @example
 * ```ts
 * import { getArchetypeBySlug, getAllArchetypes } from "@/lib/archetypes";
 *
 * // Get a specific archetype
 * const theHero = getArchetypeBySlug("the-hero");
 *
 * // Get all archetypes for listing
 * const all = getAllArchetypes();
 * ```
 */

// Types
export type {
  ArchetypeSlug,
  Archetype,
  ArchetypeWithRelations,
  ArchetypesListResponse,
  ArchetypeDetailResponse,
} from "./types";

export { ARCHETYPE_SLUGS } from "./types";

// Data
export {
  ARCHETYPES,
  getAllArchetypes,
  getArchetypeBySlug,
} from "./data";

// Correspondences
export {
  PLANET_ARCHETYPES,
  NUMBER_ARCHETYPES,
  getArchetypesForPlanet,
  getArchetypesForDigit,
  getGeometryForArchetype,
  getPlanetForArchetype,
} from "./correspondences";

// Helpers
export {
  isValidArchetypeSlug,
  getRelatedNumbers,
  getRelatedGeometries,
  getRelatedSigns,
  getArchetypeWithRelations,
  searchArchetypes,
} from "./helpers";

// Citations
export type { Citation } from "./citations";
export {
  JUNG_ARCHETYPES,
  JUNG_PSYCHOLOGY_ALCHEMY,
  PEARSON_HEROES,
  ALL_CITATIONS,
  getCitation,
} from "./citations";

// Feature flags
export { isArchetypesEnabled } from "./feature-flags";
