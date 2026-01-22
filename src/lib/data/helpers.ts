/**
 * Helper Functions and Data Enhancement
 *
 * Query utilities and relationship enhancement logic for geometries
 */

import type {
  Geometry,
  GeometryCategory,
  GeometryId,
  GeometryRelations,
  RelationshipType,
} from "./geometries.types";
import {
  CONTAINS_GRAPH,
  DUAL_GRAPH,
  RELATIONSHIP_GRAPH,
} from "./relationships";

/**
 * Enhance geometries with computed relationships
 *
 * This function:
 * 1. Adds `relationships` array from RELATIONSHIP_GRAPH (new system)
 * 2. Auto-computes legacy fields (contains, dual, appearsIn) from relationships
 * 3. Falls back to CONTAINS_GRAPH and DUAL_GRAPH for backward compatibility
 */
export function enhanceGeometries(
  geometries: Record<string, Geometry>
): Record<string, Geometry> {
  const enhanced: Record<string, Geometry> = {};

  // First pass: copy all geometries and add relationships from RELATIONSHIP_GRAPH
  Object.entries(geometries).forEach(([id, geom]) => {
    const relationships =
      RELATIONSHIP_GRAPH[id as keyof typeof RELATIONSHIP_GRAPH] ??
      geom.relationships ??
      [];

    // Extract legacy fields from relationships
    const dualRelationship = relationships.find(
      (r: { type: string }) => r.type === "dual"
    );
    const containsRelationships = relationships.filter(
      (r: { type: string }) => r.type === "contains"
    );

    enhanced[id] = {
      ...geom,
      // New system
      relationships,

      // Legacy fields (auto-computed from relationships or fallback to old graphs)
      contains:
        containsRelationships.length > 0
          ? (containsRelationships.map((r: { targetId: string }) => r.targetId) as GeometryId[])
          : CONTAINS_GRAPH[id] ?? geom.contains ?? [],
      dual: dualRelationship?.targetId ?? DUAL_GRAPH[id] ?? geom.dual,
      appearsIn: [], // Will be computed in next pass
    };
  });

  // Second pass: compute inverse relationships (appearsIn from contains and appears-in relationships)
  Object.values(enhanced).forEach((geometry) => {
    // Add appearsIn from "contains" inverse
    geometry.contains?.forEach((containedId) => {
      const contained = enhanced[containedId];
      if (contained) {
        contained.appearsIn = contained.appearsIn ?? [];
        if (!contained.appearsIn.includes(geometry.id)) {
          contained.appearsIn.push(geometry.id);
        }
      }
    });

    // Add appearsIn from explicit "appears-in" relationships
    geometry.relationships
      ?.filter((r) => r.type === "appears-in")
      .forEach((rel) => {
        const parent = enhanced[rel.targetId];
        if (parent) {
          geometry.appearsIn = geometry.appearsIn ?? [];
          if (!geometry.appearsIn.includes(parent.id)) {
            geometry.appearsIn.push(parent.id);
          }
        }
      });
  });

  return enhanced;
}

/**
 * Validate all relationship references
 *
 * Throws an error if any relationship references a non-existent geometry
 */
