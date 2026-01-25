"use client";

import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import { ZODIAC_META, type ZodiacSign } from "@/lib/astrology";
import type { ZodiacSignWithRelations } from "@/lib/astrology/signs";
import { AnimatedCard } from "@/components/animated-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import {
  ELEMENT_STYLES,
  DEFAULT_ELEMENT_STYLE,
} from "@/lib/theme/element-styles";

interface SignAspectsProps {
  sign: ZodiacSignWithRelations;
}

/**
 * Aspect type definitions with symbols and colors
 */
const ASPECT_INFO = {
  trine: {
    name: "Trine",
    symbol: "△",
    description: "Harmonious flow (120°)",
    colorClass: "text-[var(--color-gold)]",
  },
  opposition: {
    name: "Opposition",
    symbol: "☍",
    description: "Polarity and balance (180°)",
    colorClass: "text-[var(--color-copper)]",
  },
  square: {
    name: "Square",
    symbol: "□",
    description: "Dynamic tension (90°)",
    colorClass: "text-muted-foreground",
  },
  sextile: {
    name: "Sextile",
    symbol: "✶",
    description: "Supportive opportunity (60°)",
    colorClass: "text-[var(--color-gold-bright)]",
  },
} as const;

/**
 * Sign pill component for displaying related signs
 */
function SignPill({ signId }: { signId: ZodiacSign }) {
  const meta = ZODIAC_META[signId];
  const styles = ELEMENT_STYLES[meta.element] ?? DEFAULT_ELEMENT_STYLE;
  const name = signId.charAt(0).toUpperCase() + signId.slice(1);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
        "border bg-card/30 text-sm"
      )}
      style={{
        borderColor: styles.accentBorder,
      }}
    >
      <span className="text-[var(--color-gold)]">{meta.glyph}</span>
      <span className="text-muted-foreground">{name}</span>
    </span>
  );
}

/**
 * Displays related signs by astrological aspect.
 * Shows trine, opposition, square, and sextile relationships.
 */
export function SignAspects({ sign }: SignAspectsProps) {
  const { aspects } = sign;

  return (
    <AnimateOnScroll delay={0.2}>
      <Heading
        size="4"
        className="mb-6 font-display text-[var(--color-gold)]"
      >
        Sign Relationships
      </Heading>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Trine - Same element signs */}
        {aspects.trine.length > 0 && (
          <AnimatedCard className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className={cn("text-xl", ASPECT_INFO.trine.colorClass)}>
                {ASPECT_INFO.trine.symbol}
              </span>
              <Text size="2" weight="medium" className="text-[var(--color-gold)]">
                {ASPECT_INFO.trine.name}
              </Text>
            </div>
            <Text size="1" className="mb-3 block text-muted-foreground/60">
              {ASPECT_INFO.trine.description}
            </Text>
            <div className="flex flex-wrap gap-2">
              {aspects.trine.map((s) => (
                <SignPill key={s} signId={s} />
              ))}
            </div>
          </AnimatedCard>
        )}

        {/* Opposition - Opposite sign */}
        {aspects.opposition && (
          <AnimatedCard className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span
                className={cn("text-xl")}
                style={{ color: "rgb(184, 115, 51)" }}
              >
                {ASPECT_INFO.opposition.symbol}
              </span>
              <Text
                size="2"
                weight="medium"
                style={{ color: "rgb(184, 115, 51)" }}
              >
                {ASPECT_INFO.opposition.name}
              </Text>
            </div>
            <Text size="1" className="mb-3 block text-muted-foreground/60">
              {ASPECT_INFO.opposition.description}
            </Text>
            <div className="flex flex-wrap gap-2">
              <SignPill signId={aspects.opposition} />
            </div>
          </AnimatedCard>
        )}

        {/* Square - Challenging signs */}
        {aspects.square.length > 0 && (
          <AnimatedCard className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className={cn("text-xl", ASPECT_INFO.square.colorClass)}>
                {ASPECT_INFO.square.symbol}
              </span>
              <Text size="2" weight="medium" className="text-muted-foreground">
                {ASPECT_INFO.square.name}
              </Text>
            </div>
            <Text size="1" className="mb-3 block text-muted-foreground/60">
              {ASPECT_INFO.square.description}
            </Text>
            <div className="flex flex-wrap gap-2">
              {aspects.square.map((s) => (
                <SignPill key={s} signId={s} />
              ))}
            </div>
          </AnimatedCard>
        )}

        {/* Sextile - Compatible element signs */}
        {aspects.sextile.length > 0 && (
          <AnimatedCard className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className={cn("text-xl", ASPECT_INFO.sextile.colorClass)}>
                {ASPECT_INFO.sextile.symbol}
              </span>
              <Text size="2" weight="medium" className="text-[var(--color-gold-bright)]">
                {ASPECT_INFO.sextile.name}
              </Text>
            </div>
            <Text size="1" className="mb-3 block text-muted-foreground/60">
              {ASPECT_INFO.sextile.description}
            </Text>
            <div className="flex flex-wrap gap-2">
              {aspects.sextile.map((s) => (
                <SignPill key={s} signId={s} />
              ))}
            </div>
          </AnimatedCard>
        )}
      </div>
    </AnimateOnScroll>
  );
}
