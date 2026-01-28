"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useSightings } from "@/hooks/signal";
import {
  getDateRangeStart,
  RecentSightings,
  SignalBackground,
  SightingFilters,
  type DateRangeId,
} from "@/components/signal";

export function SightingsContent() {
  const searchParams = useSearchParams();
  const numberFilter = searchParams.get("number");
  const dateRange = (searchParams.get("range") as DateRangeId) ?? "all";
  const dateRangeStart = getDateRangeStart(dateRange);

  const { sightings, isLoading } = useSightings({
    number: numberFilter ?? undefined,
    since: dateRangeStart,
    limit: 50,
  });

  const isEmpty = !isLoading && sightings.length === 0;
  const hasFilters = !!numberFilter || dateRange !== "all";

  return (
    <div className="relative min-h-screen">
      <SignalBackground />

      <div className="container relative z-10 mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-4xl text-[var(--color-gold)]">
              Sightings
            </h1>
            <Link
              href="/capture"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-4 py-2 text-sm font-medium text-[var(--color-gold)] transition-all hover:border-[var(--color-gold)]/50 hover:bg-[var(--color-gold)]/20"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Capture</span>
            </Link>
          </div>
        </header>

        {/* Filters */}
        <section className="mb-8">
          <SightingFilters />
        </section>

        {/* Sightings list */}
        {isEmpty && !hasFilters ? (
          <div className="py-12 text-center">
            <p className="mb-6 text-muted-foreground">
              You haven&apos;t captured any sightings yet.
            </p>
            <Link
              href="/capture"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-6 py-3 font-heading text-sm uppercase tracking-wide text-primary-foreground transition-colors hover:bg-[var(--color-gold-bright)]"
            >
              <Plus className="h-4 w-4" />
              Capture Your First Signal
            </Link>
          </div>
        ) : (
          <section>
            <h2 className="mb-4 font-heading text-xl text-foreground">
              {numberFilter
                ? `Sightings of ${numberFilter}`
                : dateRange !== "all"
                  ? `Recent Sightings (${dateRange === "week" ? "This Week" : "This Month"})`
                  : "All Sightings"}
            </h2>
            <RecentSightings sightings={sightings} isLoading={isLoading} />
          </section>
        )}
      </div>
    </div>
  );
}
