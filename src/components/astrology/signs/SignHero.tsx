"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import type { ZodiacSignWithRelations } from "@/lib/astrology/signs";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import {
  ELEMENT_STYLES,
  DEFAULT_ELEMENT_STYLE,
} from "@/lib/theme/element-styles";

interface SignHeroProps {
  sign: ZodiacSignWithRelations;
}

/**
 * Planetary ruler display names
 */
const PLANET_NAMES: Record<string, string> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
};

/**
 * Planetary glyphs for display
 */
const PLANET_GLYPHS: Record<string, string> = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "⛢",
  neptune: "♆",
  pluto: "♇",
};

/**
 * Hero section for the sign detail page.
 * Features elemental gradient, large glyph watermark,
 * and correspondence chips.
 */
export function SignHero({ sign }: SignHeroProps) {
  const styles = ELEMENT_STYLES[sign.element] ?? DEFAULT_ELEMENT_STYLE;
  const planetName = PLANET_NAMES[sign.ruler] ?? sign.ruler;
  const planetGlyph = PLANET_GLYPHS[sign.ruler] ?? "";

  return (
    <AnimateOnScroll className="mb-12">
      {/* Back link */}
      <Link
        href="/astrology/signs"
        className="mb-4 inline-block text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
      >
        &larr; Zodiac Signs
      </Link>

      {/* Hero panel with elemental gradient */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl p-8 md:p-12",
          "border border-[var(--border-gold)]/30",
          "bg-gradient-to-br",
          styles.gradient
        )}
      >
        {/* Large glyph watermark */}
        <span
          className="pointer-events-none absolute -right-8 -top-8 select-none font-serif text-[12rem] leading-none opacity-[0.08]"
          style={{
            color: "var(--color-gold)",
            filter: styles.symbolGlow,
          }}
          aria-hidden="true"
        >
          {sign.glyph}
        </span>

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          {/* Name */}
          <Heading
            size="9"
            className="mb-2 font-display tracking-wide text-[var(--color-gold)]"
          >
            {sign.name.toUpperCase()}
          </Heading>

          {/* Date range */}
          <Text size="4" className="mb-4 block font-heading text-muted-foreground">
            {sign.dateRange.formatted}
          </Text>

          {/* Motto */}
          <Text
            size="5"
            className="mb-6 block font-serif italic text-foreground/80"
          >
            &ldquo;{sign.motto}&rdquo;
          </Text>

          {/* Correspondence chips */}
          <div className="flex flex-wrap gap-3">
            {/* Element chip */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                "border bg-card/30 text-sm",
                "transition-colors"
              )}
              style={{
                borderColor: styles.accentBorder,
              }}
            >
              <span className="capitalize text-[var(--color-gold)]">
                {sign.element}
              </span>
              <span className="text-muted-foreground/50">element</span>
            </span>

            {/* Modality chip */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                "border border-[var(--color-gold)]/20 bg-card/30 text-sm"
              )}
            >
              <span className="capitalize text-[var(--color-gold)]">
                {sign.modality}
              </span>
              <span className="text-muted-foreground/50">modality</span>
            </span>

            {/* Ruler chip with link */}
            {sign.rulingPlanetUrl ? (
              <Link
                href={sign.rulingPlanetUrl}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                  "border border-[var(--color-gold)]/20 bg-card/30 text-sm",
                  "transition-colors hover:border-[var(--color-gold)]/40 hover:bg-card/50"
                )}
              >
                <span className="text-[var(--color-gold)]">{planetGlyph}</span>
                <span className="text-[var(--color-gold)]">{planetName}</span>
                <span className="text-muted-foreground/50">ruler</span>
              </Link>
            ) : (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                  "border border-[var(--color-gold)]/20 bg-card/30 text-sm"
                )}
              >
                <span className="text-[var(--color-gold)]">{planetGlyph}</span>
                <span className="text-[var(--color-gold)]">{planetName}</span>
                <span className="text-muted-foreground/50">ruler</span>
              </span>
            )}

            {/* Polarity chip */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                "border border-[var(--color-gold)]/20 bg-card/30 text-sm"
              )}
            >
              <span className="capitalize text-muted-foreground">
                {sign.polarity === "positive" ? "yang" : "yin"}
              </span>
              <span className="text-muted-foreground/50">polarity</span>
            </span>
          </div>

          {/* Description */}
          <div className="mt-8 space-y-4">
            {sign.description.split("\n\n").map((paragraph, index) => (
              <Text
                key={index}
                size="3"
                className="block font-body leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </Text>
            ))}
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
