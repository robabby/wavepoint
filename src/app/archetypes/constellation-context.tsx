"use client";

import { useSession } from "next-auth/react";
import { useConstellation } from "@/hooks/constellation";
import type { Archetype } from "@/lib/archetypes";
import type { MajorArcanaCard } from "@/lib/tarot";
import { ArchetypeCard } from "@/components/archetypes/ArchetypeCard";
import { TarotCard } from "@/components/tarot/TarotCard";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { TAROT_STYLES } from "@/lib/theme/tarot-styles";

/**
 * Constellation-aware archetype grid.
 * Passes isInConstellation to each card when user is authenticated.
 */
export function ConstellationArchetypeGrid({
  archetypes,
}: {
  archetypes: Archetype[];
}) {
  const { data: session } = useSession();
  const { entries } = useConstellation();
  const isAuthenticated = !!session?.user;

  const activeIdentifiers = new Set(
    isAuthenticated
      ? entries
          .filter((e) => e.system === "jungian" && e.status === "active")
          .map((e) => e.identifier)
      : []
  );

  return (
    <StaggerChildren
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
      staggerDelay={0.04}
    >
      {archetypes.map((archetype) => (
        <StaggerItem key={archetype.slug}>
          <ArchetypeCard
            archetype={archetype}
            isInConstellation={activeIdentifiers.has(archetype.slug)}
          />
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}

/**
 * Constellation-aware tarot grid.
 */
export function ConstellationTarotGrid({
  cards,
}: {
  cards: MajorArcanaCard[];
}) {
  const { data: session } = useSession();
  const { entries } = useConstellation();
  const isAuthenticated = !!session?.user;

  const activeIdentifiers = new Set(
    isAuthenticated
      ? entries
          .filter((e) => e.system === "tarot" && e.status === "active")
          .map((e) => e.identifier)
      : []
  );

  return (
    <StaggerChildren
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      staggerDelay={TAROT_STYLES.animation.staggerDelay}
    >
      {cards.map((card) => (
        <StaggerItem key={card.slug}>
          <TarotCard
            card={card}
            isInConstellation={activeIdentifiers.has(card.slug)}
          />
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
