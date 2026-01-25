"use client";

import { Heading, Text } from "@radix-ui/themes";
import type { HouseWithRelations } from "@/lib/astrology/houses";
import { AnimatedCard } from "@/components/animated-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import {
  HOUSE_TYPE_STYLES,
  DEFAULT_HOUSE_TYPE_STYLE,
} from "@/lib/theme/house-styles";

interface HouseLifeAreasProps {
  house: HouseWithRelations;
}

/**
 * Displays the life areas governed by this house
 * in a responsive grid layout.
 */
export function HouseLifeAreas({ house }: HouseLifeAreasProps) {
  const styles = HOUSE_TYPE_STYLES[house.type] ?? DEFAULT_HOUSE_TYPE_STYLE;

  return (
    <AnimateOnScroll delay={0.2}>
      <Heading
        size="4"
        className="mb-6 font-display text-[var(--color-gold)]"
      >
        Life Areas
      </Heading>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {house.lifeAreas.map((area, index) => (
          <AnimatedCard
            key={index}
            className="relative overflow-hidden p-4"
          >
            {/* Subtle type glow on hover */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
              style={{
                background: `radial-gradient(ellipse at center, ${styles.glowColor} 0%, transparent 70%)`,
              }}
            />

            <div className="relative flex items-start gap-3">
              {/* Numbered indicator */}
              <span
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-display text-xs"
                style={{
                  backgroundColor: styles.glowColor,
                  borderWidth: "1px",
                  borderStyle: styles.borderStyle,
                  borderColor: styles.accentBorder,
                  color: styles.accentBorder.replace(/[\d.]+\)$/, "0.9)"),
                }}
              >
                {index + 1}
              </span>

              <Text size="2" className="text-muted-foreground">
                {area}
              </Text>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </AnimateOnScroll>
  );
}
