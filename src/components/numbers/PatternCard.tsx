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
      className={cn("group block focus:outline-none", className)}
      aria-label={`${pattern.id}: ${pattern.essence} — ${pattern.title}`}
    >
      <AnimatedCard className="h-full">
        <div className="flex flex-col p-5">
          {/* Number display */}
          <span className="font-display text-3xl tracking-wider text-[var(--color-gold)]">
            {pattern.id}
          </span>

          {/* Essence - short tagline with optional relationship badge */}
          <span className="mt-1 flex items-center gap-2 text-sm">
            <span className="font-medium text-[var(--color-gold-bright)]">
              {pattern.essence}
            </span>
            {relationshipType && (
              <>
                <span className="text-muted-foreground/50">·</span>
                <NumberRelationshipBadge type={relationshipType} />
              </>
            )}
          </span>

          {/* Title */}
          <span className="mt-3 text-xs text-muted-foreground">
            {pattern.title}
          </span>

          {/* Category badge (optional) */}
          {showCategory && (
            <span className="mt-3 inline-flex w-fit rounded-full bg-[var(--color-gold)]/10 px-2 py-0.5 text-xs capitalize text-[var(--color-gold)]">
              {pattern.category}
            </span>
          )}

          {/* Keywords */}
          <div className="mt-3 flex flex-wrap gap-1">
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
