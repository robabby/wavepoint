"use client";

import { Heading, Text } from "@radix-ui/themes";
import type { ZodiacSignWithRelations } from "@/lib/astrology/signs";
import { AnimatedCard } from "@/components/animated-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface SignTraitsProps {
  sign: ZodiacSignWithRelations;
}

/**
 * Displays strengths and challenges for a zodiac sign
 * in a two-column grid layout.
 */
export function SignTraits({ sign }: SignTraitsProps) {
  return (
    <AnimateOnScroll delay={0.15}>
      <Heading
        size="4"
        className="mb-6 font-display text-[var(--color-gold)]"
      >
        Traits
      </Heading>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Strengths Column */}
        <AnimatedCard className="relative overflow-hidden p-5">
          {/* Gold-tinted glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(212, 168, 75, 0.15) 0%, transparent 70%)",
            }}
          />

          <div className="relative">
            <Text
              size="1"
              weight="medium"
              className="mb-4 block uppercase tracking-wider text-[var(--color-gold)]/70"
            >
              Strengths
            </Text>

            <ul className="space-y-2.5">
              {sign.traits.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-gold)]/60"
                    aria-hidden="true"
                  />
                  <Text size="2" className="text-muted-foreground">
                    {strength}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </AnimatedCard>

        {/* Challenges Column */}
        <AnimatedCard className="relative overflow-hidden p-5">
          {/* Copper-tinted glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(184, 115, 51, 0.15) 0%, transparent 70%)",
            }}
          />

          <div className="relative">
            <Text
              size="1"
              weight="medium"
              className="mb-4 block uppercase tracking-wider text-[var(--color-copper)]/70"
              style={{ color: "rgba(184, 115, 51, 0.7)" }}
            >
              Challenges
            </Text>

            <ul className="space-y-2.5">
              {sign.traits.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: "rgba(184, 115, 51, 0.6)" }}
                    aria-hidden="true"
                  />
                  <Text size="2" className="text-muted-foreground">
                    {challenge}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </AnimatedCard>
      </div>
    </AnimateOnScroll>
  );
}
