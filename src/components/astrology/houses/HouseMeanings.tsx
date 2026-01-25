"use client";

import { Heading, Text } from "@radix-ui/themes";
import type { HouseWithRelations } from "@/lib/astrology/houses";
import { AnimatedCard } from "@/components/animated-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface HouseMeaningsProps {
  house: HouseWithRelations;
}

/**
 * Displays Traditional vs Modern interpretations
 * in a side-by-side card layout.
 */
export function HouseMeanings({ house }: HouseMeaningsProps) {
  return (
    <AnimateOnScroll delay={0.25}>
      <Heading
        size="4"
        className="mb-6 font-display text-[var(--color-gold)]"
      >
        Interpretations
      </Heading>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Traditional Meaning Card */}
        <AnimatedCard className="relative overflow-hidden p-5">
          {/* Copper accent (historical) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at top left, rgba(184, 140, 80, 0.15) 0%, transparent 70%)",
            }}
          />

          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "rgba(184, 140, 80, 0.7)" }}
              />
              <Text
                size="1"
                weight="medium"
                className="uppercase tracking-wider"
                style={{ color: "rgba(184, 140, 80, 0.8)" }}
              >
                Traditional
              </Text>
            </div>

            <Text
              size="2"
              className="block font-body leading-relaxed text-muted-foreground"
            >
              {house.traditionalMeaning}
            </Text>
          </div>
        </AnimatedCard>

        {/* Modern Meaning Card */}
        <AnimatedCard className="relative overflow-hidden p-5">
          {/* Gold accent (contemporary) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at top left, rgba(212, 168, 75, 0.12) 0%, transparent 70%)",
            }}
          />

          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "rgba(212, 168, 75, 0.7)" }}
              />
              <Text
                size="1"
                weight="medium"
                className="uppercase tracking-wider text-[var(--color-gold)]/80"
              >
                Modern
              </Text>
            </div>

            <Text
              size="2"
              className="block font-body leading-relaxed text-muted-foreground"
            >
              {house.modernMeaning}
            </Text>
          </div>
        </AnimatedCard>
      </div>
    </AnimateOnScroll>
  );
}
