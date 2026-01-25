/**
 * Query functions for the synthesis graph.
 */

import type { Element } from "@/lib/numbers/planetary";
import {
  getDominantDigit,
  getUniqueDigits,
  getPatternPlanetaryMeta,
} from "@/lib/numbers/planetary";
import { getArchetypesForDigit } from "@/lib/archetypes";
import type { ZodiacSign } from "@/lib/astrology";

import type {
  SynthesisGraph,
  SynthesisNode,
  PatternSynthesisQuery,
  PatternSynthesisResult,
} from "./types";
import { query, getNode, nodeKey } from "./graph";

/**
 * Get synthesis for a number pattern
 */
export function getPatternSynthesis(
  graph: SynthesisGraph,
  params: PatternSynthesisQuery
): PatternSynthesisResult {
  const { pattern, profile } = params;

  // Get pattern analysis from planetary module
  const planetaryMeta = getPatternPlanetaryMeta(pattern);
  const dominantDigit = getDominantDigit(pattern);
  const uniqueDigits = getUniqueDigits(pattern);

  // Find related archetypes via planetary connections
  const archetypes = planetaryMeta.planets.flatMap((planet) => {
    const archSlug = getArchetypesForDigit(
      Object.entries(
        { 1: "sun", 2: "moon", 3: "jupiter", 5: "mercury", 6: "venus", 8: "saturn", 9: "mars" }
      ).find(([, p]) => p === planet)?.[0] as unknown as number || 0
    );
    return archSlug;
  });

  // Collect all related nodes via graph traversal
  const seeds = uniqueDigits.map((d) => ({ type: "number" as const, id: String(d) }));

  const result = query(graph, {
    seeds,
    maxDepth: 2,
    targetTypes: ["planet", "element", "geometry", "zodiacSign", "archetype"],
  });

  // Determine personal connections if profile provided
  let personalConnections: PatternSynthesisResult["personalConnections"];

  if (profile) {
    const relatedSigns: string[] = [];
    const patternElement = planetaryMeta.primaryElement;

    // Check if user's signs are connected
    if (profile.sunSign) relatedSigns.push(profile.sunSign);
    if (profile.moonSign) relatedSigns.push(profile.moonSign);
    if (profile.risingSign) relatedSigns.push(profile.risingSign);

    // Determine element alignment
    let elementAlignment: "harmonious" | "complementary" | "challenging" = "complementary";

    if (profile.dominantElement === patternElement) {
      elementAlignment = "harmonious";
    } else if (
      (patternElement === "fire" && profile.dominantElement === "water") ||
      (patternElement === "water" && profile.dominantElement === "fire") ||
      (patternElement === "air" && profile.dominantElement === "earth") ||
      (patternElement === "earth" && profile.dominantElement === "air")
    ) {
      elementAlignment = "challenging";
    }

    personalConnections = {
      relatedSigns: relatedSigns as ZodiacSign[],
      elementAlignment,
    };
  }

  // Generate narrative for Claude prompts
  const narrative = generateNarrative(planetaryMeta, archetypes, personalConnections);

  return {
    ...result,
    patternMeta: {
      pattern,
      dominantDigit,
      primaryPlanet: planetaryMeta.primaryPlanet,
      primaryElement: planetaryMeta.primaryElement,
      geometry: planetaryMeta.geometry,
      elements: planetaryMeta.elements,
      planets: planetaryMeta.planets,
      archetypes,
    },
    personalConnections,
    narrative,
  };
}

/**
 * Generate a narrative description for Claude prompts
 */
function generateNarrative(
  planetaryMeta: ReturnType<typeof getPatternPlanetaryMeta>,
  archetypes: string[],
  personalConnections?: PatternSynthesisResult["personalConnections"]
): string {
  const lines: string[] = [];

  // Pattern fundamentals
  lines.push(`## Pattern Synthesis`);
  lines.push(`- Primary Planet: ${planetaryMeta.primaryPlanet} (${planetaryMeta.primarySymbol})`);
  lines.push(`- Primary Element: ${planetaryMeta.primaryElement}`);

  if (planetaryMeta.geometry) {
    lines.push(`- Sacred Geometry: ${planetaryMeta.geometry}`);
  }

  if (archetypes.length > 0) {
    lines.push(`- Related Archetypes: ${archetypes.join(", ")}`);
  }

  if (planetaryMeta.agrippaNote) {
    lines.push(`- Agrippa Connection: ${planetaryMeta.agrippaNote}`);
  }

  // Energy description
  lines.push("");
  lines.push(planetaryMeta.energyDescription);

  // Personal connections
  if (personalConnections) {
    lines.push("");
    lines.push(`## Personal Resonance`);

    const alignment = personalConnections.elementAlignment;
    if (alignment === "harmonious") {
      lines.push(`- This pattern's ${planetaryMeta.primaryElement} energy harmonizes with your chart.`);
    } else if (alignment === "complementary") {
      lines.push(`- This pattern offers balancing energy for your chart.`);
    } else {
      lines.push(`- This pattern presents growth opportunities through its ${planetaryMeta.primaryElement} energy.`);
    }

    if (personalConnections.relatedSigns.length > 0) {
      lines.push(`- Related to your placements in: ${personalConnections.relatedSigns.join(", ")}`);
    }
  }

  return lines.join("\n");
}

/**
 * Find what connects two nodes
 */
export function findConnection(
  graph: SynthesisGraph,
  node1: { type: "number" | "planet" | "element" | "geometry" | "zodiacSign" | "archetype"; id: string },
  node2: { type: "number" | "planet" | "element" | "geometry" | "zodiacSign" | "archetype"; id: string }
): SynthesisNode[] {
  // BFS to find path between nodes
  const result = query(graph, {
    seeds: [node1],
    maxDepth: 3,
    targetTypes: [node2.type],
  });

  // Find if node2 is in results
  const targetKey = nodeKey(node2.type, node2.id);
  const path = result.paths.find((p) => nodeKey(p.node.type, p.node.id) === targetKey);

  if (!path) return [];

  // Return nodes along the path
  return [
    getNode(graph, node1.type, node1.id)!,
    ...path.path.map((edge) => getNode(graph, edge.targetType, edge.targetId)!),
  ].filter(Boolean);
}

/**
 * Get archetypes that resonate with a given zodiac sign
 */
export function getArchetypesForSign(
  graph: SynthesisGraph,
  sign: string
): SynthesisNode[] {
  const result = query(graph, {
    seeds: [{ type: "zodiacSign", id: sign }],
    maxDepth: 2,
    targetTypes: ["archetype"],
  });

  return result.nodes.filter((n) => n.type === "archetype");
}

/**
 * Get numbers that resonate with a given element
 */
export function getNumbersForElement(
  graph: SynthesisGraph,
  element: Element
): SynthesisNode[] {
  const result = query(graph, {
    seeds: [{ type: "element", id: element }],
    maxDepth: 1,
    edgeTypes: ["expresses_element"],
    targetTypes: ["number"],
  });

  return result.nodes.filter((n) => n.type === "number");
}
