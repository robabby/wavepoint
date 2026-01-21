"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnimatedCard } from "@/components/animated-card";
import type { NumberPattern } from "@/lib/numbers";

interface PatternCardProps {
  pattern: NumberPattern;
  showCategory?: boolean;
  className?: string;
}

/**
 * Card for displaying a number pattern in grids.
 * Wraps AnimatedCard for consistent hover effects.
 */
export function PatternCard({
  pattern,
  showCategory = false,
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

          {/* Essence - short tagline */}
          <span className="mt-1 text-sm font-medium text-[var(--color-gold-bright)]">
            {pattern.essence}
          </span>

          {/* Title */}
          <span className="mt-3 text-xs text-[var(--color-warm-gray)]">
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
                className="rounded bg-[var(--color-obsidian)]/50 px-1.5 py-0.5 text-[10px] text-[var(--color-dim)]"
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
