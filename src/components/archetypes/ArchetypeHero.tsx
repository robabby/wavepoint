"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import type { ArchetypeWithRelations } from "@/lib/archetypes";
import { CorrespondenceChips } from "./CorrespondenceChips";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface ArchetypeHeroProps {
  archetype: ArchetypeWithRelations;
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
 * Hero section for archetype detail page.
 * Features elemental gradient panel with planet symbol watermark.
 */
export function ArchetypeHero({ archetype }: ArchetypeHeroProps) {
  const planetSymbol = PLANET_SYMBOLS[archetype.planet] ?? "";
  const gradientClass = ELEMENT_GRADIENTS[archetype.element] ?? ELEMENT_GRADIENTS.ether;

  return (
    <AnimateOnScroll className="mb-12">
      <Link
        href="/archetypes"
        className="mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
      >
        &larr; All archetypes
      </Link>

      {/* Hero panel with elemental gradient */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-gradient-to-br p-8 md:p-12",
          gradientClass
        )}
      >
        {/* Planet symbol watermark */}
        <span
          className={cn(
            "absolute right-4 top-4 md:right-8 md:top-8",
            "font-serif text-[10rem] leading-none text-[var(--color-gold)]",
            "opacity-[0.08]"
          )}
          aria-hidden="true"
        >
          {planetSymbol}
        </span>

        <div className="relative">
          {/* Name */}
          <Heading
            size="9"
            className="mb-3 font-display tracking-wide text-[var(--color-gold)]"
          >
            {archetype.name}
          </Heading>

          {/* Motto */}
          <Text
            size="5"
            className="mb-6 block max-w-xl italic text-foreground/80"
          >
            &ldquo;{archetype.motto}&rdquo;
          </Text>

          {/* Correspondence chips */}
          <div className="mb-6">
            <CorrespondenceChips archetype={archetype} />
          </div>

          {/* Description */}
          <Text
            size="3"
            className="max-w-2xl whitespace-pre-line leading-relaxed text-muted-foreground"
          >
            {archetype.description}
          </Text>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
