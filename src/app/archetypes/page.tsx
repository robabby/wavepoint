import type { Metadata } from "next";
import { Heading, Text } from "@radix-ui/themes";
import { getAllArchetypes } from "@/lib/archetypes";
import { getAllMajorArcana } from "@/lib/tarot";
import { ArchetypeCard } from "@/components/archetypes";
import { TarotCard, TarotSectionHeader } from "@/components/tarot";
import { SectionNav } from "@/components/section-nav";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { TAROT_STYLES } from "@/lib/theme/tarot-styles";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.guide";

export const metadata: Metadata = {
  title: "Archetypes",
  description:
    "Explore psychological archetypes from Jungian psychology and the Major Arcana tarot. Universal patterns of human experience with planetary, elemental, and symbolic correspondences.",
  openGraph: {
    title: "Archetypes | WavePoint",
    description:
      "Discover the 12 Jungian archetypes and 22 Major Arcana tarot cards. Explore psychological patterns and symbolic correspondences.",
  },
  keywords: [
    "jungian archetypes",
    "psychological archetypes",
    "carl jung",
    "major arcana",
    "tarot archetypes",
    "the fool",
    "hero archetype",
    "shadow archetype",
    "carol pearson",
    "planetary correspondences",
    "archetypal psychology",
  ],
};

const SECTIONS = [
  { id: "jungian-archetypes", label: "Jungian Archetypes" },
  { id: "major-arcana", label: "Major Arcana" },
];

export default function ArchetypesPage() {
  const allArchetypes = getAllArchetypes();
  const allTarotCards = getAllMajorArcana();

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Archetypes",
    description:
      "Explore psychological archetypes from Jungian psychology and the Major Arcana tarot. Universal patterns of human experience.",
    url: `${baseUrl}/archetypes`,
    mainEntity: [
      {
        "@type": "ItemList",
        name: "Jungian Archetypes",
        numberOfItems: allArchetypes.length,
        itemListElement: allArchetypes.map((archetype, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/archetypes/${archetype.slug}`,
          name: archetype.name,
        })),
      },
      {
        "@type": "ItemList",
        name: "Major Arcana",
        numberOfItems: allTarotCards.length,
        itemListElement: allTarotCards.map((card, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${baseUrl}/archetypes/tarot/${card.slug}`,
          name: card.name,
        })),
      },
    ],
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
        <AnimateOnScroll className="mb-8 text-center">
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
            Universal patterns of the psyche. Explore twelve Jungian archetypes
            and twenty-two Major Arcana cards—two complementary maps of the
            human journey toward wholeness.
          </Text>
        </AnimateOnScroll>

        {/* Section Navigation */}
        <SectionNav sections={SECTIONS} className="mb-12" />

        {/* Jungian Archetypes Section */}
        <section id="jungian-archetypes" className="mb-20 scroll-mt-32">
          <AnimateOnScroll className="mb-8 text-center">
            <Heading
              size="7"
              className="mb-3 font-display tracking-wide text-[var(--color-gold-bright)]"
            >
              Jungian Archetypes
            </Heading>
            <Text size="3" className="mx-auto max-w-2xl text-muted-foreground">
              Based on Carl Jung&apos;s archetypal psychology, each archetype represents
              a universal theme of human experience, connected through planetary and
              elemental correspondences.
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

          <AnimateOnScroll className="mt-8 text-center">
            <Text size="2" className="text-muted-foreground">
              {allArchetypes.length} archetypes in the Jungian framework
            </Text>
          </AnimateOnScroll>
        </section>

        {/* Major Arcana Section */}
        <section id="major-arcana" className="scroll-mt-32">
          <TarotSectionHeader className="mb-10" />

          {/* Grid of Tarot Cards with "dealt" animation */}
          <StaggerChildren
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            staggerDelay={TAROT_STYLES.animation.staggerDelay}
          >
            {allTarotCards.map((card) => (
              <StaggerItem key={card.slug}>
                <TarotCard card={card} />
              </StaggerItem>
            ))}
          </StaggerChildren>

          <AnimateOnScroll className="mt-10 text-center">
            <Text
              size="2"
              className="text-muted-foreground"
              style={{ color: TAROT_STYLES.colors.gold, opacity: 0.7 }}
            >
              {allTarotCards.length} cards in the Major Arcana
            </Text>
          </AnimateOnScroll>
        </section>
      </div>
    </main>
  );
}
