/**
 * Helper functions for the tarot module.
 */

import type { MajorArcanaSlug, MajorArcanaWithRelations } from "./types";
import { MAJOR_ARCANA_SLUGS } from "./types";
import { getMajorArcanaBySlug, getAllMajorArcana } from "./data";

/**
 * Check if a string is a valid Major Arcana slug
 */
export function isValidMajorArcanaSlug(slug: string): slug is MajorArcanaSlug {
  return MAJOR_ARCANA_SLUGS.includes(slug as MajorArcanaSlug);
}

/**
 * Get a Major Arcana card with navigation relations (prev/next cards)
 */
export function getMajorArcanaWithRelations(
  slug: MajorArcanaSlug
): MajorArcanaWithRelations | undefined {
  const card = getMajorArcanaBySlug(slug);
  if (!card) return undefined;

  const allCards = getAllMajorArcana();
  const currentIndex = allCards.findIndex((c) => c.slug === slug);

  const prevCard = currentIndex > 0 ? allCards[currentIndex - 1] : undefined;
  const nextCard = currentIndex < allCards.length - 1 ? allCards[currentIndex + 1] : undefined;

  return {
    ...card,
    previousCard: prevCard?.slug ?? null,
    nextCard: nextCard?.slug ?? null,
  };
}

/**
 * Get adjacent cards for navigation (previous and next in sequence)
 */
export function getAdjacentCards(slug: MajorArcanaSlug): {
  previous: MajorArcanaSlug | null;
  next: MajorArcanaSlug | null;
} {
  const allCards = getAllMajorArcana();
  const currentIndex = allCards.findIndex((c) => c.slug === slug);

  const prevCard = currentIndex > 0 ? allCards[currentIndex - 1] : undefined;
  const nextCard = currentIndex < allCards.length - 1 ? allCards[currentIndex + 1] : undefined;

  return {
    previous: prevCard?.slug ?? null,
    next: nextCard?.slug ?? null,
  };
}

/**
 * Format a card number as a Roman numeral
 */
export function formatRomanNumeral(number: number): string {
  const numerals: Record<number, string> = {
    0: "0",
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
    11: "XI",
    12: "XII",
    13: "XIII",
    14: "XIV",
    15: "XV",
    16: "XVI",
    17: "XVII",
    18: "XVIII",
    19: "XIX",
    20: "XX",
    21: "XXI",
  };
  return numerals[number] ?? String(number);
}
