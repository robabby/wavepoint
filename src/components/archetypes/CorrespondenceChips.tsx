"use client";

import type { Archetype } from "@/lib/archetypes";

interface CorrespondenceChipsProps {
  archetype: Archetype;
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
 * Element symbols for display
 */
const ELEMENT_SYMBOLS: Record<string, string> = {
  fire: "\uD83D\uDD25",
  water: "\uD83D\uDCA7",
  air: "\uD83D\uDCA8",
  earth: "\uD83C\uDF0D",
  ether: "\u2728",
};

/**
 * Horizontal pills/badges showing archetype correspondences.
 * Displays Planet and Element only.
 */
export function CorrespondenceChips({ archetype }: CorrespondenceChipsProps) {
  const chips: Array<{ label: string; symbol?: string }> = [];

  // Planet
  chips.push({
    label: archetype.planet.charAt(0).toUpperCase() + archetype.planet.slice(1),
    symbol: PLANET_SYMBOLS[archetype.planet],
  });

  // Element
  chips.push({
    label: archetype.element.charAt(0).toUpperCase() + archetype.element.slice(1),
    symbol: ELEMENT_SYMBOLS[archetype.element],
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
