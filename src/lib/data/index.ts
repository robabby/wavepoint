/**
 * Sacred Geometry Data Model - Main Export
 *
 * This module combines all geometry data and provides a unified API
 * for accessing sacred geometry information and relationships.
 */

import { PLATONIC_SOLIDS } from "./platonic-solids";
import { PATTERNS } from "./patterns";
import type { RelationshipType } from "./geometries.types";
import {
  enhanceGeometries,
  validateGeometries,
  getGeometryById as _getGeometryById,
  getGeometryBySlug as _getGeometryBySlug,
  getGeometriesByCategory as _getGeometriesByCategory,
  getDual as _getDual,
  getContainedGeometries as _getContainedGeometries,
  getAppearsInGeometries as _getAppearsInGeometries,
  getRelatedGeometries as _getRelatedGeometries,
  getGeometriesByElement as _getGeometriesByElement,
  getPlatonicSolids as _getPlatonicSolids,
  getPatterns as _getPatterns,
  getAllGeometries as _getAllGeometries,
  searchGeometries as _searchGeometries,
  getGeometryPath,
  getGeometryListPath,
  getNextGeometry as _getNextGeometry,
  getPreviousGeometry as _getPreviousGeometry,
  // Enhanced relationship functions (Phase 2)
  getRelationshipsByType as _getRelationshipsByType,
  getRelationshipStrength as _getRelationshipStrength,
  getRelationshipTypes as _getRelationshipTypes,
  getGroupedRelationships as _getGroupedRelationships,
} from "./helpers";

// Re-export types
export * from "./geometries.types";

// Re-export utilities
export { getGeometryPath, getGeometryListPath };
export { getGeometryThumbnailPath } from "./image-paths";

// ============================================================================
// GEOMETRIES - Enhanced and Validated
// ============================================================================

// Combine all geometries
const RAW_GEOMETRIES = {
  ...PLATONIC_SOLIDS,
  ...PATTERNS,
};

// Enhance with computed relationships
export const GEOMETRIES = enhanceGeometries(RAW_GEOMETRIES);

// Validate in development
if (process.env.NODE_ENV === "development") {
  try {
    validateGeometries(GEOMETRIES);
  } catch (error) {
    console.error("❌ Geometry validation failed:");
    console.error(error);
  }
}

// ============================================================================
// HELPER FUNCTIONS - Wrapped to use GEOMETRIES automatically
// ============================================================================

/**
 * Get a geometry by its ID
 */
export function getGeometryById(id: string) {
  return _getGeometryById(GEOMETRIES, id);
}

/**
 * Get a geometry by its slug
 * This is useful for dynamic routing where the slug is used in the URL
 * e.g., /platonic-solids/tetrahedron or /sacred-patterns/flower-of-life
 */
export function getGeometryBySlug(slug: string) {
  return _getGeometryBySlug(GEOMETRIES, slug);
}

/**
 * Get all geometries in a specific category
 */
export function getGeometriesByCategory(
  category: "platonic" | "pattern"
) {
  return _getGeometriesByCategory(GEOMETRIES, category);
}

/**
 * Get the dual of a geometry (Platonic solids only)
 */
export function getDual(geometryId: string) {
  return _getDual(GEOMETRIES, geometryId);
}

/**
 * Get all geometries that this geometry contains
 */
export function getContainedGeometries(geometryId: string) {
  return _getContainedGeometries(GEOMETRIES, geometryId);
}

/**
 * Get all geometries where this geometry appears
 */
export function getAppearsInGeometries(geometryId: string) {
  return _getAppearsInGeometries(GEOMETRIES, geometryId);
}

/**
 * Get all related geometries (contains + appears in + dual)
 */
export function getRelatedGeometries(geometryId: string) {
  return _getRelatedGeometries(GEOMETRIES, geometryId);
}

/**
 * Get all geometries associated with a specific element
 */
export function getGeometriesByElement(
  element: "fire" | "earth" | "air" | "water" | "ether"
) {
  return _getGeometriesByElement(GEOMETRIES, element);
}

/**
 * Get all Platonic Solids
 */
export function getPlatonicSolids() {
  return _getPlatonicSolids(GEOMETRIES);
}

/**
 * Get all Patterns
 */
export function getPatterns() {
  return _getPatterns(GEOMETRIES);
}

/**
 * Get all geometries as an array
 */
export function getAllGeometries() {
  return _getAllGeometries(GEOMETRIES);
}

/**
 * Search geometries by name, aliases, description, or property
 */
export function searchGeometries(query: string) {
  return _searchGeometries(GEOMETRIES, query);
}

/**
 * Get the next geometry in sequence within a category (by order field)
 */
export function getNextGeometry(
  currentId: string,
  category: "platonic" | "pattern"
) {
  return _getNextGeometry(GEOMETRIES, currentId, category);
}

/**
 * Get the previous geometry in sequence within a category (by order field)
 */
export function getPreviousGeometry(
  currentId: string,
  category: "platonic" | "pattern"
) {
  return _getPreviousGeometry(GEOMETRIES, currentId, category);
}

// ============================================================================
// ENHANCED RELATIONSHIP FUNCTIONS (Phase 2)
// ============================================================================

/**
 * Get all relationships of a specific type for a geometry
 */
export function getRelationshipsByType(
  geometryId: string,
  type: RelationshipType
) {
  return _getRelationshipsByType(GEOMETRIES, geometryId, type);
}

/**
 * Get relationship strength between two geometries
 * Returns null if no direct relationship exists
 */
export function getRelationshipStrength(fromId: string, toId: string) {
  return _getRelationshipStrength(GEOMETRIES, fromId, toId);
}

/**
 * Get all relationship types for a geometry
 */
export function getRelationshipTypes(geometryId: string) {
  return _getRelationshipTypes(GEOMETRIES, geometryId);
}

/**
 * Get grouped relationships (for display)
 * Returns relationships organized by type
 */
export function getGroupedRelationships(geometryId: string) {
  return _getGroupedRelationships(GEOMETRIES, geometryId);
}
