"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PlanetGlyph } from "./PlanetGlyph";
import type { PlanetPageData } from "@/lib/astrology/planets";
import { EASE_STANDARD } from "@/lib/animation-constants";

interface PlanetCardProps {
  /** Planet data */
  planet: PlanetPageData;
  /** Optional className */
  className?: string;
}

/**
 * Planet card for index page grid.
 * Circular glyph frame with correspondence badges.
 */
export function PlanetCard({ planet, className }: PlanetCardProps) {
  return (
    <Link href={`/astrology/planets/${planet.id}`} className="block h-full">
      <motion.article
        className={cn(
          "group relative flex h-full flex-col items-center rounded-xl p-6",
          "border border-[var(--border-gold)]/20 bg-card/30",
          "transition-colors duration-300",
          "hover:border-[var(--color-gold)]/40 hover:bg-card/50",
          className
        )}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2, ease: EASE_STANDARD }}
      >
        {/* Glyph in circular frame */}
        <div className="mb-4">
          <PlanetGlyph glyph={planet.glyph} size="lg" />
        </div>

        {/* Planet name */}
        <h3 className="mb-1 font-display text-lg tracking-wide text-foreground">
          {planet.name}
        </h3>

        {/* Keywords - fixed height with single line truncation */}
        <p className="mb-4 h-5 w-full truncate text-center text-sm text-[var(--color-gold-bright)]">
          {planet.keywords.slice(0, 2).join(" · ")}
        </p>

        {/* Correspondence badges - pushed to bottom with mt-auto */}
        <div className="mt-auto flex min-h-[26px] flex-wrap items-center justify-center gap-2">
          {/* Digit badge */}
          {planet.numerology.digit !== null && (
            <span className="rounded-full border border-[var(--color-gold)]/20 bg-card/50 px-2 py-0.5 text-xs text-muted-foreground">
              {planet.numerology.digit}
            </span>
          )}

          {/* Element badge */}
          <span className="rounded-full border border-[var(--color-gold)]/20 bg-card/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
            {planet.element}
          </span>

          {/* Day badge (if classical planet) */}
          {planet.dayOfWeek && (
            <span className="rounded-full border border-[var(--color-gold)]/20 bg-card/50 px-2 py-0.5 text-xs text-muted-foreground">
              {planet.dayOfWeek.slice(0, 3)}
            </span>
          )}
        </div>

        {/* Hover glow effect */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl opacity-0",
            "bg-gradient-to-br from-[var(--color-gold)]/5 to-transparent",
            "transition-opacity duration-300 group-hover:opacity-100"
          )}
        />
      </motion.article>
    </Link>
  );
}
