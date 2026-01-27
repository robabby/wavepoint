"use client";

import { cn } from "@/lib/utils";
import { getSignGlyph, formatDegree } from "@/lib/signal/cosmic-context";
import { formatEclipseType } from "@/lib/eclipses";
import type { Eclipse } from "@/lib/eclipses";

interface EclipseCardProps {
  /** Eclipse data */
  eclipse: Eclipse;
  /** Optional className */
  className?: string;
}

/**
 * Eclipse details card for day view.
 *
 * A dramatic, atmospheric presentation of eclipse information including:
 * - Eclipse type badge with category glyph
 * - Zodiac position with glyph and degree
 * - Rich astrological interpretation
 * - Theme keywords as tags
 *
 * Penumbral eclipses receive lighter visual treatment.
 */
export function EclipseCard({ eclipse, className }: EclipseCardProps) {
  const isPenumbral = eclipse.isPenumbral;

  // Capitalize sign name
  const signName = eclipse.sign.charAt(0).toUpperCase() + eclipse.sign.slice(1);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        "border bg-card/40 backdrop-blur-sm",
        isPenumbral
          ? "border-[var(--border-eclipse)]/30"
          : "border-[var(--border-eclipse)]/50",
        className
      )}
    >
      {/* Radial glow behind content - subtle for penumbral */}
      <div
        className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 h-32 w-64",
          isPenumbral ? "opacity-15" : "opacity-30"
        )}
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-eclipse) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Gradient background */}
      <div
        className={cn(
          "absolute inset-0",
          isPenumbral
            ? "bg-gradient-to-b from-[var(--color-eclipse)]/5 to-transparent"
            : "bg-gradient-to-b from-[var(--color-eclipse)]/10 to-transparent"
        )}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative">
        {/* Eclipse type badge - prominent */}
        <div className="pt-6 text-center">
          <span
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full",
              "border text-sm font-medium",
              isPenumbral
                ? "bg-[var(--color-eclipse)]/10 border-[var(--border-eclipse)]/30 text-[var(--color-eclipse)]/80"
                : "bg-[var(--color-eclipse)]/20 border-[var(--border-eclipse)]/50 text-[var(--color-eclipse-bright)]"
            )}
          >
            <span
              className="text-base"
              style={{
                filter: isPenumbral
                  ? undefined
                  : "drop-shadow(0 0 4px var(--glow-eclipse))",
              }}
            >
              {eclipse.category === "solar" ? "☉" : "☽"}
            </span>
            {formatEclipseType(eclipse.type)}
          </span>
        </div>

        {/* Zodiac position - centered */}
        <div className="mt-4 text-center">
          <span
            className={cn(
              "text-3xl",
              isPenumbral
                ? "text-[var(--color-eclipse)]/70"
                : "text-[var(--color-eclipse)]"
            )}
            style={{
              filter: isPenumbral
                ? undefined
                : "drop-shadow(0 0 8px var(--glow-eclipse))",
            }}
          >
            {getSignGlyph(eclipse.sign)}
          </span>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDegree(eclipse.degree)} {signName}
          </p>
        </div>

        {/* Title and essence */}
        <div className="px-6 py-4 mt-2 text-center">
          <h3 className="font-heading text-lg text-foreground">
            {eclipse.title}
          </h3>
          <p
            className={cn(
              "text-xs uppercase tracking-[0.15em] mt-1",
              isPenumbral
                ? "text-[var(--color-eclipse)]/60"
                : "text-[var(--color-eclipse)]"
            )}
          >
            {eclipse.essence}
          </p>
        </div>

        {/* Rich interpretation */}
        <div className="px-6 pb-4 border-t border-[var(--border-eclipse)]/20 pt-4">
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            {eclipse.interpretation}
          </p>
        </div>

        {/* Theme tags */}
        <div className="px-6 pb-6 flex flex-wrap justify-center gap-2">
          {eclipse.themes.map((theme) => (
            <span
              key={theme}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs",
                isPenumbral
                  ? "bg-[var(--color-eclipse)]/8 text-[var(--color-eclipse)]/70"
                  : "bg-[var(--color-eclipse)]/15 text-[var(--color-eclipse)]"
              )}
            >
              {theme}
            </span>
          ))}
        </div>

        {/* Saros cycle info - subtle footer */}
        <div className="px-6 pb-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/50">
            Saros {eclipse.saros} · {eclipse.timeUtc} UTC
          </p>
        </div>
      </div>
    </div>
  );
}
