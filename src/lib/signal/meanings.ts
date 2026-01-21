/**
 * Base meanings for angel numbers.
 *
 * This module re-exports getBaseMeaning from the Numbers module,
 * which is now the single source of truth for pattern meanings.
 *
 * For patterns not covered by Numbers (e.g., "000"), we provide
 * a local fallback meaning below.
 */

import { getBaseMeaning as getNumbersBaseMeaning } from "@/lib/numbers";

/**
 * Additional meanings for patterns not covered by the Numbers module.
 * These are patterns that users might encounter but aren't part of
 * the main Numbers content hub.
 */
const ADDITIONAL_MEANINGS: Record<string, string> = {
  "000": "The appearance of 000 speaks to infinite potential and the void from which all creation emerges. This pattern connects you to the source—the boundless space where possibilities are unlimited. It's a reminder that before any manifestation comes emptiness, and within that emptiness lies everything. You're being invited to release attachment and trust in the infinite.",
};

/**
 * Get the base meaning for a number.
 * First checks the Numbers module (20 core patterns),
 * then falls back to additional meanings, then a generic response.
 */
export function getBaseMeaning(number: string): string {
  // First try the Numbers module (single source of truth)
  const numbersMeaning = getNumbersBaseMeaning(number);

  // If Numbers returns the generic fallback, check our additional meanings
  if (numbersMeaning === `The number ${number} carries unique significance for you`) {
    return ADDITIONAL_MEANINGS[number] ?? numbersMeaning;
  }

  return numbersMeaning;
}
