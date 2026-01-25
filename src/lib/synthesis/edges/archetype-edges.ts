/**
 * Archetype edges connecting Jungian archetypes to planets and elements.
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
    edges.push({
      id: `archetype-${archetype.slug}-corresponds-to-${archetype.planet}`,
      type: "archetype_corresponds_to_planet",
      sourceType: "archetype",
      sourceId: archetype.slug,
      targetType: "planet",
      targetId: archetype.planet,
      bidirectional: true,
      weight: 9, // High weight for Jungian planetary correspondences
      context: `${archetype.name} corresponds to ${archetype.planet}`,
    });
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
    edges.push({
      id: `archetype-${archetype.slug}-expresses-${archetype.element}`,
      type: "archetype_expresses_element",
      sourceType: "archetype",
      sourceId: archetype.slug,
      targetType: "element",
      targetId: archetype.element,
      bidirectional: true,
      weight: 8,
      context: `${archetype.name} expresses ${archetype.element} element`,
    });
  }

  return edges;
}

/**
 * Generate all archetype edges
 */
export function createArchetypeEdges(): SynthesisEdge[] {
  return [
    ...createArchetypePlanetEdges(),
    ...createArchetypeElementEdges(),
  ];
}
