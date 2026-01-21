/**
 * Database queries for Numbers section
 *
 * These functions query the signal_user_number_stats table to provide
 * personalization data for the Numbers content hub.
 */

import { and, desc, eq } from "drizzle-orm";

import { db, signalUserNumberStats } from "@/lib/db";

/**
 * User stats for a single number pattern
 */
export interface UserNumberStat {
  number: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
}

/**
 * Get stats for a specific number pattern for a user
 *
 * @param userId - User's UUID
 * @param pattern - Number pattern (e.g., "444", "1111")
 * @returns Stats for the pattern, or null if user hasn't logged it
 */
export async function getUserNumberStats(
  userId: string,
  pattern: string
): Promise<UserNumberStat | null> {
  const result = await db.query.signalUserNumberStats.findFirst({
    where: and(
      eq(signalUserNumberStats.userId, userId),
      eq(signalUserNumberStats.number, pattern)
    ),
  });

  if (!result) {
    return null;
  }

  return {
    number: result.number,
    count: result.count,
    firstSeen: result.firstSeen,
    lastSeen: result.lastSeen,
  };
}

/**
 * Get all number stats for a user, ordered by count descending
 *
 * @param userId - User's UUID
 * @returns Array of stats for all patterns the user has logged
 */
export async function getUserAllNumberStats(
  userId: string
): Promise<UserNumberStat[]> {
  const results = await db.query.signalUserNumberStats.findMany({
    where: eq(signalUserNumberStats.userId, userId),
    orderBy: desc(signalUserNumberStats.count),
  });

  return results.map((result) => ({
    number: result.number,
    count: result.count,
    firstSeen: result.firstSeen,
    lastSeen: result.lastSeen,
  }));
}

/**
 * Get total sightings count for a user
 *
 * @param userId - User's UUID
 * @returns Total number of sightings across all patterns
 */
export async function getUserTotalSightings(userId: string): Promise<number> {
  const stats = await getUserAllNumberStats(userId);
  return stats.reduce((sum, stat) => sum + stat.count, 0);
}
