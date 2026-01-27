/**
 * Pure calculation functions for numerology.
 *
 * Uses Pythagorean system (A=1, B=2, ..., I=9, J=1, ...)
 * Master numbers (11, 22, 33) are preserved during reduction.
 */

import { MASTER_NUMBERS } from "./types";

/**
 * Reduce a number to a single digit (1-9) or master number (11, 22, 33)
 *
 * @param n - The number to reduce
 * @param preserveMaster - Whether to preserve master numbers (default: true)
 * @returns Reduced digit
 */
export function reduceToDigit(n: number, preserveMaster = true): number {
  // Handle negative numbers
  n = Math.abs(n);

  // Sum digits repeatedly until we get a single digit or master number
  while (n > 9) {
    // Check for master number before reducing
    if (preserveMaster && MASTER_NUMBERS.includes(n as 11 | 22 | 33)) {
      return n;
    }

    // Sum the digits
    let sum = 0;
    while (n > 0) {
      sum += n % 10;
      n = Math.floor(n / 10);
    }
    n = sum;

    // Check again after summing
    if (preserveMaster && MASTER_NUMBERS.includes(n as 11 | 22 | 33)) {
      return n;
    }
  }

  return n;
}

/**
 * Pythagorean letter-to-number mapping
 * A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9
 * J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9
 * S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8
 */
export function letterToNumber(letter: string): number {
  const char = letter.toUpperCase();
  const code = char.charCodeAt(0);

  // Only process A-Z
  if (code < 65 || code > 90) {
    return 0;
  }

  // A=1, B=2, ... Z=26, then mod 9 (with 9 staying as 9)
  const position = code - 64; // A=1, B=2, etc.
  const result = position % 9;
  return result === 0 ? 9 : result;
}

/**
 * Convert a full name to its numerology number
 *
 * @param name - Full name string
 * @returns Reduced number (1-9 or master number)
 */
export function nameToNumber(name: string): number {
  let sum = 0;

  for (const char of name) {
    sum += letterToNumber(char);
  }

  return reduceToDigit(sum);
}

/**
 * Vowels in the English alphabet
 * Note: Y is treated as a vowel when it's the only vowel sound in a syllable
 * or when it sounds like a long E or I (simplified: Y is consonant when at
 * start of word/syllable, vowel otherwise)
 */
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

/**
 * Check if Y should be treated as a vowel in context
 * Simplified rule: Y is a vowel unless it starts a syllable
 *
 * @param name - Full name
 * @param index - Position of Y in the name
 * @returns Whether Y should be treated as a vowel
 */
function isYVowel(name: string, index: number): boolean {
  // Y at start of word/name is consonant
  if (index === 0) return false;

  const prevChar = name[index - 1];

  // Y after space (start of word) is consonant
  if (prevChar === " " || prevChar === "-") return false;

  // Y after another vowel is consonant (e.g., "Maya" - second a is vowel, Y is consonant)
  if (prevChar && VOWELS.has(prevChar.toUpperCase())) return false;

  // Otherwise, Y is a vowel
  return true;
}

/**
 * Extract vowels from a name (for Soul Urge calculation)
 *
 * @param name - Full name string
 * @returns String containing only vowels
 */
export function vowelsOnly(name: string): string {
  let vowels = "";
  const upper = name.toUpperCase();

  for (let i = 0; i < upper.length; i++) {
    const char = upper.charAt(i);
    if (VOWELS.has(char)) {
      vowels += char;
    } else if (char === "Y" && isYVowel(upper, i)) {
      vowels += char;
    }
  }

  return vowels;
}

/**
 * Extract consonants from a name (for Personality calculation)
 *
 * @param name - Full name string
 * @returns String containing only consonants
 */
export function consonantsOnly(name: string): string {
  let consonants = "";
  const upper = name.toUpperCase();

  for (let i = 0; i < upper.length; i++) {
    const char = upper.charAt(i);
    // Skip non-letters
    if (char.charCodeAt(0) < 65 || char.charCodeAt(0) > 90) continue;

    // Skip vowels
    if (VOWELS.has(char)) continue;

    // Handle Y
    if (char === "Y") {
      // Y is consonant if NOT acting as vowel
      if (!isYVowel(upper, i)) {
        consonants += char;
      }
      continue;
    }

    consonants += char;
  }

  return consonants;
}

/**
 * Calculate Life Path number from birth date
 * The Life Path is calculated by reducing month, day, and year separately,
 * then adding and reducing the sum.
 *
 * @param birthDate - Date of birth
 * @returns Life Path number (1-9 or 11, 22, 33)
 */
export function lifePathNumber(birthDate: Date): number {
  // Use UTC methods to avoid timezone shifting the date
  const month = birthDate.getUTCMonth() + 1; // 0-indexed
  const day = birthDate.getUTCDate();
  const year = birthDate.getUTCFullYear();

  // Reduce each component first (this is the traditional method)
  const monthReduced = reduceToDigit(month);
  const dayReduced = reduceToDigit(day);
  const yearReduced = reduceToDigit(year);

  // Sum and reduce, preserving master numbers
  return reduceToDigit(monthReduced + dayReduced + yearReduced);
}

