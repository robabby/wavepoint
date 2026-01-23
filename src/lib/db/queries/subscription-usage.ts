/**
 * Signal subscription usage database queries.
 *
 * Tracks regeneration usage per billing period for Pro users.
 */

import { and, eq, sql } from "drizzle-orm";
import { db, signalSubscriptionUsage } from "@/lib/db";

/**
 * Get regenerations used in a billing period.
 * Returns 0 if no usage record exists.
 */
export async function getRegenerationsUsed(
  userId: string,
  periodStart: Date
): Promise<number> {
  const [usage] = await db
    .select({ regenerationsUsed: signalSubscriptionUsage.regenerationsUsed })
    .from(signalSubscriptionUsage)
    .where(
      and(
        eq(signalSubscriptionUsage.userId, userId),
        eq(signalSubscriptionUsage.periodStart, periodStart)
      )
    )
    .limit(1);

  return usage?.regenerationsUsed ?? 0;
}

/**
 * Increment regeneration counter for a billing period.
 * Creates the usage record if it doesn't exist.
 */
export async function incrementRegenerations(
  userId: string,
  periodStart: Date
): Promise<void> {
  // Use upsert to atomically increment or create
  await db
    .insert(signalSubscriptionUsage)
    .values({
      userId,
      periodStart,
      regenerationsUsed: 1,
    })
    .onConflictDoUpdate({
      target: [
        signalSubscriptionUsage.userId,
        signalSubscriptionUsage.periodStart,
      ],
      set: {
        regenerationsUsed: sql`${signalSubscriptionUsage.regenerationsUsed} + 1`,
      },
    });
}
