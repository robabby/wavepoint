"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEphemeris } from "@/hooks/calendar";
import { MoonPhaseHero } from "@/components/calendar/moon-phase-hero";
import { CosmicWeather } from "@/components/calendar/cosmic-weather";
import { PersonalTransits } from "@/components/calendar/personal-transits";
import { JournalSection } from "@/components/calendar/journal-section";
import { SightingsSection } from "@/components/calendar/sightings-section";
import { DayNavigation } from "@/components/calendar/day-navigation";
import type { MoonPhase } from "@/lib/signal/cosmic-context";

interface DayViewContentProps {
  /** Date in YYYY-MM-DD format */
  date: string;
}

/**
 * Day view content with cosmic weather and sightings.
 *
 * Client component that fetches ephemeris data and renders the day detail.
 */
export function DayViewContent({ date }: DayViewContentProps) {
  const { ephemeris, isLoading, isError } = useEphemeris(date);

  const parsedDate = parseISO(date);
  const formattedDate = format(parsedDate, "EEEE, MMMM d, yyyy");
  const monthKey = format(parsedDate, "yyyy-MM");

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          {/* Header skeleton */}
          <div className="mb-8 flex items-center gap-4">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-card/30" />
            <div className="h-6 w-48 animate-pulse rounded bg-card/30" />
          </div>

          {/* Moon hero skeleton */}
          <div className="relative mb-8 h-64 animate-pulse rounded-xl bg-card/20" />

          {/* Content skeletons */}
          <div className="space-y-6">
            <div className="h-48 animate-pulse rounded-xl bg-card/20" />
            <div className="h-32 animate-pulse rounded-xl bg-card/20" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !ephemeris) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <BackLink monthKey={monthKey} />

          <div className="mt-12 flex flex-col items-center text-center">
            <p className="text-muted-foreground mb-4">
              Unable to load cosmic data for this date
            </p>
            <Link
              href={`/calendar?month=${monthKey}`}
              className={cn(
                "rounded-lg px-4 py-2",
                "border border-[var(--color-gold)]/30 bg-card/40",
                "text-sm text-muted-foreground transition-colors",
                "hover:border-[var(--color-gold)]/50 hover:text-foreground"
              )}
            >
              Return to Calendar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <header className="mb-6">
          {/* Top row: Back link and day navigation */}
          <div className="flex items-center justify-between mb-3">
            <BackLink monthKey={monthKey} />
            <DayNavigation date={date} />
          </div>

          {/* Date heading - centered */}
          <h1 className="font-heading text-xl text-center text-foreground">
            {formattedDate}
          </h1>
        </header>

        {/* Moon Phase Hero */}
        <div className="relative mb-8 overflow-hidden rounded-xl border border-[var(--border-gold)]/20 bg-card/40 backdrop-blur-sm">
          <MoonPhaseHero
            phase={ephemeris.moon.phase as MoonPhase}
            sign={ephemeris.moon.sign}
            degree={ephemeris.moon.degree}
          />
        </div>

        {/* Two-column layout on larger screens */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Cosmic Weather + Personal Transits */}
          <div className="space-y-6">
            <CosmicWeather context={ephemeris} />
            <PersonalTransits date={date} />
          </div>

          {/* Sightings + Journal */}
          <div>
            <SightingsSection date={date} />

            {/* Journal */}
            <JournalSection date={date} className="mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Back link to calendar month view.
 */
function BackLink({ monthKey }: { monthKey: string }) {
  return (
    <Link
      href={`/calendar?month=${monthKey}`}
      aria-label="Back to calendar"
      className={cn(
        "flex items-center gap-1 text-sm text-muted-foreground",
        "transition-colors hover:text-foreground",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/60 focus-visible:rounded"
      )}
    >
      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      <span>Back</span>
    </Link>
  );
}
