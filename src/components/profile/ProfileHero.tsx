"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { Pencil } from "lucide-react";
import { ZODIAC_META } from "@/lib/astrology";
import type { BigThree } from "@/lib/profile";
import { AnimatedCard } from "@/components/animated-card";

interface ProfileHeroProps {
  bigThree: BigThree;
}

/**
 * Hero section displaying the Big Three placements.
 */
export function ProfileHero({ bigThree }: ProfileHeroProps) {
  const sunMeta = ZODIAC_META[bigThree.sun.sign];
  const moonMeta = ZODIAC_META[bigThree.moon.sign];
  const risingMeta = bigThree.rising ? ZODIAC_META[bigThree.rising.sign] : null;

  return (
    <div className="mb-12">
      <div className="mb-8 flex items-center justify-between">
        <Heading size="7" className="font-display text-foreground">
          Your Cosmic Blueprint
        </Heading>
        <Link
          href="/settings#birth-data"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 px-4 py-2 text-sm text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)]/10"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </div>

      {/* Chart placeholder - will be replaced with SVG wheel in Phase 2 */}
      <div className="mb-8 flex justify-center">
        <div className="flex h-48 w-48 items-center justify-center rounded-full border border-[var(--color-gold)]/20 bg-card/30">
          <div className="text-center">
            <div className="mb-2 text-4xl">
              {sunMeta.glyph}
            </div>
            <Text size="1" className="text-muted-foreground">
              Chart visualization coming soon
            </Text>
          </div>
        </div>
      </div>

      {/* Big Three cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Sun */}
        <Link href={`/astrology/signs/${bigThree.sun.sign}`} className="block">
          <AnimatedCard className="p-5 text-center transition-colors hover:border-[var(--color-gold)]/40">
            <div className="mb-2 text-3xl">{sunMeta.glyph}</div>
            <Text size="1" weight="medium" className="mb-1 block uppercase tracking-wider text-muted-foreground">
              Sun
            </Text>
            <Heading size="4" className="font-display capitalize text-[var(--color-gold)]">
              {bigThree.sun.sign}
            </Heading>
            <Text size="1" className="text-muted-foreground">
              {bigThree.sun.degree.toFixed(0)}°
            </Text>
          </AnimatedCard>
        </Link>

        {/* Moon */}
        <Link href={`/astrology/signs/${bigThree.moon.sign}`} className="block">
          <AnimatedCard className="p-5 text-center transition-colors hover:border-[var(--color-gold)]/40">
            <div className="mb-2 text-3xl">{moonMeta.glyph}</div>
            <Text size="1" weight="medium" className="mb-1 block uppercase tracking-wider text-muted-foreground">
              Moon
            </Text>
            <Heading size="4" className="font-display capitalize text-[var(--color-gold)]">
              {bigThree.moon.sign}
            </Heading>
            <Text size="1" className="text-muted-foreground">
              {bigThree.moon.degree.toFixed(0)}°
            </Text>
          </AnimatedCard>
        </Link>

        {/* Rising */}
        {risingMeta && bigThree.rising ? (
          <Link href={`/astrology/signs/${bigThree.rising.sign}`} className="block">
            <AnimatedCard className="p-5 text-center transition-colors hover:border-[var(--color-gold)]/40">
              <div className="mb-2 text-3xl">{risingMeta.glyph}</div>
              <Text size="1" weight="medium" className="mb-1 block uppercase tracking-wider text-muted-foreground">
                Rising
              </Text>
              <Heading size="4" className="font-display capitalize text-[var(--color-gold)]">
                {bigThree.rising.sign}
              </Heading>
              <Text size="1" className="text-muted-foreground">
                {bigThree.rising.degree.toFixed(0)}°
              </Text>
            </AnimatedCard>
          </Link>
        ) : (
          <AnimatedCard className="p-5 text-center">
            <div className="mb-2 text-3xl text-muted-foreground/30">↑</div>
            <Text size="1" weight="medium" className="mb-1 block uppercase tracking-wider text-muted-foreground">
              Rising
            </Text>
            <Text size="2" className="text-muted-foreground/60">
              Add birth time to reveal
            </Text>
          </AnimatedCard>
        )}
      </div>
    </div>
  );
}
