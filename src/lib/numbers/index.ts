/**
 * Numbers module - Public content hub for number pattern meanings.
 *
 * This module provides the data layer for the /numbers section.
 * It's designed to be framework-agnostic and can be imported by:
 * - Pages and components
 * - API routes
 * - Signal (for base meanings)
 *
 * @example
 * ```ts
 * import { getPatternByNumber, getFeaturedPatterns } from "@/lib/numbers";
 *
 * // Get a specific pattern
 * const pattern = getPatternByNumber("444");
 *
 * // Get featured patterns for landing page
 * const featured = getFeaturedPatterns();
 * ```
 */

// Types
export type {
  CategoryMeta,
  ComponentBreakdown,
  DigitComponent,
  NumberCategory,
  NumberPattern,
  NumberPatternId,
  NumberPatternWithPlanetary,
  PatternDetailResponse,
  PatternStat,
  PatternsListResponse,
  PatternStatsResponse,
} from "./types";

export { NUMBER_PATTERN_IDS } from "./types";

// Relationship types
export type {
  NumberRelationshipType,
  NumberRelationshipMeta,
  NumberRelationshipCategory,
} from "./relationship-types";

export {
  RELATIONSHIP_PRIORITY,
  RELATIONSHIP_LABELS,
  getNumberRelationshipCategory,
  getRelationshipLabel,
} from "./relationship-types";

// Relationships
export { getRelationshipsForPattern, MANUAL_RELATIONSHIPS } from "./relationships";

// Data
export { PATTERNS, getBaseMeaning, getEssence } from "./data";

// Categories
export { CATEGORIES, getAllCategories, getCategoryMeta } from "./categories";

// Helpers
export {
  getAllPatterns,
  getNextPattern,
  getPatternByNumber,
  getPatternCount,
  getPatternCountByCategory,
  getPatternsByCategory,
  getPatternsByIds,
  getPreviousPattern,
  getFeaturedPatterns,
  getRelatedPatterns,
  getRelatedPatternsWithType,
  isKnownPattern,
  searchPatterns,
  findRelatedPatternsForUncovered,
  // Planetary enrichment
  getPatternWithPlanetary,
  getAllPatternsWithPlanetary,
  getPatternsByPlanet,
  getPatternsByElement,
} from "./helpers";

export type { RelatedPatternWithType } from "./helpers";

// Component breakdown (for uncovered patterns)
export {
  generateComponentBreakdown,
  hasRecognizableElements,
} from "./component-breakdown";

// Planetary associations
export type {
  Planet,
  Element,
  PlatonicSolid,
  ConfidenceLevel,
  PlanetaryDigitMeta,
  PatternPlanetaryMeta,
} from "./planetary";

export {
  DIGIT_PLANETARY_META,
  ZERO_META,
  PLANET_META,
  ELEMENT_META,
  GEOMETRY_META,
  AGRIPPA_MAGIC_SQUARES,
  AGRIPPA_ANGEL_NUMBER_CONNECTIONS,
  getDominantDigit,
  getUniqueDigits,
  getDigitPlanetaryMeta,
  getPatternPlanetaryMeta,
  getPlanetSymbol,
  getPlanetElement,
  hasAgrippaConnection,
} from "./planetary";
