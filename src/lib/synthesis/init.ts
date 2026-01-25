/**
 * Initialize the synthesis graph with all nodes and edges.
 */

import type { SynthesisGraph } from "./types";
import { createGraph, addNode, addEdge } from "./graph";

// Node creators
import {
  createNumberNodes,
  createPlanetNodes,
  createElementNodes,
  createGeometryNodes,
  createZodiacSignNodes,
  createHouseNodes,
  createArchetypeNodes,
  createModalityNodes,
} from "./nodes";

// Edge creators
import {
  createNumberPlanetEdges,
  createNumberElementEdges,
} from "./edges/number-planet";
import { createElementGeometryEdges } from "./edges/element-geometry";
import { createPlanetSignEdges } from "./edges/planet-sign";
import {
  createSignElementEdges,
  createSignHouseEdges,
} from "./edges/sign-element";
import { createSignModalityEdges } from "./edges/sign-modality";
import { createArchetypeEdges } from "./edges/archetype-edges";

/**
 * Singleton graph instance
 */
let graphInstance: SynthesisGraph | null = null;

/**
 * Initialize and return the synthesis graph.
 * Uses singleton pattern for efficiency.
 */
export function initSynthesisGraph(): SynthesisGraph {
  if (graphInstance) {
    return graphInstance;
  }

  const graph = createGraph();

  // Add all nodes
  const allNodes = [
    ...createNumberNodes(),
    ...createPlanetNodes(),
    ...createElementNodes(),
    ...createGeometryNodes(),
    ...createZodiacSignNodes(),
    ...createHouseNodes(),
    ...createArchetypeNodes(),
    ...createModalityNodes(),
  ];

  for (const node of allNodes) {
    addNode(graph, node);
  }

  // Add all edges
  const allEdges = [
    ...createNumberPlanetEdges(),
    ...createNumberElementEdges(),
    ...createElementGeometryEdges(),
    ...createPlanetSignEdges(),
    ...createSignElementEdges(),
    ...createSignHouseEdges(),
    ...createSignModalityEdges(),
    ...createArchetypeEdges(),
  ];

  for (const edge of allEdges) {
    addEdge(graph, edge);
  }

  graphInstance = graph;
  return graph;
}

/**
 * Get the synthesis graph (initializes if needed)
 */
export function getSynthesisGraph(): SynthesisGraph {
  return initSynthesisGraph();
}

/**
 * Reset the graph (for testing)
 */
export function resetSynthesisGraph(): void {
  graphInstance = null;
}
