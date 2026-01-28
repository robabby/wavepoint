"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useStats, useCreateSighting } from "@/hooks/signal";
import type { DelightMoment } from "@/lib/signal/delight";
import type { MoodOption, ActivityOption } from "@/lib/signal/schemas";
import {
  DelightToast,
  InlineCaptureInput,
  SignalBackground,
} from "@/components/signal";
import {
  CosmicContextSection,
  PersonalFocusSection,
  QuickActionsSection,
  RecentActivitySection,
  FingerprintSummarySection,
} from "@/components/dashboard";

export function DashboardContent() {
  const [delight, setDelight] = useState<DelightMoment | null>(null);

  const {
    totalSightings,
    numberCounts,
    isLoading: statsLoading,
  } = useStats();

  const { createSighting, isCreating } = useCreateSighting();

  const handleQuickCapture = useCallback(
    async (number: string, moods?: string[], activity?: string) => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const result = await createSighting({
        number,
        moodTags: moods as MoodOption[] | undefined,
        activity: activity as ActivityOption | undefined,
        tz,
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

  const isEmpty = totalSightings === 0 && !statsLoading;

  return (
    <div className="relative min-h-screen">
      <SignalBackground />

      <div className="container relative z-10 mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="w-24" />
            <h1 className="font-display text-4xl text-[var(--color-gold)]">
              Home
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

        {/* Delight Toast */}
        <DelightToast delight={delight} onDismiss={handleDismissDelight} />

        {isEmpty ? (
          // Empty state - first time user
          <div className="space-y-8">
            {/* Section 1: Cosmic Context */}
            <CosmicContextSection />

            {/* Empty state CTA */}
            <div className="py-12 text-center">
              <p className="mb-6 text-muted-foreground">
                You haven&apos;t captured any signals yet.
              </p>
              <Link
                href="/capture"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-6 py-3 font-heading text-sm uppercase tracking-wide text-primary-foreground transition-colors hover:bg-[var(--color-gold-bright)]"
              >
                <Plus className="h-4 w-4" />
                Capture Your First Signal
              </Link>
            </div>
          </div>
        ) : (
          // Default dashboard - 5 sections + link to sightings
          <div className="space-y-8">
            {/* Section 1: Today's Cosmic Context */}
            <CosmicContextSection />

            {/* Section 2: Personal Focus */}
            <PersonalFocusSection />

            {/* Section 3: Quick Actions */}
            <QuickActionsSection />

            {/* Inline capture (bonus) */}
            <section>
              <InlineCaptureInput
                userNumbers={numberCounts}
                onCapture={handleQuickCapture}
                isCapturing={isCreating}
              />
            </section>

            {/* Section 4: Recent Activity */}
            <RecentActivitySection />

            {/* Section 5: Fingerprint Summary */}
            <FingerprintSummarySection />

            {/* View all sightings link */}
            <div className="text-center">
              <Link
                href="/sightings"
                className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
              >
                View all sightings →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
