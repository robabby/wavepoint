/**
 * Sensitive Points (Nodes) content module for astrology pages.
 *
 * This module provides data for sensitive point content pages:
 * - North Node, South Node (Lunar Nodes)
 * - Black Moon Lilith
 * - Chiron
 * - Part of Fortune
 * - Vertex
 *
 * @example
 * ```ts
 * import { getNode, getAllNodes, getNodeWithRelations } from "@/lib/astrology/nodes";
 *
 * // Get North Node data
 * const northNode = getNode("northnode");
 * console.log(northNode?.archetype); // "The Soul's Destination"
 *
 * // Get all nodes
 * const allNodes = getAllNodes();
 *
 * // Get node with relations for detail page
 * const nodeWithRelations = getNodeWithRelations("chiron");
 * console.log(nodeWithRelations?.adjacentPoints.next.name); // Next node in sequence
 * ```
 */

// Re-export SensitivePointId from constants for convenience
export type { SensitivePointId } from "../constants";

// Types
export type {
  SensitivePointCategory,
  SensitivePointPageData,
  SensitivePointWithRelations,
  SensitivePointTraits,
  // Re-exported from planets for convenience
  Citation,
  SourcedClaim,
  ConfidenceLevel,
  NumerologyConnection,
  GeometryConnection,
} from "./types";

// Data
export { SENSITIVE_POINT_DATA, getAvailableNodes, getAvailableNodeIds } from "./data";

// Helpers
export type { NodeCategoryDisplayInfo } from "./helpers";
export {
  getNode,
  getAllNodes,
  getAllNodeIds,
  isValidNodeId,
  getNodesByCategory,
  getNodesGroupedByCategory,
  getAdjacentNodes,
  getSameCategoryNodes,
  getNodeWithRelations,
  searchNodes,
  getNodePath,
  getNodeCanonicalUrl,
  getNodeCategoryDisplayInfo,
  NODE_CATEGORY_ORDER,
} from "./helpers";
