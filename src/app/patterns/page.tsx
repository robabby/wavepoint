import type { Metadata } from "next";
import { Box, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Hexagon, Star, Triangle, Circle } from "lucide-react";
import { ROUTES } from "@/util/routes";
import { Badge } from "@/components/ui/badge";
import { getPatterns, getGeometryPath } from "@/lib/data";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard, GeometryImage } from "@/components/animated-card";

// Icon mapping for Patterns
const iconMap: Record<string, typeof Hexagon> = {
  "circle-dot": Circle,
  "flower-of-life": Hexagon,
  "seed-of-life": Hexagon,
  "metatrons-cube": Sparkles,
  "sri-yantra": Triangle,
  "star-tetrahedron": Star,
  "golden-ratio": Sparkles,
  "vesica-piscis": Hexagon,
  "fruit-of-life": Hexagon,
  "philosophers-stone": Star,
  "pentagram": Star,
};

// Color mapping for Patterns
const colorMap: Record<string, string> = {
  "circle-dot": "text-white",
  "flower-of-life": "text-amber-400",
  "seed-of-life": "text-green-400",
  "metatrons-cube": "text-purple-400",
  "sri-yantra": "text-red-400",
  "star-tetrahedron": "text-cyan-400",
  "golden-ratio": "text-yellow-400",
  "vesica-piscis": "text-blue-400",
  "fruit-of-life": "text-pink-400",
  "philosophers-stone": "text-orange-400",
  "pentagram": "text-emerald-400",
};

// Category mapping for Patterns
const categoryMap: Record<string, string> = {
  "circle-dot": "Divine Source",
  "flower-of-life": "Universal Pattern",
  "seed-of-life": "Creation Symbol",
  "metatrons-cube": "Sacred Blueprint",
  "sri-yantra": "Divine Union",
  "star-tetrahedron": "Light Vehicle",
  "golden-ratio": "Divine Proportion",
  "vesica-piscis": "Creation Portal",
  "fruit-of-life": "Cosmic Blueprint",
  "philosophers-stone": "Alchemical Symbol",
  "pentagram": "Human Microcosm",
};

export const metadata: Metadata = {
  title: "Patterns",
  description:
    "Explore sacred geometric patterns including the Flower of Life, Metatron's Cube, Sri Yantra, Golden Ratio, and more. Discover the mathematical principles and divine patterns underlying the universe.",
  openGraph: {
    title: "Patterns | WavePoint",
    description:
      "Timeless geometric patterns that appear across cultures and throughout history, representing the fundamental organizing principles of creation.",
  },
};

const patterns = getPatterns()
  .filter((p) => p.featured)
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((pattern) => ({
    slug: pattern.slug,
    name: pattern.name,
    description: pattern.description,
    path: getGeometryPath(pattern),
    icon: iconMap[pattern.slug] ?? Hexagon,
    color: colorMap[pattern.slug] ?? "text-amber-400",
    category: categoryMap[pattern.slug] ?? "Pattern",
    image: pattern.images?.heroImage ?? "",
  }));

