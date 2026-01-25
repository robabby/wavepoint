import type { Metadata } from "next";
import { Heading, Text } from "@radix-ui/themes";
import { getAllArchetypes, getArchetypesByAttribution } from "@/lib/archetypes";
import { ArchetypeCard } from "@/components/archetypes";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.guide";

export const metadata: Metadata = {
  title: "Archetypes",
  description:
    "Explore the 22 Major Arcana as archetypal patterns. Each card represents a universal theme mapped to astrological and elemental correspondences.",
  openGraph: {
    title: "Archetypes | WavePoint",
    description:
      "Discover the Major Arcana as archetypal patterns. Explore planetary, zodiacal, and elemental correspondences.",
  },
  keywords: [
    "major arcana",
    "archetypes",
    "tarot meanings",
    "golden dawn",
    "sacred correspondences",
    "jungian archetypes",
    "planetary correspondences",
    "zodiac tarot",
  ],
};

export default function ArchetypesPage() {
  const allArchetypes = getAllArchetypes();
  const elementalArchetypes = getArchetypesByAttribution("element");
  const planetaryArchetypes = getArchetypesByAttribution("planet");
  const zodiacalArchetypes = getArchetypesByAttribution("zodiac");

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Archetypes - Major Arcana",
    description:
      "Explore the 22 Major Arcana as archetypal patterns. Each card represents a universal theme mapped to astrological and elemental correspondences.",
    url: `${baseUrl}/archetypes`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allArchetypes.length,
      itemListElement: allArchetypes.map((archetype, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/archetypes/${archetype.slug}`,
        name: `${archetype.romanNumeral} - ${archetype.name}`,
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
        {/* Hero */}
        <AnimateOnScroll className="mb-16 text-center">
          <Heading
            size="9"
            className="mb-4 font-display tracking-wide text-foreground"
          >
            Archetypes
          </Heading>
          <Text
            size="4"
            className="mx-auto max-w-2xl text-muted-foreground"
          >
            The 22 Major Arcana represent universal patterns of human experience.
            Each archetype maps to planetary, zodiacal, or elemental correspondences
            through the Golden Dawn tradition.
          </Text>
        </AnimateOnScroll>

        {/* Elemental Archetypes */}
        {elementalArchetypes.length > 0 && (
          <section className="mb-16">
            <AnimateOnScroll className="mb-8">
              <div className="flex items-baseline gap-3">
                <Heading
                  size="5"
                  className="font-display text-[var(--color-gold)]"
                >
                  Elemental
                </Heading>
                <Text size="2" className="text-muted-foreground">
                  Pure elemental forces
                </Text>
              </div>
            </AnimateOnScroll>

            <StaggerChildren
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6"
              staggerDelay={0.05}
            >
              {elementalArchetypes.map((archetype) => (
                <StaggerItem key={archetype.slug}>
                  <ArchetypeCard archetype={archetype} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        )}

        {/* Planetary Archetypes */}
        {planetaryArchetypes.length > 0 && (
          <section className="mb-16">
            <AnimateOnScroll className="mb-8">
              <div className="flex items-baseline gap-3">
                <Heading
                  size="5"
                  className="font-display text-[var(--color-gold)]"
                >
                  Planetary
                </Heading>
                <Text size="2" className="text-muted-foreground">
                  Celestial influences
                </Text>
              </div>
            </AnimateOnScroll>

            <StaggerChildren
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6"
              staggerDelay={0.05}
            >
              {planetaryArchetypes.map((archetype) => (
                <StaggerItem key={archetype.slug}>
                  <ArchetypeCard archetype={archetype} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        )}

        {/* Zodiacal Archetypes */}
        {zodiacalArchetypes.length > 0 && (
          <section className="mb-16">
            <AnimateOnScroll className="mb-8">
              <div className="flex items-baseline gap-3">
                <Heading
                  size="5"
                  className="font-display text-[var(--color-gold)]"
                >
                  Zodiacal
                </Heading>
                <Text size="2" className="text-muted-foreground">
                  Signs of the zodiac
                </Text>
              </div>
            </AnimateOnScroll>

            <StaggerChildren
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-6"
              staggerDelay={0.03}
            >
              {zodiacalArchetypes.map((archetype) => (
                <StaggerItem key={archetype.slug}>
                  <ArchetypeCard archetype={archetype} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        )}

        {/* Browse all link */}
        <AnimateOnScroll className="text-center">
          <Text size="2" className="text-muted-foreground">
            {allArchetypes.length} archetypes in the Major Arcana
          </Text>
        </AnimateOnScroll>
      </div>
    </main>
  );
}
