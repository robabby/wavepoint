"use client";

import { cn } from "@/lib/utils";
import type { Element } from "@/lib/numbers/planetary";
import {
  ELEMENT_STYLES,
  DEFAULT_ELEMENT_STYLE,
} from "@/lib/theme/element-styles";

interface ArchetypeGlyphProps {
  /** The Unicode glyph symbol (e.g., "♄") */
  glyph: string;
  /** Element for tinting (fire, water, air, earth) */
  element: Element;
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  /** Optional className */
  className?: string;
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
  hero: "text-7xl sm:text-8xl",
};

const frameSizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
  hero: "h-32 w-32 sm:h-40 sm:w-40",
};

/**
 * Archetype glyph display with element-tinted circular frame.
 * Variant of PlanetGlyph with element-colored border and glow.
 */
export function ArchetypeGlyph({
  glyph,
  element,
  size = "md",
  className,
}: ArchetypeGlyphProps) {
  const styles = ELEMENT_STYLES[element] ?? DEFAULT_ELEMENT_STYLE;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full",
        "border-2",
        "bg-gradient-to-br from-card/80 to-card/40",
        frameSizes[size],
        className
      )}
      style={{
        borderColor: styles.accentBorder,
        boxShadow: `0 0 20px ${styles.glowColor}`,
      }}
      aria-hidden="true"
    >
      <span
        className={cn(
          "flex translate-y-[2px] items-center justify-center font-display leading-none text-[var(--color-gold)]",
          sizeClasses[size]
        )}
        style={{
          filter: styles.symbolGlow,
        }}
      >
        {glyph}
      </span>
    </div>
  );
}
