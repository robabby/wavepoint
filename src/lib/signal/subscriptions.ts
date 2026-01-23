/**
 * Signal subscription utilities (server-side).
 *
 * Provides tier checking and subscription access helpers.
 * For client-safe tier metadata, use ./subscription-tiers.ts
 */

import { getUserSubscription } from "@/lib/db/queries/subscriptions";
import type { SubscriptionTier } from "./subscription-tiers";

// Re-export for convenience
export { SUBSCRIPTION_TIERS, type SubscriptionTier } from "./subscription-tiers";

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
