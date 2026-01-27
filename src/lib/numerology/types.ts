/**
 * Type definitions for the Numerology module.
 *
 * Numerology calculations based on Pythagorean system with
 * master number (11, 22, 33) preservation.
 */

/**
 * Valid numerology digits (1-9 plus master numbers)
 */
export type NumerologyDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33;

/**
 * Core number types that can be calculated
 */
export type CoreNumberType =
  | "lifePath"
  | "birthday"
  | "expression"
  | "soulUrge"
  | "personality"
  | "maturity";

/**
 * Personal cycle number types (calculated on demand)
 */
export type CycleNumberType = "personalYear" | "personalMonth" | "personalDay";

/**
 * All number types
 */
export type NumberType = CoreNumberType | CycleNumberType;

/**
 * Numbers that require birth name (not just birth date)
 */
export const NAME_REQUIRED_NUMBERS: CoreNumberType[] = [
  "expression",
  "soulUrge",
  "personality",
  "maturity",
];

/**
 * Master numbers that are preserved during reduction
 */
export const MASTER_NUMBERS = [11, 22, 33] as const;
export type MasterNumber = (typeof MASTER_NUMBERS)[number];

/**
 * Complete numerology profile with all calculated numbers
 */
export interface NumerologyProfile {
  // Stable numbers (stored in DB)
  lifePath: number | null;
  birthday: number | null;
  expression: number | null; // Requires birthName
  soulUrge: number | null; // Requires birthName
  personality: number | null; // Requires birthName
  maturity: number | null; // Requires both lifePath and expression

  // Dynamic cycles (calculated on demand)
  personalYear: number;
  personalMonth: number;
  personalDay: number;
}

/**
 * Partial profile with only date-based numbers
 * Used when birth name is not available
 */
export interface DateBasedNumerology {
  lifePath: number;
  birthday: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
}

/**
 * Meaning content for a numerology number
 */
export interface NumberMeaning {
  digit: NumerologyDigit;
  name: string; // Archetype name: "The Leader", "The Seeker"
  keywords: string[];
  brief: string; // 1-2 sentences
  extended: string; // 2-3 paragraphs
}

/**
 * Context-specific meaning for a number in a particular position
 */
export interface ContextualMeaning {
  digit: NumerologyDigit;
  context: NumberType;
  title: string;
  description: string;
}

/**
 * Result of getting number meaning with optional context
 */
export interface NumberMeaningResult {
  base: NumberMeaning;
  contextual?: ContextualMeaning;
}

/**
 * API response type for numerology data
 */
export interface NumerologyData {
  lifePath: number | null;
  birthday: number | null;
  expression: number | null;
  soulUrge: number | null;
  personality: number | null;
  maturity: number | null;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
}
