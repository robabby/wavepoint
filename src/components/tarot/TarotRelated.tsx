"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import type { MajorArcanaCard } from "@/lib/tarot";
import { getArchetypeBySlug } from "@/lib/archetypes";
import { TAROT_STYLES } from "@/lib/theme/tarot-styles";
import { AnimatedCard } from "@/components/animated-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface TarotRelatedProps {
  card: MajorArcanaCard;
}

/**
 * Related content section showing linked Jungian archetype.
 * Only renders for cards with established correspondences (5 pairs).
 */
export function TarotRelated({ card }: TarotRelatedProps) {
  if (!card.relatedJungianArchetype) {
    return null;
  }

  const archetype = getArchetypeBySlug(card.relatedJungianArchetype);

  if (!archetype) {
    return null;
  }

  return (
    <AnimateOnScroll delay={0.25}>
      <Heading
        size="4"
        className="mb-6 font-display"
        style={{ color: TAROT_STYLES.colors.goldBright }}
      >
        Connections
      </Heading>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatedCard className="p-5">
          <Text
            size="2"
            weight="medium"
            className="mb-3 block"
            style={{ color: TAROT_STYLES.colors.goldBright }}
          >
            Related Jungian Archetype
          </Text>

          <Link
            href={`/archetypes/${archetype.slug}`}
            className="group inline-flex items-center gap-2 rounded-full border bg-card/30 px-4 py-2 text-sm transition-colors hover:border-[var(--color-gold)]/40"
            style={{
              borderColor: `${TAROT_STYLES.colors.gold}33`,
            }}
          >
            <span className="text-muted-foreground transition-colors group-hover:text-[var(--color-gold)]">
              {archetype.name}
            </span>
            <span
              className="text-xs opacity-60"
              style={{ color: TAROT_STYLES.colors.gold }}
            >
              →
            </span>
          </Link>

          <Text size="1" className="mt-3 block text-muted-foreground/60">
            Shared archetypal themes and psychological patterns
          </Text>
        </AnimatedCard>
      </div>
    </AnimateOnScroll>
  );
}
