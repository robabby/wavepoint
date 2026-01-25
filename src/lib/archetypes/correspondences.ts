/**
 * Golden Dawn correspondence mappings for archetypes.
 *
 * These mappings connect archetypes to the broader synthesis system
 * (planets, elements, zodiac signs, numbers, geometries).
 */

import type { Planet, Element, PlatonicSolid } from "@/lib/numbers/planetary";
import type { ZodiacSign } from "@/lib/astrology";
import type { ArchetypeSlug } from "./types";

// =============================================================================
// PLANET TO ARCHETYPE MAPPING
// =============================================================================

/**
 * Map planets to their corresponding archetypes
 */
export const PLANET_ARCHETYPES: Partial<Record<Planet, ArchetypeSlug[]>> = {
  sun: ["the-sun"],
  moon: ["the-high-priestess"],
  mercury: ["the-magician"],
  venus: ["the-empress"],
  mars: ["the-tower"],
  jupiter: ["wheel-of-fortune"],
  saturn: ["the-world"],
  // Note: Uranus and Neptune are modern attributions to The Fool and The Hanged Man
  // but we use the classical element attributions (Air, Water) instead
};

/**
 * Get archetypes associated with a planet
 */
export function getArchetypesForPlanet(planet: Planet): ArchetypeSlug[] {
  return PLANET_ARCHETYPES[planet] ?? [];
}

// =============================================================================
// ZODIAC TO ARCHETYPE MAPPING
// =============================================================================

/**
 * Map zodiac signs to their corresponding archetypes
 */
export const ZODIAC_ARCHETYPES: Record<ZodiacSign, ArchetypeSlug> = {
  aries: "the-emperor",
  taurus: "the-hierophant",
  gemini: "the-lovers",
  cancer: "the-chariot",
  leo: "strength",
  virgo: "the-hermit",
  libra: "justice",
  scorpio: "death",
  sagittarius: "temperance",
  capricorn: "the-devil",
  aquarius: "the-star",
  pisces: "the-moon",
};

/**
 * Get the archetype for a zodiac sign
 */
export function getArchetypeForZodiac(sign: ZodiacSign): ArchetypeSlug {
  return ZODIAC_ARCHETYPES[sign];
}

// =============================================================================
// ELEMENT TO ARCHETYPE MAPPING
// =============================================================================

/**
 * Map elements to their corresponding archetypes (mother letters)
 */
export const ELEMENT_ARCHETYPES: Partial<Record<Element, ArchetypeSlug>> = {
  air: "the-fool",
  water: "the-hanged-man",
  fire: "judgement",
  // Earth and Ether don't have direct elemental archetypes in Golden Dawn
};

/**
 * Get the archetype for an element (mother letter cards only)
 */
export function getArchetypeForElement(element: Element): ArchetypeSlug | null {
  return ELEMENT_ARCHETYPES[element] ?? null;
}

// =============================================================================
// NUMBER TO ARCHETYPE MAPPING (VIA PLANETS)
// =============================================================================

/**
 * Map digit-planet associations to archetypes
 * Based on planetary.ts DIGIT_PLANETARY_META
 */
export const NUMBER_ARCHETYPES: Record<number, ArchetypeSlug[]> = {
  1: ["the-sun"], // Sun = 1
  2: ["the-high-priestess"], // Moon = 2
  3: ["wheel-of-fortune"], // Jupiter = 3
  // 4 = Uranus (no direct archetype, modern planet)
  5: ["the-magician"], // Mercury = 5
  6: ["the-empress"], // Venus = 6
  // 7 = Neptune (no direct archetype, modern planet)
  8: ["the-world"], // Saturn = 8
  9: ["the-tower"], // Mars = 9
};

/**
 * Get archetypes associated with a base digit (1-9)
 */
export function getArchetypesForDigit(digit: number): ArchetypeSlug[] {
  return NUMBER_ARCHETYPES[digit] ?? [];
}

// =============================================================================
// GEOMETRY CONNECTIONS (VIA ELEMENTS)
// =============================================================================

/**
 * Get related geometries for an archetype via its element
 */
export function getGeometryForArchetype(
  archetypeElement: Element | null
): PlatonicSolid | null {
  if (!archetypeElement) return null;

  const elementToGeometry: Record<Element, PlatonicSolid> = {
    fire: "tetrahedron",
    earth: "cube",
    air: "octahedron",
    water: "icosahedron",
    ether: "dodecahedron",
  };

  return elementToGeometry[archetypeElement];
}

// =============================================================================
// REVERSE LOOKUPS
// =============================================================================

/**
 * Get the planet associated with an archetype (if any)
 */
export function getPlanetForArchetype(slug: ArchetypeSlug): Planet | null {
  for (const [planet, archetypes] of Object.entries(PLANET_ARCHETYPES)) {
    if (archetypes?.includes(slug)) {
      return planet as Planet;
    }
  }
  return null;
}

/**
 * Get the zodiac sign associated with an archetype (if any)
 */
export function getZodiacForArchetype(slug: ArchetypeSlug): ZodiacSign | null {
  for (const [sign, archetype] of Object.entries(ZODIAC_ARCHETYPES)) {
    if (archetype === slug) {
      return sign as ZodiacSign;
    }
  }
  return null;
}
