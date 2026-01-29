import { getArchetypesForDigit } from "@/lib/archetypes";
import { computeBirthCards } from "./birth-cards";
import type { ComputedEntry } from "./types";

interface NumerologyNumbers {
  lifePathNumber: number | null;
  birthdayNumber: number | null;
  expressionNumber: number | null;
  soulUrgeNumber: number | null;
  personalityNumber: number | null;
  maturityNumber: number | null;
}

const POSITIONS = [
  "life-path",
  "birthday",
  "expression",
  "soul-urge",
  "personality",
  "maturity",
] as const;

const NUMEROLOGY_KEYS: (keyof NumerologyNumbers)[] = [
  "lifePathNumber",
  "birthdayNumber",
  "expressionNumber",
  "soulUrgeNumber",
  "personalityNumber",
  "maturityNumber",
];

/**
 * Reduce master numbers (11, 22, 33) to their base digit for archetype lookup
 */
function reduceToBase(digit: number): number {
  if (digit === 11) return 2;
  if (digit === 22) return 4;
  if (digit === 33) return 6;
  return digit;
}

/**
 * Compute the full constellation from user profile data.
 * Returns computed entries for both Jungian archetypes and tarot birth cards.
 */
export function computeConstellation(
  birthDate: Date | string | null,
  numerology: NumerologyNumbers
): ComputedEntry[] {
  const entries: ComputedEntry[] = [];
  const seenArchetypes = new Set<string>();

  // Jungian archetypes from numerology positions
  for (let i = 0; i < POSITIONS.length; i++) {
    const position = POSITIONS[i]!;
    const key = NUMEROLOGY_KEYS[i]!;
    const digit = numerology[key];

    if (digit == null) continue;

    const baseDigit = reduceToBase(digit);
    const archetypes = getArchetypesForDigit(baseDigit);

    for (const slug of archetypes) {
      if (seenArchetypes.has(slug)) continue;
      seenArchetypes.add(slug);
      entries.push({
        system: "jungian",
        identifier: slug,
        derivedFrom: `${position}:${digit}`,
      });
    }
  }

  // Tarot birth cards from birth date
  if (birthDate) {
    const birthCards = computeBirthCards(birthDate);
    for (const card of birthCards) {
      entries.push({
        system: "tarot",
        identifier: card.slug,
        derivedFrom: `birth-date:${typeof birthDate === "string" ? birthDate : birthDate.toISOString().split("T")[0]}`,
      });
    }
  }

  return entries;
}
