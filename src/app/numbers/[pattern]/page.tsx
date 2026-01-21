import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heading, Text } from "@radix-ui/themes";
import { ArrowRight } from "lucide-react";
import {
  getAllPatterns,
  getPatternByNumber,
  getRelatedPatterns,
  getCategoryMeta,
  generateComponentBreakdown,
  type NumberPatternId,
} from "@/lib/numbers";
import { getNumberContent } from "@/lib/content/numbers";
import { PatternCard, PersonalizationBadge, ComponentBreakdown } from "@/components/numbers";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard } from "@/components/animated-card";
import { isSignalEnabled } from "@/lib/signal/feature-flags";

/**
 * Generate static params for all known patterns.
 * Uncovered patterns are handled dynamically.
 */
export async function generateStaticParams() {
  return getAllPatterns().map((pattern) => ({
    pattern: pattern.id,
  }));
}

/**
 * Generate SEO metadata for pattern pages.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ pattern: string }>;
}): Promise<Metadata> {
  const { pattern: patternParam } = await params;
  const pattern = getPatternByNumber(patternParam);

  if (pattern) {
    const category = getCategoryMeta(pattern.category);
    return {
      title: `${pattern.id} - ${pattern.title}`,
      description: pattern.meaning,
      keywords: [
        `${pattern.id} meaning`,
        `${pattern.id} angel number`,
        `seeing ${pattern.id}`,
        ...pattern.keywords,
        category?.label.toLowerCase() ?? "",
        "angel numbers",
        "number meanings",
      ],
      openGraph: {
        title: `${pattern.id} Meaning | WavePoint`,
        description: pattern.meaning,
      },
    };
  }

  // Uncovered pattern
  return {
    title: `${patternParam} - Number Meaning`,
    description: `Explore the meaning of ${patternParam}. Understand what this number pattern might signify when you notice it.`,
    openGraph: {
      title: `${patternParam} Meaning | WavePoint`,
      description: `Discover the meaning behind the number ${patternParam}.`,
    },
  };
}

export default async function PatternDetailPage({
  params,
}: {
  params: Promise<{ pattern: string }>;
}) {
  const { pattern: patternParam } = await params;

  // Validate it's a valid number
  if (!/^\d+$/.test(patternParam)) {
    notFound();
  }

  const signalEnabled = isSignalEnabled();
  const pattern = getPatternByNumber(patternParam);

  // Handle uncovered patterns with component breakdown
  if (!pattern) {
    const breakdown = generateComponentBreakdown(patternParam);

    return (
      <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-cream)]">
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl">
            {/* Header */}
            <AnimateOnScroll className="mb-12 text-center">
              <Link
                href="/numbers"
                className="mb-4 inline-block text-sm text-[var(--color-dim)] hover:text-[var(--color-gold)] transition-colors"
              >
                ← All numbers
              </Link>
              <Heading
                size="9"
                className="mb-2 font-display tracking-widest text-[var(--color-gold)]"
              >
                {patternParam}
              </Heading>
              <Text className="text-[var(--color-warm-gray)]">
                This pattern isn&apos;t in our core collection, but let&apos;s explore its components.
              </Text>
            </AnimateOnScroll>

            {/* Component Breakdown */}
            <AnimateOnScroll delay={0.1}>
              <AnimatedCard className="p-6 sm:p-8">
                <ComponentBreakdown breakdown={breakdown} />
              </AnimatedCard>
            </AnimateOnScroll>

            {/* Signal CTA */}
            <AnimateOnScroll delay={0.2} className="mt-12">
              <AnimatedCard className="p-6 text-center sm:p-8">
                <Heading
                  size="5"
                  className="mb-3 font-display text-[var(--color-cream)]"
                >
                  Keep seeing {patternParam}?
                </Heading>
                <Text className="mb-6 text-[var(--color-warm-gray)]">
                  {signalEnabled
                    ? "Track this sighting in Signal to discover patterns over time."
                    : "Track your number sightings and find meaning in the patterns."}
                </Text>
                <Link
                  href={signalEnabled ? "/signal/capture" : "/signal"}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)]/10 px-6 py-3 text-sm font-medium text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)]/20"
                >
                  {signalEnabled ? "Log this sighting" : "Start tracking"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </AnimatedCard>
            </AnimateOnScroll>

            {/* Browse link */}
            <AnimateOnScroll delay={0.3} className="mt-8 text-center">
              <Link
                href="/numbers"
                className="text-sm text-[var(--color-dim)] hover:text-[var(--color-gold)] transition-colors"
              >
                Browse all number meanings →
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </main>
    );
  }

  // Known pattern - fetch MDX content and related patterns
  const mdxContent = await getNumberContent(pattern.id);
  const relatedPatterns = getRelatedPatterns(pattern.id as NumberPatternId);
  const category = getCategoryMeta(pattern.category);

  return (
    <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-cream)]">
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          {/* Hero Section */}
          <AnimateOnScroll className="mb-12 text-center">
            <Link
              href="/numbers"
              className="mb-4 inline-block text-sm text-[var(--color-dim)] hover:text-[var(--color-gold)] transition-colors"
            >
              ← All numbers
            </Link>

            <Heading
              size="9"
              className="mb-4 font-display tracking-widest text-[var(--color-gold)]"
            >
              {pattern.id}
            </Heading>

            <Heading
              size="6"
              as="h2"
              className="mb-4 font-display text-[var(--color-cream)]"
            >
              {pattern.title}
            </Heading>

            {/* Category badge */}
            {category && (
              <span className="mb-4 inline-block rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 px-3 py-1 text-xs text-[var(--color-gold)]">
                {category.label}
              </span>
            )}

            {/* Personalization Badge - Client Island */}
            <div className="mt-4 flex justify-center">
              <PersonalizationBadge pattern={pattern.id} />
            </div>
          </AnimateOnScroll>

          {/* Core Meaning */}
          <AnimateOnScroll delay={0.1}>
            <AnimatedCard className="mb-8 p-6 sm:p-8">
              <Text size="4" className="leading-relaxed text-[var(--color-warm-gray)]">
                {pattern.meaning}
              </Text>
            </AnimatedCard>
          </AnimateOnScroll>

          {/* MDX Content (if available) */}
          {mdxContent && (
            <AnimateOnScroll delay={0.2}>
              <div className="prose prose-invert prose-gold mb-12 max-w-none">
                {mdxContent.content}
              </div>
            </AnimateOnScroll>
          )}

          {/* Keywords */}
          {pattern.keywords.length > 0 && (
            <AnimateOnScroll delay={0.2}>
              <div className="mb-12">
                <Text
                  size="2"
                  weight="medium"
                  className="mb-3 block text-[var(--color-gold-bright)]"
                >
                  Associated themes
                </Text>
                <div className="flex flex-wrap gap-2">
                  {pattern.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-warm-charcoal)]/30 px-3 py-1 text-xs text-[var(--color-warm-gray)]"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          )}

          {/* Related Patterns */}
          {relatedPatterns.length > 0 && (
            <AnimateOnScroll delay={0.3} className="mb-12">
              <Heading
                size="4"
                className="mb-6 font-display text-[var(--color-gold)]"
              >
                Related patterns
              </Heading>
              <StaggerChildren
                className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                staggerDelay={0.05}
              >
                {relatedPatterns.map((related) => (
                  <StaggerItem key={related.id}>
                    <PatternCard pattern={related} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </AnimateOnScroll>
          )}

          {/* Signal CTA */}
          <AnimateOnScroll delay={0.4}>
            <AnimatedCard className="p-6 text-center sm:p-8">
              <Heading
                size="5"
                className="mb-3 font-display text-[var(--color-cream)]"
              >
                Seeing {pattern.id} often?
              </Heading>
              <Text className="mb-6 text-[var(--color-warm-gray)]">
                {signalEnabled
                  ? "Track this sighting in Signal to discover patterns over time."
                  : "Track your number sightings and find meaning in the patterns."}
              </Text>
              <Link
                href={signalEnabled ? "/signal/capture" : "/signal"}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)]/10 px-6 py-3 text-sm font-medium text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)]/20"
              >
                {signalEnabled ? "Log this sighting" : "Start tracking"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </AnimatedCard>
          </AnimateOnScroll>

          {/* Browse link */}
          <AnimateOnScroll delay={0.5} className="mt-8 text-center">
            <Link
              href="/numbers"
              className="text-sm text-[var(--color-dim)] hover:text-[var(--color-gold)] transition-colors"
            >
              Browse all number meanings →
            </Link>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
