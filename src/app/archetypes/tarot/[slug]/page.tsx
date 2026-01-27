import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllMajorArcana,
  isValidMajorArcanaSlug,
  getMajorArcanaWithRelations,
  type MajorArcanaSlug,
} from "@/lib/tarot";
import {
  TarotHero,
  TarotMeanings,
  TarotRelated,
} from "@/components/tarot";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.space";

/**
 * Generate static params for all Major Arcana cards.
 */
export async function generateStaticParams() {
  return getAllMajorArcana().map((card) => ({
    slug: card.slug,
  }));
}

/**
 * Generate SEO metadata for tarot card pages.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!isValidMajorArcanaSlug(slug)) {
    return {
      title: "Card Not Found",
    };
  }

  const card = getMajorArcanaWithRelations(slug as MajorArcanaSlug);

  if (!card) {
    return {
      title: "Card Not Found",
    };
  }

  return {
    title: `${card.name} (${card.romanNumeral})`,
    description: `${card.name}: ${card.archetype}. ${card.keywords.join(", ")}. Psychological interpretation of the Major Arcana.`,
    keywords: [
      `${card.name.toLowerCase()} tarot`,
      `${card.name.toLowerCase()} meaning`,
      `major arcana ${card.romanNumeral}`,
      ...card.keywords,
      "major arcana",
      "tarot archetypes",
      "psychological tarot",
    ],
    openGraph: {
      title: `${card.name} | WavePoint`,
      description: `${card.archetype}. ${card.keywords.join(", ")}`,
      images: [
        {
          url: card.imagePath,
          alt: `${card.name} tarot card`,
        },
      ],
    },
  };
}

export default async function TarotDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isValidMajorArcanaSlug(slug)) {
    notFound();
  }

  const card = getMajorArcanaWithRelations(slug as MajorArcanaSlug);

  if (!card) {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: card.name,
    description: card.archetype,
    url: `${baseUrl}/archetypes/tarot/${card.slug}`,
    keywords: card.keywords.join(", "),
    image: `${baseUrl}${card.imagePath}`,
    publisher: {
      "@type": "Organization",
      name: "WavePoint",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/archetypes/tarot/${card.slug}`,
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
          name: "Major Arcana",
          item: `${baseUrl}/archetypes#major-arcana`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: card.name,
          item: `${baseUrl}/archetypes/tarot/${card.slug}`,
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
          <TarotHero card={card} />

          {/* Interpretations */}
          <div className="mb-12">
            <TarotMeanings card={card} />
          </div>

          {/* Related Archetype */}
          <div className="mb-12">
            <TarotRelated card={card} />
          </div>
        </div>
      </div>
    </main>
  );
}
