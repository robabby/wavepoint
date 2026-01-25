/**
 * ZodiacSign-Modality edges based on sign qualities.
 *
 * Each zodiac sign belongs to one of three modalities:
 * - Cardinal: Aries, Cancer, Libra, Capricorn (initiating energy)
 * - Fixed: Taurus, Leo, Scorpio, Aquarius (stabilizing energy)
 * - Mutable: Gemini, Virgo, Sagittarius, Pisces (adapting energy)
 */

import { ZODIAC_META, ZODIAC_SIGNS } from "@/lib/astrology";
import type { SynthesisEdge } from "../types";

/**
 * Generate edges connecting zodiac signs to their modalities
 */
export function createSignModalityEdges(): SynthesisEdge[] {
  const edges: SynthesisEdge[] = [];

  for (const sign of ZODIAC_SIGNS) {
    const meta = ZODIAC_META[sign];

    edges.push({
      id: `sign-${sign}-has-modality-${meta.modality}`,
      type: "has_modality",
      sourceType: "zodiacSign",
      sourceId: sign,
      targetType: "modality",
      targetId: meta.modality,
      bidirectional: true,
      weight: 9,
      context: `${sign} is a ${meta.modality} sign`,
    });
  }

  return edges;
}
