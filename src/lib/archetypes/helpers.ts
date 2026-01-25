/**
 * Helper functions for the Archetypes module.
 */

import type { ZodiacSign } from "@/lib/astrology";
import type { Planet, Element } from "@/lib/numbers/planetary";
import { DIGIT_PLANETARY_META } from "@/lib/numbers/planetary";

import type { Archetype, ArchetypeSlug, ArchetypeWithRelations } from "./types";
import { ARCHETYPE_SLUGS } from "./types";
import { ARCHETYPES, getAllArchetypes, getArchetypeBySlug } from "./data";
import { getGeometryForArchetype } from "./correspondences";

/**
 * Check if a slug is a valid archetype slug
 */
export function isValidArchetypeSlug(slug: string): slug is ArchetypeSlug {
  return ARCHETYPE_SLUGS.includes(slug as ArchetypeSlug);
}

/**
 * Get the previous archetype in sequence (by number)
 */
export function getPreviousArchetype(slug: ArchetypeSlug): ArchetypeSlug | null {
  const archetype = ARCHETYPES[slug];
  if (!archetype || archetype.number === 0) return null;

  const all = getAllArchetypes();
  const prev = all.find((a) => a.number === archetype.number - 1);
  return prev?.slug ?? null;
}

/**
 * Get the next archetype in sequence (by number)
 */
export function getNextArchetype(slug: ArchetypeSlug): ArchetypeSlug | null {
  const archetype = ARCHETYPES[slug];
  if (!archetype || archetype.number === 21) return null;

  const all = getAllArchetypes();
  const next = all.find((a) => a.number === archetype.number + 1);
  return next?.slug ?? null;
}

/**
 * Get related number patterns for an archetype (via planetary correspondence)
 */
export function getRelatedNumbers(archetype: Archetype): string[] {
  const planet = archetype.planet;
  if (!planet) return [];

  // Find which digit corresponds to this planet
  const relatedPatterns: string[] = [];

  for (const [digitStr, meta] of Object.entries(DIGIT_PLANETARY_META)) {
    if (meta.planet === planet) {
      const digit = parseInt(digitStr, 10);
      // Add common patterns for this digit
      relatedPatterns.push(String(digit));
      relatedPatterns.push(String(digit).repeat(2));
      relatedPatterns.push(String(digit).repeat(3));
      relatedPatterns.push(String(digit).repeat(4));
    }
  }

  return relatedPatterns;
}

/**
 * Get related geometries for an archetype (via element)
 */
export function getRelatedGeometries(archetype: Archetype): string[] {
  // Get element from archetype (either direct or via zodiac)
  let element: Element | null = archetype.element;

  // If no direct element, try to get from zodiac's element
  if (!element && archetype.zodiac) {
    // Zodiac elements are defined in astrology constants
    const zodiacElements: Record<ZodiacSign, Element> = {
      aries: "fire",
      taurus: "earth",
      gemini: "air",
      cancer: "water",
      leo: "fire",
      virgo: "earth",
      libra: "air",
      scorpio: "water",
      sagittarius: "fire",
      capricorn: "earth",
      aquarius: "air",
      pisces: "water",
    };
    element = zodiacElements[archetype.zodiac];
  }

  // If planet, get element from planet
  if (!element && archetype.planet) {
    const planetElements: Partial<Record<Planet, Element>> = {
      sun: "fire",
      moon: "water",
      mercury: "air",
      venus: "earth",
      mars: "fire",
      jupiter: "ether",
      saturn: "earth",
      uranus: "air",
      neptune: "water",
    };
    element = planetElements[archetype.planet] ?? null;
  }

  if (!element) return [];

  const geometry = getGeometryForArchetype(element);
  if (!geometry) return [];

  return [geometry];
}

/**
 * Get related zodiac signs for an archetype
 */
export function getRelatedSigns(archetype: Archetype): ZodiacSign[] {
  const signs: ZodiacSign[] = [];

  // If the archetype has a direct zodiac attribution
  if (archetype.zodiac) {
    signs.push(archetype.zodiac);
  }

  // If the archetype has a planetary attribution, include signs ruled by that planet
  if (archetype.planet) {
    const planetRulerships: Partial<Record<Planet, ZodiacSign[]>> = {
      sun: ["leo"],
      moon: ["cancer"],
      mercury: ["gemini", "virgo"],
      venus: ["taurus", "libra"],
      mars: ["aries", "scorpio"],
      jupiter: ["sagittarius", "pisces"],
      saturn: ["capricorn", "aquarius"],
    };

    const ruled = planetRulerships[archetype.planet];
    if (ruled) {
      for (const sign of ruled) {
        if (!signs.includes(sign)) {
          signs.push(sign);
        }
      }
    }
  }

  return signs;
}

/**
 * Get an archetype with all its relations populated
 */
export function getArchetypeWithRelations(
  slug: ArchetypeSlug
): ArchetypeWithRelations | null {
  const archetype = getArchetypeBySlug(slug);
  if (!archetype) return null;

  return {
    ...archetype,
    relatedNumbers: getRelatedNumbers(archetype),
    relatedGeometries: getRelatedGeometries(archetype),
    relatedSigns: getRelatedSigns(archetype),
    previous: getPreviousArchetype(slug),
    next: getNextArchetype(slug),
  };
}

/**
 * Search archetypes by keyword
 */
export function searchArchetypes(query: string): Archetype[] {
  const lowerQuery = query.toLowerCase();

  return getAllArchetypes().filter((archetype) => {
    // Search in name
    if (archetype.name.toLowerCase().includes(lowerQuery)) return true;

    // Search in keywords
    if (archetype.keywords.some((k) => k.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    // Search in description
    if (archetype.description.toLowerCase().includes(lowerQuery)) return true;

    // Search in Jungian archetype
    if (archetype.jungianArchetype.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    return false;
  });
}

/**
 * Get archetypes by attribution type
 */
export function getArchetypesByAttribution(
  type: "element" | "planet" | "zodiac"
): Archetype[] {
  return getAllArchetypes().filter((a) => a.attributionType === type);
}

/**
 * Get archetypes by element (including derived elements)
 */
export function getArchetypesByElement(element: Element): Archetype[] {
  return getAllArchetypes().filter((archetype) => {
    // Direct element attribution
    if (archetype.element === element) return true;

    // Zodiac-derived element
    if (archetype.zodiac) {
      const zodiacElements: Record<ZodiacSign, Element> = {
        aries: "fire",
        taurus: "earth",
        gemini: "air",
        cancer: "water",
        leo: "fire",
        virgo: "earth",
        libra: "air",
        scorpio: "water",
        sagittarius: "fire",
        capricorn: "earth",
        aquarius: "air",
        pisces: "water",
      };
      if (zodiacElements[archetype.zodiac] === element) return true;
    }

    return false;
  });
}
