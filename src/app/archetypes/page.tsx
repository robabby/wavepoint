import type { Metadata } from "next";
import { Heading, Text } from "@radix-ui/themes";
import { getAllArchetypes } from "@/lib/archetypes";
import { ArchetypeCard } from "@/components/archetypes";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.guide";

export const metadata: Metadata = {
  title: "Archetypes",
  description:
    "Explore the 12 Jungian archetypes as psychological patterns. Each archetype represents a universal theme of human experience with planetary and elemental correspondences.",
  openGraph: {
    title: "Archetypes | WavePoint",
    description:
      "Discover the 12 Jungian psychological archetypes. Explore planetary and elemental correspondences.",
  },
  keywords: [
    "jungian archetypes",
    "psychological archetypes",
    "carl jung",
    "hero archetype",
    "shadow archetype",
    "carol pearson",
    "planetary correspondences",
    "archetypal psychology",
  ],
};

export default function ArchetypesPage() {
  const allArchetypes = getAllArchetypes();

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Jungian Archetypes",
    description:
      "Explore the 12 Jungian archetypes as psychological patterns. Each archetype represents a universal theme of human experience.",
    url: `${baseUrl}/archetypes`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allArchetypes.length,
      itemListElement: allArchetypes.map((archetype, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/archetypes/${archetype.slug}`,
        name: archetype.name,
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
            Twelve patterns of the psyche. Based on Carl Jung&apos;s archetypal psychology,
            each archetype represents a universal theme of human experience,
            connected through planetary and elemental correspondences.
          </Text>
        </AnimateOnScroll>

        {/* 3x4 Grid of Archetypes */}
        <StaggerChildren
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
          staggerDelay={0.04}
        >
          {allArchetypes.map((archetype) => (
            <StaggerItem key={archetype.slug}>
              <ArchetypeCard archetype={archetype} />
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Footer note */}
        <AnimateOnScroll className="mt-16 text-center">
          <Text size="2" className="text-muted-foreground">
            {allArchetypes.length} archetypes in the Jungian framework
          </Text>
        </AnimateOnScroll>
      </div>
    </main>
  );
}
