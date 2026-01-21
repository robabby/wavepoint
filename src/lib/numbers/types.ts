/**
 * Type definitions for the Numbers section.
 * Framework-agnostic types for number patterns and categories.
 */

/**
 * All supported number pattern IDs.
 * This is the single source of truth for what patterns are covered.
 */
export const NUMBER_PATTERN_IDS = [
  // Triples (9)
  "111",
  "222",
  "333",
  "444",
  "555",
  "666",
  "777",
  "888",
  "999",
  // Quads (2)
  "1111",
  "2222",
  // Sequential (3)
  "123",
  "1234",
  "12345",
  // Mirrored (2)
  "1212",
  "1221",
  // Doubles (4)
  "11",
  "22",
  "33",
  "44",
] as const;

/**
 * Union type of all valid pattern IDs.
 */
export type NumberPatternId = (typeof NUMBER_PATTERN_IDS)[number];

/**
 * Pattern category types.
 */
export type NumberCategory =
  | "triple"
  | "quad"
  | "sequential"
  | "mirrored"
  | "double";

/**
 * A number pattern with its meaning and metadata.
 */
export interface NumberPattern {
  /** Unique identifier (the number itself) */
  id: NumberPatternId;
  /** URL-safe slug (same as id for numbers) */
  slug: string;
  /** Pattern category */
  category: NumberCategory;
  /** Full title for the pattern (e.g., "New Beginnings & Manifestation") */
  title: string;
  /** 2-3 word essence for cards */
  essence: string;
  /** One paragraph meaning */
  meaning: string;
  /** Searchable keywords */
  keywords: string[];
  /** Related pattern IDs */
  related: NumberPatternId[];
  /** Whether to feature on landing page */
  featured: boolean;
  /** Exclude from featured grid (e.g., 666) */
  excludeFromFeatured: boolean;
  /** Sort order within category */
  order: number;
}

/**
 * Category metadata for browse sections.
 */
export interface CategoryMeta {
  /** Category identifier */
  id: NumberCategory;
  /** Singular label (e.g., "Triple") */
  label: string;
  /** Plural label (e.g., "Triples") */
  pluralLabel: string;
  /** Short description */
  description: string;
  /** Sort order */
  order: number;
}

/**
 * A single digit component in a breakdown.
 */
export interface DigitComponent {
  /** The digit or digit group */
  digit: string;
  /** Meaning of this component */
  meaning: string;
  /** If this matches a known pattern, its ID */
  patternId?: NumberPatternId;
}

/**
 * Breakdown of an uncovered number into its components.
 */
export interface ComponentBreakdown {
  /** The original number */
  number: string;
  /** Component analysis */
  components: DigitComponent[];
  /** Synthesized meaning from components */
  synthesizedMeaning: string;
}

/**
 * User stats for a specific pattern.
 */
export interface PatternStat {
  /** Pattern number */
  number: string;
  /** Times logged */
  count: number;
  /** First time seen */
  firstSeen: string;
  /** Most recent sighting */
  lastSeen: string;
}

/**
 * API response for pattern list.
 */
export interface PatternsListResponse {
  patterns: NumberPattern[];
  total: number;
}

/**
 * API response for single pattern.
 */
export interface PatternDetailResponse {
  pattern: NumberPattern;
  related: NumberPattern[];
}

/**
 * API response for user stats.
 */
export interface PatternStatsResponse {
  stats: PatternStat[];
  total: number;
}
