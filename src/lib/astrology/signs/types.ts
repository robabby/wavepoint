/**
 * Type definitions for the Zodiac Signs module.
 *
 * Signs extend the base ZODIAC_META from constants.ts with
 * content fields for the signs pages.
 */

import type { ZodiacSign, PlanetId } from "../constants";
import type { Element } from "@/lib/numbers/planetary";

/**
 * Polarity derived from element
 * - Positive (masculine): fire, air
 * - Negative (feminine): earth, water
 */
export type Polarity = "positive" | "negative";

/**
 * Date range for zodiac sign display
 */
export interface DateRange {
  /** Start month (1-12) */
  start: { month: number; day: number };
  /** End month (1-12) */
  end: { month: number; day: number };
  /** Formatted display string (e.g., "March 21 - April 19") */
  formatted: string;
}

/**
 * Traits for the sign - strengths and challenges
 */
export interface SignTraits {
  /** Positive qualities and strengths */
  strengths: string[];
  /** Shadow qualities and challenges */
  challenges: string[];
}

/**
 * Complete zodiac sign data for page display.
 * Extends ZODIAC_META with content fields.
 */
export interface ZodiacSignPageData {
  // =========================================================================
  // Identity (mirrors ZODIAC_META)
  // =========================================================================

  /** Zodiac sign id (lowercase, e.g., "aries") */
  id: ZodiacSign;
  /** Display name (capitalized, e.g., "Aries") */
  name: string;
  /** Unicode glyph (e.g., "♈") */
  glyph: string;
  /** Symbol name (e.g., "Ram") */
  symbol: string;

  // =========================================================================
  // Astrological Properties (from ZODIAC_META + computed)
  // =========================================================================

  /** Classical element */
  element: Element;
  /** Modality (cardinal, fixed, mutable) */
  modality: "cardinal" | "fixed" | "mutable";
  /** Polarity derived from element */
  polarity: Polarity;
  /** Traditional ruling planet */
  ruler: PlanetId;
  /** Starting degree in the zodiac (0-330) */
  degreesStart: number;

  // =========================================================================
  // Content Fields
  // =========================================================================

  /** Date range for this sign */
  dateRange: DateRange;
  /** Archetype description (e.g., "The Pioneer") */
  archetype: string;
  /** Traditional motto (e.g., "I am") */
  motto: string;
  /** Keywords for the sign */
  keywords: string[];
  /** Full description of the sign's meaning */
  description: string;
  /** Strengths and challenges */
  traits: SignTraits;

  // =========================================================================
  // SEO
  // =========================================================================

  /** Meta description for SEO */
  metaDescription: string;
  /** SEO keywords */
  seoKeywords: string[];
}

/**
 * Sign with related content for detail pages
 */
export interface ZodiacSignWithRelations extends ZodiacSignPageData {
  /** Related number patterns (via planetary rulership) */
  relatedNumbers: string[];
  /** Related geometries (via element) */
  relatedGeometries: string[];
  /** Related archetypes (via planetary correspondence) */
  relatedArchetypes: string[];
  /** Ruling planet page URL */
  rulingPlanetUrl: string;
  /** Signs by aspect relationship */
  aspects: {
    trine: ZodiacSign[];
    opposition: ZodiacSign | null;
    square: ZodiacSign[];
    sextile: ZodiacSign[];
  };
}

/**
 * Astrological aspect types for sign relationships
 */
export type AspectType = "trine" | "opposition" | "square" | "sextile";
