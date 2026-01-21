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
  PatternDetailResponse,
  PatternStat,
  PatternsListResponse,
  PatternStatsResponse,
} from "./types";

export { NUMBER_PATTERN_IDS } from "./types";

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
  isKnownPattern,
  searchPatterns,
} from "./helpers";

// Component breakdown (for uncovered patterns)
export {
  generateComponentBreakdown,
  hasRecognizableElements,
} from "./component-breakdown";
