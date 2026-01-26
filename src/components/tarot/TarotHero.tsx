"use client";

import Link from "next/link";
import Image from "next/image";
import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import type { MajorArcanaWithRelations } from "@/lib/tarot";
import { TAROT_STYLES } from "@/lib/theme/tarot-styles";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { TarotCardFrame } from "./TarotCardFrame";

interface TarotHeroProps {
  card: MajorArcanaWithRelations;
}

/**
 * Hero section for tarot detail page.
 * Features large framed card with warm gold styling,
 * Roman numeral watermark, and floating gold particles.
 */
export function TarotHero({ card }: TarotHeroProps) {
  return (
    <AnimateOnScroll className="mb-12">
      <Link
        href="/archetypes#major-arcana"
        className="mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
      >
        &larr; All Major Arcana
      </Link>

      {/* Hero panel with warm gold gradient */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-gradient-to-br p-6 md:p-10",
          TAROT_STYLES.hero.gradient
        )}
      >
        {/* Floating gold dust particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full animate-float"
              style={{
                backgroundColor: `${TAROT_STYLES.colors.gold}4D`, // 30% opacity
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
                animationDelay: `${(i * 0.25) % 5}s`,
                animationDuration: `${8 + (i % 4)}s`,
              }}
            />
          ))}
        </div>

        {/* Roman numeral watermark */}
        <span
          className={cn(
            "absolute right-4 top-4 md:right-8 md:top-8",
            "font-display text-[8rem] md:text-[12rem] leading-none tracking-wider",
            "opacity-[0.06]"
          )}
          style={{ color: TAROT_STYLES.colors.goldBright }}
          aria-hidden="true"
        >
          {card.romanNumeral}
        </span>

        <div className="relative flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
          {/* Card image with ornate frame */}
          <div className="mx-auto w-full max-w-[240px] flex-shrink-0 md:mx-0 md:max-w-[280px]">
            <TarotCardFrame
              className={cn(
                "rounded-xl",
                "bg-gradient-to-br",
                TAROT_STYLES.card.gradient
              )}
              style={{
                boxShadow: TAROT_STYLES.hero.frameGlow,
              }}
            >
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ aspectRatio: "2 / 3" }}
              >
                <Image
                  src={card.imagePath}
                  alt={`${card.name} tarot card`}
                  fill
                  sizes="(max-width: 768px) 240px, 280px"
                  className="object-cover object-top"
                  priority
                />

                {/* Vignette overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.25) 100%)",
                  }}
                />
              </div>
            </TarotCardFrame>
          </div>

          {/* Card info */}
          <div className="flex-1">
            {/* Number badge */}
            <Text
              size="2"
              weight="medium"
              className="mb-2 block tracking-widest"
              style={{ color: TAROT_STYLES.colors.gold }}
            >
              {card.romanNumeral} • MAJOR ARCANA
            </Text>

            {/* Name */}
            <Heading
              size="9"
              className="mb-3 font-display tracking-wide"
              style={{ color: TAROT_STYLES.colors.goldBright }}
            >
              {card.name}
            </Heading>

            {/* Archetype tagline */}
            <Text
              size="5"
              className="mb-6 block max-w-xl italic text-foreground/80"
            >
              {card.archetype}
            </Text>

            {/* Keywords */}
            <div className="mb-6 flex flex-wrap gap-2">
              {card.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border px-3 py-1 text-xs"
                  style={{
                    borderColor: `${TAROT_STYLES.colors.gold}33`,
                    color: TAROT_STYLES.colors.gold,
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* Navigation to adjacent cards */}
            <div className="flex items-center gap-4 text-sm">
              {card.previousCard && (
                <Link
                  href={`/archetypes/tarot/${card.previousCard}`}
                  className="text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
                >
                  &larr; Previous
                </Link>
              )}
              {card.nextCard && (
                <Link
                  href={`/archetypes/tarot/${card.nextCard}`}
                  className="text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
                >
                  Next &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
