"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  NumberHeroInput,
  PatternCard,
  NumberSearchResults,
  NumberRain,
} from "@/components/numbers";
import {
  YourNumbersSection,
  NumerologyDigitCard,
  NumerologyPositionCard,
} from "@/components/numerology";
import { cn } from "@/lib/utils";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard } from "@/components/animated-card";
import { searchPatterns, type NumberPattern, type CategoryMeta } from "@/lib/numbers";
import {
  type PartialNumerologyProfile,
  type PositionSlug,
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
  slug: PositionSlug
): number | null {
  const mapping: Record<PositionSlug, keyof PartialNumerologyProfile> = {
    "life-path": "lifePath",
    birthday: "birthday",
    expression: "expression",
    "soul-urge": "soulUrge",
    personality: "personality",
    maturity: "maturity",
  };
  return numerology[mapping[slug]] ?? null;
}

interface NumbersPageClientProps {
  featuredPatterns: NumberPattern[];
  categories: CategoryMeta[];
  patternsByCategory: Record<string, NumberPattern[]>;
  signalEnabled: boolean;
  userNumerology: PartialNumerologyProfile | null;
  isAuthenticated: boolean;
}

/**
 * Client component for the Numbers page with live search functionality.
 */
export function NumbersPageClient({
  featuredPatterns,
  categories,
  patternsByCategory,
  signalEnabled,
  userNumerology,
  isAuthenticated,
}: NumbersPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter patterns based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchPatterns(searchQuery);
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

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

  return (
    <>
      {/* Hero Section */}
      <section className={cn(
        "relative flex flex-col items-center justify-center px-4 text-center",
        "transition-all duration-300 ease-out",
        isSearching ? "py-8" : "min-h-[70vh] py-16"
      )}>
        <NumberRain paused={isSearching} />
        <AnimateOnScroll className={cn(
          "relative z-10",
          "flex flex-col items-center",
          "transition-all duration-300 ease-out",
          isSearching ? "gap-4" : "gap-8"
        )}>
          <Heading
            size="9"
            className="font-display text-foreground"
          >
            What did you notice?
          </Heading>

          <NumberHeroInput
            placeholder="444"
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />

          <Text
            size="3"
            className={cn(
              "max-w-md text-muted-foreground",
              "transition-all duration-200 ease-out",
              isSearching ? "h-0 opacity-0" : "opacity-100"
            )}
            aria-hidden={isSearching}
          >
            Often called angel numbers, these recurring sequences appear when
            you&apos;re paying attention.
          </Text>

          <a
            href="#featured"
            className={cn(
              "mt-4 flex flex-col items-center gap-1 text-muted-foreground transition-all duration-200 ease-out hover:text-[var(--color-gold)]",
              isSearching ? "pointer-events-none h-0 opacity-0" : "opacity-100"
            )}
            aria-label="Scroll to explore patterns"
            aria-hidden={isSearching}
            tabIndex={isSearching ? -1 : 0}
          >
            <span className="text-sm">explore</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </a>
        </AnimateOnScroll>
      </section>

      <div className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        {/* Signal relationship banner - only when Signal is enabled and not searching */}
        {signalEnabled && !isSearching && (
          <AnimateOnScroll className="mb-12">
            <div className="mx-auto max-w-2xl rounded-lg border border-[var(--border-gold)]/20 bg-card/30 px-4 py-3 text-center">
              <Text size="2" className="text-muted-foreground">
                This is your reference guide.{" "}
                <Link
                  href="/signal"
                  className="text-[var(--color-gold)] transition-colors hover:underline"
                >
                  Track the numbers you notice →
                </Link>
              </Text>
            </div>
          </AnimateOnScroll>
        )}

        {/* Show search results when searching */}
        {isSearching ? (
          <section className="mb-16">
            <NumberSearchResults query={searchQuery} results={searchResults} />
          </section>
        ) : (
          <>
            {/* Your Numbers - personalized section for authenticated users */}
            <YourNumbersSection
              numerology={userNumerology}
              isAuthenticated={isAuthenticated}
            />

            {/* The Digits - core archetypes grid */}
            <section id="featured" className="mb-12 scroll-mt-8 lg:mb-16">
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
            <section className="mb-12 lg:mb-16">
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
                  // Get user's digit for this position
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

            {/* Angel Patterns - Featured */}
            <section className="mb-12 lg:mb-16">
              <AnimateOnScroll className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Heading
                      size="5"
                      className="font-display text-[var(--color-gold)]"
                    >
                      Angel Patterns
                    </Heading>
                    <Text size="2" className="text-muted-foreground mt-1">
                      Repeating number sequences and their meanings
                    </Text>
                  </div>
                </div>
              </AnimateOnScroll>

              <StaggerChildren
                className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6"
                staggerDelay={0.05}
              >
                {featuredPatterns.map((pattern) => (
                  <StaggerItem key={pattern.id}>
                    <PatternCard pattern={pattern} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </section>

            {/* Category Sections */}
            {categories.map((category) => {
              const patterns = patternsByCategory[category.id];
              if (!patterns || patterns.length === 0) return null;

              return (
                <section key={category.id} className="mb-12 lg:mb-16">
                  <AnimateOnScroll className="mb-6">
                    <div className="flex items-baseline gap-3">
                      <Heading
                        size="5"
                        className="font-display text-[var(--color-gold)]"
                      >
                        {category.pluralLabel}
                      </Heading>
                      <Text size="2" className="text-muted-foreground">
                        {category.description}
                      </Text>
                    </div>
                  </AnimateOnScroll>

                  <StaggerChildren
                    className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                    staggerDelay={0.03}
                  >
                    {patterns.map((pattern) => (
                      <StaggerItem key={pattern.id}>
                        <PatternCard pattern={pattern} />
                      </StaggerItem>
                    ))}
                  </StaggerChildren>
                </section>
              );
            })}
          </>
        )}

{/* Signal CTA - only shown when Signal feature is enabled */}
        {signalEnabled && (
          <AnimateOnScroll>
            <AnimatedCard className="mx-auto flex max-w-2xl flex-col items-center p-8 text-center">
              <Heading
                size="5"
                className="mb-3 font-display text-foreground"
              >
                Notice these patterns often?
              </Heading>

              <Text className="mb-6 text-muted-foreground">
                Track what you see and find meaning over time with Signal.
              </Text>

              <Link
                href="/signal"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)]/10 px-6 py-3 text-sm font-medium text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)]/20"
              >
                Start tracking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </AnimatedCard>
          </AnimateOnScroll>
        )}
      </div>
    </>
  );
}
