"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import type { ArchetypeWithRelations } from "@/lib/archetypes";
import { CorrespondenceChips } from "./CorrespondenceChips";
import { AlternativeAttributions } from "./AlternativeAttributions";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface ArchetypeHeroProps {
  archetype: ArchetypeWithRelations;
}

/**
 * Hero section for archetype detail page.
 */
export function ArchetypeHero({ archetype }: ArchetypeHeroProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <AnimateOnScroll className="mb-12">
      <Link
        href="/archetypes"
        className="mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
      >
        ← All archetypes
      </Link>

      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
        {/* Card image */}
        <div className="relative aspect-[2/3] w-full max-w-[280px] overflow-hidden rounded-lg border border-[var(--color-gold)]/20 bg-card/30 shadow-lg">
          {imageError ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-card/80 to-card">
              <span className="font-display text-6xl text-[var(--color-gold)]/40">
                {archetype.romanNumeral}
              </span>
              <span className="mt-4 text-2xl text-muted-foreground/50">
                {archetype.hebrewLetter.letter}
              </span>
              <span className="mt-2 text-sm text-muted-foreground/40">
                {archetype.hebrewLetter.name}
              </span>
            </div>
          ) : (
            <Image
              src={archetype.imagePath}
              alt={`${archetype.name} tarot card`}
              fill
              priority
              sizes="(max-width: 768px) 280px, 280px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Card info */}
        <div className="flex flex-1 flex-col text-center md:text-left">
          <div className="mb-4 flex items-baseline justify-center gap-3 md:justify-start">
            <span className="font-display text-2xl tracking-wide text-[var(--color-gold)]">
              {archetype.romanNumeral}
            </span>
            <span className="text-muted-foreground">·</span>
            <Heading
              size="8"
              className="font-display tracking-wide text-[var(--color-gold)]"
            >
              {archetype.name.toUpperCase()}
            </Heading>
          </div>

          {/* Jungian Archetype */}
          <div className="mb-4">
            <span className="text-sm text-muted-foreground">Jungian Archetype: </span>
            <span className="text-sm font-medium italic text-[var(--color-gold)]">
              {archetype.jungianArchetype}
            </span>
          </div>

          {/* Description */}
          <Text
            size="4"
            className="mb-6 max-w-xl leading-relaxed text-muted-foreground"
          >
            {archetype.description}
          </Text>

          {/* Correspondence chips */}
          <div className="mb-6 flex justify-center md:justify-start">
            <CorrespondenceChips archetype={archetype} />
          </div>

          {/* Alternative attributions from other traditions */}
          {archetype.alternativeAttributions && archetype.alternativeAttributions.length > 0 && (
            <div className="mb-6 flex justify-center md:justify-start">
              <AlternativeAttributions
                attributions={archetype.alternativeAttributions}
                className="w-full max-w-sm"
              />
            </div>
          )}

          {/* Hebrew letter detail */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground md:justify-start">
            <span className="text-2xl">{archetype.hebrewLetter.letter}</span>
            <span>
              {archetype.hebrewLetter.name}, meaning &quot;{archetype.hebrewLetter.meaning}&quot;
            </span>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
