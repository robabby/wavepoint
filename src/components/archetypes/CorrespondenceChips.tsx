"use client";

import type { Archetype } from "@/lib/archetypes";

interface CorrespondenceChipsProps {
  archetype: Archetype;
}

/**
 * Horizontal pills/badges showing archetype correspondences.
 */
export function CorrespondenceChips({ archetype }: CorrespondenceChipsProps) {
  const chips: Array<{ label: string; symbol?: string }> = [];

  // Zodiac
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
    chips.push({
      label: archetype.zodiac.charAt(0).toUpperCase() + archetype.zodiac.slice(1),
      symbol: zodiacSymbols[archetype.zodiac],
    });
  }

  // Planet
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
    chips.push({
      label: archetype.planet.charAt(0).toUpperCase() + archetype.planet.slice(1),
      symbol: planetSymbols[archetype.planet],
    });
  }

  // Element (always show if available)
  if (archetype.element) {
    const elementSymbols: Record<string, string> = {
      fire: "\uD83D\uDD25",
      water: "\uD83D\uDCA7",
      air: "\uD83D\uDCA8",
      earth: "\uD83C\uDF0D",
      ether: "\u2728",
    };
    chips.push({
      label: archetype.element.charAt(0).toUpperCase() + archetype.element.slice(1),
      symbol: elementSymbols[archetype.element],
    });
  }

  // Hebrew letter
  chips.push({
    label: `${archetype.hebrewLetter.letter} ${archetype.hebrewLetter.name}`,
  });

  // Jungian archetype
  chips.push({
    label: archetype.jungianArchetype,
  });

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 px-3 py-1 text-xs text-[var(--color-gold)]"
        >
          {chip.symbol && <span>{chip.symbol}</span>}
          <span>{chip.label}</span>
        </span>
      ))}
    </div>
  );
}
