import type { Metadata } from "next";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { AnimatedCard } from "@/components/animated-card";

export const metadata: Metadata = {
  title: "Astrology | WavePoint",
  description:
    "Explore astrology through WavePoint's synthesis framework connecting planets, numbers, and sacred geometry.",
  keywords: [
    "astrology",
    "planets",
    "zodiac",
    "numerology astrology",
    "sacred geometry astrology",
  ],
};

export default function AstrologyHubPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Hero */}
          <AnimateOnScroll className="mb-16 text-center">
            <Heading
              size="9"
              className="mb-4 font-display tracking-widest text-[var(--color-gold)]"
            >
              ASTROLOGY
            </Heading>
            <Text size="4" className="text-muted-foreground">
              Celestial bodies and their correspondences with numerology and
              sacred geometry
            </Text>
          </AnimateOnScroll>

          {/* Planets Section */}
          <AnimateOnScroll delay={0.1}>
            <Link href="/astrology/planets" className="block">
              <AnimatedCard className="group relative overflow-hidden p-8 sm:p-10">
                <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
                  {/* Icon/Glyph */}
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-gold)]/40 bg-card/50 sm:mb-0 sm:mr-6">
                    <span className="font-display text-3xl text-[var(--color-gold)]">
                      ♄
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Heading
                      size="6"
                      className="mb-2 font-display text-foreground transition-colors group-hover:text-[var(--color-gold)]"
                    >
                      The Planets
                    </Heading>
                    <Text className="mb-4 text-muted-foreground">
                      Nine celestial bodies from Sun to Neptune, each carrying
                      ancient associations with numbers, elements, and geometry.
                      Discover how planetary energies connect to the patterns
                      you encounter.
                    </Text>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-gold)]">
                      Explore planets
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>

                {/* Decorative glyphs */}
                <div className="pointer-events-none absolute -right-4 -top-4 text-6xl text-[var(--color-gold)]/5">
                  ☉☽♂♃
                </div>
              </AnimatedCard>
            </Link>
          </AnimateOnScroll>

          {/* Coming Soon - Signs */}
          <AnimateOnScroll delay={0.2} className="mt-8">
            <div className="rounded-xl border border-dashed border-[var(--border-gold)]/30 bg-card/10 p-8 text-center">
              <Text className="text-muted-foreground">
                <span className="font-display text-[var(--color-gold)]/50">
                  Zodiac Signs
                </span>{" "}
                — Coming soon
              </Text>
            </div>
          </AnimateOnScroll>

          {/* Coming Soon - Houses */}
          <AnimateOnScroll delay={0.3} className="mt-4">
            <div className="rounded-xl border border-dashed border-[var(--border-gold)]/30 bg-card/10 p-8 text-center">
              <Text className="text-muted-foreground">
                <span className="font-display text-[var(--color-gold)]/50">
                  Houses
                </span>{" "}
                — Coming soon
              </Text>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