export default function PatternsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Header */}
        <AnimateOnScroll className="mx-auto mb-8 max-w-4xl text-center sm:mb-12 lg:mb-16">
          <Heading size="9" className="font-display text-foreground" mb="4">
            {ROUTES.patterns.name}
          </Heading>
          <Box mb="2">
            <Text size="5" className="mb-4 text-[var(--color-gold)]">
              {ROUTES.patterns.description}
            </Text>
          </Box>
          <Text size="3" className="mx-auto max-w-3xl text-muted-foreground">
            These timeless patterns appear across cultures and throughout
            history, from ancient temples to modern science. They represent the
            fundamental organizing principles of consciousness, energy, and
            matter—the blueprint of creation itself.
          </Text>
        </AnimateOnScroll>

        {/* Sacred Patterns Grid */}
        <StaggerChildren
          className="mx-auto mb-8 grid max-w-6xl grid-cols-1 gap-4 sm:mb-12 sm:gap-6 md:grid-cols-2 lg:mb-16 lg:grid-cols-3 lg:gap-8"
          staggerDelay={0.08}
        >
          {patterns.map((pattern) => {
            const Icon = pattern.icon;
            return (
              <StaggerItem key={pattern.path}>
                <Link href={pattern.path} className="group block">
                  <AnimatedCard className="h-full p-6">
                    <div className="flex min-h-[380px] flex-col gap-4">
                      {/* Image */}
                      <GeometryImage className="relative h-48 w-full">
                        <Image
                          src={pattern.image}
                          alt={pattern.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain svg-gold"
                        />
                      </GeometryImage>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-5 w-5 ${pattern.color}`} />
                          <Heading size="5" className="text-[var(--color-gold-bright)]">
                            {pattern.name}
                          </Heading>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-muted text-[var(--color-gold)]"
                        >
                          {pattern.category}
                        </Badge>
                      </div>

                      <Text size="2" className="line-clamp-3 text-muted-foreground">
                        {pattern.description}
                      </Text>

                      <div className="mt-auto text-sm font-medium text-[var(--color-gold)] transition-colors group-hover:text-[var(--color-gold-bright)]">
                        Explore →
                      </div>
                    </div>
                  </AnimatedCard>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        {/* The Flower of Life - Featured Section */}
        <AnimateOnScroll>
          <AnimatedCard className="mx-auto mb-4 max-w-4xl p-4 sm:mb-6 sm:p-6 lg:mb-8 lg:p-8">
            <div className="mb-4 flex items-center gap-4">
              <GeometryImage className="relative h-12 w-12 shrink-0">
                <Image
                  src="/images/geometries/patterns/flower-of-life/flower-of-life-primary.svg"
                  alt="Flower of Life"
                  fill
                  sizes="48px"
                  className="object-contain svg-gold"
                />
              </GeometryImage>
              <Heading size="7" className="font-heading text-[var(--color-gold)]">
                The Flower of Life: Universal Pattern
              </Heading>
            </div>

            <Text className="mb-4 text-muted-foreground">
              The Flower of Life is perhaps the most widely recognized symbol in
              sacred geometry. Found in temples across the world—from Egypt to
              China, from Europe to India—this pattern predates all major
              religions and appears to encode fundamental truths about the
              nature of reality.
            </Text>

            <Text className="text-muted-foreground">
              By overlapping circles in a specific pattern, the Flower of Life
              emerges naturally. Within its petals hide countless other sacred
              patterns: the Seed of Life, the Tree of Life, Metatron&apos;s
              Cube, and all five Platonic Solids. It&apos;s as if this single
              pattern contains the entire library of creation&apos;s building
              blocks.
            </Text>
          </AnimatedCard>
        </AnimateOnScroll>

        {/* Sacred Ratios */}
        <AnimateOnScroll delay={0.1}>
          <AnimatedCard className="mx-auto mb-4 max-w-4xl p-4 sm:mb-6 sm:p-6 lg:mb-8 lg:p-8">
            <Heading size="6" className="mb-4 font-heading text-[var(--color-gold)]">
              The Golden Ratio & Sacred Proportions
            </Heading>

            <Text className="mb-4 text-muted-foreground">
              Sacred patterns often embody special mathematical ratios that
              appear throughout nature:
            </Text>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <Text weight="bold" className="text-[var(--color-gold-bright)]">
                  φ (Phi) ≈ 1.618 - The Golden Ratio
                </Text>
                <Text className="text-muted-foreground">
                  Found in spiral shells, flower petals, galaxy arms, and human
                  proportions. Represents optimal growth and aesthetic
                  perfection.
                </Text>
              </div>

              <div className="flex flex-col gap-2">
                <Text weight="bold" className="text-[var(--color-gold-bright)]">
                  √2 ≈ 1.414 - The Silver Ratio
                </Text>
                <Text className="text-muted-foreground">
                  The diagonal of a square. Found in paper sizes and sacred
                  architecture. Represents the bridge between dimensions.
                </Text>
              </div>

              <div className="flex flex-col gap-2">
                <Text weight="bold" className="text-[var(--color-gold-bright)]">
                  π (Pi) ≈ 3.14159 - Circle Constant
                </Text>
                <Text className="text-muted-foreground">
                  The relationship between circle and diameter. Represents
                  cycles, wholeness, and the infinite.
                </Text>
              </div>
            </div>
          </AnimatedCard>
        </AnimateOnScroll>

        {/* Where to Find Them */}
        <AnimateOnScroll delay={0.2}>
          <AnimatedCard className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <Heading size="6" className="mb-4 font-heading text-[var(--color-gold)]">
              Where Sacred Patterns Appear
            </Heading>

            <Text className="mb-4 text-muted-foreground">
              These patterns are not mere human inventions—they are discoveries.
              They appear everywhere:
            </Text>

            <ul className="space-y-3 text-muted-foreground">
              <li>
                <strong className="text-[var(--color-gold-bright)]">Nature:</strong> Flower
                petals, pine cones, nautilus shells, crystal structures, DNA
                helixes
              </li>
              <li>
                <strong className="text-[var(--color-gold-bright)]">Architecture:</strong>{" "}
                Temples, cathedrals, pyramids, mosques—structures designed to
                elevate consciousness
              </li>
              <li>
                <strong className="text-[var(--color-gold-bright)]">Art:</strong> Mandalas,
                Islamic geometric patterns, Celtic knots, Renaissance paintings
              </li>
              <li>
                <strong className="text-[var(--color-gold-bright)]">Science:</strong> Atomic
                structures, quantum fields, cymatics (sound made visible),
                fractal mathematics
              </li>
              <li>
                <strong className="text-[var(--color-gold-bright)]">Human Body:</strong>{" "}
                Proportions, spiral of ear, arrangement of features, energy
                centers (chakras)
              </li>
            </ul>
          </AnimatedCard>
        </AnimateOnScroll>
      </div>
    </main>
  );
}
