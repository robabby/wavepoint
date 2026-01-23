"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnimatedCard } from "@/components/animated-card";
import type { NumberPattern, NumberRelationshipType } from "@/lib/numbers";
import { NumberRelationshipBadge } from "./NumberRelationshipBadge";

interface PatternCardProps {
  pattern: NumberPattern;
  showCategory?: boolean;
  relationshipType?: NumberRelationshipType;
  className?: string;
}

/**
 * Card for displaying a number pattern in grids.
 * Responsive: badge stacks below essence on mobile for breathing room.
 * Wraps AnimatedCard for consistent hover effects.
 */
export function PatternCard({
  pattern,
  showCategory = false,
  relationshipType,
  className,
}: PatternCardProps) {
  return (
    <Link
      href={`/numbers/${pattern.id}`}
      className={cn("group block h-full focus:outline-none", className)}
      aria-label={`${pattern.id}: ${pattern.essence} — ${pattern.title}`}
    >
      <AnimatedCard className="h-full">
        <div className="flex flex-col min-h-[180px] p-4 sm:p-5">
          {/* Number display */}
          <span className="font-display text-2xl sm:text-3xl tracking-wider text-[var(--color-gold)]">
            {pattern.id}
          </span>

          {/* Essence - short tagline */}
          <span className="mt-1 text-sm font-medium text-[var(--color-gold-bright)]">
            {pattern.essence}
          </span>

          {/* Relationship badge - stacked below essence for mobile breathing room */}
          {relationshipType && (
            <div className="mt-1.5">
              <NumberRelationshipBadge type={relationshipType} />
            </div>
          )}

          {/* Title */}
          <span className="mt-2 text-xs text-muted-foreground">
            {pattern.title}
          </span>

          {/* Category badge (optional) */}
          {showCategory && (
            <span className="mt-2 inline-flex w-fit rounded-full bg-[var(--color-gold)]/10 px-2 py-0.5 text-xs capitalize text-[var(--color-gold)]">
              {pattern.category}
            </span>
          )}

          {/* Keywords - pushed to bottom */}
          <div className="mt-auto flex flex-wrap gap-1 pt-3">
            {pattern.keywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="rounded bg-background/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </AnimatedCard>
    </Link>
  );
}
