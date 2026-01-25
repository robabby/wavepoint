"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import type { ZodiacSignWithRelations } from "@/lib/astrology/signs";
import { AnimatedCard } from "@/components/animated-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface SignRelatedContentProps {
  sign: ZodiacSignWithRelations;
}

/**
 * Archetype display name mapping
 */
const ARCHETYPE_NAMES: Record<string, string> = {
  "the-innocent": "The Innocent",
  "the-orphan": "The Orphan",
  "the-hero": "The Hero",
  "the-caregiver": "The Caregiver",
  "the-explorer": "The Explorer",
  "the-rebel": "The Rebel",
  "the-lover": "The Lover",
  "the-creator": "The Creator",
  "the-jester": "The Jester",
  "the-sage": "The Sage",
  "the-magician": "The Magician",
  "the-ruler": "The Ruler",
};

/**
 * Geometry display names
 */
const GEOMETRY_NAMES: Record<string, string> = {
  tetrahedron: "Tetrahedron",
  cube: "Cube",
  octahedron: "Octahedron",
  icosahedron: "Icosahedron",
  dodecahedron: "Dodecahedron",
};

/**
 * Planetary ruler display names
 */
const PLANET_NAMES: Record<string, string> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
};

/**
 * Related content section showing connected Numbers, Archetypes,
 * Geometries, and the ruling Planet.
 */
export function SignRelatedContent({ sign }: SignRelatedContentProps) {
  const hasRelatedNumbers = sign.relatedNumbers.length > 0;
  const hasRelatedArchetypes = sign.relatedArchetypes.length > 0;
  const hasRelatedGeometries = sign.relatedGeometries.length > 0;
  const hasRulingPlanet = !!sign.rulingPlanetUrl;

  if (
    !hasRelatedNumbers &&
    !hasRelatedArchetypes &&
    !hasRelatedGeometries &&
    !hasRulingPlanet
  ) {
    return null;
  }

  const planetName = PLANET_NAMES[sign.ruler] ?? sign.ruler;
  const elementName = sign.element.charAt(0).toUpperCase() + sign.element.slice(1);

  return (
    <AnimateOnScroll delay={0.25}>
      <Heading
        size="4"
        className="mb-6 font-display text-[var(--color-gold)]"
      >
        Connections
      </Heading>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Ruling Planet */}
        {hasRulingPlanet && (
          <AnimatedCard className="p-5">
            <Text
              size="2"
              weight="medium"
              className="mb-3 block text-[var(--color-gold-bright)]"
            >
              Ruling Planet
            </Text>
            <div className="flex flex-wrap gap-2">
              <Link
                href={sign.rulingPlanetUrl}
                className="rounded-full border border-[var(--color-gold)]/20 bg-card/30 px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-[var(--color-gold)]/40 hover:text-[var(--color-gold)]"
              >
                {planetName}
              </Link>
            </div>
            <Text size="1" className="mt-3 block text-muted-foreground/60">
              Traditional planetary ruler
            </Text>
          </AnimatedCard>
        )}

        {/* Related Numbers */}
        {hasRelatedNumbers && (
          <AnimatedCard className="p-5">
            <Text
              size="2"
              weight="medium"
              className="mb-3 block text-[var(--color-gold-bright)]"
            >
              Related Numbers
            </Text>
            <div className="flex flex-wrap gap-2">
              {sign.relatedNumbers.slice(0, 6).map((number) => (
                <Link
                  key={number}
                  href={`/numbers/${number}`}
                  className="rounded-full border border-[var(--color-gold)]/20 bg-card/30 px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-[var(--color-gold)]/40 hover:text-[var(--color-gold)]"
                >
                  {number}
                </Link>
              ))}
            </div>
            <Text size="1" className="mt-3 block text-muted-foreground/60">
              Via {planetName} planetary correspondence
            </Text>
          </AnimatedCard>
        )}

        {/* Related Archetypes */}
        {hasRelatedArchetypes && (
          <AnimatedCard className="p-5">
            <Text
              size="2"
              weight="medium"
              className="mb-3 block text-[var(--color-gold-bright)]"
            >
              Related Archetypes
            </Text>
            <div className="flex flex-wrap gap-2">
              {sign.relatedArchetypes.map((archetype) => (
                <Link
                  key={archetype}
                  href={`/archetypes/${archetype}`}
                  className="rounded-full border border-[var(--color-gold)]/20 bg-card/30 px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-[var(--color-gold)]/40 hover:text-[var(--color-gold)]"
                >
                  {ARCHETYPE_NAMES[archetype] ?? archetype}
                </Link>
              ))}
            </div>
            <Text size="1" className="mt-3 block text-muted-foreground/60">
              Via {planetName} planetary rulership
            </Text>
          </AnimatedCard>
        )}

        {/* Related Geometries */}
        {hasRelatedGeometries && (
          <AnimatedCard className="p-5">
            <Text
              size="2"
              weight="medium"
              className="mb-3 block text-[var(--color-gold-bright)]"
            >
              Related Geometry
            </Text>
            <div className="flex flex-wrap gap-2">
              {sign.relatedGeometries.map((geometry) => (
                <Link
                  key={geometry}
                  href={`/geometries/platonic-solids/${geometry}`}
                  className="rounded-full border border-[var(--color-gold)]/20 bg-card/30 px-3 py-1 text-sm capitalize text-muted-foreground transition-colors hover:border-[var(--color-gold)]/40 hover:text-[var(--color-gold)]"
                >
                  {GEOMETRY_NAMES[geometry] ?? geometry}
                </Link>
              ))}
            </div>
            <Text size="1" className="mt-3 block text-muted-foreground/60">
              Via {elementName} element
            </Text>
          </AnimatedCard>
        )}
      </div>
    </AnimateOnScroll>
  );
}
