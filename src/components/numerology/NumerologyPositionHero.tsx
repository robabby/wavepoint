"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import {
  getNumberMeaning,
  getPositionMeaning,
  isMasterNumber,
  type PositionSlug,
  POSITION_TYPES,
} from "@/lib/numerology";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface NumerologyPositionHeroProps {
  /** The position slug (life-path, expression, etc.) */
  positionSlug: PositionSlug;
  /** The digit for this position (1-9, 11, 22, 33) */
  digit: number;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Hero section for position + digit pages (e.g., /numbers/life-path/7).
 * Shows position name, digit with glow, archetype name, and contextual meaning.
 */
export function NumerologyPositionHero({
  positionSlug,
  digit,
  className,
}: NumerologyPositionHeroProps) {
  const position = POSITION_TYPES[positionSlug];
  const baseMeaning = getNumberMeaning(digit);
  const positionMeaning = getPositionMeaning(position?.type ?? "lifePath", digit);
  const isMaster = isMasterNumber(digit);

  if (!position || !baseMeaning) return null;

  return (
    <div
      className={cn(
        "relative text-center",
        className
      )}
    >
      {/* Radial gradient background glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse at center, var(--glow-gold) 0%, transparent 50%)`,
          opacity: 0.1,
        }}
      />

      {/* Position name label */}
      <AnimateOnScroll>
        <Text
          size="2"
          weight="medium"
          className="mb-4 block uppercase tracking-widest text-[var(--color-gold)]/70"
        >
          {position.name}
        </Text>
      </AnimateOnScroll>

      {/* Large digit */}
      <AnimateOnScroll delay={0.05}>
        <div
          className={cn(
            "font-display text-[6rem] sm:text-[8rem] leading-none mb-2",
            isMaster ? "text-[var(--color-gold)]" : "text-foreground"
          )}
          style={{
            textShadow: isMaster
              ? "0 0 50px var(--glow-gold), 0 0 100px var(--glow-gold)"
              : "0 0 30px var(--glow-gold), 0 0 60px var(--glow-gold)",
          }}
        >
          {digit}
        </div>
      </AnimateOnScroll>

      {/* Archetype name with link to digit page */}
      <AnimateOnScroll delay={0.1}>
        <Link
          href={`/numbers/digit/${digit}`}
          className="inline-block transition-opacity hover:opacity-80"
        >
          <Heading
            size="5"
            className="font-display text-[var(--color-gold)] mb-4"
          >
            {baseMeaning.name}
          </Heading>
        </Link>
      </AnimateOnScroll>

      {/* Contextual meaning title */}
      {positionMeaning && (
        <AnimateOnScroll delay={0.15}>
          <Heading
            size="6"
            as="h1"
            className="font-display text-foreground mb-6"
          >
            {positionMeaning.title}
          </Heading>
        </AnimateOnScroll>
      )}

      {/* Divider */}
      <AnimateOnScroll delay={0.2}>
        <div className="mx-auto mb-6 h-px w-full max-w-sm bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent" />
      </AnimateOnScroll>

      {/* Position-specific description */}
      {positionMeaning && (
        <AnimateOnScroll delay={0.25}>
          <Text
            size="4"
            className="mx-auto mb-8 block max-w-2xl leading-relaxed text-muted-foreground"
          >
            {positionMeaning.description}
          </Text>
        </AnimateOnScroll>
      )}

      {/* Extended contextual meaning */}
      {positionMeaning?.extended && (
        <AnimateOnScroll delay={0.3}>
          <div className="mx-auto max-w-2xl space-y-4 text-left">
            {positionMeaning.extended.split("\n\n").map((paragraph, i) => (
              <Text
                key={i}
                size="3"
                className="block leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </Text>
            ))}
          </div>
        </AnimateOnScroll>
      )}

      {/* Master number indicator */}
      {isMaster && (
        <AnimateOnScroll delay={0.35}>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 px-4 py-2">
            <span className="text-[var(--color-gold)]">✦</span>
            <Text size="2" className="text-[var(--color-gold)]">
              Master Number
            </Text>
            <span className="text-[var(--color-gold)]">✦</span>
          </div>
        </AnimateOnScroll>
      )}
    </div>
  );
}
