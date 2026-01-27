"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NumerologyData } from "@/lib/numerology";
import { getRelatedPatterns, hasNameBasedNumbers } from "@/lib/numerology";
import { AnimatedCard } from "@/components/animated-card";
import { NumerologyNumberDisplay } from "./NumerologyNumberDisplay";

interface NumerologyProfileCardProps {
  numerology: NumerologyData | null;
  hasBirthName: boolean;
  className?: string;
}

/**
 * Full numerology profile card displaying all calculated numbers.
 * Shows Life Path as hero, secondary numbers in grid, and current cycles.
 */
export function NumerologyProfileCard({
  numerology,
  hasBirthName,
  className,
}: NumerologyProfileCardProps) {
  // Don't render if no numerology data
  if (!numerology) {
    return null;
  }

  const hasNameNumbers = hasNameBasedNumbers(numerology);
  const relatedPatterns =
    numerology.lifePath != null
      ? getRelatedPatterns(numerology.lifePath).slice(0, 5)
      : [];

  return (
    <AnimatedCard className={cn("p-6", className)}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Heading size="4" className="font-display text-[var(--color-gold)]">
          Numerology
        </Heading>
        <Link
          href="/settings/profile"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 px-3 py-1 text-xs text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)]/10"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </Link>
      </div>

      {/* Life Path Hero */}
      <div className="mb-8">
        <NumerologyNumberDisplay
          digit={numerology.lifePath}
          type="lifePath"
          variant="hero"
        />
      </div>

      {/* Secondary Numbers Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border/50 p-4">
          <NumerologyNumberDisplay
            digit={numerology.expression}
            type="expression"
            locked={!hasNameNumbers}
          />
        </div>
        <div className="rounded-lg border border-border/50 p-4">
          <NumerologyNumberDisplay
            digit={numerology.soulUrge}
            type="soulUrge"
            locked={!hasNameNumbers}
          />
        </div>
        <div className="rounded-lg border border-border/50 p-4">
          <NumerologyNumberDisplay
            digit={numerology.personality}
            type="personality"
            locked={!hasNameNumbers}
          />
        </div>
        <div className="rounded-lg border border-border/50 p-4">
          <NumerologyNumberDisplay
            digit={numerology.birthday}
            type="birthday"
          />
        </div>
        <div className="rounded-lg border border-border/50 p-4">
          <NumerologyNumberDisplay
            digit={numerology.maturity}
            type="maturity"
            locked={!hasNameNumbers}
          />
        </div>
      </div>

      {/* Birth name prompt (only show once, not on each locked number) */}
      {!hasBirthName && (
        <Text size="1" className="mb-6 block text-center text-muted-foreground">
          <Link
            href="/settings/profile"
            className="text-[var(--color-gold)] underline underline-offset-2 hover:text-[var(--color-gold)]/80"
          >
            Add birth name
          </Link>{" "}
          to reveal Expression, Soul Urge, Personality, and Maturity numbers.
        </Text>
      )}

      {/* Current Cycles */}
      <div className="border-t border-border/50 pt-4">
        <Text
          size="1"
          weight="medium"
          className="mb-3 block uppercase tracking-wider text-muted-foreground"
        >
          Current Cycles
        </Text>
        <div className="flex flex-wrap items-center gap-4">
          <NumerologyNumberDisplay
            digit={numerology.personalYear}
            type="personalYear"
            variant="compact"
          />
          <span className="text-muted-foreground/30">·</span>
          <NumerologyNumberDisplay
            digit={numerology.personalMonth}
            type="personalMonth"
            variant="compact"
          />
          <span className="text-muted-foreground/30">·</span>
          <NumerologyNumberDisplay
            digit={numerology.personalDay}
            type="personalDay"
            variant="compact"
          />
        </div>
      </div>

      {/* Related Patterns */}
      {relatedPatterns.length > 0 && (
        <div className="mt-4 border-t border-border/50 pt-4">
          <Text
            size="1"
            weight="medium"
            className="mb-3 block uppercase tracking-wider text-muted-foreground"
          >
            Your Numbers in Patterns
          </Text>
          <div className="flex flex-wrap gap-2">
            {relatedPatterns.map((pattern) => (
              <Link
                key={pattern}
                href={`/numbers/${pattern}`}
                className="rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 px-3 py-1 font-mono text-sm text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)]/10"
              >
                {pattern}
              </Link>
            ))}
          </div>
        </div>
      )}
    </AnimatedCard>
  );
}
