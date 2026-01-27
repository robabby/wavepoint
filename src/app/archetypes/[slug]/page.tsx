import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Text } from "@radix-ui/themes";
import {
  getAllArchetypes,
  isValidArchetypeSlug,
  getArchetypeWithRelations,
  type ArchetypeSlug,
} from "@/lib/archetypes";
import {
  ArchetypeHero,
  ArchetypeFramework,
  ArchetypeShadow,
  RelatedContent,
} from "@/components/archetypes";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.space";

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
    title: archetype.name,
    description: `${archetype.name}: ${archetype.motto}. ${archetype.description.split("\n")[0]}`,
    keywords: [
      `${archetype.name.toLowerCase()} archetype`,
      `${archetype.name.toLowerCase()} jungian`,
      ...archetype.keywords,
      "jungian archetype",
      "psychological archetype",
      "carl jung",
    ],
    openGraph: {
      title: `${archetype.name} | WavePoint`,
      description: `${archetype.motto}. ${archetype.keywords.join(", ")}`,
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
    headline: archetype.name,
    description: archetype.description.split("\n")[0],
    url: `${baseUrl}/archetypes/${archetype.slug}`,
    keywords: archetype.keywords.join(", "),
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
              Key Themes
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

          {/* Jungian Framework */}
          <div className="mb-12">
            <ArchetypeFramework archetype={archetype} />
          </div>

          {/* Shadow Aspect */}
          <div className="mb-12">
            <ArchetypeShadow archetype={archetype} />
          </div>

          {/* Related Content */}
          <div className="mb-12">
            <RelatedContent archetype={archetype} />
          </div>
        </div>
      </div>
    </main>
  );
}
