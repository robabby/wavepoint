/**
 * Type definitions for the number relationship system.
 * Defines relationship categories, types, and priority weights.
 */

import type { NumberPatternId } from "./types";

/**
 * All supported relationship types, grouped by category.
 *
 * Family (gold) - digit family connections
 * Sequential (amber) - sequence connections
 * Structural (bronze) - pattern structure
 * Thematic (cream/gold-bright) - meaning connections
 */
export type NumberRelationshipType =
  // Family - digit family connections
  | "same-digit"
  | "digit-family"
  | "amplification"
  // Sequential - sequence connections
  | "sequential"
  | "ascending"
  | "descending"
  | "inverse"
  // Structural - pattern structure
  | "contains"
  | "component"
  | "mirrored"
  | "compound"
  // Thematic - meaning connections
  | "thematic"
  | "complementary"
  | "progression";

/**
 * Metadata for a single relationship.
 */
export interface NumberRelationshipMeta {
  /** The type of relationship */
  type: NumberRelationshipType;
  /** Target pattern ID */
  targetId: NumberPatternId;
  /** Strength of relationship (1-10 scale) */
  strength: number;
  /** Optional context explaining the relationship */
  context?: string;
  /** Whether this was computed (vs manually defined) */
  computed?: boolean;
}

/**
 * Categories for color-coding relationship badges.
 */
export type NumberRelationshipCategory =
  | "family"
  | "sequential"
  | "structural"
  | "thematic";

/**
 * Priority weights for relationship types.
 * Higher = more important, shown first when sorting.
 */
export const RELATIONSHIP_PRIORITY: Record<NumberRelationshipType, number> = {
  // Family (highest priority - most intuitive)
  "same-digit": 100,
  "digit-family": 95,
  amplification: 90,
  // Sequential
  sequential: 85,
  ascending: 80,
  descending: 80,
  inverse: 75,
  // Structural
  contains: 70,
  component: 65,
  mirrored: 60,
  compound: 55,
  // Thematic (lowest - editorial)
  thematic: 50,
  complementary: 45,
  progression: 40,
};

/**
 * Get the category for a relationship type.
 * Used for badge color-coding.
 */
export function getNumberRelationshipCategory(
  type: NumberRelationshipType
): NumberRelationshipCategory {
  const familyTypes: NumberRelationshipType[] = [
    "same-digit",
    "digit-family",
    "amplification",
  ];
  const sequentialTypes: NumberRelationshipType[] = [
    "sequential",
    "ascending",
    "descending",
    "inverse",
  ];
  const structuralTypes: NumberRelationshipType[] = [
    "contains",
    "component",
    "mirrored",
    "compound",
  ];

  if (familyTypes.includes(type)) return "family";
  if (sequentialTypes.includes(type)) return "sequential";
  if (structuralTypes.includes(type)) return "structural";
  return "thematic";
}

/**
 * Human-readable labels for relationship types.
 */
export const RELATIONSHIP_LABELS: Record<NumberRelationshipType, string> = {
  "same-digit": "Same Digit",
  "digit-family": "Family",
  amplification: "Amplified",
  sequential: "Sequential",
  ascending: "Ascending",
  descending: "Descending",
  inverse: "Inverse",
  contains: "Contains",
  component: "Component",
  mirrored: "Mirrored",
  compound: "Compound",
  thematic: "Related",
  complementary: "Complement",
  progression: "Progression",
};

/**
 * Get human-readable label for a relationship type.
 */
export function getRelationshipLabel(type: NumberRelationshipType): string {
  return RELATIONSHIP_LABELS[type];
}
