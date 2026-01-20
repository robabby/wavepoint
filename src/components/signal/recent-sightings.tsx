"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { SightingWithInterpretation } from "@/lib/signal/types";
import { staggerContainerVariants, fadeUpVariants } from "./animation-config";

export interface RecentSightingsProps {
  sightings: SightingWithInterpretation[];
  isLoading?: boolean;
}

/**
 * Recent sightings list for Signal dashboard.
 * Shows individual sightings with links to detail pages.
 */
export function RecentSightings({ sightings, isLoading }: RecentSightingsProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg bg-[var(--color-warm-charcoal)]/30"
          />
        ))}
      </div>
    );
  }

  if (sightings.length === 0) {
    return (
      <p className="py-8 text-center text-[var(--color-dim)]">
        No recent sightings
      </p>
    );
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {sightings.map((sighting) => (
        <motion.div key={sighting.id} variants={fadeUpVariants}>
          <Link
            href={`/signal/sighting/${sighting.id}`}
            className={cn(
              "flex items-center justify-between rounded-lg p-4",
              "border border-[var(--border-gold)]/20 bg-[var(--color-warm-charcoal)]/30",
              "transition-colors hover:border-[var(--color-gold)]/40 hover:bg-[var(--color-warm-charcoal)]/50"
            )}
          >
            <div className="flex items-center gap-4">
              <span className="font-display text-xl text-[var(--color-gold)]">
                {sighting.number}
              </span>
              {sighting.moodTags && sighting.moodTags.length > 0 && (
                <span className="text-sm text-[var(--color-dim)]">
                  {sighting.moodTags.slice(0, 2).join(", ")}
                </span>
              )}
            </div>
            <span className="text-xs text-[var(--color-dim)]">
              {formatDistanceToNow(new Date(sighting.timestamp), {
                addSuffix: true,
              })}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
