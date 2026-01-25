import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Text } from "@radix-ui/themes";
import {
  HOUSE_NUMBERS,
  isValidHouseNumber,
  getHouseWithRelations,
  getAdjacentHouses,
  getHouseByNumber,
  ROMAN_NUMERALS,
  type HouseNumber,
} from "@/lib/astrology/houses";
import {
  HouseHero,
  HouseTraits,
  HouseLifeAreas,
  HouseMeanings,
  HouseAxis,
} from "@/components/astrology/houses";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import {
  HOUSE_TYPE_STYLES,
  DEFAULT_HOUSE_TYPE_STYLE,
} from "@/lib/theme/house-styles";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.guide";

/**
 * Generate static params for all 12 houses.
 */
export async function generateStaticParams() {
  return HOUSE_NUMBERS.map((num) => ({
    house: String(num),
  }));
}

/**
 * Generate SEO metadata for house pages.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ house: string }>;
}): Promise<Metadata> {
  const { house: houseParam } = await params;
  const houseNum = parseInt(houseParam, 10);

  if (!isValidHouseNumber(houseNum)) {
    return {
      title: "House Not Found",
    };
  }

  const house = getHouseByNumber(houseNum);

  if (!house) {
    return {
      title: "House Not Found",
    };
  }

  return {
    title: `${house.name} | Astrological Houses | WavePoint`,
    description: house.metaDescription,
    keywords: house.seoKeywords,
    openGraph: {
      title: `${house.name} | WavePoint`,
      description: `${house.archetype}. ${house.keywords.join(", ")}`,
    },
  };
}

export default async function HouseDetailPage({
  params,
}: {
  params: Promise<{ house: string }>;
}) {
  const { house: houseParam } = await params;
  const houseNum = parseInt(houseParam, 10);

  if (!isValidHouseNumber(houseNum)) {
    notFound();
  }

  const house = getHouseWithRelations(houseNum as HouseNumber);

  if (!house) {
    notFound();
  }

  const { previous, next } = getAdjacentHouses(houseNum as HouseNumber);
  const previousHouse = getHouseByNumber(previous);
  const nextHouse = getHouseByNumber(next);

  const previousStyles = previousHouse
    ? HOUSE_TYPE_STYLES[previousHouse.type] ?? DEFAULT_HOUSE_TYPE_STYLE
    : DEFAULT_HOUSE_TYPE_STYLE;
  const nextStyles = nextHouse
    ? HOUSE_TYPE_STYLES[nextHouse.type] ?? DEFAULT_HOUSE_TYPE_STYLE
    : DEFAULT_HOUSE_TYPE_STYLE;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: house.name,
    description: house.description.split("\n")[0],
    url: `${baseUrl}/astrology/houses/${house.number}`,
    keywords: house.seoKeywords.join(", "),
    publisher: {
      "@type": "Organization",
      name: "WavePoint",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/astrology/houses/${house.number}`,
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
          name: "Houses",
          item: `${baseUrl}/astrology/houses`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: house.name,
          item: `${baseUrl}/astrology/houses/${house.number}`,
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
          <HouseHero house={house} />

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
              {house.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-[var(--color-gold)]/20 bg-card/30 px-3 py-1 text-xs text-muted-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </AnimateOnScroll>

          {/* Traits */}
          <div className="mb-12">
            <HouseTraits house={house} />
          </div>

          {/* Life Areas */}
          <div className="mb-12">
            <HouseLifeAreas house={house} />
          </div>

          {/* Traditional vs Modern Meanings */}
          <div className="mb-12">
            <HouseMeanings house={house} />
          </div>

          {/* Axis Relationship */}
          <div className="mb-12">
            <HouseAxis house={house} />
          </div>

          {/* Navigation to Previous/Next House */}
          <AnimateOnScroll delay={0.35} className="mt-12">
            <div className="flex items-center justify-between border-t border-[var(--color-gold)]/20 pt-8">
              {previousHouse && (
                <Link
                  href={`/astrology/houses/${previous}`}
                  className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
                >
                  <span className="text-lg">&larr;</span>
                  <div className="text-left">
                    <span className="block text-xs text-muted-foreground/60">
                      Previous
                    </span>
                    <span className="flex items-center gap-2">
                      <span
                        className="font-display text-lg"
                        style={{
                          color: "var(--color-gold)",
                          filter: previousStyles.symbolGlow,
                        }}
                      >
                        {ROMAN_NUMERALS[previous]}
                      </span>
                      <span className="font-display text-sm">
                        {previousHouse.name}
                      </span>
                    </span>
                  </div>
                </Link>
              )}

              <div className="flex-1" />

              {nextHouse && (
                <Link
                  href={`/astrology/houses/${next}`}
                  className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
                >
                  <div className="text-right">
                    <span className="block text-xs text-muted-foreground/60">
                      Next
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-display text-sm">
                        {nextHouse.name}
                      </span>
                      <span
                        className="font-display text-lg"
                        style={{
                          color: "var(--color-gold)",
                          filter: nextStyles.symbolGlow,
                        }}
                      >
                        {ROMAN_NUMERALS[next]}
                      </span>
                    </span>
                  </div>
                  <span className="text-lg">&rarr;</span>
                </Link>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
