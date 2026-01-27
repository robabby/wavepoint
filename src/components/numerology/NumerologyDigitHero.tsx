"use client";

import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import { getNumberMeaning, isMasterNumber } from "@/lib/numerology";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface NumerologyDigitHeroProps {
  /** The digit to display (1-9, 11, 22, 33) */
  digit: number;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Hero section for digit archetype pages.
 * Displays massive digit with glow, archetype name with decorative flourishes,
 * keywords, and extended meaning content.
 */
export function NumerologyDigitHero({
  digit,
  className,
}: NumerologyDigitHeroProps) {
  const meaning = getNumberMeaning(digit);
  const isMaster = isMasterNumber(digit);

  if (!meaning) return null;

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
          opacity: 0.15,
        }}
      />

      {/* Massive digit */}
      <AnimateOnScroll>
        <div
          className={cn(
            "font-display text-[8rem] sm:text-[10rem] leading-none mb-4",
            isMaster ? "text-[var(--color-gold)]" : "text-foreground"
          )}
          style={{
            textShadow: isMaster
              ? "0 0 60px var(--glow-gold), 0 0 120px var(--glow-gold), 0 0 180px var(--glow-gold)"
              : "0 0 40px var(--glow-gold), 0 0 80px var(--glow-gold)",
          }}
        >
          {digit}
        </div>
      </AnimateOnScroll>

      {/* Archetype name with decorative flourishes */}
      <AnimateOnScroll delay={0.1}>
        <Heading
          size="6"
          className="font-display text-[var(--color-gold)] mb-6"
        >
          <span className="text-[var(--color-gold)]/60 mr-2">✦</span>
          {meaning.name}
          <span className="text-[var(--color-gold)]/60 ml-2">✦</span>
        </Heading>
      </AnimateOnScroll>

      {/* Keywords */}
      <AnimateOnScroll delay={0.15}>
        <div className="mb-8">
          <Text size="3" className="text-muted-foreground">
            {meaning.keywords.join(" · ")}
          </Text>
        </div>
      </AnimateOnScroll>

      {/* Divider */}
      <AnimateOnScroll delay={0.2}>
        <div className="mx-auto mb-8 h-px w-full max-w-md bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent" />
      </AnimateOnScroll>

      {/* Brief meaning */}
      <AnimateOnScroll delay={0.25}>
        <Text
          size="4"
          className="mx-auto mb-8 block max-w-2xl leading-relaxed text-muted-foreground italic"
        >
          &ldquo;{meaning.brief}&rdquo;
        </Text>
      </AnimateOnScroll>

      {/* Extended meaning */}
      <AnimateOnScroll delay={0.3}>
        <div className="mx-auto max-w-2xl space-y-4 text-left">
          {meaning.extended.split("\n\n").map((paragraph, i) => (
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
