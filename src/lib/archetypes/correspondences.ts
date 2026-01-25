/**
 * Jungian correspondence mappings for archetypes.
 *
 * These mappings connect archetypes to the broader synthesis system
 * (planets, elements, numbers, geometries) via Jungian alchemical psychology.
 */

import type { Planet, Element, PlatonicSolid } from "@/lib/numbers/planetary";
import type { ArchetypeSlug } from "./types";

// =============================================================================
// PLANET TO ARCHETYPE MAPPING
// =============================================================================

/**
 * Map planets to their corresponding archetypes (Jungian alchemical psychology)
 *
 * Sun: Consciousness, ego, gold, rubedo (Magician, Ruler)
 * Moon: Unconscious, anima, silver, receptivity (Innocent, Caregiver)
 * Mercury: Mercurius, trickster, transformation (Creator, Jester)
 * Venus: Eros, beauty, conjunction (Lover)
 * Mars: Will, aggression, separation (Hero, Rebel)
 * Jupiter: Expansion, meaning, quest (Explorer)
 * Saturn: Senex, limitation, lead, wisdom (Orphan, Sage)
 */
export const PLANET_ARCHETYPES: Partial<Record<Planet, ArchetypeSlug[]>> = {
  sun: ["the-magician", "the-ruler"],
  moon: ["the-innocent", "the-caregiver"],
  mercury: ["the-creator", "the-jester"],
  venus: ["the-lover"],
  mars: ["the-hero", "the-rebel"],
  jupiter: ["the-explorer"],
  saturn: ["the-orphan", "the-sage"],
};

/**
 * Get archetypes associated with a planet
 */
export function getArchetypesForPlanet(planet: Planet): ArchetypeSlug[] {
  return PLANET_ARCHETYPES[planet] ?? [];
}

// =============================================================================
// NUMBER TO ARCHETYPE MAPPING (VIA PLANETS)
// =============================================================================

/**
 * Map digit-planet associations to archetypes (multiple archetypes per digit)
 * Based on planetary.ts DIGIT_PLANETARY_META
 */
export const NUMBER_ARCHETYPES: Record<number, ArchetypeSlug[]> = {
  1: ["the-magician", "the-ruler"], // Sun
  2: ["the-innocent", "the-caregiver"], // Moon
  3: ["the-explorer"], // Jupiter
  // 4 = Uranus (no direct archetype, modern planet)
  5: ["the-creator", "the-jester"], // Mercury
  6: ["the-lover"], // Venus
  // 7 = Neptune (no direct archetype, modern planet)
  8: ["the-orphan", "the-sage"], // Saturn
  9: ["the-hero", "the-rebel"], // Mars
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
 * Get related geometry for an archetype via its element
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
 * Get the planet associated with an archetype
 */
export function getPlanetForArchetype(slug: ArchetypeSlug): Planet | null {
  for (const [planet, archetypes] of Object.entries(PLANET_ARCHETYPES)) {
    if (archetypes?.includes(slug)) {
      return planet as Planet;
    }
  }
  return null;
}
