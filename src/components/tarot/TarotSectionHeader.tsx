"use client";

import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import { TAROT_STYLES } from "@/lib/theme/tarot-styles";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface TarotSectionHeaderProps {
  className?: string;
}

/**
 * Decorative section header for the Major Arcana section.
 * Features Art Nouveau-inspired divider with tarot ornament.
 */
export function TarotSectionHeader({ className }: TarotSectionHeaderProps) {
  return (
    <AnimateOnScroll className={cn("text-center", className)}>
      {/* Decorative divider */}
      <div className="relative mb-8 flex items-center justify-center py-4">
        {/* Left line */}
        <div
          className="h-px flex-1 max-w-[120px] md:max-w-[200px]"
          style={{
            background: `linear-gradient(to left, ${TAROT_STYLES.colors.gold}40, transparent)`,
          }}
        />

        {/* Center ornament - stylized star */}
        <div className="relative mx-4 flex items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            className="opacity-80"
            aria-hidden="true"
          >
            {/* Outer ring */}
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke={TAROT_STYLES.colors.gold}
              strokeWidth="1"
              strokeOpacity="0.3"
            />
            {/* Inner star pattern */}
            <path
              d="M24 8 L27 20 L40 24 L27 28 L24 40 L21 28 L8 24 L21 20 Z"
              stroke={TAROT_STYLES.colors.gold}
              strokeWidth="1.5"
              fill="none"
              strokeOpacity="0.6"
            />
            {/* Center diamond */}
            <path
              d="M24 18 L28 24 L24 30 L20 24 Z"
              fill={TAROT_STYLES.colors.gold}
              fillOpacity="0.4"
            />
            {/* Corner dots */}
            <circle cx="24" cy="8" r="2" fill={TAROT_STYLES.colors.gold} fillOpacity="0.5" />
            <circle cx="24" cy="40" r="2" fill={TAROT_STYLES.colors.gold} fillOpacity="0.5" />
            <circle cx="8" cy="24" r="2" fill={TAROT_STYLES.colors.gold} fillOpacity="0.5" />
            <circle cx="40" cy="24" r="2" fill={TAROT_STYLES.colors.gold} fillOpacity="0.5" />
          </svg>
        </div>

        {/* Right line */}
        <div
          className="h-px flex-1 max-w-[120px] md:max-w-[200px]"
          style={{
            background: `linear-gradient(to right, ${TAROT_STYLES.colors.gold}40, transparent)`,
          }}
        />
      </div>

      {/* Section title */}
      <Heading
        size="7"
        className="mb-3 font-display tracking-wide"
        style={{ color: TAROT_STYLES.colors.goldBright }}
      >
        Major Arcana
      </Heading>

      {/* Section description */}
      <Text size="3" className="mx-auto max-w-2xl text-muted-foreground">
        Twenty-two archetypal images of the soul&apos;s journey. From The Fool&apos;s
        first step to The World&apos;s integration, each card illuminates a stage
        of psychological transformation.
      </Text>
    </AnimateOnScroll>
  );
}
