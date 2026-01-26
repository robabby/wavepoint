import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heading, Text } from "@radix-ui/themes";
import {
  getAllPlanetIds,
  getPlanet,
  isValidPlanetId,
  getPlanetPath,
  type ContentPlanetId,
} from "@/lib/astrology/planets";
import { getPlanetContent } from "@/lib/content/planets";
import { PlanetHero, CoreIdentityCard } from "@/components/astrology";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { AnimatedCard } from "@/components/animated-card";
import { PatternCard } from "@/components/numbers";
import { getPatternByNumber } from "@/lib/numbers";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.guide";

/**
 * Generate static params for all planets with content.
 */
export async function generateStaticParams() {
  return getAllPlanetIds().map((planet) => ({
    planet,
  }));
}

/**
 * Generate SEO metadata for planet pages.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ planet: string }>;
}): Promise<Metadata> {
  const { planet: planetParam } = await params;

  if (!isValidPlanetId(planetParam)) {
    return {
      title: "Planet Not Found | WavePoint",
    };
  }

  const planet = getPlanet(planetParam as ContentPlanetId);

  if (!planet) {
    return {
      title: "Planet Coming Soon | WavePoint",
      description: `Information about ${planetParam} in astrology is coming soon.`,
    };
  }

  return {
    title: `${planet.name} | Astrology | WavePoint`,
    description: planet.metaDescription,
    keywords: planet.seoKeywords,
    openGraph: {
      title: `${planet.name} - ${planet.archetype} | WavePoint`,
      description: planet.metaDescription,
    },
  };
}

export default async function PlanetDetailPage({
  params,
}: {
  params: Promise<{ planet: string }>;
}) {
  const { planet: planetParam } = await params;

  // Validate planet ID
  if (!isValidPlanetId(planetParam)) {
    notFound();
  }

  const planet = getPlanet(planetParam as ContentPlanetId);

  // Handle planets without content yet
  if (!planet) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Link
              href="/astrology/planets"
              className="mb-4 inline-block text-sm text-muted-foreground hover:text-[var(--color-gold)] transition-colors"
            >
              ← Planets
            </Link>
            <Heading
              size="8"
              className="mb-4 font-display tracking-widest text-[var(--color-gold)]"
            >
              {planetParam.toUpperCase()}
            </Heading>
            <Text className="text-muted-foreground">
              Content for this planet is coming soon. Check back later or
              explore other planets.
            </Text>
            <div className="mt-8">
              <Link
                href="/astrology/planets"
                className="text-sm text-[var(--color-gold)] hover:underline"
              >
                Browse available planets →
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Load MDX content
  const mdxContent = await getPlanetContent(planet.id);

  // Get related number patterns
  const relatedPatterns = planet.numerology.relatedPatterns
    .slice(0, 6)
    .map((pattern) => getPatternByNumber(pattern))
    .filter((p) => p !== undefined);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${planet.name} - ${planet.archetype}`,
    description: planet.metaDescription,
    url: `${baseUrl}${getPlanetPath(planet.id)}`,
    keywords: planet.seoKeywords.join(", "),
    publisher: {
      "@type": "Organization",
      name: "WavePoint",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}${getPlanetPath(planet.id)}`,
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
          name: "Planets",
          item: `${baseUrl}/astrology/planets`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: planet.name,
          item: `${baseUrl}${getPlanetPath(planet.id)}`,
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
          <AnimateOnScroll>
            <PlanetHero planet={planet} />
          </AnimateOnScroll>

          {/* Core Meaning */}
          <AnimateOnScroll delay={0.1}>
            <AnimatedCard className="mb-8 p-6 sm:p-8">
              <Text size="4" className="leading-relaxed text-muted-foreground">
                {planet.coreArchetype.primaryClaim}
              </Text>
            </AnimatedCard>
          </AnimateOnScroll>

          {/* Associated Themes (Keywords) */}
          {planet.keywords.length > 0 && (
            <AnimateOnScroll delay={0.15}>
              <div className="mb-8">
                <h3 className="mb-4 text-base font-medium text-[var(--color-gold-bright)]">
                  Associated themes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {planet.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-[var(--color-gold)]/20 bg-card/30 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          )}

          {/* MDX Content */}
          {mdxContent && (
            <AnimateOnScroll delay={0.2}>
              <div className="prose prose-invert prose-gold mb-12 max-w-none">
                {mdxContent.content}
              </div>
            </AnimateOnScroll>
          )}

          {/* Core Identity Card (if no MDX) */}
          {!mdxContent && (
            <AnimateOnScroll delay={0.2}>
              <CoreIdentityCard planet={planet} className="mb-8" />
            </AnimateOnScroll>
          )}

          {/* Cosmic Connections - Numbers */}
          {relatedPatterns.length > 0 && (
            <AnimateOnScroll delay={0.3} className="mb-12">
              <Heading
                size="4"
                className="mb-6 font-display text-[var(--color-gold)]"
              >
                Cosmic Connections
              </Heading>

              <div className="mb-4">
                <Text
                  size="2"
                  weight="medium"
                  className="mb-3 block text-[var(--color-gold-bright)]"
                >
                  Related Numbers
                </Text>
                <Text size="2" className="mb-4 text-muted-foreground">
                  {planet.name}&apos;s digit is {planet.numerology.digit}.
                  Patterns containing this digit carry {planet.name.toLowerCase()}{" "}
                  energy.
                </Text>
              </div>

              <StaggerChildren
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                staggerDelay={0.05}
              >
                {relatedPatterns.map((pattern) => (
                  <StaggerItem key={pattern.id}>
                    <PatternCard pattern={pattern} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </AnimateOnScroll>
          )}

          {/* Geometry Connection */}
          {planet.geometry && (
            <AnimateOnScroll delay={0.35} className="mb-12">
              <AnimatedCard className="p-6 sm:p-8">
                <Text
                  size="2"
                  weight="medium"
                  className="mb-3 block text-[var(--color-gold-bright)]"
                >
                  Sacred Geometry
                </Text>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--color-gold)]/30 bg-card/50">
                    <span className="font-display text-lg capitalize text-[var(--color-gold)]">
                      {planet.geometry.geometry.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <Link
                      href={`/platonic-solids/${planet.geometry.geometry === "cube" ? "hexahedron" : planet.geometry.geometry}`}
                      className="font-heading text-lg capitalize text-foreground transition-colors hover:text-[var(--color-gold)]"
                    >
                      {planet.geometry.geometry}
                    </Link>
                    <Text size="2" className="mt-1 text-muted-foreground">
                      {planet.geometry.rationale}
                    </Text>
                  </div>
                </div>
              </AnimatedCard>
            </AnimateOnScroll>
          )}

          {/* Browse link */}
          <AnimateOnScroll delay={0.4} className="mt-8 text-center">
            <Link
              href="/astrology/planets"
              className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
            >
              Browse all planets →
            </Link>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
