"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useSightings, useStats } from "@/hooks/signal";
import {
  CollectionGrid,
  StatsSummary,
  RecentSightings,
  SignalBackground,
} from "@/components/signal";

export function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const numberFilter = searchParams.get("number");

  const {
    totalSightings,
    uniqueNumbers,
    numberCounts,
    isLoading: statsLoading,
  } = useStats();

  const { sightings, isLoading: sightingsLoading } = useSightings({
    number: numberFilter ?? undefined,
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

  const handleClearFilter = useCallback(() => {
    router.push("/signal", { scroll: false });
  }, [router]);

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
        <header className="mb-8 text-center">
          <h1 className="font-display text-4xl text-[var(--color-gold)]">
            Signal
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your angel number collection
          </p>
        </header>

        {/* Stats Summary */}
        <StatsSummary
          totalSightings={totalSightings}
          uniqueNumbers={uniqueNumbers}
          isLoading={statsLoading}
        />

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
            {/* Filter indicator */}
            {numberFilter && (
              <div className="mb-4 flex items-center justify-between">
                <span className="text-foreground">
                  Showing sightings of{" "}
                  <span className="font-display text-[var(--color-gold)]">
                    {numberFilter}
                  </span>
                </span>
                <button
                  onClick={handleClearFilter}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Clear filter
                </button>
              </div>
            )}

            {/* Recent Sightings */}
            <section className="mb-8">
              <h2 className="mb-4 font-heading text-xl text-foreground">
                {numberFilter ? `Sightings of ${numberFilter}` : "Recent Sightings"}
              </h2>
              <RecentSightings
                sightings={sightings}
                isLoading={sightingsLoading}
              />
            </section>

            {/* Collection Grid - only show when not filtered */}
            {!numberFilter && (
              <section className="mb-24">
                <h2 className="mb-4 font-heading text-xl text-foreground">
                  Your Collection
                </h2>
                <CollectionGrid
                  stats={gridStats}
                  onSelectNumber={handleSelectNumber}
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
