"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/profile";
import { useTransits } from "@/hooks/calendar";
import { usePatterns } from "@/hooks/patterns";
import { ProfilePromptCard } from "@/components/signal";
import { ConstellationDashboardCard } from "@/components/constellation";
import { PLANET_META, ASPECT_META } from "@/lib/astrology/constants";
import { getNumberMeaning } from "@/lib/numerology";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { Transit } from "@/lib/transits";

/**
 * Section 2: Personal Focus
 *
 * - If profile exists: Top 2 transits affecting user today + numerology cycles
 * - If no profile: Prompt to add birth info
 * - Pattern-based guidance when patterns exist
 */
export function PersonalFocusSection() {
  const { hasProfile, numerology, isLoading: profileLoading } = useProfile();
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

      {/* Numerology Cycles */}
      {numerology?.personalDay != null && (
        <NumerologyCyclesCard
          personalDay={numerology.personalDay}
          personalMonth={numerology.personalMonth}
          personalYear={numerology.personalYear}
          lifePath={numerology.lifePath}
        />
      )}

      {/* Archetypal Constellation */}
      <ConstellationDashboardCard />

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

function NumerologyCyclesCard({
  personalDay,
  personalMonth,
  personalYear,
  lifePath,
}: {
  personalDay: number;
  personalMonth: number;
  personalYear: number;
  lifePath: number | null;
}) {
  const dayMeaning = getNumberMeaning(personalDay);
  const monthMeaning = getNumberMeaning(personalMonth);
  const yearMeaning = getNumberMeaning(personalYear);

  return (
    <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Today&apos;s Cycles
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-72 space-y-1.5 py-2">
              <p>Personal cycles are derived from your birth date using numerological reduction.</p>
              <p className="font-medium">Year: reduce(birth month + birth day + current year)</p>
              <p className="font-medium">Month: reduce(personal year + current month)</p>
              <p className="font-medium">Day: reduce(personal month + current day)</p>
              <p className="text-muted-foreground">Each sum is reduced to a single digit (1–9).</p>
            </TooltipContent>
          </Tooltip>
        </div>
        {lifePath != null && (
          <Link
            href="/numerology"
            className="text-xs text-[var(--color-gold)] hover:underline"
          >
            LP {lifePath} →
          </Link>
        )}
      </div>

      <div className="space-y-2">
        {/* Personal Day - primary */}
        <Link href={`/numerology/${personalDay}`} className="group/cycle block">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-gold)]" />
            <span className="font-display text-lg text-foreground">{personalDay}</span>
            <span className="text-sm text-foreground group-hover/cycle:text-[var(--color-gold)] transition-colors">
              {dayMeaning?.name ?? `Digit ${personalDay}`}
            </span>
          </div>
          {dayMeaning && (
            <p className="ml-4 text-xs text-muted-foreground">
              {dayMeaning.keywords.slice(0, 3).join(" · ")}
            </p>
          )}
        </Link>

        {/* Personal Month */}
        <Link href={`/numerology/${personalMonth}`} className="group/cycle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            <span className="text-sm text-foreground">{personalMonth}</span>
            <span className="text-sm text-foreground group-hover/cycle:text-[var(--color-gold)] transition-colors">
              {monthMeaning?.name ?? `Digit ${personalMonth}`}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Month</span>
        </Link>

        {/* Personal Year */}
        <Link href={`/numerology/${personalYear}`} className="group/cycle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            <span className="text-sm text-foreground">{personalYear}</span>
            <span className="text-sm text-foreground group-hover/cycle:text-[var(--color-gold)] transition-colors">
              {yearMeaning?.name ?? `Digit ${personalYear}`}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Year</span>
        </Link>
      </div>

      <Link
        href="/numerology"
        className="mt-3 inline-block text-xs text-muted-foreground hover:text-[var(--color-gold)]"
      >
        View full numerology →
      </Link>
    </div>
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
