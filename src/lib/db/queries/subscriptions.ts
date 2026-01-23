/**
 * Signal subscription database queries.
 */

import { eq } from "drizzle-orm";
import { db, signalSubscriptions, type SignalSubscription } from "@/lib/db";

/**
 * Subscription tier types.
 */
export type SubscriptionTier = "free" | "insight";

/**
 * Subscription status types.
 */
export type SubscriptionStatus = "active" | "cancelled" | "past_due";

/**
 * Get a user's subscription record.
 * Returns null if no subscription exists (user is on free tier).
 */
export async function getUserSubscription(
  userId: string
): Promise<SignalSubscription | null> {
  const [subscription] = await db
    .select()
    .from(signalSubscriptions)
    .where(eq(signalSubscriptions.userId, userId))
    .limit(1);

  return subscription ?? null;
}

/**
 * Get a subscription by Stripe subscription ID.
 */
export async function getSubscriptionByStripeId(
  stripeSubscriptionId: string
): Promise<SignalSubscription | null> {
  const [subscription] = await db
    .select()
    .from(signalSubscriptions)
    .where(eq(signalSubscriptions.stripeSubscriptionId, stripeSubscriptionId))
    .limit(1);

  return subscription ?? null;
}

/**
 * Get a subscription by Stripe customer ID.
 */
export async function getSubscriptionByStripeCustomerId(
  stripeCustomerId: string
): Promise<SignalSubscription | null> {
  const [subscription] = await db
    .select()
    .from(signalSubscriptions)
    .where(eq(signalSubscriptions.stripeCustomerId, stripeCustomerId))
    .limit(1);

  return subscription ?? null;
}

/**
 * Create or update a user's subscription.
 */
export async function upsertSubscription(params: {
  userId: string;
  tier: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: SubscriptionStatus;
  currentPeriodEnd?: Date;
}): Promise<SignalSubscription> {
  const now = new Date();

  const [subscription] = await db
    .insert(signalSubscriptions)
    .values({
      userId: params.userId,
      tier: params.tier,
      stripeCustomerId: params.stripeCustomerId,
      stripeSubscriptionId: params.stripeSubscriptionId,
      status: params.status,
      currentPeriodEnd: params.currentPeriodEnd,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: signalSubscriptions.userId,
      set: {
        tier: params.tier,
        stripeCustomerId: params.stripeCustomerId,
        stripeSubscriptionId: params.stripeSubscriptionId,
        status: params.status,
        currentPeriodEnd: params.currentPeriodEnd,
        updatedAt: now,
      },
    })
    .returning();

  return subscription!;
}

/**
 * Update subscription status (for webhook handling).
 */
export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  updates: {
    status?: SubscriptionStatus;
    tier?: SubscriptionTier;
    currentPeriodEnd?: Date;
  }
): Promise<SignalSubscription | null> {
  const [subscription] = await db
    .update(signalSubscriptions)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(signalSubscriptions.stripeSubscriptionId, stripeSubscriptionId))
    .returning();

  return subscription ?? null;
}

/**
 * Downgrade a subscription to free tier (for cancellation).
 */
export async function downgradeToFree(
  stripeSubscriptionId: string
): Promise<SignalSubscription | null> {
  return updateSubscriptionStatus(stripeSubscriptionId, {
    tier: "free",
    status: "cancelled",
  });
}
