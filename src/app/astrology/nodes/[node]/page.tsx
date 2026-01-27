import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Text } from "@radix-ui/themes";
import {
  SENSITIVE_POINT_DATA,
  isValidNodeId,
  getNode,
  getAdjacentNodes,
  type SensitivePointId,
} from "@/lib/astrology/nodes";
import { SENSITIVE_POINTS } from "@/lib/astrology/constants";
import { PlanetGlyph } from "@/components/astrology/PlanetGlyph";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import {
  NODE_CATEGORY_STYLES,
  DEFAULT_NODE_CATEGORY_STYLE,
} from "@/lib/theme/node-styles";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.space";

/**
 * Generate static params for all 6 sensitive points.
 */
export async function generateStaticParams() {
  return SENSITIVE_POINTS.map((id) => ({
    node: id,
  }));
}

/**
 * Generate SEO metadata for node pages.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ node: string }>;
}): Promise<Metadata> {
  const { node: nodeParam } = await params;

  if (!isValidNodeId(nodeParam)) {
    return {
      title: "Sensitive Point Not Found",
    };
  }

  const node = getNode(nodeParam);

  if (!node) {
    return {
      title: "Sensitive Point Not Found",
    };
  }

  return {
    title: `${node.name} | Sensitive Points | WavePoint`,
    description: node.metaDescription,
    keywords: node.seoKeywords,
    openGraph: {
      title: `${node.name} | WavePoint`,
      description: `${node.archetype}. ${node.keywords.join(", ")}`,
    },
  };
}

export default async function NodeDetailPage({
  params,
}: {
  params: Promise<{ node: string }>;
}) {
  const { node: nodeParam } = await params;

  if (!isValidNodeId(nodeParam)) {
    notFound();
  }

  const node = getNode(nodeParam);

  if (!node) {
    notFound();
  }

  const { previous, next } = getAdjacentNodes(nodeParam as SensitivePointId);
  const categoryStyles =
    NODE_CATEGORY_STYLES[node.category] ?? DEFAULT_NODE_CATEGORY_STYLE;
  const prevStyles =
    NODE_CATEGORY_STYLES[previous.category] ?? DEFAULT_NODE_CATEGORY_STYLE;
  const nextStyles =
    NODE_CATEGORY_STYLES[next.category] ?? DEFAULT_NODE_CATEGORY_STYLE;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: node.name,
    description: node.coreArchetype.primaryClaim,
    url: `${baseUrl}/astrology/nodes/${node.id}`,
    keywords: node.seoKeywords.join(", "),
    publisher: {
      "@type": "Organization",
      name: "WavePoint",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/astrology/nodes/${node.id}`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Astrology",
          item: `${baseUrl}/astrology`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Sensitive Points",
          item: `${baseUrl}/astrology/nodes`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: node.name,
          item: `${baseUrl}/astrology/nodes/${node.id}`,
        },
      ],
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
        <div className="mx-auto max-w-3xl">
          {/* Hero Section */}
          <AnimateOnScroll className="mb-12 text-center">
            <Link
              href="/astrology/nodes"
              className="mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
            >
              ← Sensitive Points
            </Link>

            {/* Glyph with category-based aura */}
            <div className="relative mx-auto mb-6 flex justify-center">
              {/* Radial aura behind glyph */}
              <div
                className="absolute inset-0 -m-8 rounded-full opacity-40"
                style={{
                  background: `radial-gradient(circle, ${categoryStyles.glowColor} 0%, transparent 70%)`,
                }}
              />
              <PlanetGlyph glyph={node.glyph} size="hero" />
            </div>

            {/* Name and archetype */}
            <h1
              className="mb-2 font-display text-4xl tracking-widest sm:text-5xl"
              style={{
                color: "var(--color-gold)",
                filter: categoryStyles.textGlow,
              }}
            >
              {node.name.toUpperCase()}
            </h1>
            <p className="text-lg text-[var(--color-gold-bright)]">
              {node.archetype}
            </p>
          </AnimateOnScroll>

          {/* Keywords */}
          <AnimateOnScroll delay={0.1} className="mb-12">
            <Text
              size="2"
              weight="medium"
              className="mb-3 block text-[var(--color-gold-bright)]"
            >
              Key Themes
            </Text>
            <div className="flex flex-wrap gap-2">
              {node.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-[var(--color-gold)]/20 bg-card/30 px-3 py-1 text-xs text-muted-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </AnimateOnScroll>

          {/* Core Archetype */}
          <AnimateOnScroll delay={0.15} className="mb-12">
            <Text
              size="2"
              weight="medium"
              className="mb-3 block text-[var(--color-gold-bright)]"
            >
              Core Archetype
            </Text>
            <p className="mb-3 text-foreground/90">
              {node.coreArchetype.primaryClaim}
            </p>
            {node.coreArchetype.wavepointNote && (
              <p className="border-l-2 border-[var(--color-gold)]/30 pl-4 text-sm italic text-muted-foreground">
                {node.coreArchetype.wavepointNote}
              </p>
            )}
          </AnimateOnScroll>

          {/* Mythology */}
          <AnimateOnScroll delay={0.2} className="mb-12">
            <Text
              size="2"
              weight="medium"
              className="mb-3 block text-[var(--color-gold-bright)]"
            >
              Mythology & Origins
            </Text>
            <p className="text-foreground/90">{node.mythology.primaryClaim}</p>
          </AnimateOnScroll>

          {/* Modern Interpretation */}
          <AnimateOnScroll delay={0.25} className="mb-12">
            <Text
              size="2"
              weight="medium"
              className="mb-3 block text-[var(--color-gold-bright)]"
            >
              Modern Interpretation
            </Text>
            <p className="text-foreground/90">
              {node.modernInterpretation.primaryClaim}
            </p>
          </AnimateOnScroll>

          {/* Traits: Strengths & Challenges */}
          <AnimateOnScroll delay={0.3} className="mb-12">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Strengths */}
              <div className="rounded-xl border border-[var(--color-gold)]/20 bg-card/30 p-6">
                <Text
                  size="2"
                  weight="medium"
                  className="mb-4 block text-[var(--color-gold-bright)]"
                >
                  Strengths
                </Text>
                <ul className="space-y-2">
                  {node.traits.strengths.map((strength) => (
                    <li
                      key={strength}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <span className="mt-1 text-[var(--color-gold)]">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenges */}
              <div className="rounded-xl border border-[var(--color-gold)]/20 bg-card/30 p-6">
                <Text
                  size="2"
                  weight="medium"
                  className="mb-4 block text-[var(--color-gold-bright)]"
                >
                  Challenges
                </Text>
                <ul className="space-y-2">
                  {node.traits.challenges.map((challenge) => (
                    <li
                      key={challenge}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <span className="mt-1 text-muted-foreground">•</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Shadow Expression */}
          <AnimateOnScroll delay={0.35} className="mb-12">
            <Text
              size="2"
              weight="medium"
              className="mb-3 block text-[var(--color-gold-bright)]"
            >
              Shadow Expression
            </Text>
            <p className="text-foreground/90">
              {node.shadowExpression.primaryClaim}
            </p>
          </AnimateOnScroll>

          {/* Polarity Point (if applicable) */}
          {node.polarityPoint && (
            <AnimateOnScroll delay={0.4} className="mb-12">
              <div className="rounded-xl border border-[var(--color-gold)]/20 bg-card/30 p-6 text-center">
                <Text
                  size="2"
                  weight="medium"
                  className="mb-3 block text-[var(--color-gold-bright)]"
                >
                  Polarity Point
                </Text>
                <p className="mb-4 text-sm text-muted-foreground">
                  {node.name} exists in dynamic tension with its opposite
                </p>
                <Link
                  href={`/astrology/nodes/${node.polarityPoint}`}
                  className="inline-flex items-center gap-3 rounded-lg border border-[var(--color-gold)]/30 bg-card/50 px-4 py-2 transition-colors hover:border-[var(--color-gold)]/50 hover:bg-card/70"
                >
                  <span className="font-display text-2xl text-[var(--color-gold)]">
                    {SENSITIVE_POINT_DATA[node.polarityPoint]?.glyph}
                  </span>
                  <span className="font-display text-foreground">
                    {SENSITIVE_POINT_DATA[node.polarityPoint]?.name}
                  </span>
                </Link>
              </div>
            </AnimateOnScroll>
          )}

          {/* Navigation to Previous/Next Node */}
          <AnimateOnScroll delay={0.45} className="mt-12">
            <div className="flex items-center justify-between border-t border-[var(--color-gold)]/20 pt-8">
              <Link
                href={`/astrology/nodes/${previous.id}`}
                className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
              >
                <span className="text-lg">←</span>
                <div className="text-left">
                  <span className="block text-xs text-muted-foreground/60">
                    Previous
                  </span>
                  <span className="flex items-center gap-2">
                    <span
                      className="font-display text-lg"
                      style={{
                        color: "var(--color-gold)",
                        filter: prevStyles.symbolGlow,
                      }}
                    >
                      {previous.glyph}
                    </span>
                    <span className="font-display text-sm">{previous.name}</span>
                  </span>
                </div>
              </Link>

              <div className="flex-1" />

              <Link
                href={`/astrology/nodes/${next.id}`}
                className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
              >
                <div className="text-right">
                  <span className="block text-xs text-muted-foreground/60">
                    Next
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-display text-sm">{next.name}</span>
                    <span
                      className="font-display text-lg"
                      style={{
                        color: "var(--color-gold)",
                        filter: nextStyles.symbolGlow,
                      }}
                    >
                      {next.glyph}
                    </span>
                  </span>
                </div>
                <span className="text-lg">→</span>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
