"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Flame, Wind, Droplets, Mountain, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStats, useHeatmap } from "@/hooks/signal";
import { StreakStats } from "@/components/signal";
import { getPatternPlanetaryMeta } from "@/lib/numbers/planetary";

// Only include classical elements (excluding ether)
type ClassicalElement = "fire" | "earth" | "air" | "water";

/**
 * Section 5: Fingerprint Summary
 *
 * - Top 3 numbers with counts
 * - Dominant element (computed from number resonances)
 * - Streak/activity stats
 * - Link to full /profile fingerprint view
 */
export function FingerprintSummarySection() {
  const { numberCounts, isLoading: statsLoading } = useStats();
  const { streaks, isLoading: heatmapLoading } = useHeatmap();

  // Get top 3 numbers
  const topNumbers = useMemo(() => {
    return numberCounts.slice(0, 3);
  }, [numberCounts]);

  // Compute dominant element from top numbers
  const dominantElement = useMemo(() => {
    if (topNumbers.length === 0) return null;

    const elementCounts: Record<string, number> = {
      fire: 0,
      earth: 0,
      air: 0,
      water: 0,
    };

    for (const nc of topNumbers) {
      const meta = getPatternPlanetaryMeta(nc.number);
      const element = meta.primaryElement;
      if (element && element !== "ether" && elementCounts[element] !== undefined) {
        elementCounts[element] += nc.count;
      }
    }

    // Find the element with highest count
    let maxElement: ClassicalElement | null = null;
    let maxCount = 0;
    for (const [element, count] of Object.entries(elementCounts)) {
      if (count > maxCount) {
        maxElement = element as ClassicalElement;
        maxCount = count;
      }
    }

    return maxElement;
  }, [topNumbers]);

  const isLoading = statsLoading || heatmapLoading;
  const isEmpty = !isLoading && topNumbers.length === 0;

  if (isEmpty) {
    return null; // Don't show section if no data
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg text-foreground">
          Your Fingerprint
        </h2>
        <Link
          href="/profile"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-[var(--color-gold)]"
        >
          View full profile
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-4">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 w-16 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Numbers */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                Top Numbers
              </p>
              <div className="flex gap-3">
                {topNumbers.map((nc, i) => (
                  <TopNumberBadge
                    key={nc.number}
                    number={nc.number}
                    count={nc.count}
                    rank={i + 1}
                  />
                ))}
              </div>
            </div>

            {/* Dominant Element */}
            {dominantElement && (
              <div>
                <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                  Dominant Element
                </p>
                <ElementBadge element={dominantElement} />
              </div>
            )}

            {/* Streak Stats */}
            <div className="border-t border-[var(--border-gold)]/10 pt-4">
              <StreakStats
                currentStreak={streaks.current}
                longestStreak={streaks.longest}
                totalActiveDays={streaks.totalActiveDays}
                isLoading={heatmapLoading}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TopNumberBadge({
  number,
  count,
  rank,
}: {
  number: string;
  count: number;
  rank: number;
}) {
  return (
    <Link
      href={`/numbers/${number}`}
      className={cn(
        "flex flex-col items-center rounded-lg p-3",
        "border border-[var(--border-gold)]/20 bg-card/30",
        "transition-all hover:border-[var(--color-gold)]/40 hover:bg-[var(--color-gold)]/10",
        rank === 1 && "border-[var(--color-gold)]/30"
      )}
    >
      <span
        className={cn(
          "font-display text-xl",
          rank === 1 ? "text-[var(--color-gold)]" : "text-foreground"
        )}
      >
        {number}
      </span>
      <span className="mt-1 text-[10px] text-muted-foreground">
        {count}x
      </span>
    </Link>
  );
}

const ELEMENT_CONFIG: Record<
  ClassicalElement,
  { icon: typeof Flame; color: string; label: string }
> = {
  fire: { icon: Flame, color: "text-orange-400", label: "Fire" },
  earth: { icon: Mountain, color: "text-amber-600", label: "Earth" },
  air: { icon: Wind, color: "text-sky-400", label: "Air" },
  water: { icon: Droplets, color: "text-blue-400", label: "Water" },
};

function ElementBadge({ element }: { element: ClassicalElement }) {
  const config = ELEMENT_CONFIG[element];
  const Icon = config.icon;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-gold)]/20 bg-card/30 px-3 py-1.5">
      <Icon className={cn("h-4 w-4", config.color)} />
      <span className="text-sm font-medium text-foreground">{config.label}</span>
    </div>
  );
}
