/**
 * Position type definitions for numerology.
 *
 * Each position represents a different aspect of a person's numerology profile.
 * These are the "lenses" through which digit archetypes are interpreted.
 */

import type { CoreNumberType } from "./types";

/**
 * URL-safe slug for position types
 */
export type PositionSlug =
  | "life-path"
  | "birthday"
  | "expression"
  | "soul-urge"
  | "personality"
  | "maturity";

/**
 * Metadata for a numerology position type
 */
export interface PositionType {
  /** URL-safe slug */
  slug: PositionSlug;
  /** Database field name in spiritualProfiles */
  dbField: string;
  /** Internal type name (matches CoreNumberType) */
  type: CoreNumberType;
  /** Display name */
  name: string;
  /** Short description (1 sentence) */
  brief: string;
  /** Extended description (2-3 sentences) */
  description: string;
  /** How this number is calculated */
  calculation: string;
  /** Whether birth name is required for calculation */
  requiresBirthName: boolean;
  /** SEO keywords for this position */
  seoKeywords: string[];
}

/**
 * All numerology position types with their metadata
 */
export const POSITION_TYPES: Record<PositionSlug, PositionType> = {
  "life-path": {
    slug: "life-path",
    dbField: "lifePathNumber",
    type: "lifePath",
    name: "Life Path",
    brief: "Your life journey and core purpose",
    description:
      "Your Life Path number is the most significant number in your numerology chart. Calculated from your full birth date, it reveals the path you're meant to walk in this lifetime—your innate talents, challenges, and the lessons you're here to learn.",
    calculation:
      "Add all digits of your birth date (month + day + year) and reduce to a single digit or master number (11, 22, 33).",
    requiresBirthName: false,
    seoKeywords: [
      "life path number",
      "life path meaning",
      "numerology life path",
      "life path calculator",
      "what is my life path",
    ],
  },
  birthday: {
    slug: "birthday",
    dbField: "birthdayNumber",
    type: "birthday",
    name: "Birthday",
    brief: "A special gift you carry into this life",
    description:
      "Your Birthday number is a secondary influence that adds nuance to your personality. Simply the day of the month you were born (reduced if necessary), it represents a special talent or gift that supports your life journey.",
    calculation:
      "Take the day of the month you were born. If it's a two-digit number (except 11 or 22), reduce to a single digit.",
    requiresBirthName: false,
    seoKeywords: [
      "birthday number",
      "birthday numerology",
      "day of birth meaning",
      "birthday number meaning",
    ],
  },
  expression: {
    slug: "expression",
    dbField: "expressionNumber",
    type: "expression",
    name: "Expression",
    brief: "Your natural talents and abilities",
    description:
      "Your Expression number (also called Destiny number) reveals your natural abilities, talents, and the goals you're here to achieve. Calculated from your full birth name, it shows how you express yourself in the world and the person you're meant to become.",
    calculation:
      "Convert each letter of your full birth name to its numerical value (A=1, B=2... I=9, J=1...), sum all values, and reduce to a single digit or master number.",
    requiresBirthName: true,
    seoKeywords: [
      "expression number",
      "destiny number",
      "expression number meaning",
      "name numerology",
      "destiny number calculator",
    ],
  },
  "soul-urge": {
    slug: "soul-urge",
    dbField: "soulUrgeNumber",
    type: "soulUrge",
    name: "Soul Urge",
    brief: "Your inner motivations and heart's desire",
    description:
      "Your Soul Urge number (also called Heart's Desire) reveals your innermost cravings, likes, and dislikes. It shows what truly motivates you at the deepest level—often desires you may not even consciously acknowledge.",
    calculation:
      "Using only the vowels (A, E, I, O, U) in your full birth name, convert to numbers, sum, and reduce to a single digit or master number.",
    requiresBirthName: true,
    seoKeywords: [
      "soul urge number",
      "heart's desire number",
      "soul urge meaning",
      "inner motivation numerology",
    ],
  },
  personality: {
    slug: "personality",
    dbField: "personalityNumber",
    type: "personality",
    name: "Personality",
    brief: "How others perceive you",
    description:
      "Your Personality number reveals the face you show to the world—how others perceive you before they truly know you. It's like the outer layer of your personality, the first impression you make.",
    calculation:
      "Using only the consonants in your full birth name, convert to numbers, sum, and reduce to a single digit or master number.",
    requiresBirthName: true,
    seoKeywords: [
      "personality number",
      "personality number meaning",
      "outer personality numerology",
      "first impression number",
    ],
  },
  maturity: {
    slug: "maturity",
    dbField: "maturityNumber",
    type: "maturity",
    name: "Maturity",
    brief: "The person you're becoming",
    description:
      "Your Maturity number reveals who you're growing into, especially in the second half of life. It represents the true you that emerges as you gain wisdom and experience. This influence becomes stronger after age 40-50.",
    calculation:
      "Add your Life Path number and Expression number together, then reduce to a single digit or master number.",
    requiresBirthName: true,
    seoKeywords: [
      "maturity number",
      "maturity number meaning",
      "later life numerology",
      "wisdom number",
    ],
  },
};

/**
 * Get position type by slug
 */
export function getPositionBySlug(slug: string): PositionType | null {
  if (slug in POSITION_TYPES) {
    return POSITION_TYPES[slug as PositionSlug];
  }
  return null;
}

/**
 * Get position type by CoreNumberType
 */
export function getPositionByType(type: CoreNumberType): PositionType | null {
  for (const position of Object.values(POSITION_TYPES)) {
    if (position.type === type) {
      return position;
    }
  }
  return null;
}

/**
 * Convert CoreNumberType to URL slug
 */
export function typeToSlug(type: CoreNumberType): PositionSlug {
  const mapping: Record<CoreNumberType, PositionSlug> = {
    lifePath: "life-path",
    birthday: "birthday",
    expression: "expression",
    soulUrge: "soul-urge",
    personality: "personality",
    maturity: "maturity",
  };
  return mapping[type];
}

/**
 * Convert URL slug to CoreNumberType
 */
export function slugToType(slug: PositionSlug): CoreNumberType {
  const mapping: Record<PositionSlug, CoreNumberType> = {
    "life-path": "lifePath",
    birthday: "birthday",
    expression: "expression",
    "soul-urge": "soulUrge",
    personality: "personality",
    maturity: "maturity",
  };
  return mapping[slug];
}

/**
 * Check if a string is a valid position slug
 */
export function isValidPositionSlug(slug: string): slug is PositionSlug {
  return slug in POSITION_TYPES;
}

/**
 * Get all position slugs
 */
export function getAllPositionSlugs(): PositionSlug[] {
  return Object.keys(POSITION_TYPES) as PositionSlug[];
}

/**
 * Get all position types as an array
 */
export function getAllPositionTypes(): PositionType[] {
  return Object.values(POSITION_TYPES);
}
