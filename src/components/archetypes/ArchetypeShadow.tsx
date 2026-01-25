"use client";

import { Heading, Text } from "@radix-ui/themes";
import type { Archetype } from "@/lib/archetypes";
import { AnimatedCard } from "@/components/animated-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface ArchetypeShadowProps {
  archetype: Archetype;
}

/**
 * Shadow aspect card with copper/bronze accent.
 * Displays the archetype's dark side.
 */
export function ArchetypeShadow({ archetype }: ArchetypeShadowProps) {
  return (
    <AnimateOnScroll delay={0.2}>
      <AnimatedCard className="relative overflow-hidden border-[var(--color-copper)]/20 bg-card/50">
        {/* Subtle grain texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative p-6">
          <Heading
            size="3"
            className="mb-4 font-display text-[var(--color-copper)]"
          >
            The Shadow
          </Heading>

          <Text
            size="3"
            className="leading-relaxed text-muted-foreground"
          >
            {archetype.shadow}
          </Text>
        </div>
      </AnimatedCard>
    </AnimateOnScroll>
  );
}
