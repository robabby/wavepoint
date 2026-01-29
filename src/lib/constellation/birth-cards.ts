import { MAJOR_ARCANA_SLUGS } from "@/lib/tarot";

export interface BirthCardResult {
  cardNumber: number;
  slug: string;
}

/**
 * Sum the individual digits of a number
 */
function digitSum(n: number): number {
  return String(n)
    .split("")
    .reduce((sum, d) => sum + Number(d), 0);
}

/**
 * Compute tarot birth cards from a birth date using standard tarot-numerology reduction.
 *
 * Sum all digits of MMDDYYYY, then reduce:
 * - If sum > 21, reduce again
 * - First card is the reduced sum
 * - Second card is digit sum of first (if first > 9)
 * - Third card is digit sum of second (if second > 9, e.g. 19→10→1)
 * - Special case: sum == 22 → The Fool (0) + The Emperor (4)
 */
export function computeBirthCards(birthDate: Date | string): BirthCardResult[] {
  const date = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  // Sum all digits of MMDDYYYY
  let sum = digitSum(month) + digitSum(day) + digitSum(year);

  // Reduce while > 21 (but preserve 22 for special case)
  while (sum > 22) {
    sum = digitSum(sum);
  }

  // Special case: 22 → The Fool (0) + The Emperor (4)
  if (sum === 22) {
    return [
      { cardNumber: 0, slug: MAJOR_ARCANA_SLUGS[0]! },
      { cardNumber: 4, slug: MAJOR_ARCANA_SLUGS[4]! },
    ];
  }

  // If sum is still > 21 after while loop, reduce
  if (sum > 21) {
    sum = digitSum(sum);
  }

  const cards: BirthCardResult[] = [
    { cardNumber: sum, slug: MAJOR_ARCANA_SLUGS[sum]! },
  ];

  // Second card: digit sum of first if first > 9
  if (sum > 9) {
    const second = digitSum(sum);
    cards.push({ cardNumber: second, slug: MAJOR_ARCANA_SLUGS[second]! });

    // Third card: if second > 9 (e.g. 19→10→1)
    if (second > 9) {
      const third = digitSum(second);
      cards.push({ cardNumber: third, slug: MAJOR_ARCANA_SLUGS[third]! });
    }
  }

  return cards;
}
