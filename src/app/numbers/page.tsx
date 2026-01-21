import type { Metadata } from "next";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { ArrowRight, ChevronDown } from "lucide-react";
import { NumberHeroInput, PatternCard } from "@/components/numbers";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard } from "@/components/animated-card";
import { isSignalEnabled } from "@/lib/signal/feature-flags";
import {
  getFeaturedPatterns,
  getAllCategories,
  getPatternsByCategory,
  getAllPatterns,
} from "@/lib/numbers";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.guide";

export const metadata: Metadata = {
  title: "Number Meanings",
  description:
    "Explore the meanings behind repeating numbers like 111, 444, and 1111. Often called angel numbers, these recurring sequences appear when you're paying attention.",
  openGraph: {
    title: "Number Meanings | WavePoint",
    description:
      "Discover what repeating number patterns mean. Explore 111, 222, 333, 444, and other angel number sequences.",
  },
  keywords: [
    "angel numbers",
    "number meanings",
    "111 meaning",
    "444 meaning",
    "1111 meaning",
    "repeating numbers",
    "number patterns",
    "numerology",
  ],
};

export default function NumbersPage() {
  const featuredPatterns = getFeaturedPatterns();
  const categories = getAllCategories();
  const signalEnabled = isSignalEnabled();
  const allPatterns = getAllPatterns();

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Number Meanings",
    description:
      "Explore the meanings behind repeating numbers like 111, 444, and 1111. Often called angel numbers, these recurring sequences appear when you're paying attention.",
    url: `${baseUrl}/numbers`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allPatterns.length,
      itemListElement: allPatterns.map((pattern, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/numbers/${pattern.id}`,
        name: `${pattern.id} - ${pattern.title}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-cream)]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
        <AnimateOnScroll className="flex flex-col items-center gap-8">
          <Heading
            size="9"
            className="font-display text-[var(--color-cream)]"
          >
            What did you notice?
          </Heading>

          <NumberHeroInput placeholder="444" />

          <Text
            size="3"
            className="max-w-md text-[var(--color-warm-gray)]"
          >
            Often called angel numbers, these recurring sequences appear when
            you&apos;re paying attention.
          </Text>

          <a
            href="#featured"
            className="mt-4 flex flex-col items-center gap-1 text-[var(--color-dim)] transition-colors hover:text-[var(--color-gold)]"
            aria-label="Scroll to explore patterns"
          >
            <span className="text-sm">explore</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </a>
        </AnimateOnScroll>
      </section>

      <div className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
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
          const patterns = getPatternsByCategory(category.id);
          if (patterns.length === 0) return null;

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
                  <Text size="2" className="text-[var(--color-dim)]">
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

        {/* Signal CTA */}
        <AnimateOnScroll>
          <AnimatedCard className="mx-auto max-w-2xl p-8 text-center">
            <Heading
              size="5"
              className="mb-3 font-display text-[var(--color-cream)]"
            >
              Notice these patterns often?
            </Heading>

            <Text className="mb-6 text-[var(--color-warm-gray)]">
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
    </main>
  );
}
