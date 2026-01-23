"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Sparkles, CreditCard, ExternalLink } from "lucide-react";
import { fadeUpVariants } from "./animation-config";
import { SUBSCRIPTION_TIERS } from "@/lib/signal/subscriptions";

interface SubscriptionStatusProps {
  tier: "free" | "insight";
  status?: "active" | "cancelled" | "past_due" | null;
  currentPeriodEnd?: Date | null;
}

/**
 * Displays the user's current subscription status and management options.
 */
export function SubscriptionStatus({
  tier,
  status,
  currentPeriodEnd,
}: SubscriptionStatusProps) {
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [isLoadingUpgrade, setIsLoadingUpgrade] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tierInfo = SUBSCRIPTION_TIERS[tier];
  const isSubscribed = tier === "insight" && status === "active";

  const handleManageBilling = async () => {
    setIsLoadingPortal(true);
    setError(null);

    try {
      const response = await fetch("/api/signal/portal", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to open billing portal");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoadingPortal(false);
    }
  };

  const handleUpgrade = async () => {
    setIsLoadingUpgrade(true);
    setError(null);

    try {
      const response = await fetch("/api/signal/subscribe", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to start checkout");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoadingUpgrade(false);
    }
  };

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Current Plan Card */}
      <div className="rounded-lg border border-[var(--border-gold)]/30 bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {tier === "insight" ? (
                <Sparkles className="h-5 w-5 text-[var(--color-gold)]" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
              )}
              <h2 className="font-heading text-xl text-foreground">
                {tierInfo.name}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {tierInfo.description}
            </p>
          </div>

          {isSubscribed && (
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
              Active
            </span>
          )}

          {status === "past_due" && (
            <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
              Past Due
            </span>
          )}

          {status === "cancelled" && (
            <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
              Cancelled
            </span>
          )}
        </div>

        {/* Period end info for subscribers */}
        {isSubscribed && currentPeriodEnd && (
          <p className="mt-4 text-sm text-muted-foreground">
            Your subscription renews on{" "}
            {currentPeriodEnd.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}

        {/* Features list */}
        <ul className="mt-6 space-y-3">
          {tierInfo.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm">
              <Check className="h-4 w-4 text-[var(--color-gold)]" />
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {tier === "free" ? (
          <button
            onClick={handleUpgrade}
            disabled={isLoadingUpgrade}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-gold)] px-6 py-3 text-sm font-medium text-black transition-all hover:bg-[var(--color-gold)]/90 disabled:opacity-50"
          >
            {isLoadingUpgrade ? (
              "Loading..."
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Upgrade to Signal Insight
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleManageBilling}
            disabled={isLoadingPortal}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border-gold)]/30 bg-card px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-card/80 disabled:opacity-50"
          >
            {isLoadingPortal ? (
              "Loading..."
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Manage Billing
                <ExternalLink className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Upgrade prompt for free tier */}
      {tier === "free" && (
        <div className="rounded-lg border border-[var(--border-gold)]/20 bg-[var(--color-gold)]/5 p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Upgrade to Signal Insight</strong>{" "}
            for personalized AI interpretations that analyze your mood, notes,
            and sighting history to reveal deeper meanings.
          </p>
        </div>
      )}
    </motion.div>
  );
}
