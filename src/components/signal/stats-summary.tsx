"use client";

import { motion } from "motion/react";
import { fadeUpVariants } from "./animation-config";

export interface StatsSummaryProps {
  totalSightings: number;
  uniqueNumbers: number;
  isLoading?: boolean;
}

/**
 * Stats summary display for Signal dashboard.
 * Shows total sightings and unique numbers count.
 */
export function StatsSummary({
  totalSightings,
  uniqueNumbers,
  isLoading,
}: StatsSummaryProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center gap-8 py-6 mb-8">
        <div className="animate-pulse text-center">
          <div className="mx-auto h-8 w-12 rounded bg-[var(--color-warm-charcoal)]" />
          <div className="mx-auto mt-2 h-3 w-20 rounded bg-[var(--color-warm-charcoal)]" />
        </div>
        <div className="w-px bg-[var(--border-gold)]/30" />
        <div className="animate-pulse text-center">
          <div className="mx-auto h-8 w-12 rounded bg-[var(--color-warm-charcoal)]" />
          <div className="mx-auto mt-2 h-3 w-20 rounded bg-[var(--color-warm-charcoal)]" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="flex justify-center gap-8 py-6 mb-8"
    >
      <div className="text-center">
        <div className="font-display text-3xl text-[var(--color-gold)]">
          {totalSightings}
        </div>
        <div className="text-xs text-[var(--color-dim)] uppercase tracking-wide">
          Total Sightings
        </div>
      </div>
      <div className="w-px bg-[var(--border-gold)]/30" />
      <div className="text-center">
        <div className="font-display text-3xl text-[var(--color-gold)]">
          {uniqueNumbers}
        </div>
        <div className="text-xs text-[var(--color-dim)] uppercase tracking-wide">
          Unique Numbers
        </div>
      </div>
    </motion.div>
  );
}
