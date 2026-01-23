/**
 * Migration script to recalculate user activity stats with timezone awareness
 *
 * This script recalculates currentStreak, longestStreak, totalActiveDays, and
 * lastActiveDate for all users based on their sighting timestamps converted
 * to the specified timezone.
 *
 * Usage:
 *   npx tsx scripts/recalculate-activity-stats.ts [timezone]
 *
 * Examples:
 *   npx tsx scripts/recalculate-activity-stats.ts America/Los_Angeles
 *   npx tsx scripts/recalculate-activity-stats.ts UTC
 *
 * Default timezone: America/Los_Angeles
 */

import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, asc, sql } from "drizzle-orm";
import {
  signalSightings,
  signalUserActivityStats,
  users,
} from "../src/lib/db/schema";

// Load environment variables
config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not found in environment");
  process.exit(1);
}

const client = neon(DATABASE_URL);
const db = drizzle(client);

// Get timezone from command line argument or use default
const tz = process.argv[2] ?? "America/Los_Angeles";

// Validate timezone format
const IANA_TZ_REGEX = /^[A-Za-z_]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)?$/;
if (!IANA_TZ_REGEX.test(tz) && tz !== "UTC") {
  console.error(`Invalid timezone format: ${tz}`);
  console.error("Use IANA format like 'America/Los_Angeles' or 'UTC'");
  process.exit(1);
}

/**
 * Format a Date to YYYY-MM-DD string in the specified timezone
 */
function formatDateInTimezone(date: Date, timezone: string): string {
  return date.toLocaleDateString("en-CA", { timeZone: timezone });
}

/**
 * Check if two date strings (YYYY-MM-DD) are consecutive days
 */
function isConsecutiveDay(previousDate: string, currentDate: string): boolean {
  const prev = new Date(previousDate + "T12:00:00");
  prev.setDate(prev.getDate() + 1);
  const expectedNext = prev.toISOString().split("T")[0]!;
  return expectedNext === currentDate;
}

/**
 * Calculate activity stats from a list of sighting dates
 */
function calculateStats(dates: string[]): {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  lastActiveDate: string | null;
} {
  if (dates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0,
      lastActiveDate: null,
    };
  }

  // Get unique dates sorted ascending
  const uniqueDates = [...new Set(dates)].sort();
  const totalActiveDays = uniqueDates.length;
  const lastActiveDate = uniqueDates[uniqueDates.length - 1]!;

  // Calculate streaks
  let currentStreak = 1;
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    if (isConsecutiveDay(uniqueDates[i - 1]!, uniqueDates[i]!)) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  // Check if the last active date is today or yesterday (streak is current)
  const today = formatDateInTimezone(new Date(), tz);
  const yesterday = formatDateInTimezone(
    new Date(Date.now() - 24 * 60 * 60 * 1000),
    tz
  );

  if (lastActiveDate === today || lastActiveDate === yesterday) {
    // Walk backwards from the end to find current streak
    currentStreak = 1;
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      if (isConsecutiveDay(uniqueDates[i]!, uniqueDates[i + 1]!)) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    // Streak is broken
    currentStreak = 0;
  }

  return {
    currentStreak,
    longestStreak,
    totalActiveDays,
    lastActiveDate,
  };
}

async function main() {
  console.log(`Recalculating activity stats with timezone: ${tz}\n`);

  // Get all users with sightings
  const usersWithSightings = await db
    .selectDistinct({ userId: signalSightings.userId })
    .from(signalSightings);

  console.log(`Found ${usersWithSightings.length} users with sightings\n`);

  for (const { userId } of usersWithSightings) {
    // Get all sightings for this user, ordered by timestamp
    const sightings = await db
      .select({ timestamp: signalSightings.timestamp })
      .from(signalSightings)
      .where(eq(signalSightings.userId, userId))
      .orderBy(asc(signalSightings.timestamp));

    // Convert timestamps to local dates
    const dates = sightings.map((s) => formatDateInTimezone(s.timestamp, tz));

    // Calculate stats
    const stats = calculateStats(dates);

    // Get user email for logging
    const [user] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, userId));

    console.log(`User: ${user?.email ?? userId}`);
    console.log(`  Sightings: ${sightings.length}`);
    console.log(`  Active days: ${stats.totalActiveDays}`);
    console.log(`  Current streak: ${stats.currentStreak}`);
    console.log(`  Longest streak: ${stats.longestStreak}`);
    console.log(`  Last active: ${stats.lastActiveDate}`);

    // Upsert activity stats
    await db
      .insert(signalUserActivityStats)
      .values({
        userId,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        totalActiveDays: stats.totalActiveDays,
        lastActiveDate: stats.lastActiveDate,
      })
      .onConflictDoUpdate({
        target: signalUserActivityStats.userId,
        set: {
          currentStreak: stats.currentStreak,
          longestStreak: stats.longestStreak,
          totalActiveDays: stats.totalActiveDays,
          lastActiveDate: stats.lastActiveDate,
          updatedAt: sql`now()`,
        },
      });

    console.log(`  Updated!\n`);
  }

  console.log("Done!");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
