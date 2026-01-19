"use client";

import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { getOrdinal } from "./animation-config";

export interface SightingCardProps {
  number: string;
  count: number;
  lastSeenAt: Date;
  onClick: () => void;
}

/**
 * Collection card displaying a number summary.
 * Shows the number prominently with count badge and relative time.
 */
export function SightingCard({
  number,
  count,
  lastSeenAt,
  onClick,
}: SightingCardProps) {
  const ordinal = getOrdinal(count);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full p-4 rounded-xl text-left",
        "border border-[var(--border-gold)]/20",
        "bg-[var(--color-warm-charcoal)]/30",
        "hover:border-[var(--color-gold)]/40 hover:bg-[var(--color-warm-charcoal)]/50",
        "transition-all duration-200"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="font-display text-2xl text-[var(--color-gold)]">
            {number}
          </span>
          <p className="mt-1 text-xs text-[var(--color-dim)]">
            {count}
            {ordinal} sighting ·{" "}
            {formatDistanceToNow(lastSeenAt, { addSuffix: true })}
          </p>
        </div>
        {count > 1 && (
          <span className="px-2 py-0.5 rounded-full bg-[var(--color-gold)]/10 text-xs text-[var(--color-gold)]">
            ×{count}
          </span>
        )}
      </div>
    </motion.button>
  );
}
