/**
 * Major Arcana Tarot module
 *
 * Provides data, types, and utilities for the 22 Major Arcana cards,
 * interpreted through a psychological/Jungian lens.
 */

// Types
export type { MajorArcanaCard, MajorArcanaSlug, MajorArcanaWithRelations, TarotCardNumber } from "./types";
export { MAJOR_ARCANA_SLUGS, TAROT_ROMAN_NUMERALS, getRomanNumeral } from "./types";

// Data
export { MAJOR_ARCANA, getAllMajorArcana, getMajorArcanaBySlug, getMajorArcanaByNumber } from "./data";

// Correspondences
export {
  TAROT_ARCHETYPE_MAP,
  ARCHETYPE_TAROT_MAP,
  getLinkedArchetype,
  getLinkedTarotCard,
  hasLinkedArchetype,
  hasLinkedTarotCard,
} from "./correspondences";

// Helpers
export {
  isValidMajorArcanaSlug,
  getMajorArcanaWithRelations,
  getAdjacentCards,
  formatRomanNumeral,
} from "./helpers";
