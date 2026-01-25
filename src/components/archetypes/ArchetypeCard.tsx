"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Archetype } from "@/lib/archetypes";

interface ArchetypeCardProps {
  archetype: Archetype;
  className?: string;
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
 * Element style configuration type
 */
type ElementStyle = {
  gradient: string;
  glowColor: string;
  accentBorder: string;
  symbolGlow: string;
  textGlow: string;
};

/**
 * Default style (ether) used as fallback
 */
const DEFAULT_STYLE: ElementStyle = {
  gradient: "from-[#0a0510] via-[#18102a] to-[#100a1a]",
  glowColor: "rgba(160, 100, 200, 0.12)",
  accentBorder: "rgba(180, 140, 220, 0.35)",
  symbolGlow: "drop-shadow(0 0 30px rgba(160, 120, 200, 0.4))",
  textGlow: "drop-shadow(0 0 8px rgba(180, 140, 220, 0.4))",
};

/**
 * Element-based visual configurations
 * Each element has distinct gradient, glow, and accent colors
 */
const ELEMENT_STYLES: Record<string, ElementStyle> = {
  fire: {
    gradient: "from-[#1a0505] via-[#3d1810] to-[#2a0a08]",
    glowColor: "rgba(255, 100, 50, 0.15)",
    accentBorder: "rgba(255, 140, 80, 0.4)",
    symbolGlow: "drop-shadow(0 0 30px rgba(255, 120, 50, 0.4))",
    textGlow: "drop-shadow(0 0 8px rgba(255, 140, 80, 0.5))",
  },
  water: {
    gradient: "from-[#050a14] via-[#0a1a2e] to-[#061220]",
    glowColor: "rgba(100, 180, 255, 0.12)",
    accentBorder: "rgba(140, 200, 255, 0.35)",
    symbolGlow: "drop-shadow(0 0 30px rgba(120, 180, 255, 0.35))",
    textGlow: "drop-shadow(0 0 8px rgba(140, 200, 255, 0.4))",
  },
  air: {
    gradient: "from-[#0a0a12] via-[#151522] to-[#0f0f1a]",
    glowColor: "rgba(180, 160, 220, 0.1)",
    accentBorder: "rgba(200, 180, 240, 0.35)",
    symbolGlow: "drop-shadow(0 0 30px rgba(180, 160, 220, 0.35))",
    textGlow: "drop-shadow(0 0 8px rgba(200, 180, 240, 0.4))",
  },
  earth: {
    gradient: "from-[#0d0a05] via-[#1f1810] to-[#15100a]",
    glowColor: "rgba(184, 115, 51, 0.12)",
    accentBorder: "rgba(200, 140, 80, 0.4)",
    symbolGlow: "drop-shadow(0 0 30px rgba(184, 130, 70, 0.4))",
    textGlow: "drop-shadow(0 0 8px rgba(200, 140, 80, 0.5))",
  },
  ether: DEFAULT_STYLE,
};

/**
 * Card for displaying an archetype in grids.
 * Features elemental gradient background, radiant planet symbol,
 * and atmospheric depth effects.
 */
export function ArchetypeCard({ archetype, className }: ArchetypeCardProps) {
  const planetSymbol = PLANET_SYMBOLS[archetype.planet] ?? "";
  const styles = ELEMENT_STYLES[archetype.element] ?? DEFAULT_STYLE;

  return (
    <Link
      href={`/archetypes/${archetype.slug}`}
      className={cn("group block h-full focus:outline-none", className)}
      aria-label={`${archetype.name}: ${archetype.keywords[0]}`}
    >
      <motion.div
        className={cn(
          "h-full overflow-hidden rounded-lg",
          "border border-[var(--border-gold)]/50",
          "bg-card transition-colors duration-300",
          "focus-within:ring-2 focus-within:ring-[var(--color-gold)] focus-within:ring-offset-2 focus-within:ring-offset-background"
        )}
        style={
          {
            "--element-glow": styles.glowColor,
            "--element-border": styles.accentBorder,
          } as React.CSSProperties
        }
        whileHover={{
          scale: 1.03,
          borderColor: styles.accentBorder,
          boxShadow: `0 8px 40px ${styles.glowColor}, 0 0 60px ${styles.glowColor}`,
        }}
        transition={{
          duration: 0.35,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <div className="flex h-full flex-col">
          {/* Elemental gradient background with atmospheric effects */}
          <div
            className={cn(
              "relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br",
              styles.gradient
            )}
          >
            {/* Radial glow behind symbol */}
            <div
              className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at 50% 45%, ${styles.glowColor} 0%, transparent 60%)`,
              }}
            />

            {/* Vignette overlay for depth */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.4) 100%)",
              }}
            />

            {/* Noise texture for organic feel */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Planet symbol with glow */}
            <motion.span
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "select-none font-serif text-[7rem] leading-none",
                "text-[var(--color-gold)]"
              )}
              style={{
                filter: styles.symbolGlow,
              }}
              initial={{ opacity: 0.18 }}
              whileHover={{ opacity: 0.45 }}
              transition={{ duration: 0.4 }}
              aria-hidden="true"
            >
              <motion.span
                className="group-hover:animate-pulse"
                style={{ animationDuration: "3s" }}
              >
                {planetSymbol}
              </motion.span>
            </motion.span>

            {/* Subtle inner border glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-t-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                boxShadow: `inset 0 0 30px ${styles.glowColor}`,
              }}
            />
          </div>

          {/* Card info with enhanced typography */}
          <div className="flex flex-1 flex-col gap-1.5 p-4">
            {/* Name with element-colored glow on hover */}
            <span
              className={cn(
                "font-display text-sm tracking-wide text-[var(--color-gold)]",
                "transition-all duration-300 group-hover:tracking-wider"
              )}
              style={{
                filter: "none",
                transition: "filter 0.3s ease",
              }}
            >
              <span className="inline-block transition-[filter] duration-300 group-hover:[filter:var(--text-glow)]"
                style={{ "--text-glow": styles.textGlow } as React.CSSProperties}
              >
                {archetype.name.toUpperCase()}
              </span>
            </span>

            {/* Motto with refined italic styling */}
            <span className="line-clamp-2 font-serif text-xs italic text-muted-foreground/70 transition-colors duration-300 group-hover:text-muted-foreground/90">
              &ldquo;{archetype.motto}&rdquo;
            </span>

            {/* Planet and Element badges */}
            <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground/60">
              <span
                className="flex items-center gap-1 transition-colors duration-300 group-hover:text-muted-foreground/90"
              >
                <span className="text-sm opacity-70">{planetSymbol}</span>
                <span className="capitalize">{archetype.planet}</span>
              </span>
              <span className="text-muted-foreground/30">·</span>
              <span className="capitalize transition-colors duration-300 group-hover:text-muted-foreground/90">
                {archetype.element}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
