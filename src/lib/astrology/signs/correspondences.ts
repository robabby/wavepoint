/**
 * Cross-domain correspondence mappings for zodiac signs.
 *
 * These mappings connect signs to planets, numbers, archetypes,
 * and geometries via the synthesis system.
 */

import { ZODIAC_SIGNS, type ZodiacSign, type PlanetId } from "../constants";
import { PLANET_ARCHETYPES } from "@/lib/archetypes";
import type { ZodiacSignPageData } from "./types";

// =============================================================================
// SIGN → PLANET (Direct Rulership)
// =============================================================================

/**
 * Get the URL for the ruling planet's page.
 * Returns empty string if planet page doesn't exist.
 */
export function getRulingPlanetUrl(sign: ZodiacSignPageData): string {
  // Currently available planet pages
  const availablePlanets: PlanetId[] = [
    "sun",
    "moon",
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
  ];

  if (availablePlanets.includes(sign.ruler)) {
    return `/astrology/planets/${sign.ruler}`;
  }

  return "";
}

// =============================================================================
// SIGN → NUMBERS (Via Planetary Rulership)
// =============================================================================

/**
 * Map planetary rulers to their associated digits
 */
const PLANET_TO_DIGIT: Partial<Record<PlanetId, number>> = {
  sun: 1,
  moon: 2,
  jupiter: 3,
  uranus: 4,
  mercury: 5,
  venus: 6,
  neptune: 7,
  saturn: 8,
  mars: 9,
};

/**
 * Get related number patterns for a sign via its planetary ruler.
 * Returns patterns like ["9", "99", "999", "9999"] for Mars-ruled signs.
 */
export function getRelatedNumbers(sign: ZodiacSignPageData): string[] {
  const digit = PLANET_TO_DIGIT[sign.ruler];
  if (!digit) return [];

  // Return common repeating patterns
  return [
    String(digit),
    String(digit).repeat(2),
    String(digit).repeat(3),
    String(digit).repeat(4),
  ];
}

// =============================================================================
// SIGN → ARCHETYPES (Via Planetary Rulership)
// =============================================================================

/**
 * Get related archetypes for a sign via its planetary ruler.
 */
export function getRelatedArchetypes(sign: ZodiacSignPageData): string[] {
  // Map ruler to the planetary type used in PLANET_ARCHETYPES
  const rulerToArchetypePlanet: Partial<Record<PlanetId, string>> = {
    sun: "sun",
    moon: "moon",
    mercury: "mercury",
    venus: "venus",
    mars: "mars",
    jupiter: "jupiter",
    saturn: "saturn",
    // Modern planets don't have direct archetype mappings
    uranus: undefined,
    neptune: undefined,
    pluto: undefined,
  };

  const planetKey = rulerToArchetypePlanet[sign.ruler];
  if (!planetKey) return [];

  const archetypes = PLANET_ARCHETYPES[planetKey as keyof typeof PLANET_ARCHETYPES];
  return archetypes ?? [];
}

// =============================================================================
// SIGN → GEOMETRIES (Via Element)
// =============================================================================

/**
 * Element to Platonic solid mapping
 */
const ELEMENT_TO_GEOMETRY: Record<string, string> = {
  fire: "tetrahedron",
  earth: "cube",
  air: "octahedron",
  water: "icosahedron",
  ether: "dodecahedron",
};

/**
 * Get related geometries for a sign via its element.
 */
export function getRelatedGeometries(sign: ZodiacSignPageData): string[] {
  const geometry = ELEMENT_TO_GEOMETRY[sign.element];
  return geometry ? [geometry] : [];
}

// =============================================================================
// SIGN → SIGNS (Astrological Aspects)
// =============================================================================

/**
 * Calculate signs at a given aspect distance.
 * @param signIndex - Index of the sign (0-11)
 * @param aspectDistance - Number of signs away (positive only)
 * @returns Array of sign indices at that distance
 */
function getSignsAtDistance(signIndex: number, aspectDistance: number): number[] {
  if (aspectDistance === 0 || aspectDistance > 6) return [];

  const forward = (signIndex + aspectDistance) % 12;
  const backward = (signIndex - aspectDistance + 12) % 12;

  // Opposition (6 signs away) only has one result
  if (aspectDistance === 6) {
    return [forward];
  }

  // Other aspects have two results (forward and backward)
  return [forward, backward];
}

/**
 * Get signs that form aspects with the given sign.
 */
export function getSignAspects(signId: ZodiacSign): {
  trine: ZodiacSign[];
  opposition: ZodiacSign | null;
  square: ZodiacSign[];
  sextile: ZodiacSign[];
} {
  const signIndex = ZODIAC_SIGNS.indexOf(signId);

  // Trine: 4 signs apart (120 degrees) - same element
  const trineIndices = getSignsAtDistance(signIndex, 4);

  // Opposition: 6 signs apart (180 degrees)
  const oppositionIndex = (signIndex + 6) % 12;

  // Square: 3 signs apart (90 degrees)
  const squareIndices = getSignsAtDistance(signIndex, 3);

  // Sextile: 2 signs apart (60 degrees) - compatible elements
  const sextileIndices = getSignsAtDistance(signIndex, 2);

  return {
    trine: trineIndices.map((i) => ZODIAC_SIGNS[i]!),
    opposition: ZODIAC_SIGNS[oppositionIndex]!,
    square: squareIndices.map((i) => ZODIAC_SIGNS[i]!),
    sextile: sextileIndices.map((i) => ZODIAC_SIGNS[i]!),
  };
}

// =============================================================================
// REVERSE LOOKUPS
// =============================================================================

/**
 * Get signs ruled by a specific planet
 */
export function getSignsForPlanet(planet: PlanetId): ZodiacSign[] {
  const signs: ZodiacSign[] = [];

  for (const sign of ZODIAC_SIGNS) {
    // Import ZODIAC_META from constants for this check
    const { ZODIAC_META } = require("../constants");
    if (ZODIAC_META[sign].ruler === planet) {
      signs.push(sign);
    }
  }

  return signs;
}
