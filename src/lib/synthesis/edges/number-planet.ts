/**
 * Number-Planet edges based on DIGIT_PLANETARY_META.
 */

import { DIGIT_PLANETARY_META } from "@/lib/numbers/planetary";
import type { SynthesisEdge } from "../types";

/**
 * Generate edges connecting numbers to their planetary associations
 */
export function createNumberPlanetEdges(): SynthesisEdge[] {
  const edges: SynthesisEdge[] = [];

  for (const [digitStr, meta] of Object.entries(DIGIT_PLANETARY_META)) {
    const digit = parseInt(digitStr, 10);

    edges.push({
      id: `number-${digit}-resonates-with-${meta.planet}`,
      type: "resonates_with",
      sourceType: "number",
      sourceId: String(digit),
      targetType: "planet",
      targetId: meta.planet,
      bidirectional: true,
      weight: meta.confidence === "very-high" ? 10 : meta.confidence === "high" ? 9 : 7,
      confidence: meta.confidence,
      traditions: meta.traditions,
      context: `${digit} resonates with ${meta.planet} energy`,
    });
  }

  return edges;
}

/**
 * Generate edges connecting numbers to their elements
 */
export function createNumberElementEdges(): SynthesisEdge[] {
  const edges: SynthesisEdge[] = [];

  for (const [digitStr, meta] of Object.entries(DIGIT_PLANETARY_META)) {
    const digit = parseInt(digitStr, 10);

    edges.push({
      id: `number-${digit}-expresses-${meta.element}`,
      type: "expresses_element",
      sourceType: "number",
      sourceId: String(digit),
      targetType: "element",
      targetId: meta.element,
      bidirectional: true,
      weight: 9,
      context: `${digit} expresses ${meta.element} element`,
    });
  }

  // Special case: 0 expresses ether
  edges.push({
    id: "number-0-expresses-ether",
    type: "expresses_element",
    sourceType: "number",
    sourceId: "0",
    targetType: "element",
    targetId: "ether",
    bidirectional: true,
    weight: 8,
    context: "Zero represents pure potential, the void, ether",
  });

  return edges;
}
