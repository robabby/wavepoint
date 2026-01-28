"use client";

import Link from "next/link";
import { Plus, List, Home } from "lucide-react";
import { useStats } from "@/hooks/signal";
import { SignalBackground } from "@/components/signal";
import { cn } from "@/lib/utils";

/**
 * Signal feature preview hub for authenticated users.
 * Shows stats summary and quick links to Signal-related pages.
 */
export function SignalFeatureHub() {
  const { totalSightings, numberCounts, uniqueNumbers, isLoading } = useStats();

  const topNumbers = numberCounts.slice(0, 3);

  return (
    <div className="relative min-h-screen">
      <SignalBackground />

      <div className="container relative z-10 mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="font-display text-5xl text-[var(--color-gold)]">
            Signal
          </h1>
          <p className="mt-3 text-muted-foreground">
            Track your angel number synchronicities
          </p>
        </header>

        {/* Stats summary */}
        {!isLoading && totalSightings > 0 && (
          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-4 text-center">
              <p className="font-display text-2xl text-[var(--color-gold)]">
                {totalSightings}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Total Sightings
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-4 text-center">
              <p className="font-display text-2xl text-[var(--color-gold)]">
                {topNumbers[0]?.number ?? "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Top Number
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-4 text-center">
              <p className="font-display text-2xl text-[var(--color-gold)]">
                {uniqueNumbers}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Unique Numbers
              </p>
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="space-y-3">
          <Link
            href="/capture"
            className={cn(
              "flex items-center gap-4 rounded-xl p-5",
              "border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10",
              "transition-all hover:border-[var(--color-gold)]/50 hover:bg-[var(--color-gold)]/20"
            )}
          >
            <Plus className="h-6 w-6 text-[var(--color-gold)]" />
            <div>
              <p className="font-heading text-sm font-medium text-foreground">
                Capture a Sighting
              </p>
              <p className="text-xs text-muted-foreground">
                Record a new angel number encounter
              </p>
            </div>
          </Link>

          <Link
            href="/sightings"
            className={cn(
              "flex items-center gap-4 rounded-xl p-5",
              "border border-[var(--border-gold)]/20 bg-card/30",
              "transition-all hover:border-[var(--border-gold)]/40 hover:bg-card/50"
            )}
          >
            <List className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="font-heading text-sm font-medium text-foreground">
                Browse Sightings
              </p>
              <p className="text-xs text-muted-foreground">
                Search and filter your sighting history
              </p>
            </div>
          </Link>

          <Link
            href="/home"
            className={cn(
              "flex items-center gap-4 rounded-xl p-5",
              "border border-[var(--border-gold)]/20 bg-card/30",
              "transition-all hover:border-[var(--border-gold)]/40 hover:bg-card/50"
            )}
          >
            <Home className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="font-heading text-sm font-medium text-foreground">
                View Dashboard
              </p>
              <p className="text-xs text-muted-foreground">
                Cosmic context, quick actions, and recent activity
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
