"use client";

import { cn } from "@/lib/utils";
import { useTransits } from "@/hooks/calendar";
import { ProfilePromptCard } from "@/components/signal/profile-prompt-card";
import {
  getPlanetGlyph,
  getAspectSymbol,
} from "@/lib/signal/cosmic-context";
import { PLANET_META, type CelestialBodyId, type AngleId } from "@/lib/astrology/constants";
import type { Transit } from "@/lib/transits";

interface PersonalTransitsProps {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Optional className */
  className?: string;
}

/**
 * Get display name for a natal point (planet or angle).
 */
function getNatalPointName(point: CelestialBodyId | AngleId): string {
  if (point === "ascendant") return "Ascendant";
  if (point === "midheaven") return "Midheaven";
  return PLANET_META[point as CelestialBodyId]?.name ?? point;
}

/**
 * Get glyph for a natal point (planet or angle).
 */
function getNatalPointGlyph(point: CelestialBodyId | AngleId): string {
  if (point === "ascendant") return "AC";
  if (point === "midheaven") return "MC";
  return getPlanetGlyph(point);
}

/**
 * Transit row component displaying a single transit.
 */
function TransitRow({ transit }: { transit: Transit }) {
  const { transitingPlanet, natalPoint, aspectType, orb, isExact } = transit;

  return (
    <div className="flex items-center justify-between py-2">
      {/* Transit: Planet → Aspect → Natal Point */}
      <div className="flex items-center gap-2 text-sm">
        {/* Transiting planet */}
        <span className="text-[var(--color-gold)]">
          {getPlanetGlyph(transitingPlanet)}
        </span>
        <span className="text-muted-foreground/80">
          {PLANET_META[transitingPlanet as CelestialBodyId]?.name ?? transitingPlanet}
        </span>

        {/* Aspect symbol */}
        <span className="text-muted-foreground">
          {getAspectSymbol(aspectType)}
        </span>

        {/* Natal point */}
        <span className="text-[var(--color-gold)]">
          {getNatalPointGlyph(natalPoint)}
        </span>
        <span className="text-muted-foreground/80">
          {getNatalPointName(natalPoint)}
        </span>
      </div>

      {/* Orb badge */}
      <div className="flex items-center gap-2">
        {isExact && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
              "bg-[var(--color-gold)]/20 text-[var(--color-gold)]"
            )}
          >
            Exact
          </span>
        )}
        <span className="text-xs text-muted-foreground/60">
          {orb.toFixed(1)}°
        </span>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for transits section.
 */
function TransitsSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-card/30" />
            <div className="h-4 w-16 animate-pulse rounded bg-card/30" />
            <div className="h-4 w-4 animate-pulse rounded bg-card/30" />
            <div className="h-4 w-16 animate-pulse rounded bg-card/30" />
          </div>
          <div className="h-4 w-8 animate-pulse rounded bg-card/30" />
        </div>
      ))}
    </div>
  );
}

/**
 * Personal transits section for the day view.
 *
 * Shows current planetary transits to the user's natal chart.
 * Prompts profile creation if user has no spiritual profile.
 */
export function PersonalTransits({ date, className }: PersonalTransitsProps) {
  const { transits, totalCount, isLoading, hasNoProfile, hasIncompleteProfile, isError } =
    useTransits(date);

  return (
    <section className={className}>
      <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
        Personal Transits
      </h3>

      {/* Loading state */}
      {isLoading && (
        <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/40 backdrop-blur-sm p-4">
          <TransitsSkeleton />
        </div>
      )}

      {/* No profile state */}
      {!isLoading && (hasNoProfile || hasIncompleteProfile) && (
        <ProfilePromptCard
          title="See Your Personal Transits"
          description="Add your birth details to discover which planets are activating your natal chart today."
          linkText="Create your profile"
        />
      )}

      {/* Error state */}
      {!isLoading && isError && (
        <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/40 backdrop-blur-sm p-4">
          <p className="py-4 text-center text-sm text-muted-foreground/50">
            Unable to load transits
          </p>
        </div>
      )}

      {/* Transits list */}
      {!isLoading && !hasNoProfile && !hasIncompleteProfile && !isError && (
        <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/40 backdrop-blur-sm p-4">
          {transits.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground/50">
              No significant transits today
            </p>
          ) : (
            <>
              <div className="divide-y divide-[var(--border-gold)]/10">
                {transits.map((transit, i) => (
                  <TransitRow key={i} transit={transit} />
                ))}
              </div>
              {totalCount > transits.length && (
                <p className="mt-3 border-t border-[var(--border-gold)]/10 pt-3 text-center text-xs text-muted-foreground/50">
                  Showing {transits.length} of {totalCount} transits
                </p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
