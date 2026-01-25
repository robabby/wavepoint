/**
 * Type definitions for the Archetypes module.
 *
 * Archetypes represent the 12 Jungian psychological archetypes,
 * based on Carl Jung's archetypal psychology and the framework
 * popularized by Carol Pearson.
 */

import type { Planet, Element } from "@/lib/numbers/planetary";
import type { ZodiacSign } from "@/lib/astrology";

/**
 * Archetype slugs for all 12 Jungian archetypes
 */
export const ARCHETYPE_SLUGS = [
  "the-innocent",
  "the-orphan",
  "the-hero",
  "the-caregiver",
  "the-explorer",
  "the-rebel",
  "the-lover",
  "the-creator",
  "the-jester",
  "the-sage",
  "the-magician",
  "the-ruler",
] as const;

export type ArchetypeSlug = (typeof ARCHETYPE_SLUGS)[number];

/**
 * Complete archetype data for a Jungian archetype
 */
export interface Archetype {
  /** URL slug (e.g., "the-innocent") */
  slug: ArchetypeSlug;
  /** Display name (e.g., "The Innocent") */
  name: string;

  /** Jungian planetary correspondence */
  planet: Planet;
  /** Classical element */
  element: Element;

  /** Core motto (e.g., "Free to be you and me") */
  motto: string;
  /** Core desire (e.g., "To experience paradise") */
  coreDesire: string;
  /** Goal (e.g., "To be happy") */
  goal: string;
  /** Greatest fear (e.g., "Doing something wrong") */
  greatestFear: string;
  /** Strategy (e.g., "Do things right") */
  strategy: string;
  /** Weakness (e.g., "Boring, naivety, denial") */
  weakness: string;
  /** Talent (e.g., "Faith and optimism") */
  talent: string;

  /** Keywords for the archetype */
  keywords: string[];
  /** Brief description of the archetype's meaning */
  description: string;

  /** Shadow aspect (the archetype's dark side) */
  shadow: string;

  /** Image path for card display */
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
  /** Related zodiac signs (via planetary rulership) */
  relatedSigns: ZodiacSign[];
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
