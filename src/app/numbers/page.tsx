import type { Metadata } from "next";
import { isSignalEnabled } from "@/lib/signal/feature-flags";
import {
  getFeaturedPatterns,
  getAllCategories,
  getPatternsByCategory,
  getAllPatterns,
} from "@/lib/numbers";
import { NumbersPageClient } from "./NumbersPageClient";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.guide";

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

export default function NumbersPage() {
  const featuredPatterns = getFeaturedPatterns();
  const categories = getAllCategories();
  const signalEnabled = isSignalEnabled();
  const allPatterns = getAllPatterns();

  // Pre-compute patterns by category for client component
  const patternsByCategory: Record<string, typeof allPatterns> = {};
  for (const category of categories) {
    patternsByCategory[category.id] = getPatternsByCategory(category.id);
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
    <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-cream)]">
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
      />
    </main>
  );
}
