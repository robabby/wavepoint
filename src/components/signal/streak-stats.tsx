"use client";

import { motion } from "motion/react";
import { fadeUpVariants } from "./animation-config";

export interface StreakStatsProps {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  isLoading?: boolean;
}

/**
 * Streak stats display for Signal dashboard.
 * Shows current streak, longest streak, and total active days.
 */
export function StreakStats({
  currentStreak,
  longestStreak,
  totalActiveDays,
  isLoading,
}: StreakStatsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center gap-6 py-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse text-center">
            <div className="mx-auto h-6 w-16 rounded bg-card" />
            <div className="mx-auto mt-1 h-3 w-12 rounded bg-card" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap justify-center gap-6 py-4"
    >
      <div className="text-center">
        <div className="font-display text-2xl text-[var(--color-gold)]">
          {currentStreak > 0 ? `${currentStreak}` : "—"}
        </div>
        <div className="text-xs text-muted-foreground">
          {currentStreak === 1 ? "day streak" : "day streak"}
        </div>
      </div>

      <div className="w-px bg-[var(--border-gold)]/30" />

      <div className="text-center">
        <div className="font-display text-2xl text-[var(--color-gold)]">
          {longestStreak > 0 ? longestStreak : "—"}
        </div>
        <div className="text-xs text-muted-foreground">best streak</div>
      </div>

      <div className="w-px bg-[var(--border-gold)]/30" />

      <div className="text-center">
        <div className="font-display text-2xl text-[var(--color-gold)]">
          {totalActiveDays > 0 ? totalActiveDays : "—"}
        </div>
        <div className="text-xs text-muted-foreground">
          {totalActiveDays === 1 ? "day active" : "days active"}
        </div>
      </div>
    </motion.div>
  );
}
