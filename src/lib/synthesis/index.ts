/**
 * Synthesis module - Knowledge graph connecting all sacred systems.
 *
 * The synthesis graph bridges Sacred Geometry, Numerology, Astrology,
 * and Archetypes through their shared foundations (elements, planets).
 *
 * @example
 * ```ts
 * import { getSynthesisGraph, getPatternSynthesis } from "@/lib/synthesis";
 *
 * // Get synthesis for a number pattern
 * const graph = getSynthesisGraph();
 * const result = getPatternSynthesis(graph, {
 *   pattern: "444",
 *   profile: { sunSign: "capricorn" },
 * });
 *
 * console.log(result.patternMeta.primaryPlanet); // "uranus"
 * console.log(result.narrative); // Full synthesis narrative
 * ```
 */

// Types
export type {
  NodeType,
  EdgeType,
  BaseNode,
  GeometryNode,
  ElementNode,
  PlanetNode,
  NumberNode,
  ZodiacSignNode,
  HouseNode,
  ArchetypeNode,
  SynthesisNode,
  SynthesisEdge,
  SynthesisGraph,
  SynthesisQuery,
  SynthesisResult,
  PatternSynthesisQuery,
  PatternSynthesisResult,
} from "./types";

export { NODE_TYPES, EDGE_TYPES } from "./types";

// Constants
export {
  MAX_SYNTHESIS_PROMPT_TOKENS,
  DEFAULT_MAX_DEPTH,
  DEFAULT_MIN_WEIGHT,
} from "./constants";

// Graph operations
export {
  createGraph,
  addNode,
  addEdge,
  getNode,
  getEdgesFrom,
  getConnectedNodes,
  query,
  getNodesByType,
  nodeCount,
  edgeCount,
  nodeKey,
  parseNodeKey,
} from "./graph";

// Initialization
export {
  initSynthesisGraph,
  getSynthesisGraph,
  resetSynthesisGraph,
} from "./init";

// Queries
export {
  getPatternSynthesis,
  findConnection,
  getArchetypesForSign,
  getNumbersForElement,
} from "./queries";

// Prompt generation
export {
  buildSynthesisContext,
  buildSynthesisNarrative,
  isWithinTokenBudget,
} from "./prompt";
