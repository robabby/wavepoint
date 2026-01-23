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
 * If timezone is provided, formats in that timezone; otherwise uses UTC
 */
function formatDateString(date: Date, tz?: string): string {
  if (tz) {
    // Use toLocaleDateString with en-CA locale for YYYY-MM-DD format in the specified timezone
    return date.toLocaleDateString("en-CA", { timeZone: tz });
  }
  return date.toISOString().split("T")[0]!;
}

/**
 * Check if two date strings (YYYY-MM-DD format) are consecutive days
 * Both dates should already be in the same timezone context
 */
function isConsecutiveDay(
  previousDate: string,
  currentDate: string
): boolean {
  // Parse dates using noon to avoid DST edge cases
  const prev = new Date(previousDate + "T12:00:00");

  // Add one day to previous date
  prev.setDate(prev.getDate() + 1);

  // Format back to YYYY-MM-DD for comparison
  const expectedNext = prev.toISOString().split("T")[0]!;
  return expectedNext === currentDate;
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
 * @param tz - IANA timezone for date calculation (e.g. "America/Los_Angeles")
 * @returns Updated activity stats
 */
export async function updateUserActivityStats(
  userId: string,
  sightingDate: Date = new Date(),
  tz?: string
): Promise<SignalUserActivityStats> {
  const today = formatDateString(sightingDate, tz);

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
