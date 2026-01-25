/**
 * Planet-ZodiacSign edges based on traditional rulerships.
 */

import type { ZodiacSign } from "@/lib/astrology";
import type { SynthesisEdge } from "../types";

/**
 * Traditional rulership assignments
 */
const RULERSHIPS: Record<string, ZodiacSign[]> = {
  sun: ["leo"],
  moon: ["cancer"],
  mercury: ["gemini", "virgo"],
  venus: ["taurus", "libra"],
  mars: ["aries"], // Scorpio has Pluto as modern ruler
  jupiter: ["sagittarius"], // Pisces has Neptune as modern ruler
  saturn: ["capricorn"], // Aquarius has Uranus as modern ruler
  uranus: ["aquarius"],
  neptune: ["pisces"],
  pluto: ["scorpio"],
};

/**
 * Exaltation assignments
 */
const EXALTATIONS: Record<string, ZodiacSign> = {
  sun: "aries",
  moon: "taurus",
  mercury: "virgo",
  venus: "pisces",
  mars: "capricorn",
  jupiter: "cancer",
  saturn: "libra",
};

/**
 * Detriment assignments (opposite of rulership)
 */
const DETRIMENTS: Record<string, ZodiacSign[]> = {
  sun: ["aquarius"],
  moon: ["capricorn"],
  mercury: ["sagittarius", "pisces"],
  venus: ["aries", "scorpio"],
  mars: ["taurus", "libra"],
  jupiter: ["gemini", "virgo"],
  saturn: ["cancer", "leo"],
};

/**
 * Fall assignments (opposite of exaltation)
 */
const FALLS: Record<string, ZodiacSign> = {
  sun: "libra",
  moon: "scorpio",
  mercury: "pisces",
  venus: "virgo",
  mars: "cancer",
  jupiter: "capricorn",
  saturn: "aries",
};

/**
 * Generate planet-rules-sign edges
 */
export function createRulershipEdges(): SynthesisEdge[] {
  const edges: SynthesisEdge[] = [];

  for (const [planet, signs] of Object.entries(RULERSHIPS)) {
    for (const sign of signs) {
      edges.push({
        id: `planet-${planet}-rules-${sign}`,
        type: "rules",
        sourceType: "planet",
        sourceId: planet,
        targetType: "zodiacSign",
        targetId: sign,
        bidirectional: false,
        weight: 10,
        context: `${planet} rules ${sign}`,
      });
    }
  }

  return edges;
}

/**
 * Generate planet-exalts-in-sign edges
 */
export function createExaltationEdges(): SynthesisEdge[] {
  const edges: SynthesisEdge[] = [];

  for (const [planet, sign] of Object.entries(EXALTATIONS)) {
    edges.push({
      id: `planet-${planet}-exalts-in-${sign}`,
      type: "exalts_in",
      sourceType: "planet",
      sourceId: planet,
      targetType: "zodiacSign",
      targetId: sign,
      bidirectional: false,
      weight: 8,
      context: `${planet} is exalted in ${sign}`,
    });
  }

  return edges;
}

/**
 * Generate planet-detriment-in-sign edges
 */
export function createDetrimentEdges(): SynthesisEdge[] {
  const edges: SynthesisEdge[] = [];

  for (const [planet, signs] of Object.entries(DETRIMENTS)) {
    for (const sign of signs) {
      edges.push({
        id: `planet-${planet}-detriment-in-${sign}`,
        type: "detriment_in",
        sourceType: "planet",
        sourceId: planet,
        targetType: "zodiacSign",
        targetId: sign,
        bidirectional: false,
        weight: 6,
        context: `${planet} is in detriment in ${sign}`,
      });
    }
  }

  return edges;
}

/**
 * Generate planet-falls-in-sign edges
 */
export function createFallEdges(): SynthesisEdge[] {
  const edges: SynthesisEdge[] = [];

  for (const [planet, sign] of Object.entries(FALLS)) {
    edges.push({
      id: `planet-${planet}-falls-in-${sign}`,
      type: "falls_in",
      sourceType: "planet",
      sourceId: planet,
      targetType: "zodiacSign",
      targetId: sign,
      bidirectional: false,
      weight: 6,
      context: `${planet} falls in ${sign}`,
    });
  }

  return edges;
}

/**
 * Generate all planet-sign edges
 */
export function createPlanetSignEdges(): SynthesisEdge[] {
  return [
    ...createRulershipEdges(),
    ...createExaltationEdges(),
    ...createDetrimentEdges(),
    ...createFallEdges(),
  ];
}
