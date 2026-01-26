"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { format, parseISO, isSameDay } from "date-fns";
import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSightings } from "@/hooks/signal";
import { fadeUpVariants } from "@/components/signal/animation-config";

interface SightingsSectionProps {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Optional className */
  className?: string;
}

/**
 * Sightings section for day view.
 *
 * Shows all angel number sightings captured on the given day.
 * Links to individual sighting detail pages.
 */
export function SightingsSection({ date, className }: SightingsSectionProps) {
  // Memoize the date to prevent query key changes on every render
  // We only care about the date, not the exact time, so round to start of day
  const ninetyDaysAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    d.setHours(0, 0, 0, 0); // Normalize to midnight for stable query key
    return d;
  }, []);

  const { sightings, isLoading } = useSightings({ since: ninetyDaysAgo });

  // Filter to sightings on this specific day
  const targetDate = parseISO(date);
  const daySightings = sightings.filter((s) =>
    isSameDay(new Date(s.timestamp), targetDate)
  );

  return (
    <section className={className}>
      <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
        Sightings
      </h3>

      <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/40 backdrop-blur-sm p-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-card/30"
              />
            ))}
          </div>
        ) : daySightings.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center py-6 text-center">
            <Radio className="h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              No angel numbers captured this day
            </p>
            <Link
              href="/signal/capture"
              className={cn(
                "inline-flex items-center gap-2 rounded-full",
                "border border-[var(--color-gold)]/30 bg-card/50",
                "px-4 py-2 text-sm text-muted-foreground",
                "transition-colors hover:border-[var(--color-gold)]/50 hover:text-foreground"
              )}
            >
              Capture a Sighting
            </Link>
          </div>
        ) : (
          // Sightings list
          <motion.div
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {daySightings.map((sighting) => (
              <motion.div key={sighting.id} variants={fadeUpVariants}>
                <Link
                  href={`/signal/sighting/${sighting.id}`}
                  className={cn(
                    "flex items-center justify-between rounded-lg p-3",
                    "border border-[var(--border-gold)]/10 bg-card/30",
                    "transition-colors hover:border-[var(--color-gold)]/30 hover:bg-card/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg text-[var(--color-gold)]">
                      {sighting.number}
                    </span>
                    {sighting.moodTags && sighting.moodTags.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {sighting.moodTags.slice(0, 2).join(", ")}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(sighting.timestamp), "h:mm a")}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
