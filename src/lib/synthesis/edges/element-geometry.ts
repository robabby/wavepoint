/**
 * Element-Geometry edges based on Platonic solid correspondences.
 */

import { ELEMENT_META } from "@/lib/numbers/planetary";
import type { SynthesisEdge } from "../types";

/**
 * Generate edges connecting elements to their Platonic solids
 */
export function createElementGeometryEdges(): SynthesisEdge[] {
  const edges: SynthesisEdge[] = [];

  for (const [elementId, meta] of Object.entries(ELEMENT_META)) {
    edges.push({
      id: `element-${elementId}-manifests-as-${meta.geometry}`,
      type: "manifests_as",
      sourceType: "element",
      sourceId: elementId,
      targetType: "geometry",
      targetId: meta.geometry,
      bidirectional: true,
      weight: 10, // Foundational, maximum weight
      context: `${meta.name} manifests as the ${meta.geometry}`,
    });
  }

  return edges;
}
