/**
 * Planet page data for content pages.
 *
 * Using PLANET_PAGE_DATA to avoid collision with PLANET_META exports in:
 * - src/lib/astrology/constants.ts
 * - src/lib/numbers/planetary.ts
 *
 * Starting with Saturn as the template planet. Additional planets will be
 * added after the Saturn page is validated.
 */

import type { PlanetPageData, ContentPlanetId } from "./types";
import {
  PTOLEMY_TETRABIBLOS,
  LILLY_CHRISTIAN_ASTROLOGY,
  GREENE_SATURN,
  VEDIC_TRADITION,
  AGRIPPA_OCCULT_PHILOSOPHY,
  MODERN_WESTERN_CONSENSUS,
} from "./citations";

// ═══════════════════════════════════════════════════════════════════════════
// SATURN
// ═══════════════════════════════════════════════════════════════════════════

const SATURN: PlanetPageData = {
  id: "saturn",
  name: "Saturn",
  glyph: "♄",
  archetype: "The Great Teacher",
  keywords: ["discipline", "structure", "time", "karma", "mastery", "limits"],
  element: "earth",
  dayOfWeek: "Saturday",
  metal: "Lead",
  type: "social",

  rulerships: [
    {
      sign: "Capricorn",
      traditional: true,
      modern: true,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Aquarius",
      traditional: true,
      modern: false, // Uranus is modern ruler
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  dignities: [
    {
      sign: "Libra",
      type: "exaltation",
      degree: 21,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Aries",
      type: "fall",
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Cancer",
      type: "detriment",
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Leo",
      type: "detriment",
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  numerology: {
    digit: 8,
    traditions: ["Vedic", "Chaldean", "Kabbalah", "Lo Shu"],
    confidence: "established",
    relatedPatterns: ["8", "88", "888", "8888", "44", "17", "26", "35"],
  },

  geometry: {
    geometry: "cube",
    rationale:
      "The cube (hexahedron) embodies Saturn's earth element qualities: stability, structure, and grounded manifestation. Its six faces represent Saturn's mastery over the material realm.",
    confidence: "consensus",
  },

  coreArchetype: {
    primaryClaim:
      "Saturn represents the principle of limitation, structure, and time. In the natal chart, Saturn shows where we encounter obstacles that ultimately teach us discipline and mastery.",
    sources: [
      PTOLEMY_TETRABIBLOS,
      LILLY_CHRISTIAN_ASTROLOGY,
      GREENE_SATURN,
      MODERN_WESTERN_CONSENSUS,
    ],
    confidence: "established",
    wavepointNote:
      "In our synthesis, Saturn's role as teacher connects to the number 8's themes of karmic lessons and material mastery. The Saturn-8-Earth triad forms one of the most consistent correspondences across traditions.",
  },

  elementalNature: {
    primaryClaim:
      "Saturn's cold, dry nature aligns with the earth element. This manifests as crystallization, contraction, and the formation of lasting structures in both physical and psychological realms.",
    sources: [PTOLEMY_TETRABIBLOS, VEDIC_TRADITION, AGRIPPA_OCCULT_PHILOSOPHY],
    confidence: "established",
  },

  metaDescription:
    "Explore Saturn in astrology: the Great Teacher of discipline, time, and karmic lessons. Discover connections to the number 8, earth element, and the cube in sacred geometry.",
  seoKeywords: [
    "saturn astrology",
    "saturn meaning",
    "saturn numerology",
    "saturn number 8",
    "saturn great teacher",
    "saturn karma",
    "saturn discipline",
    "saturn capricorn",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// PLANET PAGE DATA COLLECTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All planet page data indexed by planet ID.
 *
 * Note: Using PLANET_PAGE_DATA name to avoid collision with PLANET_META
 * in astrology/constants.ts and numbers/planetary.ts.
 */
export const PLANET_PAGE_DATA: Partial<Record<ContentPlanetId, PlanetPageData>> =
  {
    saturn: SATURN,
    // Additional planets will be added after Saturn page is validated:
    // sun: SUN,
    // moon: MOON,
    // mercury: MERCURY,
    // venus: VENUS,
    // mars: MARS,
    // jupiter: JUPITER,
    // uranus: URANUS,
    // neptune: NEPTUNE,
  };

/**
 * Get all planets that have page data.
 * Returns only planets with complete content.
 */
export function getAvailablePlanets(): PlanetPageData[] {
  return Object.values(PLANET_PAGE_DATA).filter(
    (p): p is PlanetPageData => p !== undefined
  );
}

/**
 * Get planet IDs that have page data available.
 */
export function getAvailablePlanetIds(): ContentPlanetId[] {
  return Object.keys(PLANET_PAGE_DATA) as ContentPlanetId[];
}
