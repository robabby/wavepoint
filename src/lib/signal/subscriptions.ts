/**
 * Signal subscription utilities.
 *
 * Provides tier checking and subscription access helpers.
 */

import {
  getUserSubscription,
  type SubscriptionTier,
} from "@/lib/db/queries/subscriptions";

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
 * Subscription tier metadata for UI display.
 */
export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    description: "Base meanings from Numbers library",
    features: [
      "Unlimited sightings",
      "Base number meanings",
      "Activity heatmap & streaks",
      "Your Numbers collection",
      "Pattern insights",
    ],
  },
  insight: {
    name: "Signal Insight",
    description: "Personalized AI interpretations",
    features: [
      "Everything in Free",
      "AI-powered interpretations",
      "Context-aware meanings",
      "Mood & note analysis",
      "Deeper pattern recognition",
    ],
  },
} as const;
