"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Archetype } from "@/lib/archetypes";
import {
  ELEMENT_STYLES,
  DEFAULT_ELEMENT_STYLE,
} from "@/lib/theme/element-styles";
import { ArchetypeGlyph } from "./ArchetypeGlyph";
import { EASE_STANDARD } from "@/lib/animation-constants";

interface ArchetypeCardProps {
  archetype: Archetype;
  className?: string;
  isInConstellation?: boolean;
}

/**
 * Planet symbols for display
 */
const PLANET_SYMBOLS: Record<string, string> = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "⛢",
  neptune: "♆",
};

/**
 * Card for displaying an archetype in grids.
 * Follows PlanetCard/SignCard design: centered layout with
 * element-tinted circular glyph frame and correspondence badge.
 */
export function ArchetypeCard({ archetype, className, isInConstellation }: ArchetypeCardProps) {
  const planetSymbol = PLANET_SYMBOLS[archetype.planet] ?? "";
  const styles = ELEMENT_STYLES[archetype.element] ?? DEFAULT_ELEMENT_STYLE;

  return (
    <Link
      href={`/archetypes/${archetype.slug}`}
      className="block"
      aria-label={`${archetype.name}: ${archetype.keywords.slice(0, 2).join(", ")}`}
    >
      <motion.article
        className={cn(
          "group relative flex flex-col items-center rounded-xl p-6",
          "border border-[var(--border-gold)]/20 bg-card/30",
          "transition-colors duration-300",
          "hover:bg-card/50",
          className
        )}
        style={
          {
            "--element-glow": styles.glowColor,
            "--element-border": styles.accentBorder,
          } as React.CSSProperties
        }
        whileHover={{
          scale: 1.02,
          borderColor: styles.accentBorder,
        }}
        transition={{ duration: 0.2, ease: EASE_STANDARD }}
      >
        {/* Glyph in element-tinted circular frame */}
        <div className="mb-4">
          <ArchetypeGlyph
            glyph={planetSymbol}
            element={archetype.element}
            size="lg"
          />
        </div>

        {/* Archetype name */}
        <h3 className="mb-1 font-display text-lg tracking-wide text-foreground">
          {archetype.name.toUpperCase()}
        </h3>

        {/* Keywords (first 2) */}
        <p className="mb-4 text-center text-sm text-[var(--color-gold-bright)]">
          {archetype.keywords.slice(0, 2).join(" · ")}
        </p>

        {/* Element badge with element-specific styling */}
        <div className="flex justify-center">
          <span
            className="rounded-full px-2 py-0.5 text-xs capitalize"
            style={{
              backgroundColor: styles.glowColor,
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: styles.accentBorder,
              color: styles.accentBorder.replace(/[\d.]+\)$/, "0.9)"),
            }}
          >
            {archetype.element}
          </span>
        </div>

        {/* Constellation indicator */}
        {isInConstellation && (
          <span
            className="absolute right-2 top-2 text-[var(--color-gold)]"
            style={{ filter: "drop-shadow(0 0 6px rgba(212,168,75,0.5))" }}
          >
            ✦
          </span>
        )}

        {/* Hover glow effect with element color */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl",
            isInConstellation
              ? "opacity-30 transition-opacity duration-300 group-hover:opacity-100"
              : "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          )}
          style={{
            background: `radial-gradient(ellipse at center, ${styles.glowColor} 0%, transparent 70%)`,
          }}
        />
      </motion.article>
    </Link>
  );
}
