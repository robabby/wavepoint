import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Text } from "@radix-ui/themes";
import { auth } from "@/lib/auth";
import { db, spiritualProfiles } from "@/lib/db";
import { ZODIAC_SIGNS, type ZodiacSign } from "@/lib/astrology";
import {
  isValidSignId,
  getSignWithRelations,
  getAdjacentSigns,
  getSignById,
} from "@/lib/astrology/signs";
import {
  SignHero,
  SignTraits,
  SignAspects,
  SignRelatedContent,
} from "@/components/astrology";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.space";

/**
 * Generate static params for all 12 zodiac signs.
 */
export async function generateStaticParams() {
  return ZODIAC_SIGNS.map((sign) => ({
    sign,
  }));
}

/**
 * Generate SEO metadata for sign pages.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ sign: string }>;
}): Promise<Metadata> {
  const { sign: signId } = await params;

  if (!isValidSignId(signId)) {
    return {
      title: "Sign Not Found",
    };
  }

  const sign = getSignById(signId);

  if (!sign) {
    return {
      title: "Sign Not Found",
    };
  }

  return {
    title: `${sign.name} | Zodiac Signs | WavePoint`,
    description: sign.metaDescription,
    keywords: sign.seoKeywords,
    openGraph: {
      title: `${sign.name} | WavePoint`,
      description: `${sign.archetype}. ${sign.keywords.join(", ")}`,
    },
  };
}

/**
 * Determine which placement(s) match the current sign for the user
 */
type PlacementType = "sun" | "moon" | "rising";

interface UserPlacements {
  sun: ZodiacSign | null;
  moon: ZodiacSign | null;
  rising: ZodiacSign | null;
}

function getMatchingPlacements(signId: string, placements: UserPlacements): PlacementType[] {
  const matches: PlacementType[] = [];
  if (placements.sun === signId) matches.push("sun");
  if (placements.moon === signId) matches.push("moon");
  if (placements.rising === signId) matches.push("rising");
  return matches;
}

export default async function SignDetailPage({
  params,
}: {
  params: Promise<{ sign: string }>;
}) {
  const { sign: signId } = await params;

  if (!isValidSignId(signId)) {
    notFound();
  }

  const sign = getSignWithRelations(signId as ZodiacSign);

  if (!sign) {
    notFound();
  }

  const { previous, next } = getAdjacentSigns(signId as ZodiacSign);
  const previousSign = getSignById(previous);
  const nextSign = getSignById(next);

  // Fetch user's placements if authenticated (optional - doesn't require auth)
  let userMatchingPlacements: PlacementType[] = [];
  try {
    const session = await auth();
    if (session?.user?.id) {
      const [row] = await db
        .select({
          sunSign: spiritualProfiles.sunSign,
          moonSign: spiritualProfiles.moonSign,
          risingSign: spiritualProfiles.risingSign,
        })
        .from(spiritualProfiles)
        .where(eq(spiritualProfiles.userId, session.user.id));

      if (row) {
        userMatchingPlacements = getMatchingPlacements(signId, {
          sun: row.sunSign as ZodiacSign | null,
          moon: row.moonSign as ZodiacSign | null,
          rising: row.risingSign as ZodiacSign | null,
        });
      }
    }
  } catch {
    // Auth or DB error - continue without personalization
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: sign.name,
    description: sign.description.split("\n")[0],
    url: `${baseUrl}/astrology/signs/${sign.id}`,
    keywords: sign.seoKeywords.join(", "),
    publisher: {
      "@type": "Organization",
      name: "WavePoint",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/astrology/signs/${sign.id}`,
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
          name: "Zodiac Signs",
          item: `${baseUrl}/astrology/signs`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: sign.name,
          item: `${baseUrl}/astrology/signs/${sign.id}`,
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
          {/* Personal placement badge */}
          {userMatchingPlacements.length > 0 && (
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 px-4 py-2 text-sm">
                <span className="text-[var(--color-gold)]">✦</span>
                <span className="text-foreground">
                  This is your{" "}
                  <span className="font-medium text-[var(--color-gold)]">
                    {userMatchingPlacements.map((p, i) => (
                      <span key={p}>
                        {i > 0 && (i === userMatchingPlacements.length - 1 ? " & " : ", ")}
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </span>
                    ))}
                  </span>
                  {" "}sign
                </span>
                <span className="text-[var(--color-gold)]">✦</span>
              </div>
            </div>
          )}

          {/* Hero Section */}
          <SignHero sign={sign} />

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
              {sign.keywords.map((keyword) => (
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
            <SignTraits sign={sign} />
          </div>

          {/* Sign Relationships */}
          <div className="mb-12">
            <SignAspects sign={sign} />
          </div>

          {/* Related Content */}
          <div className="mb-12">
            <SignRelatedContent sign={sign} />
          </div>

          {/* Navigation to Previous/Next Sign */}
          <AnimateOnScroll delay={0.3} className="mt-12">
            <div className="flex items-center justify-between border-t border-[var(--color-gold)]/20 pt-8">
              {previousSign && (
                <Link
                  href={`/astrology/signs/${previous}`}
                  className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
                >
                  <span className="text-lg">&larr;</span>
                  <div className="text-left">
                    <span className="block text-xs text-muted-foreground/60">
                      Previous
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-lg text-[var(--color-gold)]">
                        {previousSign.glyph}
                      </span>
                      <span className="font-display text-sm">
                        {previousSign.name}
                      </span>
                    </span>
                  </div>
                </Link>
              )}

              <div className="flex-1" />

              {nextSign && (
                <Link
                  href={`/astrology/signs/${next}`}
                  className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
                >
                  <div className="text-right">
                    <span className="block text-xs text-muted-foreground/60">
                      Next
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-display text-sm">
                        {nextSign.name}
                      </span>
                      <span className="text-lg text-[var(--color-gold)]">
                        {nextSign.glyph}
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
