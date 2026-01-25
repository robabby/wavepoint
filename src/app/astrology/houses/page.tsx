import type { Metadata } from "next";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { getAllHouses } from "@/lib/astrology/houses";
import {
  HouseCard,
  HouseTable,
  HouseTypeLegend,
} from "@/components/astrology/houses";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard } from "@/components/animated-card";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.guide";

export const metadata: Metadata = {
  title: "Astrological Houses | Astrology | WavePoint",
  description:
    "Explore the 12 astrological houses: from the House of Self to the House of the Unconscious. Discover how each house governs specific life areas and experiences.",
  keywords: [
    "astrological houses",
    "12 houses astrology",
    "first house",
    "natal chart houses",
    "angular houses",
    "succedent houses",
    "cadent houses",
    "house meanings",
    "ascendant",
    "midheaven",
  ],
  openGraph: {
    title: "Astrological Houses | WavePoint",
    description:
      "The 12 houses of the natal chart and their governance over life areas from identity to transcendence.",
  },
};

export default function HousesIndexPage() {
  const allHouses = getAllHouses();

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Astrological Houses",
    description:
      "Explore the 12 astrological houses and how they govern different areas of life experience.",
    url: `${baseUrl}/astrology/houses`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allHouses.map((house, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/astrology/houses/${house.number}`,
        name: house.name,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <AnimateOnScroll className="mb-12 text-center">
            <Link
              href="/astrology"
              className="mb-4 inline-block text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
            >
              &larr; Astrology
            </Link>
            <Heading
              size="9"
              className="mb-4 font-display tracking-widest text-[var(--color-gold)]"
            >
              HOUSES
            </Heading>
            <Text size="4" className="mx-auto max-w-2xl text-muted-foreground">
              The twelve houses of the natal chart, each governing specific
              domains of life from identity to transcendence.
            </Text>
          </AnimateOnScroll>

          {/* House Type Legend */}
          <AnimateOnScroll delay={0.1} className="mb-12">
            <HouseTypeLegend />
          </AnimateOnScroll>

          {/* All Houses Grid - Numerical Order */}
          <AnimateOnScroll delay={0.15} className="mb-12">
            <StaggerChildren
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
              staggerDelay={0.03}
            >
              {allHouses.map((house) => (
                <StaggerItem key={house.number}>
                  <HouseCard house={house} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </AnimateOnScroll>

          {/* Quick Reference Table */}
          <AnimateOnScroll delay={0.35}>
            <AnimatedCard className="p-6 sm:p-8">
              <Heading
                size="5"
                className="mb-6 font-display text-[var(--color-gold)]"
              >
                Quick Reference
              </Heading>
              <HouseTable houses={allHouses} />
            </AnimatedCard>
          </AnimateOnScroll>

          {/* Cross-links */}
          <AnimateOnScroll delay={0.4} className="mt-12 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/astrology/signs"
                className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
              >
                Explore the zodiac signs &rarr;
              </Link>
              <span className="text-muted-foreground/30">|</span>
              <Link
                href="/astrology/planets"
                className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
              >
                Explore the planets &rarr;
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
