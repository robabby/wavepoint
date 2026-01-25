"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnimatedCard } from "@/components/animated-card";
import type { Archetype } from "@/lib/archetypes";

interface ArchetypeCardProps {
  archetype: Archetype;
  className?: string;
}

/**
 * Planet symbols for display
 */
const PLANET_SYMBOLS: Record<string, string> = {
  sun: "\u2609",
  moon: "\u263D",
  mercury: "\u263F",
  venus: "\u2640",
  mars: "\u2642",
  jupiter: "\u2643",
  saturn: "\u2644",
  uranus: "\u26E2",
  neptune: "\u2646",
};

/**
 * Element-based gradient backgrounds
 */
const ELEMENT_GRADIENTS: Record<string, string> = {
  fire: "from-[#1a0a0a] via-[#2d1408] to-[#1a0a0a]",
  water: "from-[#0a0a1a] via-[#081420] to-[#0a0a1a]",
  air: "from-[#0f0f14] via-[#14161c] to-[#0f0f14]",
  earth: "from-[#0f0d0a] via-[#1a1610] to-[#0f0d0a]",
  ether: "from-[#0f0a14] via-[#14101a] to-[#0f0a14]",
};

/**
 * Card for displaying an archetype in grids.
 * Features elemental gradient background and planet symbol watermark.
 */
export function ArchetypeCard({ archetype, className }: ArchetypeCardProps) {
  const planetSymbol = PLANET_SYMBOLS[archetype.planet] ?? "";
  const gradientClass = ELEMENT_GRADIENTS[archetype.element] ?? ELEMENT_GRADIENTS.ether;

  return (
    <Link
      href={`/archetypes/${archetype.slug}`}
      className={cn("group block h-full focus:outline-none", className)}
      aria-label={`${archetype.name}: ${archetype.keywords[0]}`}
    >
      <AnimatedCard className="h-full overflow-hidden transition-all duration-300 group-hover:border-[var(--color-gold)]/30">
        <div className="flex flex-col">
          {/* Elemental gradient background with planet watermark */}
          <div
            className={cn(
              "relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br",
              gradientClass
            )}
          >
            {/* Planet symbol watermark */}
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "font-serif text-[8rem] leading-none text-[var(--color-gold)]",
                "opacity-10 transition-opacity duration-300 group-hover:opacity-20"
              )}
              aria-hidden="true"
            >
              {planetSymbol}
            </span>
          </div>

          {/* Card info */}
          <div className="flex flex-col gap-1.5 p-4">
            {/* Name */}
            <span className="font-display text-sm tracking-wide text-[var(--color-gold)]">
              {archetype.name.toUpperCase()}
            </span>

            {/* Motto */}
            <span className="line-clamp-2 text-xs italic text-muted-foreground/80">
              &ldquo;{archetype.motto}&rdquo;
            </span>

            {/* Planet and Element */}
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{planetSymbol}</span>
              <span className="capitalize">{archetype.planet}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="capitalize">{archetype.element}</span>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </Link>
  );
}
