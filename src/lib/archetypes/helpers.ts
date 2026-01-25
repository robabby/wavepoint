/**
 * Helper functions for the Archetypes module.
 */

import type { ZodiacSign } from "@/lib/astrology";
import type { Planet } from "@/lib/numbers/planetary";
import { DIGIT_PLANETARY_META } from "@/lib/numbers/planetary";

import type { Archetype, ArchetypeSlug, ArchetypeWithRelations } from "./types";
import { ARCHETYPE_SLUGS } from "./types";
import { getAllArchetypes, getArchetypeBySlug } from "./data";
import { getGeometryForArchetype } from "./correspondences";

/**
 * Check if a slug is a valid archetype slug
 */
export function isValidArchetypeSlug(slug: string): slug is ArchetypeSlug {
  return ARCHETYPE_SLUGS.includes(slug as ArchetypeSlug);
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
  const geometry = getGeometryForArchetype(archetype.element);
  if (!geometry) return [];
  return [geometry];
}

/**
 * Get related zodiac signs for an archetype (via planetary rulership)
 */
export function getRelatedSigns(archetype: Archetype): ZodiacSign[] {
  const signs: ZodiacSign[] = [];

  // Get signs ruled by this archetype's planet
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
    signs.push(...ruled);
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

    // Search in motto
    if (archetype.motto.toLowerCase().includes(lowerQuery)) return true;

    return false;
  });
}
