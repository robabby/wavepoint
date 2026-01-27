import type { Metadata } from "next";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { getAllNodes } from "@/lib/astrology/nodes";
import { NodeCard, NodeTable } from "@/components/astrology/nodes";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard } from "@/components/animated-card";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.space";

export const metadata: Metadata = {
  title: "Sensitive Points | Astrology | WavePoint",
  description:
    "Explore the sensitive points in astrology: North Node, South Node, Black Moon Lilith, Chiron, Part of Fortune, and Vertex. Discover their meanings and archetypal significance.",
  keywords: [
    "sensitive points astrology",
    "north node",
    "south node",
    "lunar nodes",
    "black moon lilith",
    "chiron astrology",
    "part of fortune",
    "vertex astrology",
    "karmic astrology",
  ],
  openGraph: {
    title: "Sensitive Points | WavePoint",
    description:
      "Six sensitive points in the natal chart: lunar nodes, Lilith, Chiron, Part of Fortune, and Vertex.",
  },
};

export default function NodesIndexPage() {
  const allNodes = getAllNodes();

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sensitive Points",
    description:
      "Explore the sensitive points in astrology: calculated chart positions representing karmic direction, shadow integration, wounds, fortune, and fated encounters.",
    url: `${baseUrl}/astrology/nodes`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allNodes.map((node, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/astrology/nodes/${node.id}`,
        name: node.name,
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
              SENSITIVE POINTS
            </Heading>
            <Text size="4" className="mx-auto max-w-2xl text-muted-foreground">
              Calculated chart positions representing karmic direction, shadow
              integration, ancestral wounds, fortune, and fated encounters.
            </Text>
          </AnimateOnScroll>

          {/* All Sensitive Points Grid */}
          <AnimateOnScroll delay={0.1} className="mb-12">
            <StaggerChildren
              className="grid grid-cols-2 gap-4 sm:grid-cols-3"
              staggerDelay={0.05}
            >
              {allNodes.map((node) => (
                <StaggerItem key={node.id}>
                  <NodeCard node={node} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </AnimateOnScroll>

          {/* Quick Reference Table */}
          <AnimateOnScroll delay={0.2}>
            <AnimatedCard className="p-6 sm:p-8">
              <Heading
                size="5"
                className="mb-6 font-display text-[var(--color-gold)]"
              >
                Quick Reference
              </Heading>
              <NodeTable nodes={allNodes} />
            </AnimatedCard>
          </AnimateOnScroll>

          {/* Cross-links */}
          <AnimateOnScroll delay={0.3} className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link
                href="/astrology/planets"
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                Explore planets →
              </Link>
              <Link
                href="/astrology/signs"
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                Explore zodiac signs →
              </Link>
              <Link
                href="/astrology/houses"
                className="transition-colors hover:text-[var(--color-gold)]"
              >
                Explore houses →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
