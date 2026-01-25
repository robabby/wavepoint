/**
 * Planets content module for astrology pages.
 *
 * This module provides planet data for content pages, including:
 * - Planet page data with synthesis connections
 * - Citation and source tracking
 * - Cross-domain helpers linking to numerology
 *
 * @example
 * ```ts
 * import { getPlanet, getAllPlanets, getPlanetWithNumerology } from "@/lib/astrology/planets";
 *
 * // Get Saturn data
 * const saturn = getPlanet("saturn");
 * console.log(saturn?.archetype); // "The Great Teacher"
 *
 * // Get Saturn with numerology data
 * const saturnFull = getPlanetWithNumerology("saturn");
 * console.log(saturnFull?.digitMeta?.traits); // ["discipline", "karma", ...]
 * ```
 */

// Types (use `export type` for type-only exports)
export type {
  ContentPlanetId,
  ConfidenceLevel,
  SourceCategory,
  Citation,
  SourcedClaim,
  PlanetaryRulership,
  PlanetaryDignity,
  NumerologyConnection,
  GeometryConnection,
  PlanetPageData,
  PlanetGroup,
} from "./types";

// Type guards and constants
export {
  CONTENT_PLANET_IDS,
  CLASSICAL_PLANETS,
  OUTER_PLANETS,
  isContentPlanetId,
} from "./types";

// Data
export { PLANET_PAGE_DATA, getAvailablePlanets, getAvailablePlanetIds } from "./data";

// Citations
export {
  CITATIONS,
  getCitation,
  getCitations,
  // Individual citations for direct import
  PTOLEMY_TETRABIBLOS,
  LILLY_CHRISTIAN_ASTROLOGY,
  GREENE_SATURN,
  VEDIC_TRADITION,
  CHALDEAN_TRADITION,
  KABBALAH_TRADITION,
  AGRIPPA_OCCULT_PHILOSOPHY,
  MODERN_WESTERN_CONSENSUS,
  WAVEPOINT_SYNTHESIS,
} from "./citations";

// Helpers
export type { PlanetWithNumerology } from "./helpers";
export {
  getPlanet,
  getAllPlanets,
  getAllPlanetIds,
  hasPlanetContent,
  isValidPlanetId,
  getClassicalPlanets,
  getOuterPlanets,
  getPlanetWithNumerology,
  getPlanetNumberPatterns,
  getPlanetDigit,
  getPlanetByDigit,
  getPlanetPath,
  getPlanetCanonicalUrl,
} from "./helpers";
