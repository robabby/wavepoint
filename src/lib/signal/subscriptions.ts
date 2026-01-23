/**
 * Signal subscription utilities (server-side).
 *
 * Provides tier checking and subscription access helpers.
 * For client-safe tier metadata, use ./subscription-tiers.ts
 */

import { getUserSubscription } from "@/lib/db/queries/subscriptions";
import {
  getRegenerationsUsed,
  incrementRegenerations as incrementRegenerationsQuery,
} from "@/lib/db/queries/subscription-usage";
import type { SubscriptionTier } from "./subscription-tiers";

// Re-export for convenience
export { SUBSCRIPTION_TIERS, type SubscriptionTier } from "./subscription-tiers";

/** Monthly regeneration limit for Pro users */
const MONTHLY_REGEN_LIMIT = 10;

/**
 * Check if a user has Signal Insight access.
 *
 * Users have access if:
 * - They have an 'insight' tier subscription with 'active' status
 * - Their subscription period hasn't expired
 */
export async function hasInsightAccess(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  // No subscription = free tier
  if (!subscription) {
    return false;
  }

  // Must be on insight tier with active status
  if (subscription.tier !== "insight" || subscription.status !== "active") {
    return false;
  }

  // Check if subscription period is still valid
  if (subscription.currentPeriodEnd) {
    const now = new Date();
    if (subscription.currentPeriodEnd < now) {
      return false;
    }
  }

  return true;
}

/**
 * Get a user's current subscription tier.
 * Returns 'free' if no subscription or subscription is not active.
 */
export async function getSubscriptionTier(
  userId: string
): Promise<SubscriptionTier> {
  const hasAccess = await hasInsightAccess(userId);
  return hasAccess ? "insight" : "free";
}

/**
 * Result of regeneration limit check.
 */
export interface CanRegenerateResult {
  /** Whether regeneration is allowed */
  allowed: boolean;
  /** Number of regenerations remaining this period */
  remaining: number;
  /** Start of current billing period */
  periodStart: Date | null;
  /** When the limit resets */
  resetsAt: Date | null;
}

/**
 * Check if a user can regenerate an interpretation.
 *
 * Returns allowed: true if:
 * - User has Signal Insight access
 * - User has not exceeded monthly regeneration limit
 */
export async function canRegenerate(
  userId: string
): Promise<CanRegenerateResult> {
  const subscription = await getUserSubscription(userId);

  // No subscription or not insight tier = not allowed
  if (!subscription || subscription.tier !== "insight") {
    return {
      allowed: false,
      remaining: 0,
      periodStart: null,
      resetsAt: null,
    };
  }

  // Check if subscription is active
  if (subscription.status !== "active") {
    return {
      allowed: false,
      remaining: 0,
      periodStart: null,
      resetsAt: subscription.currentPeriodEnd,
    };
  }

  // Check if subscription period is still valid
  const now = new Date();
  if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < now) {
    return {
      allowed: false,
      remaining: 0,
      periodStart: null,
      resetsAt: null,
    };
  }

  // Calculate period start from period end (roughly 1 month prior)
  // Stripe sets currentPeriodEnd, so we derive periodStart from it
  const periodStart = subscription.currentPeriodEnd
    ? new Date(
        new Date(subscription.currentPeriodEnd).setMonth(
          subscription.currentPeriodEnd.getMonth() - 1
        )
      )
    : new Date(now.getFullYear(), now.getMonth(), 1); // Fallback to start of current month

  // Get usage for current period
  const used = await getRegenerationsUsed(userId, periodStart);
  const remaining = Math.max(0, MONTHLY_REGEN_LIMIT - used);

  return {
    allowed: remaining > 0,
    remaining,
    periodStart,
    resetsAt: subscription.currentPeriodEnd,
  };
}

/**
 * Increment regeneration counter for a user.
 * Should be called after successful regeneration.
 */
export async function incrementRegenerations(userId: string): Promise<void> {
  const subscription = await getUserSubscription(userId);

  // Calculate period start
  const now = new Date();
  const periodStart = subscription?.currentPeriodEnd
    ? new Date(
        new Date(subscription.currentPeriodEnd).setMonth(
          subscription.currentPeriodEnd.getMonth() - 1
        )
      )
    : new Date(now.getFullYear(), now.getMonth(), 1);

  await incrementRegenerationsQuery(userId, periodStart);
}
