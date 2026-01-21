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

/**
 * Find related patterns for an uncovered number.
 * Uses three strategies:
 * 1. Containment - find patterns whose ID is contained in the number
 * 2. Digit patterns - find repeating patterns for each unique digit
 * 3. Category similarity - if ascending/descending/palindrome, show similar patterns
 *
 * Returns up to 6 related patterns.
 */
export function findRelatedPatternsForUncovered(number: string): NumberPattern[] {
  const found = new Set<NumberPatternId>();
  const results: NumberPattern[] = [];

  // Strategy 1: Find patterns contained in the number
  // e.g., "12345" contains "123", "1234", "234", "345", etc.
  for (const id of NUMBER_PATTERN_IDS) {
    if (number.includes(id) && number !== id) {
      found.add(id);
    }
  }

  // Strategy 2: Find repeating digit patterns for each unique digit
  // e.g., "8847" relates to 88, 888, 44, 444, 77, 777
  const uniqueDigits = [...new Set(number.split(""))].filter((d) => d !== "0");
  for (const digit of uniqueDigits) {
    const double = `${digit}${digit}` as NumberPatternId;
    const triple = `${digit}${digit}${digit}` as NumberPatternId;
    const quad = `${digit}${digit}${digit}${digit}` as NumberPatternId;

    if (NUMBER_PATTERN_IDS.includes(double)) found.add(double);
    if (NUMBER_PATTERN_IDS.includes(triple)) found.add(triple);
    if (NUMBER_PATTERN_IDS.includes(quad)) found.add(quad);
  }

  // Strategy 3: Check for sequential or palindrome patterns
  const isAscending = isAscendingSequence(number);
  const isDescending = isDescendingSequence(number);
  const isPalindrome = isPalindromeNumber(number);

  if (isAscending) {
    // Add other ascending sequences
    const ascending: NumberPatternId[] = [
      "123",
      "234",
      "345",
      "456",
      "567",
      "678",
      "789",
      "1234",
      "12345",
    ];
    for (const id of ascending) {
      if (number !== id) found.add(id);
    }
  }

  if (isDescending) {
    // Add other descending sequences
    const descending: NumberPatternId[] = ["321", "432", "4321", "54321"];
    for (const id of descending) {
      if (number !== id) found.add(id);
    }
  }

  if (isPalindrome && number.length >= 4) {
    // Add mirrored patterns
    const mirrored: NumberPatternId[] = [
      "1001",
      "1221",
      "1331",
      "1441",
      "1551",
      "1661",
      "1771",
      "1881",
      "1991",
    ];
    for (const id of mirrored) {
      if (number !== id) found.add(id);
    }
  }

  // Convert to pattern objects and limit to 6
  for (const id of found) {
    const pattern = PATTERNS[id];
    if (pattern && results.length < 6) {
      results.push(pattern);
    }
    if (results.length >= 6) break;
  }

  // Sort by relevance: contained patterns first, then by order
  return results.sort((a, b) => {
    const aContained = number.includes(a.id);
    const bContained = number.includes(b.id);
    if (aContained && !bContained) return -1;
    if (!aContained && bContained) return 1;
    return a.order - b.order;
  });
}

/**
 * Check if a number is an ascending sequence (e.g., 123, 456, 12345).
 */
function isAscendingSequence(number: string): boolean {
  if (number.length < 3) return false;
  for (let i = 1; i < number.length; i++) {
    const prev = parseInt(number[i - 1]!, 10);
    const curr = parseInt(number[i]!, 10);
    if (curr !== prev + 1) return false;
  }
  return true;
}

/**
 * Check if a number is a descending sequence (e.g., 321, 987, 54321).
 */
function isDescendingSequence(number: string): boolean {
  if (number.length < 3) return false;
  for (let i = 1; i < number.length; i++) {
    const prev = parseInt(number[i - 1]!, 10);
    const curr = parseInt(number[i]!, 10);
    if (curr !== prev - 1) return false;
  }
  return true;
}

/**
 * Check if a number is a palindrome (e.g., 1221, 12321).
 */
function isPalindromeNumber(number: string): boolean {
  if (number.length < 3) return false;
  return number === number.split("").reverse().join("");
}
