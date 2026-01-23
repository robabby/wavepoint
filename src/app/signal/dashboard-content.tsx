"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Settings } from "lucide-react";
import { useSightings, useStats, useHeatmap, useCreateSighting } from "@/hooks/signal";
import type { DelightMoment } from "@/lib/signal/delight";
import type { MoodOption } from "@/lib/signal/schemas";
import {
  ActivityHeatmap,
  DelightToast,
  getDateRangeStart,
  InlineCaptureInput,
  RecentSightings,
  SignalBackground,
  SightingFilters,
  StatsSummary,
  StreakStats,
  YourNumbers,
  type DateRangeId,
} from "@/components/signal";

export function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const numberFilter = searchParams.get("number");
  const dateRange = (searchParams.get("range") as DateRangeId) ?? "all";
  const dateRangeStart = getDateRangeStart(dateRange);
  const [delight, setDelight] = useState<DelightMoment | null>(null);

  const {
    totalSightings,
    uniqueNumbers,
    numberCounts,
    isLoading: statsLoading,
  } = useStats();

  const { createSighting, isCreating } = useCreateSighting();

  const {
    dailyCounts,
    streaks,
    isLoading: heatmapLoading,
  } = useHeatmap();

  const { sightings, isLoading: sightingsLoading } = useSightings({
    number: numberFilter ?? undefined,
    since: dateRangeStart,
    limit: 10,
  });

  const handleSelectNumber = useCallback(
    (number: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("number", number);
      router.push(`/signal?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleQuickCapture = useCallback(
    async (number: string, moods?: string[]) => {
      const result = await createSighting({
        number,
        moodTags: moods as MoodOption[] | undefined,
      });
      if (result.delight) {
        setDelight(result.delight);
      }
    },
    [createSighting]
  );

  const handleDismissDelight = useCallback(() => {
    setDelight(null);
  }, []);

  // Transform numberCounts for CollectionGrid
  const gridStats = numberCounts.map((nc) => ({
    number: nc.number,
    count: nc.count,
    lastSeen: nc.lastSeen,
  }));

  const isEmpty = totalSightings === 0 && !statsLoading;

  return (
    <div className="relative min-h-screen">
      <SignalBackground />

      <div className="container relative z-10 mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-center gap-3">
            <h1 className="font-display text-4xl text-[var(--color-gold)]">
              Signal
            </h1>
            <Link
              href="/signal/settings"
              aria-label="Settings"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
          <p className="mt-2 text-center text-muted-foreground">
            Your angel number collection
          </p>
        </header>

        {/* Stats Summary */}
        <StatsSummary
          totalSightings={totalSightings}
          uniqueNumbers={uniqueNumbers}
          isLoading={statsLoading}
        />

        {/* Quick Capture - show for all users when not filtering */}
        {!numberFilter && (
          <section className="mb-8">
            <InlineCaptureInput
              userNumbers={numberCounts}
              onCapture={handleQuickCapture}
              isCapturing={isCreating}
            />
          </section>
        )}

        {/* Delight Toast */}
        <DelightToast delight={delight} onDismiss={handleDismissDelight} />

        {/* Activity Section - only show when user has data */}
        {!isEmpty && !numberFilter && (
          <section className="mb-8">
            <h2 className="mb-4 font-heading text-xl text-foreground">
              Activity
            </h2>
            <div className="rounded-lg border border-[var(--border-gold)]/20 bg-card/50 p-4">
              <StreakStats
                currentStreak={streaks.current}
                longestStreak={streaks.longest}
                totalActiveDays={streaks.totalActiveDays}
                isLoading={heatmapLoading}
              />
              <div className="mt-4 border-t border-[var(--border-gold)]/10 pt-4">
                <ActivityHeatmap
                  dailyCounts={dailyCounts}
                  isLoading={heatmapLoading}
                />
              </div>
            </div>
          </section>
        )}

        {isEmpty ? (
          // Empty state - first time user
          <div className="py-12 text-center">
            <p className="mb-6 text-muted-foreground">
              You haven&apos;t captured any signals yet.
            </p>
            <Link
              href="/signal/capture"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-6 py-3 font-heading text-sm uppercase tracking-wide text-primary-foreground transition-colors hover:bg-[var(--color-gold-bright)]"
            >
              <Plus className="h-4 w-4" />
              Capture Your First Signal
            </Link>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <section className="mb-6">
              <SightingFilters />
            </section>

            {/* Recent Sightings */}
            <section className="mb-8">
              <h2 className="mb-4 font-heading text-xl text-foreground">
                {numberFilter
                  ? `Sightings of ${numberFilter}`
                  : dateRange !== "all"
                    ? `Recent Sightings (${dateRange === "week" ? "This Week" : "This Month"})`
                    : "Recent Sightings"}
              </h2>
              <RecentSightings
                sightings={sightings}
                isLoading={sightingsLoading}
              />
            </section>

            {/* Your Numbers - only show when not filtered */}
            {!numberFilter && (
              <section className="mb-24">
                <h2 className="mb-4 font-heading text-xl text-foreground">
                  Your Numbers
                </h2>
                <YourNumbers
                  stats={gridStats}
                  onSelectNumber={handleSelectNumber}
                  isLoading={statsLoading}
                />
              </section>
            )}
          </>
        )}

        {/* Fixed CTA button */}
        {!isEmpty && (
          <div className="fixed bottom-8 left-0 right-0 flex justify-center">
            <Link
              href="/signal/capture"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-6 py-3 font-heading text-sm uppercase tracking-wide text-primary-foreground shadow-lg transition-all hover:bg-[var(--color-gold-bright)] hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Capture Signal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
