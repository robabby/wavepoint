/**
 * Archetype edges connecting Major Arcana to planets, zodiac, and elements.
 */

import { getAllArchetypes } from "@/lib/archetypes";
import type { SynthesisEdge } from "../types";

/**
 * Generate edges connecting archetypes to their planetary correspondences
 */
export function createArchetypePlanetEdges(): SynthesisEdge[] {
  const edges: SynthesisEdge[] = [];
  const archetypes = getAllArchetypes();

  for (const archetype of archetypes) {
    if (archetype.planet) {
      edges.push({
        id: `archetype-${archetype.slug}-corresponds-to-${archetype.planet}`,
        type: "archetype_corresponds_to_planet",
        sourceType: "archetype",
        sourceId: archetype.slug,
        targetType: "planet",
        targetId: archetype.planet,
        bidirectional: true,
        weight:
          archetype.confidence === "very-high"
            ? 10
            : archetype.confidence === "high"
            ? 9
            : 7,
        confidence: archetype.confidence,
        context: `${archetype.name} corresponds to ${archetype.planet}`,
      });
    }
  }

  return edges;
}

/**
 * Generate edges connecting archetypes to their zodiac correspondences
 */
export function createArchetypeZodiacEdges(): SynthesisEdge[] {
  const edges: SynthesisEdge[] = [];
  const archetypes = getAllArchetypes();

  for (const archetype of archetypes) {
    if (archetype.zodiac) {
      edges.push({
        id: `archetype-${archetype.slug}-corresponds-to-${archetype.zodiac}`,
        type: "archetype_corresponds_to_zodiac",
        sourceType: "archetype",
        sourceId: archetype.slug,
        targetType: "zodiacSign",
        targetId: archetype.zodiac,
        bidirectional: true,
        weight:
          archetype.confidence === "very-high"
            ? 10
            : archetype.confidence === "high"
            ? 9
            : 7,
        confidence: archetype.confidence,
        context: `${archetype.name} corresponds to ${archetype.zodiac}`,
      });
    }
  }

  return edges;
}

/**
 * Generate edges connecting archetypes to their elemental correspondences
 */
export function createArchetypeElementEdges(): SynthesisEdge[] {
  const edges: SynthesisEdge[] = [];
  const archetypes = getAllArchetypes();

  for (const archetype of archetypes) {
    if (archetype.element) {
      edges.push({
        id: `archetype-${archetype.slug}-expresses-${archetype.element}`,
        type: "archetype_expresses_element",
        sourceType: "archetype",
        sourceId: archetype.slug,
        targetType: "element",
        targetId: archetype.element,
        bidirectional: true,
        weight:
          archetype.confidence === "very-high"
            ? 10
            : archetype.confidence === "high"
            ? 9
            : 7,
        confidence: archetype.confidence,
        context: `${archetype.name} expresses ${archetype.element} element`,
      });
    }
  }

  return edges;
}

/**
 * Generate all archetype edges
 */
export function createArchetypeEdges(): SynthesisEdge[] {
  return [
    ...createArchetypePlanetEdges(),
    ...createArchetypeZodiacEdges(),
    ...createArchetypeElementEdges(),
  ];
}
