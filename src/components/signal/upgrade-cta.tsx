"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { fadeUpVariants } from "./animation-config";

/**
 * Upgrade CTA component for free tier users.
 * Displays a compelling prompt to upgrade to Signal Insight.
 */
export function UpgradeCta() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--color-gold)]/5 p-6"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-[var(--color-gold)]/10 p-2">
          <Sparkles className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-heading text-lg text-foreground">
              Want a personalized interpretation?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Signal Insight analyzes your mood, notes, and history to reveal
              what this number means for you.
            </p>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-black transition-all hover:bg-[var(--color-gold)]/90 disabled:opacity-50"
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Upgrade to Signal Insight
              </>
            )}
          </button>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </div>
    </motion.div>
  );
}
