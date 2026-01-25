/**
 * ZodiacSign-Element edges based on sign triplicities.
 */

import { ZODIAC_META, ZODIAC_SIGNS, type ZodiacSign } from "@/lib/astrology";
import type { SynthesisEdge } from "../types";

/**
 * Generate edges connecting zodiac signs to their elements
 */
export function createSignElementEdges(): SynthesisEdge[] {
  const edges: SynthesisEdge[] = [];

  for (const sign of ZODIAC_SIGNS) {
    const meta = ZODIAC_META[sign];

    edges.push({
      id: `sign-${sign}-belongs-to-${meta.element}`,
      type: "belongs_to_element",
      sourceType: "zodiacSign",
      sourceId: sign,
      targetType: "element",
      targetId: meta.element,
      bidirectional: true,
      weight: 10,
      context: `${sign} is a ${meta.element} sign`,
    });
  }

  return edges;
}

/**
 * House natural sign mappings (Aries = 1st, Taurus = 2nd, etc.)
 */
const HOUSE_NATURAL_SIGNS: ZodiacSign[] = [
  "aries",      // 1
  "taurus",     // 2
  "gemini",     // 3
  "cancer",     // 4
  "leo",        // 5
  "virgo",      // 6
  "libra",      // 7
  "scorpio",    // 8
  "sagittarius",// 9
  "capricorn",  // 10
  "aquarius",   // 11
  "pisces",     // 12
];

/**
 * Generate edges connecting zodiac signs to their natural houses
 */
export function createSignHouseEdges(): SynthesisEdge[] {
  const edges: SynthesisEdge[] = [];

  HOUSE_NATURAL_SIGNS.forEach((sign, index) => {
    const houseNumber = index + 1;

    edges.push({
      id: `sign-${sign}-naturally-rules-house-${houseNumber}`,
      type: "naturally_rules",
      sourceType: "zodiacSign",
      sourceId: sign,
      targetType: "house",
      targetId: String(houseNumber),
      bidirectional: true,
      weight: 8,
      context: `${sign} naturally rules the ${houseNumber}th house`,
    });
  });

  return edges;
}
