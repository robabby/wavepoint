/**
 * Helper functions for sensitive point (node) content pages.
 */

import type { SensitivePointPageData, SensitivePointCategory, SensitivePointWithRelations } from "./types";
import type { SensitivePointId } from "../constants";
import { SENSITIVE_POINTS } from "../constants";
import { SENSITIVE_POINT_DATA, getAvailableNodes, getAvailableNodeIds } from "./data";

// ═══════════════════════════════════════════════════════════════════════════
// BASIC GETTERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get a sensitive point by ID.
 * Returns undefined if point doesn't exist.
 */
export function getNode(id: SensitivePointId): SensitivePointPageData | undefined {
  return SENSITIVE_POINT_DATA[id];
}

/**
 * Get all sensitive points.
 */
export function getAllNodes(): SensitivePointPageData[] {
  return getAvailableNodes();
}

/**
 * Get all sensitive point IDs.
 */
export function getAllNodeIds(): SensitivePointId[] {
  return getAvailableNodeIds();
}

/**
 * Check if a string is a valid sensitive point ID.
 */
export function isValidNodeId(id: string): id is SensitivePointId {
  return SENSITIVE_POINTS.includes(id as SensitivePointId);
}

// ═══════════════════════════════════════════════════════════════════════════
// GROUPED ACCESS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get sensitive points by category.
 */
export function getNodesByCategory(category: SensitivePointCategory): SensitivePointPageData[] {
  return getAllNodes().filter((node) => node.category === category);
}

/**
 * Get all nodes grouped by category.
 */
export function getNodesGroupedByCategory(): Record<SensitivePointCategory, SensitivePointPageData[]> {
  return {
    lunar: getNodesByCategory("lunar"),
    asteroid: getNodesByCategory("asteroid"),
    "arabic-part": getNodesByCategory("arabic-part"),
    angle: getNodesByCategory("angle"),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get adjacent nodes for circular navigation.
 * Uses the order defined in SENSITIVE_POINTS.
 */
export function getAdjacentNodes(id: SensitivePointId): {
  previous: SensitivePointPageData;
  next: SensitivePointPageData;
} {
  const nodeIds = [...SENSITIVE_POINTS] as SensitivePointId[];
  const currentIndex = nodeIds.indexOf(id);

  // Default to first if not found
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  const prevIndex = safeIndex === 0 ? nodeIds.length - 1 : safeIndex - 1;
  const nextIndex = safeIndex === nodeIds.length - 1 ? 0 : safeIndex + 1;

  const prevId = nodeIds[prevIndex] ?? "northnode";
  const nextId = nodeIds[nextIndex] ?? "northnode";

  return {
    previous: SENSITIVE_POINT_DATA[prevId],
    next: SENSITIVE_POINT_DATA[nextId],
  };
}

/**
 * Get other nodes of the same category.
 */
export function getSameCategoryNodes(id: SensitivePointId): SensitivePointPageData[] {
  const node = getNode(id);
  if (!node) return [];

  return getAllNodes().filter((n) => n.category === node.category && n.id !== id);
}

// ═══════════════════════════════════════════════════════════════════════════
// RELATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get a node with all its relations populated.
 */
export function getNodeWithRelations(id: SensitivePointId): SensitivePointWithRelations | null {
  const node = getNode(id);
  if (!node) return null;

  const polarityPointUrl = node.polarityPoint
    ? `/astrology/nodes/${node.polarityPoint}`
    : undefined;

  return {
    ...node,
    adjacentPoints: getAdjacentNodes(id),
    polarityPointUrl,
    sameCategoryPoints: getSameCategoryNodes(id),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Search nodes by keyword.
 */
export function searchNodes(query: string): SensitivePointPageData[] {
  const lowerQuery = query.toLowerCase();

  return getAllNodes().filter((node) => {
    // Search in name
    if (node.name.toLowerCase().includes(lowerQuery)) return true;

    // Search in archetype
    if (node.archetype.toLowerCase().includes(lowerQuery)) return true;

    // Search in keywords
    if (node.keywords.some((k) => k.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    // Search in core archetype claim
    if (node.coreArchetype.primaryClaim.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    return false;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SEO HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get the URL path for a node page.
 */
export function getNodePath(id: SensitivePointId): string {
  return `/astrology/nodes/${id}`;
}

/**
 * Get the canonical URL for a node page.
 */
export function getNodeCanonicalUrl(id: SensitivePointId, baseUrl: string): string {
  return `${baseUrl}${getNodePath(id)}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Category display information.
 */
export interface NodeCategoryDisplayInfo {
  name: string;
  description: string;
}

/**
 * Get display info for a node category.
 */
export function getNodeCategoryDisplayInfo(category: SensitivePointCategory): NodeCategoryDisplayInfo {
  const categoryInfo: Record<SensitivePointCategory, NodeCategoryDisplayInfo> = {
    lunar: {
      name: "Lunar Points",
      description:
        "Points derived from the Moon's orbit, including the lunar nodes and Black Moon Lilith. These points connect to the soul's karmic journey and the shadow self.",
    },
    asteroid: {
      name: "Asteroids",
      description:
        "Celestial bodies orbiting between Mars and Jupiter, carrying specific archetypal themes. Chiron bridges the personal and transpersonal planets.",
    },
    "arabic-part": {
      name: "Arabic Parts",
      description:
        "Calculated points synthesizing multiple chart factors, developed in medieval Islamic astrology. The Part of Fortune combines Sun, Moon, and Ascendant.",
    },
    angle: {
      name: "Angles",
      description:
        "Points derived from the intersection of celestial circles. The Vertex marks where fate reaches us through encounters with others.",
    },
  };

  return categoryInfo[category];
}

/**
 * Category order for display.
 */
export const NODE_CATEGORY_ORDER: readonly SensitivePointCategory[] = [
  "lunar",
  "asteroid",
  "arabic-part",
  "angle",
] as const;
