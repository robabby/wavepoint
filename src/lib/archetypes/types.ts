/**
 * Type definitions for the Archetypes module.
 *
 * Archetypes represent the 22 Major Arcana of the Tarot, mapped to
 * astrological correspondences using the Golden Dawn system.
 */

import type { Planet, Element, ConfidenceLevel } from "@/lib/numbers/planetary";
import type { ZodiacSign } from "@/lib/astrology";

/**
 * Archetype slugs for all 22 Major Arcana
 */
export const ARCHETYPE_SLUGS = [
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

export type ArchetypeSlug = (typeof ARCHETYPE_SLUGS)[number];

/**
 * Attribution type for Golden Dawn correspondences
 */
export type AttributionType = "element" | "planet" | "zodiac";

/**
 * Hebrew letter with its meaning
 */
export interface HebrewLetter {
  /** Hebrew letter character */
  letter: string;
  /** Letter name (transliterated) */
  name: string;
  /** Traditional meaning */
  meaning: string;
  /** Numerical value (gematria) */
  value: number;
}

/**
 * Alternative attribution from a different esoteric tradition
 */
export interface AlternativeAttribution {
  /** Name of the tradition (e.g., "Thoth", "Continental", "B.O.T.A.") */
  tradition: string;
  /** The alternative attribution value */
  value: string;
  /** Optional note explaining the difference */
  note?: string;
}

/**
 * Complete archetype data for a Major Arcana card
 */
export interface Archetype {
  /** URL slug (e.g., "the-fool") */
  slug: ArchetypeSlug;
  /** Display name (e.g., "The Fool") */
  name: string;
  /** Card number (0-21, Roman numerals traditional) */
  number: number;
  /** Roman numeral representation */
  romanNumeral: string;

  /** Hebrew letter correspondence */
  hebrewLetter: HebrewLetter;

  /** Golden Dawn attribution type */
  attributionType: AttributionType;
  /** Primary attribution (planet, element, or zodiac) */
  primaryAttribution: string;

  /** Element (derived from attribution) */
  element: Element | null;
  /** Planet (if planetary attribution) */
  planet: Planet | null;
  /** Zodiac sign (if zodiacal attribution) */
  zodiac: ZodiacSign | null;

  /** Confidence level based on cross-traditional agreement */
  confidence: ConfidenceLevel;

  /** Alternative attributions from other traditions */
  alternativeAttributions?: AlternativeAttribution[];

  /** Keywords for the archetype */
  keywords: string[];

  /** Jungian archetype connection */
  jungianArchetype: string;

  /** Brief description of the archetype's meaning */
  description: string;

  /** Traditional upright meanings */
  uprightMeanings: string[];

  /** Traditional reversed meanings */
  reversedMeanings: string[];

  /** Rider-Waite-Smith image path */
  imagePath: string;
}

/**
 * Archetype with related content for detail pages
 */
export interface ArchetypeWithRelations extends Archetype {
  /** Related number patterns (via planetary correspondence) */
  relatedNumbers: string[];
  /** Related geometries (via element) */
  relatedGeometries: string[];
  /** Related zodiac signs */
  relatedSigns: ZodiacSign[];
  /** Previous archetype (by number) */
  previous: ArchetypeSlug | null;
  /** Next archetype (by number) */
  next: ArchetypeSlug | null;
}

/**
 * API response for archetypes list
 */
export interface ArchetypesListResponse {
  archetypes: Archetype[];
  total: number;
}

/**
 * API response for archetype detail
 */
export interface ArchetypeDetailResponse {
  archetype: ArchetypeWithRelations | null;
}
