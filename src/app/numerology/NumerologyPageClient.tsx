"use client";

import { useMemo } from "react";
import { Heading, Text } from "@radix-ui/themes";
import {
  YourNumbersSection,
  NumerologyDigitCard,
  NumerologyPositionCard,
} from "@/components/numerology";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { SectionNav } from "@/components/section-nav";
import {
  type PartialNumerologyProfile,
  type CoreNumberType,
  getAllPositionSlugs,
  getUserDigits,
  findMatchingPositions,
} from "@/lib/numerology";

/** All numerology digits in display order */
const NUMEROLOGY_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const MASTER_NUMBERS = [11, 22, 33] as const;

/** Get user's digit for a specific numerology position */
function getUserDigitForPosition(
  numerology: PartialNumerologyProfile,
  slug: string
): number | null {
  const mapping: Record<string, keyof PartialNumerologyProfile> = {
    "life-path": "lifePath",
    birthday: "birthday",
    expression: "expression",
    "soul-urge": "soulUrge",
    personality: "personality",
    maturity: "maturity",
  };
  return numerology[mapping[slug] as keyof PartialNumerologyProfile] ?? null;
}

interface NumerologyPageClientProps {
  userNumerology: PartialNumerologyProfile | null;
  isAuthenticated: boolean;
}

export function NumerologyPageClient({
  userNumerology,
  isAuthenticated,
}: NumerologyPageClientProps) {
  // Get user's digits for highlighting in the grid
  const userDigits = useMemo(
    () => getUserDigits(userNumerology),
    [userNumerology]
  );

  // Get positions for each digit (for tooltip explanations)
  const getPositionsForDigit = useMemo(() => {
    return (digit: number): CoreNumberType[] => {
      if (!userNumerology) return [];
      return findMatchingPositions(userNumerology, digit);
    };
  }, [userNumerology]);

  // Get position slugs for the grid
  const positionSlugs = getAllPositionSlugs();

  // Build section nav items
  const sections = useMemo(() => {
    const items = [];
    if (isAuthenticated) {
      items.push({ id: "your-numbers", label: "Your Numbers" });
    }
    items.push(
      { id: "digits", label: "The Digits" },
      { id: "positions", label: "Positions" }
    );
    return items;
  }, [isAuthenticated]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(ellipse at center, var(--glow-gold) 0%, transparent 50%)",
            opacity: 0.05,
          }}
        />

        <AnimateOnScroll className="relative z-10 flex flex-col items-center gap-4">
          <Heading
            size="9"
            className="font-display tracking-widest text-[var(--color-gold)]"
          >
            NUMEROLOGY
          </Heading>

          <Text
            size="4"
            className="max-w-2xl text-muted-foreground"
          >
            The mathematics of destiny. Explore core digit archetypes,
            numerological positions, and the cycles shaping your path.
          </Text>
        </AnimateOnScroll>
      </section>

      {/* Section Nav */}
      <SectionNav sections={sections} />

      <div className="container mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Your Numbers - personalized section for authenticated users */}
        <div id="your-numbers">
          <YourNumbersSection
            numerology={userNumerology}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* The Digits - core archetypes grid */}
        <section id="digits" className="mb-12 scroll-mt-32 lg:mb-16">
          <AnimateOnScroll className="mb-6">
            <Heading
              size="5"
              className="font-display text-[var(--color-gold)]"
            >
              The Digits
            </Heading>
            <Text size="2" className="text-muted-foreground mt-1">
              Core archetypes that form all number meanings
            </Text>
          </AnimateOnScroll>

          {/* Single digits 1-9 */}
          <StaggerChildren
            className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-6 lg:gap-4 mb-4"
            staggerDelay={0.03}
          >
            {NUMEROLOGY_DIGITS.map((digit) => (
              <StaggerItem key={digit}>
                <NumerologyDigitCard
                  digit={digit}
                  isUserDigit={userDigits.has(digit)}
                  userPositions={getPositionsForDigit(digit)}
                />
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Master numbers 11, 22, 33 */}
          <StaggerChildren
            className="grid grid-cols-3 gap-3 lg:gap-4 max-w-md mx-auto sm:max-w-lg"
            staggerDelay={0.03}
          >
            {MASTER_NUMBERS.map((digit) => (
              <StaggerItem key={digit}>
                <NumerologyDigitCard
                  digit={digit}
                  isUserDigit={userDigits.has(digit)}
                  userPositions={getPositionsForDigit(digit)}
                />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>

        {/* Numerology Positions */}
        <section id="positions" className="mb-12 scroll-mt-32 lg:mb-16">
          <AnimateOnScroll className="mb-6">
            <Heading
              size="5"
              className="font-display text-[var(--color-gold)]"
            >
              Numerology Positions
            </Heading>
            <Text size="2" className="text-muted-foreground mt-1">
              Different lenses for understanding your numbers
            </Text>
          </AnimateOnScroll>

          <StaggerChildren
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            staggerDelay={0.05}
          >
            {positionSlugs.map((slug) => {
              const positionDigit = userNumerology
                ? getUserDigitForPosition(userNumerology, slug)
                : null;

              return (
                <StaggerItem key={slug}>
                  <NumerologyPositionCard
                    slug={slug}
                    userDigit={positionDigit}
                  />
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </section>
      </div>
    </>
  );
}
