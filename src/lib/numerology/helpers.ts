/**
 * Helper functions for numerology module.
 *
 * Provides utilities for working with numerology profiles and
 * connecting numerology to angel number patterns.
 */

import type { NumberPatternId } from "@/lib/numbers";
import type { NumerologyProfile, NumerologyData, DateBasedNumerology } from "./types";
import {
  calculateStableNumbers,
  calculateCycleNumbers,
  lifePathNumber,
  birthdayNumber,
  personalYearNumber,
  personalMonthNumber,
  personalDayNumber,
} from "./calculations";

/**
 * Mapping of numerology digits to related angel number patterns
 */
const DIGIT_TO_PATTERNS: Record<number, NumberPatternId[]> = {
  1: ["11", "111", "1111", "1010", "1212", "1001", "123", "1234", "12345"],
  2: ["22", "222", "2222", "1212", "1122", "123", "234", "1234", "12345"],
  3: ["33", "333", "3333", "123", "234", "345", "1234", "12345"],
  4: ["44", "444", "4444", "345", "456", "1234", "12345"],
  5: ["55", "555", "5555", "345", "456", "567", "1234", "12345"],
  6: ["66", "666", "6666", "456", "567", "678"],
  7: ["77", "777", "7777", "1717", "567", "678", "789"],
  8: ["88", "888", "8888", "678", "789"],
  9: ["99", "999", "9999", "789"],
  11: ["11", "111", "1111", "1122", "1212"],
  22: ["22", "222", "2222", "1122"],
  33: ["33", "333", "3333"],
};

/**
 * Get angel number patterns related to a numerology digit
 *
 * @param digit - Numerology digit (1-9, 11, 22, 33)
 * @returns Array of related pattern IDs
 */
export function getRelatedPatterns(digit: number): NumberPatternId[] {
  return DIGIT_TO_PATTERNS[digit] ?? [];
}

/**
 * Get all patterns related to a user's numerology profile
 * Returns unique patterns sorted by relevance (Life Path first)
 *
 * @param profile - Numerology profile
 * @returns Array of unique pattern IDs
 */
export function getProfileRelatedPatterns(profile: Partial<NumerologyProfile>): NumberPatternId[] {
  const patterns = new Set<NumberPatternId>();

  // Priority order: Life Path, Expression, Personal Year, others
  const orderedDigits = [
    profile.lifePath,
    profile.expression,
    profile.personalYear,
    profile.birthday,
    profile.soulUrge,
    profile.personality,
    profile.maturity,
  ].filter((d): d is number => d != null);

  for (const digit of orderedDigits) {
    for (const pattern of getRelatedPatterns(digit)) {
      patterns.add(pattern);
    }
  }

  return Array.from(patterns);
}

/**
 * Calculate a date-based numerology profile (no name required)
 *
 * @param birthDate - Date of birth
 * @param currentDate - Current date for cycles (default: now)
 * @returns Profile with date-based numbers only
 */
export function getDateBasedProfile(
  birthDate: Date,
  currentDate: Date = new Date()
): DateBasedNumerology {
  return {
    lifePath: lifePathNumber(birthDate),
    birthday: birthdayNumber(birthDate),
    personalYear: personalYearNumber(birthDate, currentDate),
    personalMonth: personalMonthNumber(birthDate, currentDate),
    personalDay: personalDayNumber(birthDate, currentDate),
  };
}

/**
 * Calculate a full numerology profile
 *
 * @param birthDate - Date of birth
 * @param birthName - Full name at birth (optional)
 * @param currentDate - Current date for cycles (default: now)
 * @returns Complete numerology profile
 */
export function getFullProfile(
  birthDate: Date,
  birthName?: string | null,
  currentDate: Date = new Date()
): NumerologyProfile {
  const stable = calculateStableNumbers(birthDate, birthName);
  const cycles = calculateCycleNumbers(birthDate, currentDate);

  return {
    ...stable,
    ...cycles,
  };
}

/**
 * Convert stored numerology data to API response format
 *
 * @param stored - Stored profile data from DB
 * @param birthDate - Birth date for cycle calculations
 * @returns NumerologyData for API response
 */
export function toNumerologyData(
  stored: {
    lifePathNumber: number | null;
    birthdayNumber: number | null;
    expressionNumber: number | null;
    soulUrgeNumber: number | null;
    personalityNumber: number | null;
    maturityNumber: number | null;
  },
  birthDate: Date
): NumerologyData {
  const cycles = calculateCycleNumbers(birthDate);

  return {
    lifePath: stored.lifePathNumber,
    birthday: stored.birthdayNumber,
    expression: stored.expressionNumber,
    soulUrge: stored.soulUrgeNumber,
    personality: stored.personalityNumber,
    maturity: stored.maturityNumber,
    personalYear: cycles.personalYear,
    personalMonth: cycles.personalMonth,
    personalDay: cycles.personalDay,
  };
}

/**
 * Check if a profile has name-based numbers calculated
 *
 * @param profile - Numerology profile or data
 * @returns True if expression number is present
 */
export function hasNameBasedNumbers(
  profile: Partial<NumerologyProfile> | NumerologyData | null
): boolean {
  return profile?.expression != null;
}

/**
 * Check if a numerology digit is a master number
 *
 * @param digit - Number to check
 * @returns True if 11, 22, or 33
 */
export function isMasterNumber(digit: number): boolean {
  return digit === 11 || digit === 22 || digit === 33;
}

/**
 * Format a numerology digit for display
 * Master numbers show as-is, single digits optionally padded
 *
 * @param digit - The digit to format
 * @param pad - Whether to pad single digits (default: false)
 * @returns Formatted string
 */
export function formatDigit(digit: number | null, pad = false): string {
  if (digit == null) return "—";
  if (isMasterNumber(digit)) return String(digit);
  return pad ? String(digit).padStart(2, "0") : String(digit);
}
