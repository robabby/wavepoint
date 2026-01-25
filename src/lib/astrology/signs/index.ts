/**
 * Zodiac Signs module - 12 signs of the zodiac.
 *
 * This module provides the data layer for the /astrology/signs section.
 *
 * @example
 * ```ts
 * import { getSignById, getAllSigns, getSignWithRelations } from "@/lib/astrology/signs";
 *
 * // Get a specific sign
 * const aries = getSignById("aries");
 *
 * // Get all signs for listing
 * const all = getAllSigns();
 *
 * // Get a sign with all relations
 * const ariesFull = getSignWithRelations("aries");
 * ```
 */

// Types
export type {
  Polarity,
  DateRange,
  SignTraits,
  ZodiacSignPageData,
  ZodiacSignWithRelations,
  AspectType,
} from "./types";

// Data
export { ZODIAC_SIGN_DATA, getAllSigns, getSignById } from "./data";

// Helpers
export {
  isValidSignId,
  getSignsByElement,
  getSignsByModality,
  getSignsByPolarity,
  getSignIndex,
  getAdjacentSigns,
  getSignWithRelations,
  getSignsGroupedByElement,
  getElementDisplayInfo,
  searchSigns,
} from "./helpers";

// Correspondences
export {
  getRulingPlanetUrl,
  getRelatedNumbers,
  getRelatedArchetypes,
  getRelatedGeometries,
  getSignAspects,
  getSignsForPlanet,
} from "./correspondences";
