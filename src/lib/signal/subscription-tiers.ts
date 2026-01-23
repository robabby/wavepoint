/**
 * Subscription tier metadata for UI display.
 *
 * This file is client-safe - it contains no server-side dependencies.
 */

export type SubscriptionTier = "free" | "insight";

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
