import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Heading, Text } from "@radix-ui/themes";
import { auth } from "@/lib/auth";
import { db, spiritualProfiles } from "@/lib/db";
import {
  getNumberMeaning,
  getRelatedPatterns,
  isValidNumerologyDigit,
  findMatchingPositions,
  getAllPositionTypes,
  type NumerologyDigit,
} from "@/lib/numerology";
import { getPatternByNumber } from "@/lib/numbers";
import {
  NumerologyDigitHero,
  NumerologyPersonalizationCallout,
} from "@/components/numerology";
import { PatternCard } from "@/components/numbers";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.space";

/** Valid numerology digits for static generation */
const VALID_DIGITS: NumerologyDigit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

/**
 * Generate static params for all 12 digit archetype pages.
 */
export async function generateStaticParams() {
  return VALID_DIGITS.map((digit) => ({
    digit: String(digit),
  }));
}

/**
 * Generate SEO metadata for digit archetype pages.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ digit: string }>;
}): Promise<Metadata> {
  const { digit: digitParam } = await params;
  const digit = parseInt(digitParam, 10);

  if (!isValidNumerologyDigit(digit)) {
    return { title: "Number Not Found" };
  }

  const meaning = getNumberMeaning(digit);

  if (!meaning) {
    return { title: "Number Not Found" };
  }

  return {
    title: `${digit} - ${meaning.name} | Numerology`,
    description: meaning.brief,
    keywords: [
      `number ${digit} meaning`,
      `numerology ${digit}`,
      meaning.name.toLowerCase(),
      ...meaning.keywords,
      "numerology",
      "number meanings",
    ],
    openGraph: {
      title: `${digit} - ${meaning.name} | WavePoint`,
      description: meaning.brief,
    },
  };
}

export default async function DigitArchetypePage({
  params,
}: {
  params: Promise<{ digit: string }>;
}) {
  const { digit: digitParam } = await params;
  const digit = parseInt(digitParam, 10);

  // Validate digit
  if (!isValidNumerologyDigit(digit)) {
    notFound();
  }

  const meaning = getNumberMeaning(digit);

  if (!meaning) {
    notFound();
  }

  // Get related angel patterns
  const relatedPatternIds = getRelatedPatterns(digit);
  const relatedPatterns = relatedPatternIds
    .map((id) => getPatternByNumber(id))
    .filter((p): p is NonNullable<typeof p> => p != null);

  // Get position types for "Appears in" section
  const positionTypes = getAllPositionTypes();

  // Fetch user's numerology for personalization
  let userMatchingPositions: ReturnType<typeof findMatchingPositions> = [];
  try {
    const session = await auth();
    if (session?.user?.id) {
      const [profile] = await db
        .select({
          lifePath: spiritualProfiles.lifePathNumber,
          birthday: spiritualProfiles.birthdayNumber,
          expression: spiritualProfiles.expressionNumber,
          soulUrge: spiritualProfiles.soulUrgeNumber,
          personality: spiritualProfiles.personalityNumber,
          maturity: spiritualProfiles.maturityNumber,
        })
        .from(spiritualProfiles)
        .where(eq(spiritualProfiles.userId, session.user.id));

      if (profile) {
        userMatchingPositions = findMatchingPositions(profile, digit);
      }
    }
  } catch {
    // Auth or DB error - continue without personalization
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${digit} - ${meaning.name}`,
    description: meaning.brief,
    url: `${baseUrl}/numbers/digit/${digit}`,
    keywords: meaning.keywords.join(", "),
    publisher: {
      "@type": "Organization",
      name: "WavePoint",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/numbers/digit/${digit}`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Numbers",
          item: `${baseUrl}/numbers`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `${digit}`,
          item: `${baseUrl}/numbers/digit/${digit}`,
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
          {/* Back link */}
          <AnimateOnScroll className="mb-8 text-center">
            <Link
              href="/numbers"
              className="text-sm text-muted-foreground hover:text-[var(--color-gold)] transition-colors"
            >
              ← All numbers
            </Link>
          </AnimateOnScroll>

          {/* Personalization callout */}
          {userMatchingPositions.length > 0 && (
            <div className="mb-6 flex justify-center">
              <NumerologyPersonalizationCallout
                positions={userMatchingPositions}
              />
            </div>
          )}

          {/* Hero Section */}
          <NumerologyDigitHero digit={digit} className="mb-12" />

          {/* Numerology Positions Section */}
          <AnimateOnScroll delay={0.4} className="mb-12">
            <Heading
              size="4"
              className="mb-6 font-display text-[var(--color-gold)]"
            >
              {digit} in numerology positions
            </Heading>
            <Text className="mb-6 text-muted-foreground">
              The meaning of {digit} shifts depending on where it appears in your chart.
              Explore how {meaning.name.replace("The ", "")} energy manifests in each position.
            </Text>
            <StaggerChildren
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              staggerDelay={0.05}
            >
              {positionTypes.map((position) => (
                <StaggerItem key={position.slug}>
                  <Link
                    href={`/numbers/${position.slug}/${digit}`}
                    className="block"
                  >
                    <div className="p-4 rounded-lg border border-border/50 hover:border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)]/5 transition-colors">
                      <Text weight="medium" className="text-foreground">
                        {position.name} {digit}
                      </Text>
                      <Text size="2" className="text-muted-foreground mt-1 block">
                        {position.brief}
                      </Text>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </AnimateOnScroll>

          {/* Related Angel Patterns */}
          {relatedPatterns.length > 0 && (
            <AnimateOnScroll delay={0.5} className="mb-12">
              <Heading
                size="4"
                className="mb-6 font-display text-[var(--color-gold)]"
              >
                Related angel patterns
              </Heading>
              <Text className="mb-6 text-muted-foreground">
                Angel number patterns featuring the energy of {digit}.
              </Text>
              <StaggerChildren
                className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3"
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

          {/* Browse link */}
          <AnimateOnScroll delay={0.6} className="text-center">
            <Link
              href="/numbers"
              className="text-sm text-muted-foreground hover:text-[var(--color-gold)] transition-colors"
            >
              Browse all number meanings →
            </Link>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
