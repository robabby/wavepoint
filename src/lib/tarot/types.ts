/**
 * Type definitions for the Major Arcana tarot module.
 *
 * The Major Arcana represents 22 archetypal images from the tarot,
 * interpreted through a psychological/Jungian lens rather than
 * divinatory or Golden Dawn traditions.
 */

import type { ArchetypeSlug } from "@/lib/archetypes";

/**
 * Slugs for all 22 Major Arcana cards
 */
export const MAJOR_ARCANA_SLUGS = [
  "the-fool",
  "the-magician",
  "the-high-priestess",
  "the-empress",
  "the-emperor",
  "the-hierophant",
  "the-lovers",
  "the-chariot",
  "strength",
  "the-hermit",
  "wheel-of-fortune",
  "justice",
  "the-hanged-man",
  "death",
  "temperance",
  "the-devil",
  "the-tower",
  "the-star",
  "the-moon",
  "the-sun",
  "judgement",
  "the-world",
] as const;

export type MajorArcanaSlug = (typeof MAJOR_ARCANA_SLUGS)[number];

/**
 * Roman numerals for Major Arcana cards (0-21)
 */
const ROMAN_NUMERAL_MAP = {
  0: "0",
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
  11: "XI",
  12: "XII",
  13: "XIII",
  14: "XIV",
  15: "XV",
  16: "XVI",
  17: "XVII",
  18: "XVIII",
  19: "XIX",
  20: "XX",
  21: "XXI",
} as const;

export type TarotCardNumber = keyof typeof ROMAN_NUMERAL_MAP;

/**
 * Get Roman numeral for a card number
 */
export function getRomanNumeral(number: TarotCardNumber): string {
  return ROMAN_NUMERAL_MAP[number];
}

/**
 * @deprecated Use getRomanNumeral() instead
 */
export const TAROT_ROMAN_NUMERALS = ROMAN_NUMERAL_MAP as Record<number, string>;

/**
 * Complete data for a Major Arcana card
 */
export interface MajorArcanaCard {
  /** URL slug (e.g., "the-fool") */
  slug: MajorArcanaSlug;
  /** Card number (0-21) */
  number: number;
  /** Roman numeral representation */
  romanNumeral: string;
  /** Display name (e.g., "The Fool") */
  name: string;
  /** Path to card image */
  imagePath: string;
  /** Keywords describing the card's themes */
  keywords: string[];
  /** Brief archetype tagline */
  archetype: string;
  /** Psychological interpretation of upright meaning */
  uprightMeaning: string;
  /** Shadow/reversed psychological interpretation */
  reversedMeaning: string;
  /** Key symbols and their psychological significance */
  symbolism: string;
  /** Full description of the card's meaning */
  description: string;
  /** Related Jungian archetype slug (only for 5 matched pairs) */
  relatedJungianArchetype?: ArchetypeSlug;
}

/**
 * Major Arcana card with bidirectional relation data
 */
export interface MajorArcanaWithRelations extends MajorArcanaCard {
  /** Previous card in sequence (null for The Fool) */
  previousCard: MajorArcanaSlug | null;
  /** Next card in sequence (null for The World) */
  nextCard: MajorArcanaSlug | null;
}
