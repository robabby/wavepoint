"use client";

import { Heading, Text } from "@radix-ui/themes";
import type { HouseWithRelations } from "@/lib/astrology/houses";
import { AnimatedCard } from "@/components/animated-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import {
  HOUSE_TYPE_STYLES,
  DEFAULT_HOUSE_TYPE_STYLE,
} from "@/lib/theme/house-styles";

interface HouseTraitsProps {
  house: HouseWithRelations;
}

/**
 * Displays strengths and challenges for a house
 * in a two-column grid layout with house type accent colors.
 */
export function HouseTraits({ house }: HouseTraitsProps) {
  const styles = HOUSE_TYPE_STYLES[house.type] ?? DEFAULT_HOUSE_TYPE_STYLE;

  return (
    <AnimateOnScroll delay={0.15}>
      <Heading
        size="4"
        className="mb-6 font-display text-[var(--color-gold)]"
      >
        Traits
      </Heading>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Strengths Column */}
        <AnimatedCard className="relative overflow-hidden p-5">
          {/* Type-tinted glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse at top right, ${styles.glowColor.replace(/[\d.]+\)$/, "0.25)")} 0%, transparent 70%)`,
            }}
          />

          <div className="relative">
            <Text
              size="1"
              weight="medium"
              className="mb-4 block uppercase tracking-wider"
              style={{
                color: styles.accentBorder.replace(/[\d.]+\)$/, "0.7)"),
              }}
            >
              Strengths
            </Text>

            <ul className="space-y-2.5">
              {house.traits.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{
                      backgroundColor: styles.accentBorder.replace(
                        /[\d.]+\)$/,
                        "0.6)"
                      ),
                    }}
                    aria-hidden="true"
                  />
                  <Text size="2" className="text-muted-foreground">
                    {strength}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </AnimatedCard>

        {/* Challenges Column */}
        <AnimatedCard className="relative overflow-hidden p-5">
          {/* Copper-tinted glow (consistent with sign traits) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(184, 115, 51, 0.15) 0%, transparent 70%)",
            }}
          />

          <div className="relative">
            <Text
              size="1"
              weight="medium"
              className="mb-4 block uppercase tracking-wider"
              style={{ color: "rgba(184, 115, 51, 0.7)" }}
            >
              Challenges
            </Text>

            <ul className="space-y-2.5">
              {house.traits.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: "rgba(184, 115, 51, 0.6)" }}
                    aria-hidden="true"
                  />
                  <Text size="2" className="text-muted-foreground">
                    {challenge}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </AnimatedCard>
      </div>
    </AnimateOnScroll>
  );
}
