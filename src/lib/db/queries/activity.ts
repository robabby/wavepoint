/**
 * Database queries for Signal activity tracking
 *
 * Manages user activity stats including streaks and engagement tracking.
 */

import { eq, sql } from "drizzle-orm";

import { db, signalUserActivityStats } from "@/lib/db";
import type { SignalUserActivityStats } from "@/lib/db";

/**
 * User activity stats
 */
export interface UserActivityStats {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  lastActiveDate: string | null;
}

/**
 * Get activity stats for a user
 *
 * @param userId - User's UUID
 * @returns Activity stats or default values if none exist
 */
export async function getUserActivityStats(
  userId: string
): Promise<UserActivityStats> {
  const result = await db.query.signalUserActivityStats.findFirst({
    where: eq(signalUserActivityStats.userId, userId),
  });

  return {
    currentStreak: result?.currentStreak ?? 0,
    longestStreak: result?.longestStreak ?? 0,
    totalActiveDays: result?.totalActiveDays ?? 0,
    lastActiveDate: result?.lastActiveDate ?? null,
  };
}

/**
 * Format a Date to YYYY-MM-DD string
 */
function formatDateString(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

/**
 * Check if two date strings are consecutive days
 */
function isConsecutiveDay(
  previousDate: string,
  currentDate: string
): boolean {
  const prev = new Date(previousDate + "T00:00:00Z");

  // Add one day to previous date
  prev.setUTCDate(prev.getUTCDate() + 1);

  return formatDateString(prev) === currentDate;
}

/**
 * Update activity stats when a sighting is created
 *
 * Logic:
 * - Same day as last active: no-op
 * - Consecutive day: increment current streak
 * - Gap: reset current streak to 1
 * - Always: update longest if current > longest
 *
 * @param userId - User's UUID
 * @param sightingDate - Date of the sighting (defaults to now)
 * @returns Updated activity stats
 */
export async function updateUserActivityStats(
  userId: string,
  sightingDate: Date = new Date()
): Promise<SignalUserActivityStats> {
  const today = formatDateString(sightingDate);

  // Get existing stats
  const existing = await db.query.signalUserActivityStats.findFirst({
    where: eq(signalUserActivityStats.userId, userId),
  });

  if (!existing) {
    // First ever sighting - create initial stats
    const [created] = await db
      .insert(signalUserActivityStats)
      .values({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        totalActiveDays: 1,
        lastActiveDate: today,
      })
      .returning();
    return created!;
  }

  const lastActive = existing.lastActiveDate;

  // Same day - no changes needed
  if (lastActive === today) {
    return existing;
  }

  // Calculate new streak
  let newCurrentStreak: number;
  let newTotalActiveDays = existing.totalActiveDays + 1;

  if (lastActive && isConsecutiveDay(lastActive, today)) {
    // Consecutive day - extend streak
    newCurrentStreak = existing.currentStreak + 1;
  } else {
    // Gap - reset streak
    newCurrentStreak = 1;
  }

  // Update longest streak if needed
  const newLongestStreak = Math.max(existing.longestStreak, newCurrentStreak);

  // Update stats
  const [updated] = await db
    .update(signalUserActivityStats)
    .set({
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      totalActiveDays: newTotalActiveDays,
      lastActiveDate: today,
      updatedAt: sql`now()`,
    })
    .where(eq(signalUserActivityStats.userId, userId))
    .returning();

  return updated!;
}
