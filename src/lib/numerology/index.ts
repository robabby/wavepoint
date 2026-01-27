/**
 * Numerology module - Comprehensive numerology calculations and meanings.
 *
 * This module provides numerology functionality using the Pythagorean system
 * with master number (11, 22, 33) preservation.
 *
 * @example
 * ```ts
 * import {
 *   lifePathNumber,
 *   getNumberMeaning,
 *   getFullProfile,
 * } from "@/lib/numerology";
 *
 * // Calculate Life Path
 * const lifePath = lifePathNumber(new Date("1990-05-15"));
 *
 * // Get meaning
 * const meaning = getNumberMeaning(lifePath);
 *
 * // Get full profile
 * const profile = getFullProfile(birthDate, "John Michael Doe");
 * ```
 */

// Types
export type {
  NumerologyDigit,
  CoreNumberType,
  CycleNumberType,
  NumberType,
  NumerologyProfile,
  DateBasedNumerology,
  NumberMeaning,
  ContextualMeaning,
  NumberMeaningResult,
  NumerologyData,
} from "./types";

export { NAME_REQUIRED_NUMBERS, MASTER_NUMBERS } from "./types";

// Calculations
export {
  reduceToDigit,
  letterToNumber,
  nameToNumber,
  vowelsOnly,
  consonantsOnly,
  lifePathNumber,
  birthdayNumber,
  expressionNumber,
  soulUrgeNumber,
  personalityNumber,
  maturityNumber,
  personalYearNumber,
  personalMonthNumber,
  personalDayNumber,
  calculateStableNumbers,
  calculateCycleNumbers,
} from "./calculations";

// Meanings
export {
  NUMBER_MEANINGS,
  getNumberMeaning,
  getContextualMeaning,
  getFullMeaning,
} from "./meanings";

// Helpers
export {
  getRelatedPatterns,
  getProfileRelatedPatterns,
  getDateBasedProfile,
  getFullProfile,
  toNumerologyData,
  hasNameBasedNumbers,
  isMasterNumber,
  formatDigit,
} from "./helpers";

// Position Types
export type { PositionSlug, PositionType } from "./position-types";
export {
  POSITION_TYPES,
  getPositionBySlug,
  getPositionByType,
  typeToSlug,
  slugToType,
  isValidPositionSlug,
  getAllPositionSlugs,
  getAllPositionTypes,
} from "./position-types";

// Position Meanings
export type { PositionMeaning } from "./position-meanings";
export {
  POSITION_MEANINGS,
  getPositionMeaning,
  getAllMeaningsForDigit,
  getAllMeaningsForPosition,
} from "./position-meanings";

// Personalization
export type { PartialNumerologyProfile } from "./personalization";
export {
  findMatchingPositions,
  extractDominantDigit,
  formatPositionList,
  isValidNumerologyDigit,
  getUserDigits,
  hasNumerologyProfile,
  hasCompleteNumerology,
  getPositionSlugForDigit,
} from "./personalization";
