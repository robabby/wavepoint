"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { HousePageData } from "@/lib/astrology/houses";
import { ZODIAC_META } from "@/lib/astrology/constants";
import { HouseGlyph } from "./HouseGlyph";
import {
  HOUSE_TYPE_STYLES,
  DEFAULT_HOUSE_TYPE_STYLE,
} from "@/lib/theme/house-styles";
import { EASE_STANDARD } from "@/lib/animation-constants";

interface HouseCardProps {
  house: HousePageData;
  className?: string;
}

/**
 * House card for index page grid.
 * Square-ish with large Roman numeral and house type styling.
 * Border style varies: Angular=solid, Succedent=dashed, Cadent=dotted.
 */
export function HouseCard({ house, className }: HouseCardProps) {
  const styles = HOUSE_TYPE_STYLES[house.type] ?? DEFAULT_HOUSE_TYPE_STYLE;
  const naturalSignGlyph = ZODIAC_META[house.naturalSign]?.glyph ?? "";

  return (
    <Link href={`/astrology/houses/${house.number}`} className={cn("block h-full", className)}>
      <motion.article
        className={cn(
          "group relative flex h-full flex-col items-center rounded-xl p-6",
          "bg-card/30",
          "transition-colors duration-300",
          "hover:bg-card/50"
        )}
        style={{
          borderWidth: "1px",
          borderStyle: styles.borderStyle,
          borderColor: "rgba(212, 168, 75, 0.2)",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2, ease: EASE_STANDARD }}
      >
        {/* Glyph in architectural frame */}
        <div className="mb-4">
          <HouseGlyph number={house.number} size="lg" />
        </div>

        {/* House name */}
        <h3 className="mb-1 text-center font-display text-lg tracking-wide text-foreground">
          {house.name}
        </h3>

        {/* Archetype */}
        <p className="mb-4 text-center text-sm italic text-muted-foreground">
          {house.archetype}
        </p>

        {/* Spacer to push badges to bottom */}
        <div className="flex-1" />

        {/* Correspondence badges */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {/* Type badge with type-specific styling */}
          <span
            className="rounded-full px-2 py-0.5 text-xs capitalize"
            style={{
              backgroundColor: styles.glowColor,
              borderWidth: "1px",
              borderStyle: styles.borderStyle,
              borderColor: styles.accentBorder,
              color: styles.accentBorder.replace(/[\d.]+\)$/, "0.9)"),
            }}
          >
            {house.type}
          </span>

          {/* Natural sign badge */}
          <span className="rounded-full border border-[var(--color-gold)]/20 bg-card/50 px-2 py-0.5 text-xs text-muted-foreground">
            <span className="mr-1 text-[var(--color-gold)]">
              {naturalSignGlyph}
            </span>
            <span className="capitalize">{house.naturalSign}</span>
          </span>
        </div>

        {/* Hover glow effect */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl opacity-0",
            "transition-opacity duration-300 group-hover:opacity-100"
          )}
          style={{
            background: `radial-gradient(ellipse at center, ${styles.glowColor} 0%, transparent 70%)`,
          }}
        />
      </motion.article>
    </Link>
  );
}
