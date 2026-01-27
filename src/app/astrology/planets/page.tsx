import type { Metadata } from "next";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import {
  getAllPlanets,
  getClassicalPlanets,
  getOuterPlanets,
} from "@/lib/astrology/planets";
import { PlanetCard, CorrespondencesTable } from "@/components/astrology";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard } from "@/components/animated-card";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.space";

export const metadata: Metadata = {
  title: "The Planets | Astrology | WavePoint",
  description:
    "Explore the ten planets in astrology: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto. Discover their connections to numerology and sacred geometry.",
  keywords: [
    "planets astrology",
    "sun astrology",
    "moon astrology",
    "saturn astrology",
    "pluto astrology",
    "planet meanings",
    "planet numerology",
    "classical planets",
  ],
  openGraph: {
    title: "The Planets | WavePoint",
    description:
      "Ten celestial bodies and their correspondences with numbers, elements, and sacred geometry.",
  },
};

export default function PlanetsIndexPage() {
  const allPlanets = getAllPlanets();
  const classicalPlanets = getClassicalPlanets();
  const outerPlanets = getOuterPlanets();

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "The Planets",
    description:
      "Explore the ten planets in astrology and their correspondences with numerology and sacred geometry.",
    url: `${baseUrl}/astrology/planets`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allPlanets.map((planet, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/astrology/planets/${planet.id}`,
        name: planet.name,
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
              ← Astrology
            </Link>
            <Heading
              size="9"
              className="mb-4 font-display tracking-widest text-[var(--color-gold)]"
            >
              THE PLANETS
            </Heading>
            <Text size="4" className="mx-auto max-w-2xl text-muted-foreground">
              Celestial bodies in the astrological tradition, each carrying
              ancient associations with numbers, elements, and geometry.
            </Text>
          </AnimateOnScroll>

          {/* Classical Seven */}
          {classicalPlanets.length > 0 && (
            <AnimateOnScroll delay={0.1} className="mb-12">
              <div className="mb-6">
                <Heading
                  size="5"
                  className="mb-2 font-display text-[var(--color-gold)]"
                >
                  The Classical Seven
                </Heading>
                <Text size="2" className="text-muted-foreground">
                  Known to ancient observers, visible without telescopes
                </Text>
              </div>

              <StaggerChildren
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                staggerDelay={0.05}
              >
                {classicalPlanets.map((planet) => (
                  <StaggerItem key={planet.id}>
                    <PlanetCard planet={planet} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </AnimateOnScroll>
          )}

          {/* Outer Planets */}
          {outerPlanets.length > 0 && (
            <AnimateOnScroll delay={0.2} className="mb-12">
              <div className="mb-6">
                <Heading
                  size="5"
                  className="mb-2 font-display text-[var(--color-gold)]"
                >
                  The Outer Planets
                </Heading>
                <Text size="2" className="text-muted-foreground">
                  Discovered in the modern era, representing transpersonal forces
                </Text>
              </div>

              <StaggerChildren
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                staggerDelay={0.05}
              >
                {outerPlanets.map((planet) => (
                  <StaggerItem key={planet.id}>
                    <PlanetCard planet={planet} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </AnimateOnScroll>
          )}

          {/* Coming Soon Notice (when not all planets available) */}
          {allPlanets.length < 10 && (
            <AnimateOnScroll delay={0.25} className="mb-12">
              <div className="rounded-xl border border-dashed border-[var(--border-gold)]/30 bg-card/10 p-6 text-center">
                <Text className="text-muted-foreground">
                  More planets coming soon. Currently featuring{" "}
                  <span className="text-[var(--color-gold)]">
                    {allPlanets.map((p) => p.name).join(", ")}
                  </span>
                  .
                </Text>
              </div>
            </AnimateOnScroll>
          )}

          {/* Quick Reference Table */}
          {allPlanets.length > 0 && (
            <AnimateOnScroll delay={0.3}>
              <AnimatedCard className="p-6 sm:p-8">
                <Heading
                  size="5"
                  className="mb-6 font-display text-[var(--color-gold)]"
                >
                  Quick Reference
                </Heading>
                <CorrespondencesTable planets={allPlanets} />
              </AnimatedCard>
            </AnimateOnScroll>
          )}

          {/* Cross-links */}
          <AnimateOnScroll delay={0.4} className="mt-12 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/astrology/nodes"
                className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
              >
                Explore sensitive points →
              </Link>
              <span className="text-muted-foreground/30">|</span>
              <Link
                href="/numbers"
                className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
              >
                Explore number meanings →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
