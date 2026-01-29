"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getNumberMeaning,
  getRelatedPatterns,
  isMasterNumber,
  hasNumerologyProfile,
  type PartialNumerologyProfile,
} from "@/lib/numerology";
import { AnimatedCard } from "@/components/animated-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface YourNumbersSectionProps {
  /** User's numerology data (null if no profile) */
  numerology: PartialNumerologyProfile | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * "Your Numbers" section for the Numbers hub page.
 * Shows personalized numerology data for authenticated users with profiles,
 * or a CTA to complete their profile.
 * Not rendered for unauthenticated users.
 */
export function YourNumbersSection({
  numerology,
  isAuthenticated,
  className,
}: YourNumbersSectionProps) {
  // Don't show for unauthenticated users
  if (!isAuthenticated) return null;

  const hasProfile = hasNumerologyProfile(numerology);

  // CTA to complete profile
  if (!hasProfile) {
    return (
      <AnimateOnScroll className={className}>
        <section className="mb-12 lg:mb-16">
          <Heading
            size="5"
            className="mb-6 font-display text-[var(--color-gold)]"
          >
            Your Numbers
          </Heading>

          <AnimatedCard className="p-8 text-center">
            <div className="mb-4">
              <span className="text-[var(--color-gold)]/60 text-lg">✦</span>
              <Text size="5" weight="medium" className="mx-3 text-foreground">
                Discover your numbers
              </Text>
              <span className="text-[var(--color-gold)]/60 text-lg">✦</span>
            </div>

            <Text className="mb-6 block max-w-md mx-auto text-muted-foreground">
              Add your birth details to see your personal numerology and related patterns.
            </Text>

            <Link
              href="/settings/profile"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)]/10 px-6 py-3 text-sm font-medium text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)]/20"
            >
              Complete Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimatedCard>
        </section>
      </AnimateOnScroll>
    );
  }

  // User has numerology profile
  const lifePath = numerology!.lifePath;
  const lifePathMeaning = lifePath ? getNumberMeaning(lifePath) : null;
  const isLifePathMaster = lifePath ? isMasterNumber(lifePath) : false;

  // Get related patterns based on Life Path
  const relatedPatterns = lifePath
    ? getRelatedPatterns(lifePath).slice(0, 6)
    : [];

  // Secondary numbers for grid
  const secondaryNumbers = [
    { digit: numerology!.expression, label: "Expression", slug: "expression" },
    { digit: numerology!.soulUrge, label: "Soul Urge", slug: "soul-urge" },
    { digit: numerology!.personality, label: "Personality", slug: "personality" },
    { digit: numerology!.birthday, label: "Birthday", slug: "birthday" },
    { digit: numerology!.maturity, label: "Maturity", slug: "maturity" },
  ].filter((n) => n.digit != null);

  return (
    <AnimateOnScroll className={className}>
      <section className="mb-12 lg:mb-16">
        {/* Header with link to profile */}
        <div className="mb-6 flex items-center justify-between">
          <Heading
            size="5"
            className="font-display text-[var(--color-gold)]"
          >
            Your Numbers
          </Heading>
          <Link
            href="/profile"
            className="text-sm text-muted-foreground hover:text-[var(--color-gold)] transition-colors"
          >
            View profile →
          </Link>
        </div>

        <AnimatedCard className="p-6 sm:p-8">
          {/* Life Path Hero */}
          {lifePath && lifePathMeaning && (
            <Link
              href={`/numerology/life-path/${lifePath}`}
              className="block mb-6 pb-6 border-b border-border/50 hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center gap-6">
                {/* Large digit */}
                <div
                  className={cn(
                    "font-display text-6xl sm:text-7xl",
                    isLifePathMaster ? "text-[var(--color-gold)]" : "text-foreground"
                  )}
                  style={{
                    textShadow: "0 0 30px var(--glow-gold)",
                  }}
                >
                  {lifePath}
                </div>

                {/* Info */}
                <div className="text-left">
                  <Text size="2" className="text-muted-foreground mb-1 block">
                    Life Path · {lifePathMeaning.name}
                  </Text>
                  <Text size="3" className="text-foreground">
                    Your core journey and purpose
                  </Text>
                </div>
              </div>
            </Link>
          )}

          {/* Secondary Numbers Grid */}
          {secondaryNumbers.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
              {secondaryNumbers.map(({ digit, label, slug }) => {
                const isMaster = digit ? isMasterNumber(digit) : false;

                return (
                  <Link
                    key={slug}
                    href={`/numerology/${slug}/${digit}`}
                    className="text-center p-3 rounded-lg border border-border/50 hover:border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)]/5 transition-colors"
                  >
                    <div
                      className={cn(
                        "font-display text-2xl mb-1",
                        isMaster ? "text-[var(--color-gold)]" : "text-foreground"
                      )}
                    >
                      {digit}
                    </div>
                    <Text size="1" className="text-muted-foreground">
                      {label}
                    </Text>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Related Patterns */}
          {relatedPatterns.length > 0 && (
            <div className="pt-4 border-t border-border/50">
              <Text
                size="1"
                weight="medium"
                className="mb-3 block uppercase tracking-wider text-muted-foreground"
              >
                Related patterns
              </Text>
              <div className="flex flex-wrap gap-2">
                {relatedPatterns.map((pattern) => (
                  <Link
                    key={pattern}
                    href={`/numbers/${pattern}`}
                    className="rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 px-3 py-1 font-mono text-sm text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)]/10"
                  >
                    {pattern}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </AnimatedCard>
      </section>
    </AnimateOnScroll>
  );
}
