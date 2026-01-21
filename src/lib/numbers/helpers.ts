/**
 * Query functions for number patterns.
 * Pure functions for filtering, sorting, and retrieving patterns.
 */

import { PATTERNS } from "./data";
import type { NumberCategory, NumberPattern, NumberPatternId } from "./types";
import { NUMBER_PATTERN_IDS } from "./types";

/**
 * Get all patterns as an array, sorted by category order then pattern order.
 */
export function getAllPatterns(): NumberPattern[] {
  return Object.values(PATTERNS).sort((a, b) => {
    // Sort by category order first, then by pattern order
    const categoryOrder: Record<NumberCategory, number> = {
      double: 1,
      triple: 2,
      quad: 3,
      sequential: 4,
      mirrored: 5,
      clock: 6,
      sandwich: 7,
      compound: 8,
    };
    const catDiff = categoryOrder[a.category] - categoryOrder[b.category];
    if (catDiff !== 0) return catDiff;
    return a.order - b.order;
  });
}

/**
 * Get a pattern by its ID/number.
 * Returns undefined if not found.
 */
export function getPatternByNumber(number: string): NumberPattern | undefined {
  return PATTERNS[number as NumberPatternId];
}

/**
 * Get patterns filtered by category.
 */
export function getPatternsByCategory(category: NumberCategory): NumberPattern[] {
  return Object.values(PATTERNS)
    .filter((p) => p.category === category)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get featured patterns for the landing page grid.
 * Excludes patterns marked with excludeFromFeatured (e.g., 666).
 */
export function getFeaturedPatterns(): NumberPattern[] {
  return Object.values(PATTERNS)
    .filter((p) => p.featured && !p.excludeFromFeatured)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get related patterns for a given pattern.
 * Returns full pattern objects for the related IDs.
 */
export function getRelatedPatterns(patternId: NumberPatternId): NumberPattern[] {
  const pattern = PATTERNS[patternId];
  if (!pattern) return [];

  return pattern.related
    .map((id) => PATTERNS[id])
    .filter((p): p is NumberPattern => p !== undefined);
}

/**
 * Search patterns by keyword or number.
 */
export function searchPatterns(query: string): NumberPattern[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return Object.values(PATTERNS).filter((pattern) => {
    // Match by number
    if (pattern.id.includes(normalizedQuery)) return true;

    // Match by title
    if (pattern.title.toLowerCase().includes(normalizedQuery)) return true;

    // Match by keywords
    if (pattern.keywords.some((kw) => kw.toLowerCase().includes(normalizedQuery))) {
      return true;
    }

    // Match by essence
    if (pattern.essence.toLowerCase().includes(normalizedQuery)) return true;

    return false;
  });
}

/**
 * Check if a number is a covered pattern.
 */
export function isKnownPattern(number: string): boolean {
  return NUMBER_PATTERN_IDS.includes(number as NumberPatternId);
}

/**
 * Get patterns by multiple IDs.
 * Useful for fetching a specific set of patterns.
 */
export function getPatternsByIds(ids: NumberPatternId[]): NumberPattern[] {
  return ids
    .map((id) => PATTERNS[id])
    .filter((p): p is NumberPattern => p !== undefined);
}

/**
 * Get the next pattern in a category (for navigation).
 */
export function getNextPattern(
  patternId: NumberPatternId,
): NumberPattern | undefined {
  const pattern = PATTERNS[patternId];
  if (!pattern) return undefined;

  const categoryPatterns = getPatternsByCategory(pattern.category);
  const currentIndex = categoryPatterns.findIndex((p) => p.id === patternId);

  if (currentIndex === -1 || currentIndex === categoryPatterns.length - 1) {
    return undefined;
  }

  return categoryPatterns[currentIndex + 1];
}

/**
 * Get the previous pattern in a category (for navigation).
 */
export function getPreviousPattern(
  patternId: NumberPatternId,
): NumberPattern | undefined {
  const pattern = PATTERNS[patternId];
  if (!pattern) return undefined;

  const categoryPatterns = getPatternsByCategory(pattern.category);
  const currentIndex = categoryPatterns.findIndex((p) => p.id === patternId);

  if (currentIndex <= 0) {
    return undefined;
  }

  return categoryPatterns[currentIndex - 1];
}

/**
 * Get total count of patterns.
 */
export function getPatternCount(): number {
  return NUMBER_PATTERN_IDS.length;
}

/**
 * Get count of patterns by category.
 */
export function getPatternCountByCategory(category: NumberCategory): number {
  return getPatternsByCategory(category).length;
}
