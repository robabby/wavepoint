import type { CosmicContext } from "./cosmic-context";

/**
 * A sighting with its AI-generated interpretation.
 * Used in UI components that display sighting details.
 */
export interface SightingWithInterpretation {
  id: string;
  userId: string;
  number: string;
  note: string | null;
  moodTags: string[] | null;
  tz: string | null;
  cosmicContext: CosmicContext | null;
  timestamp: Date;
  createdAt: Date;
  interpretation: {
    id: string;
    content: string;
    model: string;
    createdAt: Date;
  } | null;
}

/**
 * Aggregated statistics for a user's sightings.
 * Used in the dashboard overview.
 */
export interface UserStats {
  totalSightings: number;
  uniqueNumbers: number;
  numberCounts: NumberCount[];
}

/**
 * Count and timing info for a specific number.
 */
export interface NumberCount {
  number: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
}
