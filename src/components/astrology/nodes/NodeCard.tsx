"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PlanetGlyph } from "../PlanetGlyph";
import type { SensitivePointPageData } from "@/lib/astrology/nodes";
import { EASE_STANDARD } from "@/lib/animation-constants";

interface NodeCardProps {
  /** Sensitive point data */
  node: SensitivePointPageData;
  /** Optional className */
  className?: string;
}

/**
 * Category labels for display
 */
const CATEGORY_LABELS: Record<string, string> = {
  lunar: "Lunar",
  asteroid: "Asteroid",
  "arabic-part": "Arabic Part",
  angle: "Angle",
};

/**
 * Sensitive point card for index page grid.
 * Circular glyph frame with category badge.
 */
export function NodeCard({ node, className }: NodeCardProps) {
  return (
    <Link href={`/astrology/nodes/${node.id}`} className="block h-full">
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
          <PlanetGlyph glyph={node.glyph} size="lg" />
        </div>

        {/* Node name */}
        <h3 className="mb-1 font-display text-lg tracking-wide text-foreground">
          {node.name}
        </h3>

        {/* Archetype - smaller text */}
        <p className="mb-4 text-center text-sm text-[var(--color-gold-bright)]">
          {node.archetype}
        </p>

        {/* Category badge - pushed to bottom with mt-auto */}
        <div className="mt-auto flex min-h-[26px] flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-[var(--color-gold)]/20 bg-card/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
            {CATEGORY_LABELS[node.category] ?? node.category}
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
