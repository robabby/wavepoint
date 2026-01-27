import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { spiritualProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isSignalEnabled } from "@/lib/signal/feature-flags";
import {
  getFeaturedPatterns,
  getAllCategories,
  getPatternsByCategory,
  getAllPatterns,
} from "@/lib/numbers";
import type { PartialNumerologyProfile } from "@/lib/numerology";
import { NumbersPageClient } from "./NumbersPageClient";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.space";

export const metadata: Metadata = {
  title: "Number Meanings",
  description:
    "Explore the meanings behind repeating numbers like 111, 444, and 1111. Often called angel numbers, these recurring sequences appear when you're paying attention.",
  openGraph: {
    title: "Number Meanings | WavePoint",
    description:
      "Discover what repeating number patterns mean. Explore 111, 222, 333, 444, and other angel number sequences.",
  },
  keywords: [
    "angel numbers",
    "number meanings",
    "111 meaning",
    "444 meaning",
    "1111 meaning",
    "repeating numbers",
    "number patterns",
    "numerology",
  ],
};

export default async function NumbersPage() {
  const featuredPatterns = getFeaturedPatterns();
  const categories = getAllCategories();
  const signalEnabled = isSignalEnabled();
  const allPatterns = getAllPatterns();

  // Pre-compute patterns by category for client component
  const patternsByCategory: Record<string, typeof allPatterns> = {};
  for (const category of categories) {
    patternsByCategory[category.id] = getPatternsByCategory(category.id);
  }

  // Fetch user's numerology data for personalization
  let userNumerology: PartialNumerologyProfile | null = null;
  let isAuthenticated = false;

  try {
    const session = await auth();
    isAuthenticated = !!session?.user?.id;

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
        userNumerology = {
          lifePath: profile.lifePath,
          birthday: profile.birthday,
          expression: profile.expression,
          soulUrge: profile.soulUrge,
          personality: profile.personality,
          maturity: profile.maturity,
        };
      }
    }
  } catch {
    // Auth or DB error - continue without personalization
  }

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Number Meanings",
    description:
      "Explore the meanings behind repeating numbers like 111, 444, and 1111. Often called angel numbers, these recurring sequences appear when you're paying attention.",
    url: `${baseUrl}/numbers`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allPatterns.length,
      itemListElement: allPatterns.map((pattern, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/numbers/${pattern.id}`,
        name: `${pattern.id} - ${pattern.title}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NumbersPageClient
        featuredPatterns={featuredPatterns}
        categories={categories}
        patternsByCategory={patternsByCategory}
        signalEnabled={signalEnabled}
        userNumerology={userNumerology}
        isAuthenticated={isAuthenticated}
      />
    </main>
  );
}
