"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import type { ArchetypeWithRelations } from "@/lib/archetypes";
import { AnimatedCard } from "@/components/animated-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface RelatedContentProps {
  archetype: ArchetypeWithRelations;
}

/**
 * Related content section showing connected Numbers, Geometries, and Zodiac signs.
 */
export function RelatedContent({ archetype }: RelatedContentProps) {
  const hasRelatedNumbers = archetype.relatedNumbers.length > 0;
  const hasRelatedGeometries = archetype.relatedGeometries.length > 0;
  const hasRelatedSigns = archetype.relatedSigns.length > 0;

  if (!hasRelatedNumbers && !hasRelatedGeometries && !hasRelatedSigns) {
    return null;
  }

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

  const planetName = archetype.planet.charAt(0).toUpperCase() + archetype.planet.slice(1);
  const elementName = archetype.element.charAt(0).toUpperCase() + archetype.element.slice(1);

  return (
    <AnimateOnScroll delay={0.25}>
      <Heading
        size="4"
        className="mb-6 font-display text-[var(--color-gold)]"
      >
        Connections
      </Heading>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              {archetype.relatedNumbers.slice(0, 6).map((number) => (
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

        {/* Related Geometries */}
        {hasRelatedGeometries && (
          <AnimatedCard className="p-5">
            <Text
              size="2"
              weight="medium"
              className="mb-3 block text-[var(--color-gold-bright)]"
            >
              Related Geometries
            </Text>
            <div className="flex flex-wrap gap-2">
              {archetype.relatedGeometries.map((geometry) => (
                <Link
                  key={geometry}
                  href={`/geometries/platonic-solids/${geometry}`}
                  className="rounded-full border border-[var(--color-gold)]/20 bg-card/30 px-3 py-1 text-sm capitalize text-muted-foreground transition-colors hover:border-[var(--color-gold)]/40 hover:text-[var(--color-gold)]"
                >
                  {geometry}
                </Link>
              ))}
            </div>
            <Text size="1" className="mt-3 block text-muted-foreground/60">
              Via {elementName} element
            </Text>
          </AnimatedCard>
        )}

        {/* Related Zodiac Signs */}
        {hasRelatedSigns && (
          <AnimatedCard className="p-5">
            <Text
              size="2"
              weight="medium"
              className="mb-3 block text-[var(--color-gold-bright)]"
            >
              Related Signs
            </Text>
            <div className="flex flex-wrap gap-2">
              {archetype.relatedSigns.map((sign) => (
                <Link
                  key={sign}
                  href={`/astrology/signs/${sign}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-gold)]/20 bg-card/30 px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-[var(--color-gold)]/40 hover:text-[var(--color-gold)]"
                >
                  <span>{zodiacSymbols[sign]}</span>
                  <span className="capitalize">{sign}</span>
                </Link>
              ))}
            </div>
            <Text size="1" className="mt-3 block text-muted-foreground/60">
              Via {planetName} planetary rulership
            </Text>
          </AnimatedCard>
        )}
      </div>
    </AnimateOnScroll>
  );
}
