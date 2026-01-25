"use client";

import { Heading } from "@radix-ui/themes";
import type { Archetype } from "@/lib/archetypes";
import { AnimatedCard } from "@/components/animated-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface ArchetypeFrameworkProps {
  archetype: Archetype;
}

/**
 * 2-column grid displaying the Jungian archetype framework.
 * Shows: Core Desire, Greatest Fear, Goal, Strategy, Talent, Weakness
 */
export function ArchetypeFramework({ archetype }: ArchetypeFrameworkProps) {
  const frameworkItems = [
    { label: "Core Desire", value: archetype.coreDesire },
    { label: "Greatest Fear", value: archetype.greatestFear },
    { label: "Goal", value: archetype.goal },
    { label: "Strategy", value: archetype.strategy },
    { label: "Talent", value: archetype.talent },
    { label: "Weakness", value: archetype.weakness },
  ];

  return (
    <AnimateOnScroll delay={0.15}>
      <Heading
        size="4"
        className="mb-6 font-display text-[var(--color-gold)]"
      >
        The Framework
      </Heading>

      <div className="grid gap-4 sm:grid-cols-2">
        {frameworkItems.map((item) => (
          <AnimatedCard key={item.label} className="p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-[var(--color-gold)]/70">
              {item.label}
            </div>
            <div className="mt-2 text-sm leading-relaxed text-foreground/90">
              {item.value}
            </div>
          </AnimatedCard>
        ))}
      </div>
    </AnimateOnScroll>
  );
}
