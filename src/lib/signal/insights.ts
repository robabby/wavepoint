/**
 * Pattern insight detection for Signal.
 *
 * Rule-based insights shown on capture result screen.
 * No AI required - computed at capture time from stats.
 */

import { getPatternByNumber } from "@/lib/numbers/helpers";
import { CATEGORIES } from "@/lib/numbers/categories";
import type { NumberCategory } from "@/lib/numbers/types";

/**
 * Insight types
 */
export type InsightType = "frequent" | "returning" | "first_catch";

/**
 * A pattern insight to display
 */
export interface PatternInsight {
  type: InsightType;
  message: string;
  subtext?: string;
}

/**
 * Context needed to compute insights
 */
export interface InsightContext {
  /** The number just logged */
  number: string;
  /** Total times this number has been seen (including this time) */
  count: number;
  /** When this number was first seen */
  firstSeen: Date;
  /** When this number was last seen (before this sighting) */
  lastSeen: Date | null;
  /** Recent sightings of this number in the past 7 days (before this one) */
  recentCount: number;
  /** Is this the first time seeing this number? */
  isFirstCatch: boolean;
}

/**
 * Generate pattern insights based on sighting context.
 *
 * Returns at most one insight (the most relevant one).
 * Priority: first_catch > frequent > returning
 *
 * @param context - The sighting context
 * @returns An insight or null if no insight applies
 */
export function generateInsight(context: InsightContext): PatternInsight | null {
  const {
    number,
    count,
    lastSeen,
    recentCount,
    isFirstCatch,
  } = context;

  // Check for first catch
  if (isFirstCatch) {
    return getFirstCatchInsight(number);
  }

  // Check for frequent pattern (3+ times in 7 days)
  // recentCount is the count before this sighting, so check >= 2
  if (recentCount >= 2) {
    return getFrequentInsight(number, recentCount + 1);
  }

  // Check for returning pattern (gap of 14+ days)
  if (lastSeen && count > 1) {
    const daysSinceLastSeen = getDaysBetween(lastSeen, new Date());
    if (daysSinceLastSeen >= 14) {
      return getReturningInsight(number, daysSinceLastSeen);
    }
  }

  return null;
}

/**
 * Generate insight for first catch of a number.
 */
function getFirstCatchInsight(number: string): PatternInsight {
  const pattern = getPatternByNumber(number);

  if (pattern) {
    const categoryMeta = CATEGORIES[pattern.category];
    return {
      type: "first_catch",
      message: `First time seeing ${number}.`,
      subtext: `${categoryMeta.pluralLabel} ${getCategoryMeaning(pattern.category)}`,
    };
  }

  // For uncovered numbers, provide a generic message
  return {
    type: "first_catch",
    message: `First time seeing ${number}.`,
    subtext: "A new pattern enters your awareness.",
  };
}

/**
 * Generate insight for frequent pattern.
 */
function getFrequentInsight(number: string, weekCount: number): PatternInsight {
  return {
    type: "frequent",
    message: `${number} is showing up a lot this week.`,
    subtext: `${weekCount} times in the past 7 days.`,
  };
}

/**
 * Generate insight for returning pattern.
 */
function getReturningInsight(number: string, daysSince: number): PatternInsight {
  return {
    type: "returning",
    message: `${number} is back.`,
    subtext: `Last seen ${daysSince} days ago.`,
  };
}

/**
 * Get a short meaning for a category.
 */
function getCategoryMeaning(category: NumberCategory): string {
  const meanings: Record<NumberCategory, string> = {
    double: "are about amplification and emphasis.",
    triple: "carry powerful vibrations.",
    quad: "represent mastery and alignment.",
    sequential: "symbolize progression and flow.",
    mirrored: "are about reflection and balance.",
    clock: "mark significant moments in time.",
    sandwich: "represent protection and enclosure.",
    compound: "blend energies in unique ways.",
  };
  return meanings[category];
}

/**
 * Calculate days between two dates.
 */
function getDaysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffMs / oneDay);
}

/**
 * Query helper: count sightings of a number in the past N days.
 *
 * This is meant to be called with data from the database.
 * The actual DB query should be done in the API route.
 */
export function countRecentSightings(
  sightings: Array<{ number: string; timestamp: Date }>,
  number: string,
  days: number
): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return sightings.filter(
    (s) => s.number === number && s.timestamp >= cutoff
  ).length;
}
