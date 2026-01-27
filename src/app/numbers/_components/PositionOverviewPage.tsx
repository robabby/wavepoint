import Link from "next/link";
import { eq } from "drizzle-orm";
import { Heading, Text } from "@radix-ui/themes";
import { auth } from "@/lib/auth";
import { db, spiritualProfiles } from "@/lib/db";
import {
  type PositionSlug,
  POSITION_TYPES,
  slugToType,
  getNumberMeaning,
  isMasterNumber,
  type NumerologyDigit,
} from "@/lib/numerology";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard } from "@/components/animated-card";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.space";

/** All valid numerology digits */
const ALL_DIGITS: NumerologyDigit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

interface PositionOverviewPageProps {
  slug: PositionSlug;
}

/**
 * Shared component for position overview pages.
 * Shows position info and grid of all 12 digits.
 */
export async function PositionOverviewPage({ slug }: PositionOverviewPageProps) {
  const position = POSITION_TYPES[slug];
  const coreType = slugToType(slug);

  if (!position) {
    return null;
  }

  // Fetch user's digit for this position
  let userDigit: number | null = null;
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
        // Get the user's digit for this position
        const fieldMap = {
          lifePath: "lifePath",
          birthday: "birthday",
          expression: "expression",
          soulUrge: "soulUrge",
          personality: "personality",
          maturity: "maturity",
        } as const;
        const field = fieldMap[coreType as keyof typeof fieldMap];
        userDigit = field ? profile[field] ?? null : null;
      }
    }
  } catch {
    // Auth or DB error - continue without personalization
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${position.name} Number Meanings`,
    description: position.description,
    url: `${baseUrl}/numbers/${slug}`,
    keywords: position.seoKeywords.join(", "),
    publisher: {
      "@type": "Organization",
      name: "WavePoint",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/numbers/${slug}`,
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
          item: `${baseUrl}/numbers/${slug}`,
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
          {/* Back link */}
          <AnimateOnScroll className="mb-8 text-center">
            <Link
              href="/numbers"
              className="text-sm text-muted-foreground hover:text-[var(--color-gold)] transition-colors"
            >
              ← All numbers
            </Link>
          </AnimateOnScroll>

          {/* Hero Section */}
          <AnimateOnScroll className="mb-12 text-center">
            <Heading
              size="8"
              className="mb-4 font-display text-[var(--color-gold)]"
            >
              {position.name} Number
            </Heading>

            <Text size="5" className="mb-6 block max-w-2xl mx-auto text-muted-foreground">
              {position.brief}
            </Text>
          </AnimateOnScroll>

          {/* Description Card */}
          <AnimateOnScroll delay={0.1} className="mb-12">
            <AnimatedCard className="p-6 sm:p-8">
              <Text size="3" className="leading-relaxed text-muted-foreground mb-6 block">
                {position.description}
              </Text>

              <div className="border-t border-border/50 pt-6">
                <Text
                  size="2"
                  weight="medium"
                  className="mb-2 block text-[var(--color-gold)]"
                >
                  How it&apos;s calculated
                </Text>
                <Text size="2" className="text-muted-foreground">
                  {position.calculation}
                </Text>
              </div>

              {position.requiresBirthName && (
                <div className="mt-4 rounded-lg bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 p-4">
                  <Text size="2" className="text-[var(--color-gold)]">
                    This number requires your birth name for calculation.{" "}
                    <Link
                      href="/settings/profile"
                      className="underline underline-offset-2 hover:no-underline"
                    >
                      Add it in your profile
                    </Link>
                    .
                  </Text>
                </div>
              )}
            </AnimatedCard>
          </AnimateOnScroll>

          {/* User's Number (if available) */}
          {userDigit && (
            <AnimateOnScroll delay={0.15} className="mb-12">
              <div className="text-center">
                <Text
                  size="2"
                  weight="medium"
                  className="mb-4 block uppercase tracking-wider text-muted-foreground"
                >
                  Your {position.name} Number
                </Text>
                <Link
                  href={`/numbers/${slug}/${userDigit}`}
                  className="inline-block"
                >
                  <div
                    className={`font-display text-7xl ${isMasterNumber(userDigit) ? "text-[var(--color-gold)]" : "text-foreground"} hover:opacity-80 transition-opacity`}
                    style={{ textShadow: "0 0 40px var(--glow-gold)" }}
                  >
                    {userDigit}
                  </div>
                  <Text size="3" className="mt-2 text-[var(--color-gold)] block">
                    {getNumberMeaning(userDigit)?.name}
                  </Text>
                </Link>
              </div>
            </AnimateOnScroll>
          )}

          {/* All Digits Grid */}
          <AnimateOnScroll delay={0.2}>
            <Heading
              size="5"
              className="mb-6 font-display text-[var(--color-gold)]"
            >
              Explore all {position.name} numbers
            </Heading>

            {/* Single digits */}
            <StaggerChildren
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-6"
              staggerDelay={0.03}
            >
              {ALL_DIGITS.filter((d) => d < 10).map((digit) => (
                <StaggerItem key={digit}>
                  <Link href={`/numbers/${slug}/${digit}`} className="block">
                    <DigitGridCard
                      digit={digit}
                      isUserDigit={userDigit === digit}
                    />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>

            {/* Master numbers */}
            <Text
              size="2"
              weight="medium"
              className="mb-4 block text-[var(--color-gold)]/70"
            >
              Master Numbers
            </Text>
            <StaggerChildren
              className="grid grid-cols-3 gap-4"
              staggerDelay={0.03}
            >
              {ALL_DIGITS.filter((d) => d > 9).map((digit) => (
                <StaggerItem key={digit}>
                  <Link href={`/numbers/${slug}/${digit}`} className="block">
                    <DigitGridCard
                      digit={digit}
                      isUserDigit={userDigit === digit}
                      isMaster
                    />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </AnimateOnScroll>

          {/* Browse link */}
          <AnimateOnScroll delay={0.3} className="mt-12 text-center">
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

/**
 * Simple digit card for the grid display
 */
function DigitGridCard({
  digit,
  isUserDigit = false,
  isMaster = false,
}: {
  digit: number;
  isUserDigit?: boolean;
  isMaster?: boolean;
}) {
  const meaning = getNumberMeaning(digit);

  return (
    <AnimatedCard
      className={`p-4 text-center ${isUserDigit ? "ring-2 ring-[var(--color-gold)]/50" : ""}`}
    >
      <div
        className={`font-display text-3xl sm:text-4xl mb-1 ${isMaster ? "text-[var(--color-gold)]" : "text-foreground"}`}
        style={{
          textShadow: isMaster
            ? "0 0 30px var(--glow-gold)"
            : "0 0 20px var(--glow-gold)",
        }}
      >
        {digit}
      </div>
      {meaning && (
        <Text size="1" className="text-muted-foreground">
          {meaning.name.replace("The ", "")}
        </Text>
      )}
      {isUserDigit && (
        <div className="mt-2 rounded-full bg-[var(--color-gold)]/10 px-2 py-0.5">
          <Text size="1" className="text-[var(--color-gold)]">
            Yours
          </Text>
        </div>
      )}
    </AnimatedCard>
  );
}

/**
 * Generate metadata for position overview pages
 */
export function generatePositionMetadata(slug: PositionSlug) {
  const position = POSITION_TYPES[slug];

  if (!position) {
    return { title: "Not Found" };
  }

  return {
    title: `${position.name} Number Meanings | Numerology`,
    description: position.description,
    keywords: position.seoKeywords,
    openGraph: {
      title: `${position.name} Number | WavePoint`,
      description: position.brief,
    },
  };
}
