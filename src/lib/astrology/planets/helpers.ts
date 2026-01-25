/**
 * Helper functions for planet content pages.
 */

import type { PlanetPageData, ContentPlanetId } from "./types";
import { CONTENT_PLANET_IDS, CLASSICAL_PLANETS, OUTER_PLANETS } from "./types";
import { PLANET_PAGE_DATA, getAvailablePlanets, getAvailablePlanetIds } from "./data";
import { DIGIT_PLANETARY_META, PLANET_META as NUMEROLOGY_PLANET_META } from "@/lib/numbers/planetary";

// ═══════════════════════════════════════════════════════════════════════════
// BASIC GETTERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get a planet by ID.
 * Returns undefined if planet doesn't have content yet.
 */
export function getPlanet(id: ContentPlanetId): PlanetPageData | undefined {
  return PLANET_PAGE_DATA[id];
}

/**
 * Get all planets that have content pages.
 */
export function getAllPlanets(): PlanetPageData[] {
  return getAvailablePlanets();
}

/**
 * Get all planet IDs that have content pages.
 */
export function getAllPlanetIds(): ContentPlanetId[] {
  return getAvailablePlanetIds();
}

/**
 * Check if a planet has content available.
 */
export function hasPlanetContent(id: ContentPlanetId): boolean {
  return PLANET_PAGE_DATA[id] !== undefined;
}

/**
 * Check if a string is a valid content planet ID.
 */
export function isValidPlanetId(id: string): id is ContentPlanetId {
  return CONTENT_PLANET_IDS.includes(id as ContentPlanetId);
}

// ═══════════════════════════════════════════════════════════════════════════
// GROUPED ACCESS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get classical planets (Sun through Saturn) that have content.
 */
export function getClassicalPlanets(): PlanetPageData[] {
  return CLASSICAL_PLANETS.map((id) => PLANET_PAGE_DATA[id]).filter(
    (p): p is PlanetPageData => p !== undefined
  );
}

/**
 * Get outer planets (Uranus, Neptune) that have content.
 */
export function getOuterPlanets(): PlanetPageData[] {
  return OUTER_PLANETS.map((id) => PLANET_PAGE_DATA[id]).filter(
    (p): p is PlanetPageData => p !== undefined
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CROSS-DOMAIN INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extended planet data that includes numerology mappings.
 */
export interface PlanetWithNumerology extends PlanetPageData {
  /** Full numerology metadata from planetary.ts */
  digitMeta: typeof DIGIT_PLANETARY_META[1] | undefined;
  /** Full planet metadata from planetary.ts */
  planetMeta: typeof NUMEROLOGY_PLANET_META.saturn | undefined;
}

/**
 * Get planet with additional numerology data from planetary.ts.
 * This bridges the planets module with existing numerology data.
 */
export function getPlanetWithNumerology(
  id: ContentPlanetId
): PlanetWithNumerology | undefined {
  const planet = getPlanet(id);
  if (!planet) return undefined;

  // Get corresponding digit metadata
  const digitMeta = planet.numerology.digit > 0
    ? DIGIT_PLANETARY_META[planet.numerology.digit]
    : undefined;

  // Get corresponding planet metadata from numerology module
  // ContentPlanetId already excludes "pluto", so this always works
  const planetMeta = NUMEROLOGY_PLANET_META[id as keyof typeof NUMEROLOGY_PLANET_META];

  return {
    ...planet,
    digitMeta,
    planetMeta,
  };
}

/**
 * Get the primary number patterns associated with a planet.
 */
export function getPlanetNumberPatterns(id: ContentPlanetId): string[] {
  const planet = getPlanet(id);
  if (!planet) return [];
  return planet.numerology.relatedPatterns;
}

/**
 * Get the digit associated with a planet.
 */
export function getPlanetDigit(id: ContentPlanetId): number | undefined {
  const planet = getPlanet(id);
  return planet?.numerology.digit;
}

/**
 * Find planet by associated digit (1-9).
 */
export function getPlanetByDigit(digit: number): PlanetPageData | undefined {
  return getAllPlanets().find((p) => p.numerology.digit === digit);
}

// ═══════════════════════════════════════════════════════════════════════════
// SEO HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get the URL path for a planet page.
 */
export function getPlanetPath(id: ContentPlanetId): string {
  return `/astrology/planets/${id}`;
}

/**
 * Get the canonical URL for a planet page.
 */
export function getPlanetCanonicalUrl(
  id: ContentPlanetId,
  baseUrl: string
): string {
  return `${baseUrl}${getPlanetPath(id)}`;
}
