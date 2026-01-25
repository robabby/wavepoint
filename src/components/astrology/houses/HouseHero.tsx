"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import type { HouseWithRelations } from "@/lib/astrology/houses";
import { ZODIAC_META, PLANET_META } from "@/lib/astrology/constants";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import {
  HOUSE_TYPE_STYLES,
  DEFAULT_HOUSE_TYPE_STYLE,
} from "@/lib/theme/house-styles";

interface HouseHeroProps {
  house: HouseWithRelations;
}

/**
 * Hero section for the house detail page.
 * Features house type gradient, large Roman numeral watermark,
 * and correspondence chips with links.
 */
export function HouseHero({ house }: HouseHeroProps) {
  const styles = HOUSE_TYPE_STYLES[house.type] ?? DEFAULT_HOUSE_TYPE_STYLE;
  const signMeta = ZODIAC_META[house.naturalSign];
  const planetMeta = PLANET_META[house.naturalRuler];

  return (
    <AnimateOnScroll className="mb-12">
      {/* Back link */}
      <Link
        href="/astrology/houses"
        className="mb-4 inline-block text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
      >
        &larr; Houses
      </Link>

      {/* Hero panel with house type gradient */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl p-8 md:p-12",
          "border border-[var(--border-gold)]/30",
          "bg-gradient-to-br",
          styles.gradient
        )}
      >
        {/* Large Roman numeral watermark */}
        <span
          className="pointer-events-none absolute -right-4 -top-4 select-none font-display text-[10rem] leading-none opacity-[0.06] sm:-right-8 sm:-top-8 sm:text-[14rem]"
          style={{
            color: "var(--color-gold)",
            filter: styles.symbolGlow,
          }}
          aria-hidden="true"
        >
          {house.glyph}
        </span>

        {/* Position indicator showing house in wheel */}
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl">
          <div className="h-full bg-[var(--color-gold)]/5" />
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent"
            style={{
              left: `${((house.number - 1) / 12) * 100}%`,
              width: "8.33%",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          {/* House name */}
          <Heading
            size="9"
            className="mb-2 font-display tracking-wide text-[var(--color-gold)]"
          >
            {house.name.toUpperCase()}
          </Heading>

          {/* Archetype */}
          <Text size="4" className="mb-4 block font-heading text-muted-foreground">
            {house.archetype}
          </Text>

          {/* Motto */}
          <Text
            size="5"
            className="mb-6 block font-serif italic text-foreground/80"
          >
            &ldquo;{house.motto}&rdquo;
          </Text>

          {/* Correspondence chips */}
          <div className="flex flex-wrap gap-3">
            {/* Type chip with styling */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                "text-sm"
              )}
              style={{
                backgroundColor: styles.glowColor,
                borderWidth: "1px",
                borderStyle: styles.borderStyle,
                borderColor: styles.accentBorder,
              }}
            >
              <span
                className="capitalize"
                style={{
                  color: styles.accentBorder.replace(/[\d.]+\)$/, "0.9)"),
                }}
              >
                {house.type}
              </span>
              <span className="text-muted-foreground/50">house</span>
            </span>

            {/* Natural sign chip with link */}
            <Link
              href={house.naturalSignUrl}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                "border border-[var(--color-gold)]/20 bg-card/30 text-sm",
                "transition-colors hover:border-[var(--color-gold)]/40 hover:bg-card/50"
              )}
            >
              <span className="text-[var(--color-gold)]">{signMeta?.glyph}</span>
              <span className="capitalize text-[var(--color-gold)]">
                {house.naturalSign}
              </span>
              <span className="text-muted-foreground/50">natural sign</span>
            </Link>

            {/* Natural ruler chip with link */}
            <Link
              href={house.naturalRulerUrl}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                "border border-[var(--color-gold)]/20 bg-card/30 text-sm",
                "transition-colors hover:border-[var(--color-gold)]/40 hover:bg-card/50"
              )}
            >
              <span className="text-[var(--color-gold)]">{planetMeta?.glyph}</span>
              <span className="text-[var(--color-gold)]">{planetMeta?.name}</span>
              <span className="text-muted-foreground/50">natural ruler</span>
            </Link>

            {/* House number chip */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                "border border-[var(--color-gold)]/20 bg-card/30 text-sm"
              )}
            >
              <span className="font-display text-[var(--color-gold)]">
                {house.glyph}
              </span>
              <span className="text-muted-foreground/50">
                {getOrdinal(house.number)} house
              </span>
            </span>
          </div>

          {/* Description */}
          <div className="mt-8 space-y-4">
            {house.description.split("\n\n").map((paragraph, index) => (
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

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0] ?? "th");
}
