"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import type { HouseWithRelations } from "@/lib/astrology/houses";
import { getHouseByNumber, ROMAN_NUMERALS } from "@/lib/astrology/houses";
import { AnimatedCard } from "@/components/animated-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import {
  HOUSE_TYPE_STYLES,
  DEFAULT_HOUSE_TYPE_STYLE,
} from "@/lib/theme/house-styles";

interface HouseAxisProps {
  house: HouseWithRelations;
}

/**
 * Displays the axis relationship between opposite houses.
 * Shows connection between current house and its opposite.
 */
export function HouseAxis({ house }: HouseAxisProps) {
  const oppositeHouse = getHouseByNumber(house.oppositeHouse);
  if (!oppositeHouse) return null;

  const currentStyles =
    HOUSE_TYPE_STYLES[house.type] ?? DEFAULT_HOUSE_TYPE_STYLE;
  const oppositeStyles =
    HOUSE_TYPE_STYLES[oppositeHouse.type] ?? DEFAULT_HOUSE_TYPE_STYLE;

  return (
    <AnimateOnScroll delay={0.3}>
      <Heading
        size="4"
        className="mb-6 font-display text-[var(--color-gold)]"
      >
        {house.axisName}
      </Heading>

      <AnimatedCard className="relative overflow-hidden p-6">
        {/* Dual gradient representing axis */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${currentStyles.glowColor} 0%, transparent 50%, ${oppositeStyles.glowColor} 100%)`,
          }}
        />

        <div className="relative">
          <Text size="2" className="mb-6 block text-muted-foreground">
            The {house.axisName} connects the {house.glyph} House and the{" "}
            {ROMAN_NUMERALS[house.oppositeHouse]} House, representing complementary
            areas of life experience that must be balanced.
          </Text>

          <div className="flex items-center justify-between gap-4">
            {/* Current house */}
            <div className="flex-1 text-center">
              <div
                className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full font-display text-xl"
                style={{
                  backgroundColor: currentStyles.glowColor,
                  borderWidth: "1px",
                  borderStyle: currentStyles.borderStyle,
                  borderColor: currentStyles.accentBorder,
                  color: "var(--color-gold)",
                  filter: currentStyles.symbolGlow,
                }}
              >
                {house.glyph}
              </div>
              <Text size="2" weight="medium" className="text-foreground">
                {house.name}
              </Text>
              <Text size="1" className="text-muted-foreground/70">
                {house.archetype}
              </Text>
            </div>

            {/* Axis connector */}
            <div className="flex flex-col items-center gap-1">
              <div className="h-px w-8 bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent sm:w-16" />
              <Text
                size="1"
                className="whitespace-nowrap text-muted-foreground/50"
              >
                axis
              </Text>
              <div className="h-px w-8 bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent sm:w-16" />
            </div>

            {/* Opposite house */}
            <Link
              href={`/astrology/houses/${house.oppositeHouse}`}
              className="group flex-1 text-center transition-opacity hover:opacity-80"
            >
              <div
                className={cn(
                  "mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full font-display text-xl",
                  "transition-transform group-hover:scale-105"
                )}
                style={{
                  backgroundColor: oppositeStyles.glowColor,
                  borderWidth: "1px",
                  borderStyle: oppositeStyles.borderStyle,
                  borderColor: oppositeStyles.accentBorder,
                  color: "var(--color-gold)",
                  filter: oppositeStyles.symbolGlow,
                }}
              >
                {ROMAN_NUMERALS[house.oppositeHouse]}
              </div>
              <Text
                size="2"
                weight="medium"
                className="text-foreground transition-colors group-hover:text-[var(--color-gold)]"
              >
                {oppositeHouse.name}
              </Text>
              <Text size="1" className="text-muted-foreground/70">
                {oppositeHouse.archetype}
              </Text>
            </Link>
          </div>
        </div>
      </AnimatedCard>
    </AnimateOnScroll>
  );
}
