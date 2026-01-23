/**
 * Type definitions for the Numbers section.
 * Framework-agnostic types for number patterns and categories.
 */

/**
 * All supported number pattern IDs.
 * This is the single source of truth for what patterns are covered.
 */
export const NUMBER_PATTERN_IDS = [
  // Doubles (9)
  "11",
  "22",
  "33",
  "44",
  "55",
  "66",
  "77",
  "88",
  "99",
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
  // Quads (9)
  "1111",
  "2222",
  "3333",
  "4444",
  "5555",
  "6666",
  "7777",
  "8888",
  "9999",
  // Sequential (14)
  "123",
  "234",
  "345",
  "456",
  "567",
  "678",
  "789",
  "1234",
  "12345",
  "321",
  "432",
  "4321",
  "54321",
  "122",
  // Mirrored (9)
  "1001",
  "1221",
  "1331",
  "1441",
  "1551",
  "1661",
  "1771",
  "1881",
  "1991",
  // Clock (15)
  "0000",
  "0101",
  "1010",
  "1212",
  "1313",
  "1414",
  "1515",
  "1616",
  "1717",
  "1818",
  "1919",
  "2020",
  "2112",
  "2121",
  "2323",
  // Sandwich (12)
  "101",
  "202",
  "303",
  "404",
  "505",
  "606",
  "707",
  "717",
  "808",
  "818",
  "909",
  "919",
  // Compound (14)
  "1122",
  "1133",
  "1144",
  "1155",
  "1166",
  "1177",
  "1188",
  "1199",
  "1224",
  "1236",
  "1248",
  "1326",
  "1339",
  "1428",
] as const;

/**
 * Union type of all valid pattern IDs.
 */
export type NumberPatternId = (typeof NUMBER_PATTERN_IDS)[number];

/**
 * Pattern category types.
 */
export type NumberCategory =
  | "double"
  | "triple"
  | "quad"
  | "sequential"
  | "mirrored"
  | "clock"
  | "sandwich"
  | "compound";

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
