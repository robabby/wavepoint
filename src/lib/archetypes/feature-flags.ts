/**
 * Feature flags for the Archetypes module.
 */

/**
 * Check if the Archetypes feature is enabled.
 * Always enabled for now (no env var gate).
 */
export function isArchetypesEnabled(): boolean {
  // Archetypes is a content section like Numbers/Geometries
  // It doesn't need a separate feature flag since it's read-only content
  return true;
}
