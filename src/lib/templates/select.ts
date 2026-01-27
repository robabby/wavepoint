/**
 * Template selection logic.
 *
 * Selects the best matching template for a given number pattern.
 *
 * @module templates/select
 */

import type { BaseTemplate, TemplateCategory } from "./types";
import { getTemplateStore } from "./load";

// =============================================================================
// Number Pattern Detection
// =============================================================================

/**
 * Detect the category of a number pattern.
 */
export function detectCategory(number: string): TemplateCategory {
  // Check for repetition (all same digit): 111, 222, 0000
  if (isRepetition(number)) {
    return "repetition";
  }

  // Check for mirror/palindrome: 1221, 1331, 12321
  if (isMirror(number)) {
    return "mirror";
  }

  // Check for sequence: 123, 321, 1234, 4321
  if (isSequence(number)) {
    return "sequence";
  }

  // Default to classic for everything else
  return "classic";
}

/**
 * Check if number is all the same digit (repetition).
 */
function isRepetition(number: string): boolean {
  if (number.length < 2) return false;
  const firstDigit = number[0];
  return number.split("").every((d) => d === firstDigit);
}

/**
 * Check if number is a palindrome (mirror).
 */
function isMirror(number: string): boolean {
  if (number.length < 4) return false;
  const reversed = number.split("").reverse().join("");
  return number === reversed && !isRepetition(number);
}

/**
 * Check if number is a sequence (ascending or descending).
 */
function isSequence(number: string): boolean {
  if (number.length < 3) return false;

  const digits = number.split("").map(Number);

  // Check ascending
  let isAscending = true;
  for (let i = 1; i < digits.length; i++) {
    const curr = digits[i];
    const prev = digits[i - 1];
    if (curr === undefined || prev === undefined || curr !== prev + 1) {
      isAscending = false;
      break;
    }
  }
  if (isAscending) return true;

  // Check descending
  let isDescending = true;
  for (let i = 1; i < digits.length; i++) {
    const curr = digits[i];
    const prev = digits[i - 1];
    if (curr === undefined || prev === undefined || curr !== prev - 1) {
      isDescending = false;
      break;
    }
  }
  return isDescending;
}

// =============================================================================
// Template Selection
// =============================================================================

/**
 * Select the best matching base template for a number.
 *
 * Strategy:
 * 1. Exact match by number string
 * 2. Fallback to category-based selection
 * 3. Return undefined if no template found
 */
export function selectBaseTemplate(number: string): BaseTemplate | undefined {
  const store = getTemplateStore();

  // 1. Try exact match
  const exactMatch = store.base.get(number);
  if (exactMatch) {
    return exactMatch;
  }

  // 2. Try category-based fallback
  const category = detectCategory(number);
  const categoryTemplate = findCategoryFallback(number, category);
  if (categoryTemplate) {
    return categoryTemplate;
  }

  // 3. No template found
  return undefined;
}

/**
 * Find a fallback template based on category.
 *
 * For repetition: Use the template for the repeated digit (e.g., 1111 -> 111)
 * For sequence: Use closest sequence template
 * For mirror: Use closest mirror template
 * For classic: Use any classic template that shares digits
 */
function findCategoryFallback(
  number: string,
  category: TemplateCategory
): BaseTemplate | undefined {
  const store = getTemplateStore();

  switch (category) {
    case "repetition": {
      // Try shorter/longer repetition of same digit
      const digit = number[0];
      if (!digit) break;
      for (const len of [3, 4, 5, 2]) {
        const fallbackNumber = digit.repeat(len);
        const template = store.base.get(fallbackNumber);
        if (template) return template;
      }
      break;
    }

    case "sequence": {
      // Try similar length sequences
      const templates = Array.from(store.base.values()).filter(
        (t) => t.category === "sequence"
      );
      // Prefer same length
      const sameLength = templates.filter((t) => t.number.length === number.length);
      if (sameLength.length > 0) {
        return sameLength[0];
      }
      // Any sequence
      if (templates.length > 0) {
        return templates[0];
      }
      break;
    }

    case "mirror": {
      // Try similar length mirrors
      const templates = Array.from(store.base.values()).filter(
        (t) => t.category === "mirror"
      );
      const sameLength = templates.filter((t) => t.number.length === number.length);
      if (sameLength.length > 0) {
        return sameLength[0];
      }
      if (templates.length > 0) {
        return templates[0];
      }
      break;
    }

    case "classic": {
      // Try finding a classic template with similar starting digit
      const templates = Array.from(store.base.values()).filter(
        (t) => t.category === "classic"
      );
      const sameStart = templates.filter((t) => t.number[0] === number[0]);
      if (sameStart.length > 0) {
        return sameStart[0];
      }
      // Any classic as last resort
      if (templates.length > 0) {
        return templates[0];
      }
      break;
    }
  }

  return undefined;
}

/**
 * Check if a template exists for a number (exact or fallback).
 */
export function hasTemplate(number: string): boolean {
  return selectBaseTemplate(number) !== undefined;
}

/**
 * Get all available numbers that have exact templates.
 */
export function getAvailableNumbers(): string[] {
  const store = getTemplateStore();
  return Array.from(store.base.keys());
}
