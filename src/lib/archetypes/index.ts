/**
 * Archetypes module - Major Arcana content with Golden Dawn correspondences.
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
 * const theFool = getArchetypeBySlug("the-fool");
 *
 * // Get all archetypes for listing
 * const all = getAllArchetypes();
 * ```
 */

// Types
export type {
  ArchetypeSlug,
  AttributionType,
  HebrewLetter,
  AlternativeAttribution,
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
  getArchetypeByNumber,
} from "./data";

// Correspondences
export {
  PLANET_ARCHETYPES,
  ZODIAC_ARCHETYPES,
  ELEMENT_ARCHETYPES,
  NUMBER_ARCHETYPES,
  getArchetypesForPlanet,
  getArchetypeForZodiac,
  getArchetypeForElement,
  getArchetypesForDigit,
  getGeometryForArchetype,
  getPlanetForArchetype,
  getZodiacForArchetype,
} from "./correspondences";

// Helpers
export {
  isValidArchetypeSlug,
  getPreviousArchetype,
  getNextArchetype,
  getRelatedNumbers,
  getRelatedGeometries,
  getRelatedSigns,
  getArchetypeWithRelations,
  searchArchetypes,
  getArchetypesByAttribution,
  getArchetypesByElement,
} from "./helpers";

// Citations
export type { Citation } from "./citations";
export {
  GOLDEN_DAWN_TRADITION,
  CROWLEY_777,
  LEVI_TRANSCENDENTAL_MAGIC,
  SEPHER_YETZIRAH,
  TOMBERG_MEDITATIONS,
  ALL_CITATIONS,
  getCitation,
} from "./citations";

// Feature flags
export { isArchetypesEnabled } from "./feature-flags";
