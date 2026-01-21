/**
 * Category metadata for the Numbers section.
 * Defines taxonomy for pattern browsing.
 */

import type { CategoryMeta, NumberCategory } from "./types";

/**
 * All category definitions with metadata.
 */
export const CATEGORIES: Record<NumberCategory, CategoryMeta> = {
  double: {
    id: "double",
    label: "Double",
    pluralLabel: "Doubles",
    description: "Two repeating digits like 11, 22, 33",
    order: 1,
  },
  triple: {
    id: "triple",
    label: "Triple",
    pluralLabel: "Triples",
    description: "Three repeating digits like 111, 444, 777",
    order: 2,
  },
  quad: {
    id: "quad",
    label: "Quad",
    pluralLabel: "Quads",
    description: "Four repeating digits like 1111, 2222",
    order: 3,
  },
  sequential: {
    id: "sequential",
    label: "Sequential",
    pluralLabel: "Sequences",
    description: "Numbers in order like 123, 1234, or descending like 321",
    order: 4,
  },
  mirrored: {
    id: "mirrored",
    label: "Mirrored",
    pluralLabel: "Mirrors",
    description: "Palindrome patterns like 1221, 1331",
    order: 5,
  },
  clock: {
    id: "clock",
    label: "Clock",
    pluralLabel: "Clock Patterns",
    description: "Repeating patterns commonly seen on digital clocks",
    order: 6,
  },
  sandwich: {
    id: "sandwich",
    label: "Sandwich",
    pluralLabel: "Sandwiches",
    description: "Patterns where the same digit bookends different middle digits",
    order: 7,
  },
  compound: {
    id: "compound",
    label: "Compound",
    pluralLabel: "Compounds",
    description: "Patterns where the second half relates mathematically to the first",
    order: 8,
  },
};

/**
 * Get category metadata by ID.
 */
export function getCategoryMeta(category: NumberCategory): CategoryMeta {
  return CATEGORIES[category];
}

/**
 * Get all categories sorted by order.
 */
export function getAllCategories(): CategoryMeta[] {
  return Object.values(CATEGORIES).sort((a, b) => a.order - b.order);
}
