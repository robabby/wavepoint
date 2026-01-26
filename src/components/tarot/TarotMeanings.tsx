"use client";

import { Heading, Text } from "@radix-ui/themes";
import type { MajorArcanaCard } from "@/lib/tarot";
import { TAROT_STYLES } from "@/lib/theme/tarot-styles";
import { AnimatedCard } from "@/components/animated-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface TarotMeaningsProps {
  card: MajorArcanaCard;
}

/**
 * Tarot card meanings section with upright, reversed, symbolism, and journey.
 * Uses a 2x2 grid layout on larger screens.
 */
export function TarotMeanings({ card }: TarotMeaningsProps) {
  return (
    <AnimateOnScroll delay={0.15}>
      <Heading
        size="4"
        className="mb-6 font-display"
        style={{ color: TAROT_STYLES.colors.goldBright }}
      >
        Interpretations
      </Heading>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Upright Meaning */}
        <AnimatedCard className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="text-lg"
              style={{ color: TAROT_STYLES.colors.gold }}
              aria-hidden="true"
            >
              ↑
            </span>
            <Text
              size="2"
              weight="medium"
              style={{ color: TAROT_STYLES.colors.goldBright }}
            >
              Upright
            </Text>
          </div>
          <Text size="2" className="leading-relaxed text-muted-foreground">
            {card.uprightMeaning}
          </Text>
        </AnimatedCard>

        {/* Reversed Meaning */}
        <AnimatedCard className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="text-lg"
              style={{ color: TAROT_STYLES.colors.gold }}
              aria-hidden="true"
            >
              ↓
            </span>
            <Text
              size="2"
              weight="medium"
              style={{ color: TAROT_STYLES.colors.goldBright }}
            >
              Reversed
            </Text>
          </div>
          <Text size="2" className="leading-relaxed text-muted-foreground">
            {card.reversedMeaning}
          </Text>
        </AnimatedCard>

        {/* Symbolism */}
        <AnimatedCard className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="text-lg"
              style={{ color: TAROT_STYLES.colors.gold }}
              aria-hidden="true"
            >
              ◇
            </span>
            <Text
              size="2"
              weight="medium"
              style={{ color: TAROT_STYLES.colors.goldBright }}
            >
              Symbolism
            </Text>
          </div>
          <Text size="2" className="leading-relaxed text-muted-foreground">
            {card.symbolism}
          </Text>
        </AnimatedCard>

        {/* Journey Description */}
        <AnimatedCard className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="text-lg"
              style={{ color: TAROT_STYLES.colors.gold }}
              aria-hidden="true"
            >
              ∞
            </span>
            <Text
              size="2"
              weight="medium"
              style={{ color: TAROT_STYLES.colors.goldBright }}
            >
              The Journey
            </Text>
          </div>
          <Text
            size="2"
            className="whitespace-pre-line leading-relaxed text-muted-foreground"
          >
            {card.description}
          </Text>
        </AnimatedCard>
      </div>
    </AnimateOnScroll>
  );
}
