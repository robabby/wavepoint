import type { Metadata } from "next";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import {
  getAllSigns,
  getSignsGroupedByElement,
  getElementDisplayInfo,
} from "@/lib/astrology/signs";
import { SignCard, ZodiacTable } from "@/components/astrology";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard } from "@/components/animated-card";

const baseUrl = process.env.APP_URL ?? "https://wavepoint.space";

export const metadata: Metadata = {
  title: "Zodiac Signs | Astrology | WavePoint",
  description:
    "Explore the 12 zodiac signs: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, and Pisces. Discover their connections to planets, elements, and numerology.",
  keywords: [
    "zodiac signs",
    "astrology signs",
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
    "fire signs",
    "earth signs",
    "air signs",
    "water signs",
  ],
  openGraph: {
    title: "Zodiac Signs | WavePoint",
    description:
      "The 12 zodiac signs and their correspondences with planets, elements, and sacred geometry.",
  },
};

/**
 * Element section order (alchemical)
 */
const ELEMENT_ORDER = ["fire", "earth", "air", "water"] as const;

export default function SignsIndexPage() {
  const allSigns = getAllSigns();
  const signsByElement = getSignsGroupedByElement();

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Zodiac Signs",
    description:
      "Explore the 12 zodiac signs and their correspondences with planets, elements, and numerology.",
    url: `${baseUrl}/astrology/signs`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allSigns.map((sign, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/astrology/signs/${sign.id}`,
        name: sign.name,
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

      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <AnimateOnScroll className="mb-12 text-center">
            <Link
              href="/astrology"
              className="mb-4 inline-block text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
            >
              &larr; Astrology
            </Link>
            <Heading
              size="9"
              className="mb-4 font-display tracking-widest text-[var(--color-gold)]"
            >
              ZODIAC SIGNS
            </Heading>
            <Text size="4" className="mx-auto max-w-2xl text-muted-foreground">
              The twelve signs of the zodiac, each carrying ancient associations
              with elements, modalities, and planetary rulers.
            </Text>
          </AnimateOnScroll>

          {/* Signs grouped by element */}
          {ELEMENT_ORDER.map((element, elementIndex) => {
            const signs = signsByElement[element];
            const elementInfo = getElementDisplayInfo(element);

            return (
              <AnimateOnScroll
                key={element}
                delay={0.1 + elementIndex * 0.05}
                className="mb-12"
              >
                <div className="mb-6">
                  <Heading
                    size="5"
                    className="mb-2 font-display text-[var(--color-gold)]"
                  >
                    {elementInfo.name} Signs
                  </Heading>
                  <Text size="2" className="text-muted-foreground">
                    {elementInfo.description}
                  </Text>
                </div>

                <StaggerChildren
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                  staggerDelay={0.05}
                >
                  {signs.map((sign) => (
                    <StaggerItem key={sign.id}>
                      <SignCard sign={sign} />
                    </StaggerItem>
                  ))}
                </StaggerChildren>
              </AnimateOnScroll>
            );
          })}

          {/* Quick Reference Table */}
          <AnimateOnScroll delay={0.35}>
            <AnimatedCard className="p-6 sm:p-8">
              <Heading
                size="5"
                className="mb-6 font-display text-[var(--color-gold)]"
              >
                Quick Reference
              </Heading>
              <ZodiacTable signs={allSigns} />
            </AnimatedCard>
          </AnimateOnScroll>

          {/* Cross-links */}
          <AnimateOnScroll delay={0.4} className="mt-12 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/astrology/planets"
                className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
              >
                Explore the planets →
              </Link>
              <span className="text-muted-foreground/30">|</span>
              <Link
                href="/astrology/nodes"
                className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
              >
                Explore sensitive points →
              </Link>
              <span className="text-muted-foreground/30">|</span>
              <Link
                href="/numbers"
                className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
              >
                Explore number meanings →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
