"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  NumberHeroInput,
  PatternCard,
  NumberSearchResults,
} from "@/components/numbers";
import { cn } from "@/lib/utils";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard } from "@/components/animated-card";
import { searchPatterns, type NumberPattern, type CategoryMeta } from "@/lib/numbers";

interface NumbersPageClientProps {
  featuredPatterns: NumberPattern[];
  categories: CategoryMeta[];
  patternsByCategory: Record<string, NumberPattern[]>;
  signalEnabled: boolean;
}

/**
 * Client component for the Numbers page with live search functionality.
 */
export function NumbersPageClient({
  featuredPatterns,
  categories,
  patternsByCategory,
  signalEnabled,
}: NumbersPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter patterns based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchPatterns(searchQuery);
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <>
      {/* Hero Section */}
      <section className={cn(
        "flex flex-col items-center justify-center px-4 text-center",
        "transition-all duration-300 ease-out",
        isSearching ? "py-8" : "min-h-[70vh] py-16"
      )}>
        <AnimateOnScroll className={cn(
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
        {/* Show search results when searching */}
        {isSearching ? (
          <section className="mb-16">
            <NumberSearchResults query={searchQuery} results={searchResults} />
          </section>
        ) : (
          <>
            {/* Featured Patterns */}
            <section id="featured" className="mb-16 scroll-mt-8 lg:mb-24">
              <AnimateOnScroll className="mb-8 text-center">
                <Heading
                  size="6"
                  className="font-display text-[var(--color-gold)]"
                >
                  Most encountered
                </Heading>
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

        {/* Signal CTA */}
        <AnimateOnScroll>
          <AnimatedCard className="mx-auto max-w-2xl p-8 text-center">
            <Heading
              size="5"
              className="mb-3 font-display text-foreground"
            >
              Notice these patterns often?
            </Heading>

            <Text className="mb-6 text-muted-foreground">
              {signalEnabled
                ? "Signal helps you track what you see and find meaning over time."
                : "Track what you see and find meaning over time with Signal."}
            </Text>

            <Link
              href={signalEnabled ? "/signal" : "/signal"}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)]/10 px-6 py-3 text-sm font-medium text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)]/20"
            >
              {signalEnabled ? "View your signals" : "Start tracking"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimatedCard>
        </AnimateOnScroll>
      </div>
    </>
  );
}
