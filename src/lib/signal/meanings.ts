/**
 * Base meanings for common angel numbers.
 * Used as foundation for AI interpretations and fallbacks.
 */
const BASE_MEANINGS: Record<string, string> = {
  "111": "New beginnings, manifestation, alignment with your higher purpose",
  "222": "Balance, harmony, trust the process, partnerships",
  "333": "Ascended masters are near, creativity, self-expression",
  "444": "Angels are with you, protection, foundation building",
  "555": "Major changes coming, transformation, freedom",
  "666": "Balance material and spiritual, self-reflection",
  "777": "Spiritual awakening, luck, divine wisdom",
  "888": "Abundance, financial prosperity, infinite flow",
  "999": "Completion, endings leading to new beginnings",
  "000": "Infinite potential, oneness with the universe",
  "1111": "Powerful manifestation portal, alignment, wake-up call",
  "1212": "Stay positive, trust your path, spiritual growth",
  "1234": "Progress, step by step, you're on the right track",
};

/**
 * Get the base meaning for a number.
 * Returns a generic message for unknown numbers.
 */
export function getBaseMeaning(number: string): string {
  return (
    BASE_MEANINGS[number] ??
    `The number ${number} carries unique significance for you`
  );
}