/**
 * Calculate Birthday number
 * Simply the day of birth reduced to a single digit
 *
 * @param birthDate - Date of birth
 * @returns Birthday number (1-9, or 11, 22 for those days)
 */
export function birthdayNumber(birthDate: Date): number {
  // Use UTC to avoid timezone shifting the date
  const day = birthDate.getUTCDate();
  // Birthday number preserves 11 and 22 (days of month)
  // but 33 isn't possible (max day is 31)
  return reduceToDigit(day);
}

/**
 * Calculate Expression (Destiny) number from birth name
 * Sum of all letters in the full birth name
 *
 * @param birthName - Full name at birth
 * @returns Expression number (1-9 or master number)
 */
export function expressionNumber(birthName: string): number {
  return nameToNumber(birthName);
}

/**
 * Calculate Soul Urge (Heart's Desire) number
 * Sum of vowels in the full birth name
 *
 * @param birthName - Full name at birth
 * @returns Soul Urge number (1-9 or master number)
 */
export function soulUrgeNumber(birthName: string): number {
  const vowels = vowelsOnly(birthName);
  return nameToNumber(vowels);
}

/**
 * Calculate Personality number
 * Sum of consonants in the full birth name
 *
 * @param birthName - Full name at birth
 * @returns Personality number (1-9 or master number)
 */
export function personalityNumber(birthName: string): number {
  const consonants = consonantsOnly(birthName);
  return nameToNumber(consonants);
}

/**
 * Calculate Maturity number
 * Sum of Life Path and Expression numbers
 *
 * @param lifePath - Life Path number
 * @param expression - Expression number
 * @returns Maturity number (1-9 or master number)
 */
export function maturityNumber(lifePath: number, expression: number): number {
  return reduceToDigit(lifePath + expression);
}

/**
 * Calculate Personal Year number
 * Based on birth month/day and current year
 *
 * @param birthDate - Date of birth
 * @param currentDate - Current date (default: now)
 * @returns Personal Year number (1-9)
 */
export function personalYearNumber(
  birthDate: Date,
  currentDate: Date = new Date()
): number {
  // Use UTC for birth date to avoid timezone shifting
  const birthMonth = birthDate.getUTCMonth() + 1;
  const birthDay = birthDate.getUTCDate();
  // Current date uses local time (user's actual current date)
  const currentYear = currentDate.getFullYear();

  // Reduce and sum
  const monthReduced = reduceToDigit(birthMonth, false);
  const dayReduced = reduceToDigit(birthDay, false);
  const yearReduced = reduceToDigit(currentYear, false);

  // Personal cycles don't preserve master numbers
  return reduceToDigit(monthReduced + dayReduced + yearReduced, false);
}

/**
 * Calculate Personal Month number
 * Personal Year + calendar month
 *
 * @param birthDate - Date of birth
 * @param currentDate - Current date (default: now)
 * @returns Personal Month number (1-9)
 */
export function personalMonthNumber(
  birthDate: Date,
  currentDate: Date = new Date()
): number {
  const personalYear = personalYearNumber(birthDate, currentDate);
  const currentMonth = currentDate.getMonth() + 1;

  return reduceToDigit(personalYear + currentMonth, false);
}

/**
 * Calculate Personal Day number
 * Personal Month + calendar day
 *
 * @param birthDate - Date of birth
 * @param currentDate - Current date (default: now)
 * @returns Personal Day number (1-9)
 */
export function personalDayNumber(
  birthDate: Date,
  currentDate: Date = new Date()
): number {
  const personalMonth = personalMonthNumber(birthDate, currentDate);
  const currentDay = currentDate.getDate();

  return reduceToDigit(personalMonth + currentDay, false);
}

/**
 * Calculate all stable (storable) numerology numbers from birth data
 *
 * @param birthDate - Date of birth
 * @param birthName - Full name at birth (optional)
 * @returns Object with all calculated numbers
 */
export function calculateStableNumbers(
  birthDate: Date,
  birthName?: string | null
): {
  lifePath: number;
  birthday: number;
  expression: number | null;
  soulUrge: number | null;
  personality: number | null;
  maturity: number | null;
} {
  const lifePath = lifePathNumber(birthDate);
  const birthday = birthdayNumber(birthDate);

  let expression: number | null = null;
  let soulUrge: number | null = null;
  let personality: number | null = null;
  let maturity: number | null = null;

  if (birthName && birthName.trim().length > 0) {
    const cleanName = birthName.trim();
    expression = expressionNumber(cleanName);
    soulUrge = soulUrgeNumber(cleanName);
    personality = personalityNumber(cleanName);
    maturity = maturityNumber(lifePath, expression);
  }

  return {
    lifePath,
    birthday,
    expression,
    soulUrge,
    personality,
    maturity,
  };
}

/**
 * Calculate all dynamic cycle numbers
 *
 * @param birthDate - Date of birth
 * @param currentDate - Current date (default: now)
 * @returns Object with personal year/month/day
 */
export function calculateCycleNumbers(
  birthDate: Date,
  currentDate: Date = new Date()
): {
  personalYear: number;
  personalMonth: number;
  personalDay: number;
} {
  return {
    personalYear: personalYearNumber(birthDate, currentDate),
    personalMonth: personalMonthNumber(birthDate, currentDate),
    personalDay: personalDayNumber(birthDate, currentDate),
  };
}
