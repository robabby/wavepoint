/**
 * Component breakdown for uncovered patterns.
 * Analyzes numbers by their digits and provides synthesized meanings.
 */

import { getPatternByNumber } from "./helpers";
import type { ComponentBreakdown, DigitComponent, NumberPatternId } from "./types";

/**
 * Base meanings for single digits.
 * Used when breaking down unfamiliar patterns.
 */
const DIGIT_MEANINGS: Record<string, string> = {
  "0": "Infinite potential, wholeness, cycles",
  "1": "New beginnings, independence, leadership",
  "2": "Balance, partnership, diplomacy",
  "3": "Creativity, expression, growth",
  "4": "Stability, foundation, hard work",
  "5": "Change, freedom, adventure",
  "6": "Harmony, responsibility, nurturing",
  "7": "Wisdom, spirituality, introspection",
  "8": "Abundance, power, manifestation",
  "9": "Completion, humanitarianism, wisdom",
};

/**
 * Get the meaning for a single digit.
 */
function getDigitMeaning(digit: string): string {
  return DIGIT_MEANINGS[digit] ?? "Mystery, the unknown";
}

/**
 * Identify repeating digit patterns in a number.
 * For example, "847" has no repeats, but "8847" has "88".
 */
function findRepeatingGroups(number: string): string[] {
  const groups: string[] = [];
  let i = 0;

  while (i < number.length) {
    const digit = number[i];
    let count = 1;

    // Count consecutive same digits
    while (i + count < number.length && number[i + count] === digit) {
      count++;
    }

    if (count >= 2) {
      groups.push(digit!.repeat(count));
    }
    i += count;
  }

  return groups;
}

/**
 * Generate a component breakdown for any number.
 * Links to known patterns when possible.
 */
export function generateComponentBreakdown(number: string): ComponentBreakdown {
  const components: DigitComponent[] = [];

  // First, check for repeating groups that match known patterns
  const repeatingGroups = findRepeatingGroups(number);
  const usedIndices = new Set<number>();

  for (const group of repeatingGroups) {
    const pattern = getPatternByNumber(group);
    if (pattern) {
      // Find where this group starts in the number
      let startIndex = 0;
      for (let i = 0; i < number.length; i++) {
        if (!usedIndices.has(i) && number.substring(i, i + group.length) === group) {
          startIndex = i;
          break;
        }
      }

      components.push({
        digit: group,
        meaning: pattern.essence,
        patternId: pattern.id as NumberPatternId,
      });

      // Mark these indices as used
      for (let i = startIndex; i < startIndex + group.length; i++) {
        usedIndices.add(i);
      }
    }
  }

  // Now process remaining individual digits
  for (let i = 0; i < number.length; i++) {
    if (!usedIndices.has(i)) {
      const digit = number[i]!;
      components.push({
        digit,
        meaning: getDigitMeaning(digit),
      });
    }
  }

  // Sort components by their appearance order in the original number
  components.sort((a, b) => {
    const aIndex = number.indexOf(a.digit);
    const bIndex = number.indexOf(b.digit);
    return aIndex - bIndex;
  });

  // Generate synthesized meaning
  const synthesizedMeaning = generateSynthesizedMeaning(number, components);

  return {
    number,
    components,
    synthesizedMeaning,
  };
}

/**
 * Generate a synthesized meaning from components.
 */
function generateSynthesizedMeaning(
  number: string,
  components: DigitComponent[],
): string {
  // Check for special patterns
  const isAscending = isAscendingSequence(number);
  const isDescending = isDescendingSequence(number);
  const isPalindrome = number === number.split("").reverse().join("");
  const allSameDigit = number.split("").every((d) => d === number[0]);

  if (allSameDigit && number.length >= 2) {
    const digit = number[0];
    const count = number.length;
    const digitMeaning = getDigitMeaning(digit!);
    return `The energy of ${digit} (${digitMeaning.toLowerCase()}) is amplified ${count} times, creating a powerful resonance in your experience.`;
  }

  if (isAscending) {
    return "This ascending sequence represents forward momentum and progression. Each step builds on the last, suggesting steady advancement toward your goals.";
  }

  if (isDescending) {
    return "This descending pattern speaks to release, winding down, and completion. It may be time to let go of what no longer serves you.";
  }

  if (isPalindrome) {
    return "This mirrored pattern suggests reflection and cycles—what goes out returns, what begins comes back around. Look for themes of balance and reciprocity.";
  }

  // Default synthesis from components
  const meanings = components
    .filter((c) => !c.patternId) // Only use individual digit meanings
    .map((c) => c.meaning.toLowerCase().split(",")[0]?.trim())
    .filter(Boolean);

  if (meanings.length === 0) {
    // All components are known patterns
    const patternMeanings = components
      .filter((c) => c.patternId)
      .map((c) => c.meaning.toLowerCase());
    return `This number combines the energies of ${patternMeanings.join(" and ")}, creating a layered message for you to explore.`;
  }

  const uniqueMeanings = [...new Set(meanings)];
  if (uniqueMeanings.length === 1) {
    return `The repeated presence of ${uniqueMeanings[0]} energy suggests a focused message. This theme may be particularly relevant to your current circumstances.`;
  }

  return `This combination blends ${uniqueMeanings.slice(0, 3).join(", ")}. Consider how these energies might be interacting in your life right now.`;
}

/**
 * Check if a number is an ascending sequence (e.g., 123, 456).
 */
function isAscendingSequence(number: string): boolean {
  if (number.length < 2) return false;

  for (let i = 1; i < number.length; i++) {
    const prev = parseInt(number[i - 1]!, 10);
    const curr = parseInt(number[i]!, 10);
    if (curr !== prev + 1) return false;
  }
  return true;
}

/**
 * Check if a number is a descending sequence (e.g., 987, 654).
 */
function isDescendingSequence(number: string): boolean {
  if (number.length < 2) return false;

  for (let i = 1; i < number.length; i++) {
    const prev = parseInt(number[i - 1]!, 10);
    const curr = parseInt(number[i]!, 10);
    if (curr !== prev - 1) return false;
  }
  return true;
}

/**
 * Check if a number has any recognizable pattern elements.
 * Useful for determining if breakdown will be meaningful.
 */
export function hasRecognizableElements(number: string): boolean {
  // Check for known patterns
  if (getPatternByNumber(number)) return true;

  // Check for repeating groups
  const groups = findRepeatingGroups(number);
  if (groups.some((g) => getPatternByNumber(g))) return true;

  // Check for sequences
  if (isAscendingSequence(number) || isDescendingSequence(number)) return true;

  // Check for palindromes
  if (number.length >= 3 && number === number.split("").reverse().join("")) {
    return true;
  }

  return false;
}
