/**
 * Valid Platonic solid slugs for geometry affinities
 */
export const PLATONIC_SOLID_SLUGS = [
  "tetrahedron",
  "hexahedron",
  "octahedron",
  "icosahedron",
  "dodecahedron",
] as const;

export type PlatonicSolidSlug = (typeof PLATONIC_SOLID_SLUGS)[number];

/**
 * Affinity score range (1-5)
 * 1 = Low affinity
 * 5 = High affinity
 */
export type AffinityScore = 1 | 2 | 3 | 4 | 5;

/**
 * Source of the affinity rating
 * - self_reported: User explicitly set this value
 * - inferred: System inferred from user behavior/patterns
 */
export type AffinitySource = "self_reported" | "inferred";

/**
 * Geometry affinity record from database
 */
export interface GeometryAffinity {
  id: string;
  userId: string;
  geometrySlug: PlatonicSolidSlug;
  affinityScore: AffinityScore;
  source: AffinitySource;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for upserting a geometry affinity
 * When affinityScore is null, the affinity record is deleted
 */
export interface UpsertGeometryAffinityInput {
  geometrySlug: PlatonicSolidSlug;
  affinityScore: AffinityScore | null;
}
