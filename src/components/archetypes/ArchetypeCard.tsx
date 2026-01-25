"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatedCard } from "@/components/animated-card";
import type { Archetype } from "@/lib/archetypes";

interface ArchetypeCardProps {
  archetype: Archetype;
  className?: string;
}

/**
 * Card for displaying an archetype in grids.
 * Features Rider-Waite imagery with sepia treatment.
 */
export function ArchetypeCard({ archetype, className }: ArchetypeCardProps) {
  // Get zodiac/planet/element symbol for display
  const getAttributionSymbol = () => {
    if (archetype.zodiac) {
      const zodiacSymbols: Record<string, string> = {
        aries: "\u2648",
        taurus: "\u2649",
        gemini: "\u264A",
        cancer: "\u264B",
        leo: "\u264C",
        virgo: "\u264D",
        libra: "\u264E",
        scorpio: "\u264F",
        sagittarius: "\u2650",
        capricorn: "\u2651",
        aquarius: "\u2652",
        pisces: "\u2653",
      };
      return zodiacSymbols[archetype.zodiac] ?? "";
    }
    if (archetype.planet) {
      const planetSymbols: Record<string, string> = {
        sun: "\u2609",
        moon: "\u263D",
        mercury: "\u263F",
        venus: "\u2640",
        mars: "\u2642",
        jupiter: "\u2643",
        saturn: "\u2644",
        uranus: "\u26E2",
        neptune: "\u2646",
        pluto: "\u2647",
      };
      return planetSymbols[archetype.planet] ?? "";
    }
    if (archetype.element) {
      const elementSymbols: Record<string, string> = {
        fire: "\uD83D\uDD25",
        water: "\uD83D\uDCA7",
        air: "\uD83D\uDCA8",
        earth: "\uD83C\uDF0D",
        ether: "\u2728",
      };
      return elementSymbols[archetype.element] ?? "";
    }
    return "";
  };

  return (
    <Link
      href={`/archetypes/${archetype.slug}`}
      className={cn("group block h-full focus:outline-none", className)}
      aria-label={`${archetype.romanNumeral} ${archetype.name}: ${archetype.keywords[0]}`}
    >
      <AnimatedCard className="h-full overflow-hidden">
        <div className="flex flex-col">
          {/* Card image with sepia treatment */}
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-card/50">
            <Image
              src={archetype.imagePath}
              alt={`${archetype.name} tarot card`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className={cn(
                "object-cover transition-all duration-300",
                "sepia-[0.3] saturate-[0.8] contrast-[1.1]",
                "group-hover:sepia-0 group-hover:saturate-100 group-hover:contrast-100"
              )}
            />
          </div>

          {/* Card info */}
          <div className="flex flex-col gap-1 p-4">
            {/* Number and name */}
            <div className="flex items-baseline gap-2">
              <span className="font-display text-sm tracking-wide text-[var(--color-gold)]">
                {archetype.romanNumeral}
              </span>
              <span className="text-[10px] text-muted-foreground">\u00B7</span>
              <span className="font-display text-sm tracking-wide text-[var(--color-gold)]">
                {archetype.name.toUpperCase()}
              </span>
            </div>

            {/* Attribution and Hebrew letter */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{getAttributionSymbol()} {archetype.primaryAttribution}</span>
              <span>\u00B7</span>
              <span>{archetype.hebrewLetter.name}</span>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </Link>
  );
}
