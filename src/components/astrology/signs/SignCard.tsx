"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ZodiacSignPageData } from "@/lib/astrology/signs";
import { PlanetGlyph } from "../PlanetGlyph";
import { EASE_STANDARD } from "@/lib/animation-constants";

interface SignCardProps {
  sign: ZodiacSignPageData;
  className?: string;
}

/**
 * Sign card for index page grid.
 * Follows PlanetCard design: circular glyph frame with correspondence badges.
 */
export function SignCard({ sign, className }: SignCardProps) {
  return (
    <Link href={`/astrology/signs/${sign.id}`} className="block">
      <motion.article
        className={cn(
          "group relative flex flex-col items-center rounded-xl p-6",
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
          <PlanetGlyph glyph={sign.glyph} size="lg" />
        </div>

        {/* Sign name */}
        <h3 className="mb-1 font-display text-lg tracking-wide text-foreground">
          {sign.name}
        </h3>

        {/* Date range */}
        <p className="mb-4 text-center text-sm text-[var(--color-gold-bright)]">
          {sign.dateRange.formatted}
        </p>

        {/* Correspondence badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {/* Element badge */}
          <span className="rounded-full border border-[var(--color-gold)]/20 bg-card/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
            {sign.element}
          </span>

          {/* Modality badge */}
          <span className="rounded-full border border-[var(--color-gold)]/20 bg-card/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
            {sign.modality}
          </span>

          {/* Ruler badge */}
          <span className="rounded-full border border-[var(--color-gold)]/20 bg-card/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
            {sign.ruler}
          </span>
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
