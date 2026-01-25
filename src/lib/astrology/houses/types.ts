/**
 * Type definitions for the Astrological Houses module.
 *
 * Houses represent the 12 sectors of the natal chart, each governing
 * specific life areas and experiences.
 */

import type { ZodiacSign, PlanetId } from "../constants";

/**
 * House numbers 1-12
 */
export type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * House type classification based on relationship to angles
 * - Angular: Houses on the angles (1, 4, 7, 10) - most prominent
 * - Succedent: Houses following angles (2, 5, 8, 11) - stabilizing
 * - Cadent: Houses preceding angles (3, 6, 9, 12) - transitional
 */
export type HouseType = "angular" | "succedent" | "cadent";

/**
 * Traits for the house - strengths and challenges
 */
export interface HouseTraits {
  /** Positive qualities when this house is emphasized */
  strengths: string[];
  /** Shadow qualities and challenges */
  challenges: string[];
}

/**
 * Complete house data for page display.
 */
export interface HousePageData {
  // =========================================================================
  // Identity
  // =========================================================================

  /** House number (1-12) */
  number: HouseNumber;
  /** House name (e.g., "House of Self") */
  name: string;
  /** Roman numeral glyph (e.g., "I", "II", "XII") */
  glyph: string;
  /** House type classification */
  type: HouseType;

  // =========================================================================
  // Astrological Correspondences
  // =========================================================================

  /** Natural sign of this house (e.g., Aries for 1st) */
  naturalSign: ZodiacSign;
  /** Natural planetary ruler (e.g., Mars for 1st) */
  naturalRuler: PlanetId;
  /** Opposite house number (axis partner) */
  oppositeHouse: HouseNumber;
  /** Name of the axis (e.g., "Self-Other Axis") */
  axisName: string;

  // =========================================================================
  // Content Fields
  // =========================================================================

  /** Archetype description (e.g., "The Threshold of Being") */
  archetype: string;
  /** Traditional motto in question form (e.g., "Who am I?") */
  motto: string;
  /** Keywords for the house */
  keywords: string[];
  /** Life areas governed by this house */
  lifeAreas: string[];
  /** Full description of the house's meaning (multi-paragraph) */
  description: string;
  /** Classical/traditional interpretation */
  traditionalMeaning: string;
  /** Modern/psychological interpretation */
  modernMeaning: string;
  /** Strengths and challenges */
  traits: HouseTraits;

  // =========================================================================
  // SEO
  // =========================================================================

  /** Meta description for SEO */
  metaDescription: string;
  /** SEO keywords */
  seoKeywords: string[];
}

/**
 * House with computed relations for detail pages
 */
export interface HouseWithRelations extends HousePageData {
  /** URL to the natural sign page */
  naturalSignUrl: string;
  /** URL to the natural ruler page */
  naturalRulerUrl: string;
  /** Adjacent house numbers for navigation */
  adjacentHouses: {
    previous: HouseNumber;
    next: HouseNumber;
  };
  /** Other houses of the same type */
  sameTypeHouses: HouseNumber[];
}