export function validateGeometries(
  geometries: Record<string, Geometry>
): void {
  const errors: string[] = [];

  Object.values(geometries).forEach((geom) => {
    // Validate contains references
    geom.contains?.forEach((id) => {
      if (!geometries[id]) {
        errors.push(`${geom.id}.contains: Invalid reference to "${id}"`);
      }
    });

    // Validate appearsIn references
    geom.appearsIn?.forEach((id) => {
      if (!geometries[id]) {
        errors.push(`${geom.id}.appearsIn: Invalid reference to "${id}"`);
      }
    });

    // Validate dual reference
    if (geom.dual && !geometries[geom.dual]) {
      errors.push(`${geom.id}.dual: Invalid reference to "${geom.dual}"`);
    }
  });

  if (errors.length > 0) {
    throw new Error(
      `Geometry validation failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`
    );
  }
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Get a geometry by its ID
 */
export function getGeometryById(
  geometries: Record<string, Geometry>,
  id: string
): Geometry | undefined {
  return geometries[id];
}

/**
 * Get a geometry by its slug
 * This is useful for dynamic routing where the slug is used in the URL
 * e.g., /platonic-solids/tetrahedron or /patterns/flower-of-life
 */
export function getGeometryBySlug(
  geometries: Record<string, Geometry>,
  slug: string
): Geometry | undefined {
  return Object.values(geometries).find((g) => g.slug === slug);
}

/**
 * Get all geometries in a specific category
 */
export function getGeometriesByCategory(
  geometries: Record<string, Geometry>,
  category: GeometryCategory
): Geometry[] {
  return Object.values(geometries)
    .filter((g) => g.category === category)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Get the dual of a geometry (Platonic solids only)
 */
export function getDual(
  geometries: Record<string, Geometry>,
  geometryId: string
): Geometry | undefined {
  const geometry = geometries[geometryId];
  if (!geometry?.dual) return undefined;
  return geometries[geometry.dual];
}

/**
 * Get all geometries that this geometry contains
 */
export function getContainedGeometries(
  geometries: Record<string, Geometry>,
  geometryId: string
): Geometry[] {
  const geometry = geometries[geometryId];
  if (!geometry?.contains) return [];
  return geometry.contains
    .map((id) => geometries[id])
    .filter((g): g is Geometry => g !== undefined);
}

/**
 * Get all geometries where this geometry appears
 */
export function getAppearsInGeometries(
  geometries: Record<string, Geometry>,
  geometryId: string
): Geometry[] {
  const geometry = geometries[geometryId];
  if (!geometry?.appearsIn) return [];
  return geometry.appearsIn
    .map((id) => geometries[id])
    .filter((g): g is Geometry => g !== undefined);
}

/**
 * Get all related geometries (contains + appears in + dual)
 */
export function getRelatedGeometries(
  geometries: Record<string, Geometry>,
  geometryId: string
): {
  dual?: Geometry;
  contains: Geometry[];
  appearsIn: Geometry[];
} {
  return {
    dual: getDual(geometries, geometryId),
    contains: getContainedGeometries(geometries, geometryId),
    appearsIn: getAppearsInGeometries(geometries, geometryId),
  };
}

/**
 * Get all geometries associated with a specific element
 */
export function getGeometriesByElement(
  geometries: Record<string, Geometry>,
  element: GeometryRelations["element"]
): Geometry[] {
  return Object.values(geometries).filter(
    (g) => g.relatedBy?.element === element
  );
}

/**
 * Get all Platonic Solids
 */
export function getPlatonicSolids(
  geometries: Record<string, Geometry>
): Geometry[] {
  return getGeometriesByCategory(geometries, "platonic");
}

/**
 * Get all Patterns
 */
export function getPatterns(
  geometries: Record<string, Geometry>
): Geometry[] {
  return getGeometriesByCategory(geometries, "pattern");
}

/**
 * Get all geometries as an array
 */
export function getAllGeometries(
  geometries: Record<string, Geometry>
): Geometry[] {
  return Object.values(geometries);
}

/**
 * Search geometries by name, aliases, description, or property
 */
export function searchGeometries(
  geometries: Record<string, Geometry>,
  query: string
): Geometry[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(geometries).filter(
    (g) =>
      g.name.toLowerCase().includes(lowerQuery) ||
      (g.aliases?.some((alias) =>
        alias.toLowerCase().includes(lowerQuery)
      ) ??
        false) ||
      (g.description?.toLowerCase().includes(lowerQuery) ?? false) ||
      (g.relatedBy?.property?.some((p) =>
        p.toLowerCase().includes(lowerQuery)
      ) ??
        false)
  );
}

/**
 * Get the URL path for a geometry based on its category
 */
export function getGeometryPath(geometry: Geometry): string {
  if (geometry.category === "platonic") {
    return `/geometries/platonic-solids/${geometry.slug}`;
  } else if (geometry.category === "pattern") {
    return `/geometries/patterns/${geometry.slug}`;
  }
  return "/";
}

/**
 * Get the URL path for a category's list page
 */
export function getGeometryListPath(category: GeometryCategory): string {
  if (category === "platonic") return "/geometries/platonic-solids";
  if (category === "pattern") return "/geometries/patterns";
  return "/";
}

/**
 * Get the next geometry in sequence within a category (by order field)
 */
export function getNextGeometry(
  geometries: Record<string, Geometry>,
  currentId: string,
  category: GeometryCategory
): Geometry | undefined {
  const sortedGeometries = getGeometriesByCategory(geometries, category)
    .filter((g) => g.order !== undefined)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const currentIndex = sortedGeometries.findIndex((g) => g.id === currentId);
  return currentIndex >= 0 && currentIndex < sortedGeometries.length - 1
    ? sortedGeometries[currentIndex + 1]
    : undefined;
}

/**
 * Get the previous geometry in sequence within a category (by order field)
 */
export function getPreviousGeometry(
  geometries: Record<string, Geometry>,
  currentId: string,
  category: GeometryCategory
): Geometry | undefined {
  const sortedGeometries = getGeometriesByCategory(geometries, category)
    .filter((g) => g.order !== undefined)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const currentIndex = sortedGeometries.findIndex((g) => g.id === currentId);
  return currentIndex > 0 ? sortedGeometries[currentIndex - 1] : undefined;
}

// ============================================================================
// ENHANCED RELATIONSHIP QUERY FUNCTIONS (Phase 2)
// ============================================================================

/**
 * Get all relationships of a specific type for a geometry
 */
export function getRelationshipsByType(
  geometries: Record<string, Geometry>,
  geometryId: string,
  type: RelationshipType
): Geometry[] {
  const geometry = geometries[geometryId];
  if (!geometry?.relationships) return [];

  const relationshipIds = geometry.relationships
    .filter((r) => r.type === type)
    .map((r) => r.targetId);

  return relationshipIds
    .map((id) => geometries[id])
    .filter((g): g is Geometry => g !== undefined);
}

/**
 * Get relationship strength between two geometries
 * Returns null if no direct relationship exists
 */
export function getRelationshipStrength(
  geometries: Record<string, Geometry>,
  fromId: string,
  toId: string
): number | null {
  const geometry = geometries[fromId];
  if (!geometry?.relationships) return null;

  const relationship = geometry.relationships.find((r) => r.targetId === toId);
  return relationship?.strength ?? null;
}

/**
 * Get all relationship types for a geometry
 */
export function getRelationshipTypes(
  geometries: Record<string, Geometry>,
  geometryId: string
): RelationshipType[] {
  const geometry = geometries[geometryId];
  if (!geometry?.relationships) return [];

  const types = new Set(geometry.relationships.map((r) => r.type));
  return Array.from(types);
}

/**
 * Get grouped relationships (for display)
 * Returns relationships organized by type
 */
export function getGroupedRelationships(
  geometries: Record<string, Geometry>,
  geometryId: string
): Record<RelationshipType, Geometry[]> {
  const geometry = geometries[geometryId];
  const grouped: Partial<Record<RelationshipType, Geometry[]>> = {};

  if (!geometry?.relationships) {
    return grouped as Record<RelationshipType, Geometry[]>;
  }

  geometry.relationships.forEach((rel) => {
    grouped[rel.type] ??= [];
    const target = geometries[rel.targetId];
    if (target) {
      grouped[rel.type]!.push(target);
    }
  });

  return grouped as Record<RelationshipType, Geometry[]>;
}
