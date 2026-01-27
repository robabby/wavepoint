/**
 * Personalization helpers for numerology.
 *
 * These functions help determine when to show "This is YOUR number" callouts
 * and other personalization features based on a user's numerology profile.
 */

import type { CoreNumberType, NumerologyDigit, NumerologyData } from "./types";
import { POSITION_TYPES, type PositionSlug, typeToSlug } from "./position-types";

/**
 * Partial numerology data that may come from the database
 */
export interface PartialNumerologyProfile {
  lifePath?: number | null;
  birthday?: number | null;
  expression?: number | null;
  soulUrge?: number | null;
  personality?: number | null;
  maturity?: number | null;
}

/**
 * Find which positions in a user's profile match a specific digit.
 * Returns an array of position types where the user has this digit.
 *
 * @param profile - User's numerology profile (or partial data)
 * @param digit - The digit to match against
 * @returns Array of CoreNumberType positions where the digit appears
 *
 * @example
 * const profile = { lifePath: 7, expression: 3, soulUrge: 7 };
 * findMatchingPositions(profile, 7);
 * // Returns: ["lifePath", "soulUrge"]
 */
export function findMatchingPositions(
  profile: PartialNumerologyProfile | NumerologyData | null | undefined,
  digit: number
): CoreNumberType[] {
  if (!profile) return [];

  const matches: CoreNumberType[] = [];

  // Check each core position
  if (profile.lifePath === digit) matches.push("lifePath");
  if (profile.birthday === digit) matches.push("birthday");
  if (profile.expression === digit) matches.push("expression");
  if (profile.soulUrge === digit) matches.push("soulUrge");
  if (profile.personality === digit) matches.push("personality");
  if (profile.maturity === digit) matches.push("maturity");

  return matches;
}

/**
 * Extract the dominant digit from an angel number pattern.
 * For repeating patterns (111, 444), returns the repeated digit.
 * For other patterns, returns the most frequent digit or null if ambiguous.
 *
 * @param patternId - The pattern ID string (e.g., "444", "1212", "123")
 * @returns The dominant digit, or null if no clear dominant digit
 *
 * @example
 * extractDominantDigit("444");  // Returns: 4
 * extractDominantDigit("1111"); // Returns: 1
 * extractDominantDigit("1212"); // Returns: null (tied)
 * extractDominantDigit("123");  // Returns: null (all unique)
 */
export function extractDominantDigit(patternId: string): number | null {
  if (!patternId || patternId.length === 0) return null;

  // Count digit frequency
  const counts: Record<string, number> = {};
  for (const char of patternId) {
    if (/\d/.test(char)) {
      counts[char] = (counts[char] ?? 0) + 1;
    }
  }

  const entries = Object.entries(counts);
  if (entries.length === 0) return null;

  // Sort by count descending
  entries.sort((a, b) => b[1] - a[1]);

  // Check if there's a clear winner (more than half the digits)
  const [topDigit, topCount] = entries[0]!;
  const totalDigits = patternId.replace(/\D/g, "").length;

  if (topCount > totalDigits / 2) {
    return parseInt(topDigit, 10);
  }

  // For repeating patterns like "111", "4444" - all same digit
  if (entries.length === 1) {
    return parseInt(topDigit, 10);
  }

  // No clear dominant digit
  return null;
}

/**
 * Format a list of positions into a readable string.
 *
 * @param positions - Array of CoreNumberType positions
 * @returns Formatted string like "Life Path & Birthday" or "Life Path, Expression & Soul Urge"
 *
 * @example
 * formatPositionList(["lifePath"]);                    // "Life Path"
 * formatPositionList(["lifePath", "birthday"]);        // "Life Path & Birthday"
 * formatPositionList(["lifePath", "expression", "soulUrge"]); // "Life Path, Expression & Soul Urge"
 */
export function formatPositionList(positions: CoreNumberType[]): string {
  if (positions.length === 0) return "";

  const names = positions.map((type) => {
    const slug = typeToSlug(type);
    return POSITION_TYPES[slug]?.name ?? type;
  });

  if (names.length === 1) {
    return names[0]!;
  }

  if (names.length === 2) {
    return `${names[0]} & ${names[1]}`;
  }

  // 3 or more: "A, B & C"
  const lastItem = names.pop();
  return `${names.join(", ")} & ${lastItem}`;
}

/**
 * Check if a digit is valid for numerology (1-9, 11, 22, 33)
 */
export function isValidNumerologyDigit(digit: number): digit is NumerologyDigit {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].includes(digit);
}

/**
 * Get all unique digits from a user's numerology profile.
 * Useful for highlighting which digits are "theirs" on grid displays.
 *
 * @param profile - User's numerology profile
 * @returns Set of unique digits present in the profile
 */
export function getUserDigits(
  profile: PartialNumerologyProfile | NumerologyData | null | undefined
): Set<number> {
  if (!profile) return new Set();

  const digits = new Set<number>();

  if (profile.lifePath != null) digits.add(profile.lifePath);
  if (profile.birthday != null) digits.add(profile.birthday);
  if (profile.expression != null) digits.add(profile.expression);
  if (profile.soulUrge != null) digits.add(profile.soulUrge);
  if (profile.personality != null) digits.add(profile.personality);
  if (profile.maturity != null) digits.add(profile.maturity);

  return digits;
}

/**
 * Check if a user has any numerology data (at minimum, Life Path)
 */
export function hasNumerologyProfile(
  profile: PartialNumerologyProfile | NumerologyData | null | undefined
): boolean {
  return profile?.lifePath != null;
}

/**
 * Check if a user has complete core numerology (including name-based numbers)
 */
export function hasCompleteNumerology(
  profile: PartialNumerologyProfile | NumerologyData | null | undefined
): boolean {
  if (!profile) return false;

  return (
    profile.lifePath != null &&
    profile.birthday != null &&
    profile.expression != null &&
    profile.soulUrge != null &&
    profile.personality != null &&
    profile.maturity != null
  );
}

/**
 * Get the user's position for a specific digit, if any
 * Returns the URL slug for linking to the position page
 */
export function getPositionSlugForDigit(
  profile: PartialNumerologyProfile | NumerologyData | null | undefined,
  digit: number
): PositionSlug | null {
  const positions = findMatchingPositions(profile, digit);
  if (positions.length === 0) return null;

  // Return the first (most significant) position
  return typeToSlug(positions[0]!);
}
