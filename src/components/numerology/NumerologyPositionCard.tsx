"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import type { PositionSlug } from "@/lib/numerology";
import { POSITION_TYPES } from "@/lib/numerology";
import { AnimatedCard } from "@/components/animated-card";

interface NumerologyPositionCardProps {
  /** The position slug (life-path, expression, etc.) */
  slug: PositionSlug;
  /** Optional user's digit for this position */
  userDigit?: number | null;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Card displaying a numerology position type.
 * Links to /numbers/[type] for the full position page.
 * Shows position name, brief description, and calculation method.
 */
export function NumerologyPositionCard({
  slug,
  userDigit,
  className,
}: NumerologyPositionCardProps) {
  const position = POSITION_TYPES[slug];

  if (!position) return null;

  return (
    <Link href={`/numerology/${slug}`} className="block">
      <AnimatedCard
        className={cn(
          "relative p-4 sm:p-6 border-l-2 border-l-[var(--color-gold)]/40 hover:border-l-[var(--color-gold)]/80 transition-colors",
          className
        )}
      >
        {/* Position name */}
        <Heading
          size="4"
          className="font-display text-[var(--color-gold)] mb-2"
        >
          {position.name}
        </Heading>

        {/* Brief description */}
        <Text size="2" className="text-muted-foreground mb-3 block">
          {position.brief}
        </Text>

        {/* Divider */}
        <div className="border-t border-border/50 pt-3 mt-3">
          {/* Calculation method (subtle) */}
          <Text size="1" className="text-muted-foreground/70">
            {position.requiresBirthName
              ? "Requires birth name"
              : "Calculated from birth date"}
          </Text>
        </div>

        {/* User's digit if available */}
        {userDigit != null && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Text size="1" className="text-muted-foreground">
              Yours:
            </Text>
            <span
              className="font-display text-lg text-[var(--color-gold)]"
              style={{ textShadow: "0 0 20px var(--glow-gold)" }}
            >
              {userDigit}
            </span>
          </div>
        )}
      </AnimatedCard>
    </Link>
  );
}
