import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Heading, Text } from "@radix-ui/themes";
import { auth } from "@/lib/auth";
import { db, spiritualProfiles } from "@/lib/db";
import {
  type PositionSlug,
  type NumerologyDigit,
  POSITION_TYPES,
  slugToType,
  getNumberMeaning,
  getPositionMeaning,
  getRelatedPatterns,
  isValidNumerologyDigit,
  findMatchingPositions,
  getAllPositionTypes,
} from "@/lib/numerology";
import { getPatternByNumber } from "@/lib/numbers";
import {
  NumerologyPositionHero,
  NumerologyPersonalizationCallout,
} from "@/components/numerology";
import { PatternCard } from "@/components/numbers";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard } from "@/components/animated-card";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.space";

/** All valid numerology digits */
const ALL_DIGITS: NumerologyDigit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

interface PositionDigitPageProps {
  positionSlug: PositionSlug;
  digitParam: string;
}

/**
 * Shared component for position + digit pages (e.g., /numbers/life-path/7).
 * Shows position-specific meaning, base archetype, related patterns, and cross-links.
 */
export async function PositionDigitPage({
  positionSlug,
  digitParam,
}: PositionDigitPageProps) {
  const digit = parseInt(digitParam, 10);

  // Validate digit
  if (!isValidNumerologyDigit(digit)) {
    notFound();
  }

  const position = POSITION_TYPES[positionSlug];
  const coreType = slugToType(positionSlug);
  const baseMeaning = getNumberMeaning(digit);
  const positionMeaning = getPositionMeaning(coreType, digit);

  if (!position || !baseMeaning) {
    notFound();
  }

  // Get related angel patterns
  const relatedPatternIds = getRelatedPatterns(digit);
  const relatedPatterns = relatedPatternIds
    .slice(0, 6)
    .map((id) => getPatternByNumber(id))
    .filter((p): p is NonNullable<typeof p> => p != null);

  // Get other positions for cross-linking
  const otherPositions = getAllPositionTypes().filter(
    (p) => p.slug !== positionSlug
  );

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
    headline: positionMeaning?.title ?? `${position.name} ${digit}`,
    description:
      positionMeaning?.description ?? `${position.name} ${digit} meaning`,
    url: `${baseUrl}/numbers/${positionSlug}/${digit}`,
    keywords: [
      `${position.name.toLowerCase()} ${digit}`,
      `${position.name.toLowerCase()} number ${digit}`,
      baseMeaning.name.toLowerCase(),
      ...baseMeaning.keywords,
    ].join(", "),
    publisher: {
      "@type": "Organization",
      name: "WavePoint",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/numbers/${positionSlug}/${digit}`,
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
          name: position.name,
          item: `${baseUrl}/numbers/${positionSlug}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${digit}`,
          item: `${baseUrl}/numbers/${positionSlug}/${digit}`,
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
              href={`/numbers/${positionSlug}`}
              className="text-sm text-muted-foreground hover:text-[var(--color-gold)] transition-colors"
            >
              ← All {position.name} numbers
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
          <NumerologyPositionHero
            positionSlug={positionSlug}
            digit={digit}
            className="mb-12"
          />

          {/* Base Archetype Link */}
          <AnimateOnScroll delay={0.4} className="mb-12">
            <AnimatedCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Text
                    size="2"
                    weight="medium"
                    className="mb-1 block text-muted-foreground"
                  >
                    Core archetype
                  </Text>
                  <Link
                    href={`/numbers/digit/${digit}`}
                    className="text-[var(--color-gold)] hover:underline"
                  >
                    <Text size="4" weight="medium">
                      {digit} - {baseMeaning.name}
                    </Text>
                  </Link>
                </div>
                <Link
                  href={`/numbers/digit/${digit}`}
                  className="text-sm text-muted-foreground hover:text-[var(--color-gold)] transition-colors"
                >
                  Learn more →
                </Link>
              </div>
            </AnimatedCard>
          </AnimateOnScroll>

          {/* Other Positions with this Digit */}
          <AnimateOnScroll delay={0.45} className="mb-12">
            <Heading
              size="4"
              className="mb-4 font-display text-[var(--color-gold)]"
            >
              {digit} in other positions
            </Heading>
            <Text className="mb-4 text-muted-foreground">
              Explore how {baseMeaning.name.replace("The ", "")} energy
              manifests in other areas of your numerology chart.
            </Text>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {otherPositions.map((pos) => (
                <Link
                  key={pos.slug}
                  href={`/numbers/${pos.slug}/${digit}`}
                  className="p-3 rounded-lg border border-border/50 hover:border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)]/5 transition-colors text-center"
                >
                  <Text size="2" weight="medium" className="text-foreground">
                    {pos.name} {digit}
                  </Text>
                </Link>
              ))}
            </div>
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

          {/* Browse links */}
          <AnimateOnScroll delay={0.55} className="text-center space-y-2">
            <Link
              href={`/numbers/${positionSlug}`}
              className="block text-sm text-muted-foreground hover:text-[var(--color-gold)] transition-colors"
            >
              View all {position.name} numbers →
            </Link>
            <Link
              href="/numbers"
              className="block text-sm text-muted-foreground hover:text-[var(--color-gold)] transition-colors"
            >
              Browse all number meanings →
            </Link>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}

/**
 * Generate static params for all digit pages within a position
 */
export function generateDigitStaticParams() {
  return ALL_DIGITS.map((digit) => ({
    digit: String(digit),
  }));
}

/**
 * Generate metadata for position + digit pages
 */
export function generatePositionDigitMetadata(
  positionSlug: PositionSlug,
  digitParam: string
) {
  const digit = parseInt(digitParam, 10);

  if (!isValidNumerologyDigit(digit)) {
    return { title: "Not Found" };
  }

  const position = POSITION_TYPES[positionSlug];
  const baseMeaning = getNumberMeaning(digit);
  const coreType = slugToType(positionSlug);
  const positionMeaning = getPositionMeaning(coreType, digit);

  if (!position || !baseMeaning) {
    return { title: "Not Found" };
  }

  return {
    title:
      positionMeaning?.title ?? `${position.name} ${digit} - ${baseMeaning.name}`,
    description:
      positionMeaning?.description ??
      `Discover the meaning of ${position.name} ${digit}. ${baseMeaning.brief}`,
    keywords: [
      `${position.name.toLowerCase()} ${digit}`,
      `${position.name.toLowerCase()} number ${digit}`,
      `numerology ${position.name.toLowerCase()}`,
      baseMeaning.name.toLowerCase(),
      ...baseMeaning.keywords,
    ],
    openGraph: {
      title: `${position.name} ${digit} - ${baseMeaning.name} | WavePoint`,
      description:
        positionMeaning?.description ??
        `${position.name} ${digit} meaning in numerology.`,
    },
  };
}
