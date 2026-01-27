"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/profile";
import { useTransits } from "@/hooks/calendar";
import { usePatterns } from "@/hooks/patterns";
import { ProfilePromptCard } from "@/components/signal";
import { PLANET_META, ASPECT_META } from "@/lib/astrology/constants";
import type { Transit } from "@/lib/transits";

/**
 * Section 2: Personal Focus
 *
 * - If profile exists: Top 2 transits affecting user today
 * - If no profile: Prompt to add birth info
 * - Pattern-based guidance when patterns exist
 */
export function PersonalFocusSection() {
  const { hasProfile, isLoading: profileLoading } = useProfile();
  const today = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0] ?? "";
  }, []);
  const { transits, isLoading: transitsLoading, hasNoProfile } = useTransits(today);
  const { patterns } = usePatterns();

  // Get top 2 most significant transits
  const topTransits = useMemo(() => {
    if (!transits || transits.length === 0) return [];
    // Sort by: exact first, then by orb
    return [...transits]
      .sort((a, b) => {
        if (a.isExact !== b.isExact) return a.isExact ? -1 : 1;
        return a.orb - b.orb;
      })
      .slice(0, 2);
  }, [transits]);

  // Get pattern-based guidance
  const patternGuidance = useMemo(() => {
    if (!patterns) return null;

    // Look for activity correlation insights (NumbersForActivityInsight type)
    const activityInsight = patterns.activityCorrelation.find(
      (i) => i.key.endsWith("_numbers")
    );
    if (activityInsight && "numbers" in activityInsight.value) {
      const activity = activityInsight.value.activity;
      const topNumber = activityInsight.value.numbers[0];
      if (topNumber) {
        return {
          text: `You tend to see ${topNumber.number} during ${activity}`,
          suggestion: "Notice it today?",
        };
      }
    }

    // Fallback to time distribution
    const timeInsight = patterns.timeDistribution.find(
      (i) => i.key === "peak_hour"
    );
    if (timeInsight && timeInsight.value) {
      const { label, percentage } = timeInsight.value;
      return {
        text: `${percentage}% of your sightings happen around ${label}`,
        suggestion: "Stay present during this time",
      };
    }

    return null;
  }, [patterns]);

  // Loading state
  if (profileLoading) {
    return (
      <section className="rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        </div>
      </section>
    );
  }

  // No profile state
  if (!hasProfile || hasNoProfile) {
    return (
      <section>
        <ProfilePromptCard />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <h2 className="font-heading text-lg text-foreground">Personal Focus</h2>

      {/* Transits */}
      {transitsLoading ? (
        <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-48 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ) : topTransits.length > 0 ? (
        <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-4">
          <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
            Today&apos;s Transits
          </p>
          <div className="space-y-2">
            {topTransits.map((transit, i) => (
              <TransitRow key={i} transit={transit} />
            ))}
          </div>
          <Link
            href={`/calendar/day/${today}`}
            className="mt-3 inline-block text-xs text-muted-foreground hover:text-[var(--color-gold)]"
          >
            View all transits →
          </Link>
        </div>
      ) : null}

      {/* Pattern-based guidance */}
      {patternGuidance && (
        <div className="rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 text-[var(--color-gold)]" />
            <div>
              <p className="text-sm text-foreground">{patternGuidance.text}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {patternGuidance.suggestion}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function TransitRow({ transit }: { transit: Transit }) {
  const transitingPlanet =
    PLANET_META[transit.transitingPlanet as keyof typeof PLANET_META];
  const natalPoint =
    PLANET_META[transit.natalPoint as keyof typeof PLANET_META];
  const aspect = ASPECT_META[transit.aspectType];

  const transitName = transitingPlanet?.name ?? transit.transitingPlanet;
  const natalName = natalPoint?.name ?? transit.natalPoint;
  const aspectName = aspect?.name ?? transit.aspectType;

  // Color based on aspect nature
  const dotColor = useMemo(() => {
    switch (aspect?.nature) {
      case "harmonious":
        return "bg-emerald-500";
      case "challenging":
        return "bg-[var(--color-copper)]";
      default:
        return "bg-[var(--color-gold)]";
    }
  }, [aspect?.nature]);

  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", dotColor)} />
      <span className="text-sm text-foreground">
        {transitName} {aspectName} your {natalName}
      </span>
      {transit.isExact && (
        <span className="rounded-full bg-[var(--color-gold)]/20 px-1.5 py-0.5 text-[10px] text-[var(--color-gold)]">
          Exact
        </span>
      )}
    </div>
  );
}
