/**
 * Collection coverage calculations for Signal.
 *
 * Determines which number categories a user has logged and
 * provides coverage statistics for the "Your Numbers" display.
 */

import { CATEGORIES, getAllCategories } from "@/lib/numbers/categories";
import { getPatternByNumber, getPatternsByCategory } from "@/lib/numbers/helpers";
import type { NumberCategory } from "@/lib/numbers/types";

/**
 * Category coverage statistics
 */
export interface CategoryCoverage {
  category: NumberCategory;
  label: string;
  pluralLabel: string;
  description: string;
  caught: number;
  total: number;
  percentage: number;
}

/**
 * Overall collection statistics
 */
export interface CollectionStats {
  totalCaught: number;
  totalPatterns: number;
  percentage: number;
  categoriesCovered: number;
  totalCategories: number;
}

/**
 * Calculate coverage for a specific category based on user's logged numbers.
 *
 * @param category - The category to calculate coverage for
 * @param loggedNumbers - Array of number patterns the user has logged
 * @returns Coverage statistics for the category
 */
export function getCategoryCoverage(
  category: NumberCategory,
  loggedNumbers: string[]
): CategoryCoverage {
  const categoryMeta = CATEGORIES[category];
  const categoryPatterns = getPatternsByCategory(category);

  // Count how many patterns in this category the user has logged
  const caughtPatterns = categoryPatterns.filter((pattern) =>
    loggedNumbers.includes(pattern.id)
  );

  const total = categoryPatterns.length;
  const caught = caughtPatterns.length;
  const percentage = total > 0 ? Math.round((caught / total) * 100) : 0;

  return {
    category,
    label: categoryMeta.label,
    pluralLabel: categoryMeta.pluralLabel,
    description: categoryMeta.description,
    caught,
    total,
    percentage,
  };
}

/**
 * Get coverage for all categories.
 *
 * @param loggedNumbers - Array of number patterns the user has logged
 * @returns Array of coverage stats for all categories, sorted by order
 */
export function getAllCategoryCoverage(
  loggedNumbers: string[]
): CategoryCoverage[] {
  const categories = getAllCategories();
  return categories.map((cat) =>
    getCategoryCoverage(cat.id, loggedNumbers)
  );
}

/**
 * Calculate overall collection statistics.
 *
 * @param loggedNumbers - Array of number patterns the user has logged
 * @returns Overall collection stats
 */
export function getCollectionStats(loggedNumbers: string[]): CollectionStats {
  const allCoverage = getAllCategoryCoverage(loggedNumbers);

  // Count unique patterns that are known in the Numbers library
  const knownPatterns = loggedNumbers.filter((num) => getPatternByNumber(num));
  const totalCaught = knownPatterns.length;

  // Sum up total patterns across all categories
  const totalPatterns = allCoverage.reduce((sum, cat) => sum + cat.total, 0);

  // Count categories with at least one catch
  const categoriesCovered = allCoverage.filter((cat) => cat.caught > 0).length;

  const percentage =
    totalPatterns > 0 ? Math.round((totalCaught / totalPatterns) * 100) : 0;

  return {
    totalCaught,
    totalPatterns,
    percentage,
    categoriesCovered,
    totalCategories: allCoverage.length,
  };
}

/**
 * Get categories with zero catches (uncaught categories).
 *
 * @param loggedNumbers - Array of number patterns the user has logged
 * @returns Array of uncaught category coverages
 */
export function getUncaughtCategories(
  loggedNumbers: string[]
): CategoryCoverage[] {
  return getAllCategoryCoverage(loggedNumbers).filter(
    (cat) => cat.caught === 0
  );
}

/**
 * Get a discovery prompt for an uncaught category.
 *
 * @param category - The uncaught category
 * @returns A prompt encouraging the user to catch patterns in this category
 */
export function getDiscoveryPrompt(category: CategoryCoverage): string {
  const prompts: Record<NumberCategory, string> = {
    double: "Watch for simple doubles like 11, 22, 33...",
    triple: "Keep an eye out for triple digits like 111, 444, 777...",
    quad: "Spot four-digit repeaters like 1111, 2222...",
    sequential: "Notice sequences like 123, 456, or countdowns like 321...",
    mirrored: "Look for palindromes like 1221, 1331...",
    clock: "Check your clock for patterns like 11:11, 12:12...",
    sandwich: "Find sandwich numbers like 101, 707, 919...",
    compound: "Discover compound patterns like 1122, 1234...",
  };

  return prompts[category.category];
}

/**
 * Determine the category of a logged number (if it's a known pattern).
 *
 * @param number - The number pattern
 * @returns The category or null if not a known pattern
 */
export function getNumberCategory(number: string): NumberCategory | null {
  const pattern = getPatternByNumber(number);
  return pattern?.category ?? null;
}

/**
 * Check if a number is a first catch for its category.
 *
 * @param number - The number just logged
 * @param previousNumbers - Numbers logged before this one
 * @returns True if this is the first pattern from its category
 */
export function isFirstCategoryMatch(
  number: string,
  previousNumbers: string[]
): boolean {
  const category = getNumberCategory(number);
  if (!category) return false;

  // Check if any previous number was from this category
  const previousFromCategory = previousNumbers.some(
    (num) => getNumberCategory(num) === category
  );

  return !previousFromCategory;
}

/**
 * Get context message for first category catch.
 *
 * @param number - The number just logged
 * @param loggedNumbers - All logged numbers including the new one
 * @returns Context message or null if not a first category catch
 */
export function getFirstCategoryCatchMessage(
  number: string,
  loggedNumbers: string[]
): string | null {
  const category = getNumberCategory(number);
  if (!category) return null;

  const categoryMeta = CATEGORIES[category];
  const coverage = getCategoryCoverage(
    category,
    loggedNumbers
  );

  // Only show message if this is truly a first catch (caught === 1)
  if (coverage.caught !== 1) return null;

  const stats = getCollectionStats(loggedNumbers);

  return `First ${categoryMeta.label.toLowerCase()} number! ${stats.categoriesCovered} of ${stats.totalCategories} categories caught.`;
}
