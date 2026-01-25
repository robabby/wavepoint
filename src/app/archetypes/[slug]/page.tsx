import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heading, Text } from "@radix-ui/themes";
import {
  getAllArchetypes,
  isValidArchetypeSlug,
  getArchetypeWithRelations,
  type ArchetypeSlug,
} from "@/lib/archetypes";
import {
  ArchetypeHero,
  RelatedContent,
  ArchetypeNav,
} from "@/components/archetypes";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { AnimatedCard } from "@/components/animated-card";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.guide";

/**
 * Generate static params for all archetypes.
 */
export async function generateStaticParams() {
  return getAllArchetypes().map((archetype) => ({
    slug: archetype.slug,
  }));
}

/**
 * Generate SEO metadata for archetype pages.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!isValidArchetypeSlug(slug)) {
    return {
      title: "Archetype Not Found",
    };
  }

  const archetype = getArchetypeWithRelations(slug as ArchetypeSlug);

  if (!archetype) {
    return {
      title: "Archetype Not Found",
    };
  }

  return {
    title: `${archetype.romanNumeral} ${archetype.name}`,
    description: archetype.description,
    keywords: [
      `${archetype.name.toLowerCase()} tarot`,
      `${archetype.name.toLowerCase()} meaning`,
      archetype.jungianArchetype.toLowerCase(),
      ...archetype.keywords,
      "major arcana",
      "tarot archetypes",
    ],
    openGraph: {
      title: `${archetype.romanNumeral} ${archetype.name} | WavePoint`,
      description: archetype.description,
      images: [
        {
          url: archetype.imagePath,
          alt: `${archetype.name} tarot card`,
        },
      ],
    },
  };
}

export default async function ArchetypeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isValidArchetypeSlug(slug)) {
    notFound();
  }

  const archetype = getArchetypeWithRelations(slug as ArchetypeSlug);

  if (!archetype) {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${archetype.romanNumeral} ${archetype.name}`,
    description: archetype.description,
    url: `${baseUrl}/archetypes/${archetype.slug}`,
    keywords: archetype.keywords.join(", "),
    image: `${baseUrl}${archetype.imagePath}`,
    publisher: {
      "@type": "Organization",
      name: "WavePoint",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/archetypes/${archetype.slug}`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Archetypes",
          item: `${baseUrl}/archetypes`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: archetype.name,
          item: `${baseUrl}/archetypes/${archetype.slug}`,
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
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <ArchetypeHero archetype={archetype} />

          {/* Keywords */}
          <AnimateOnScroll delay={0.1} className="mb-12">
            <Text
              size="2"
              weight="medium"
              className="mb-3 block text-[var(--color-gold-bright)]"
            >
              Key themes
            </Text>
            <div className="flex flex-wrap gap-2">
              {archetype.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-[var(--color-gold)]/20 bg-card/30 px-3 py-1 text-xs text-muted-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </AnimateOnScroll>

          {/* Meanings Section */}
          <AnimateOnScroll delay={0.15} className="mb-12">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Upright Meanings */}
              <AnimatedCard className="p-6">
                <Heading
                  size="3"
                  className="mb-4 font-display text-[var(--color-gold)]"
                >
                  Upright
                </Heading>
                <ul className="space-y-2">
                  {archetype.uprightMeanings.map((meaning) => (
                    <li
                      key={meaning}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-gold)]/40" />
                      <span className="capitalize">{meaning}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedCard>

              {/* Reversed Meanings */}
              <AnimatedCard className="p-6">
                <Heading
                  size="3"
                  className="mb-4 font-display text-muted-foreground"
                >
                  Reversed
                </Heading>
                <ul className="space-y-2">
                  {archetype.reversedMeanings.map((meaning) => (
                    <li
                      key={meaning}
                      className="flex items-start gap-2 text-sm text-muted-foreground/80"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                      <span className="capitalize">{meaning}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedCard>
            </div>
          </AnimateOnScroll>

          {/* Related Content */}
          <div className="mb-12">
            <RelatedContent archetype={archetype} />
          </div>

          {/* Navigation */}
          <ArchetypeNav
            previous={archetype.previous}
            next={archetype.next}
          />
        </div>
      </div>
    </main>
  );
}
