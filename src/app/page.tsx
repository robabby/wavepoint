import { Button, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import {
  CircleDot,
  Sparkles,
  Triangle,
  Droplets,
  Box as BoxIcon,
  Octagon,
} from "lucide-react";
import { ROUTES } from "@/util/routes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/client-tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getPlatonicSolids,
  getPatterns,
  getGeometryPath,
} from "@/lib/data";
import { AnimatedHero, AnimatedHeroItem } from "@/components/animated-hero";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard, GeometryImage } from "@/components/animated-card";
import { AnimatedButton } from "@/components/animated-button";

// Icon mapping for Platonic Solids
const iconMap: Record<string, typeof Triangle> = {
  tetrahedron: Triangle,
  hexahedron: BoxIcon,
  octahedron: Octagon,
  dodecahedron: Sparkles,
  icosahedron: Droplets,
};

// Color mapping for Platonic Solids - using gold/copper palette
const colorMap: Record<string, string> = {
  tetrahedron: "text-[var(--color-gold)]",
  hexahedron: "text-[var(--color-copper)]",
  octahedron: "text-[var(--color-gold-bright)]",
  dodecahedron: "text-[var(--color-bronze)]",
  icosahedron: "text-[var(--color-gold-muted)]",
};

const platonicSolids = getPlatonicSolids()
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((solid) => ({
    id: solid.id,
    name: solid.name,
    path: getGeometryPath(solid),
    element: solid.relatedBy?.element
      ? solid.relatedBy.element.charAt(0).toUpperCase() +
        solid.relatedBy.element.slice(1)
      : "Unknown",
    faces: solid.mathProperties?.faces ?? 0,
    icon: iconMap[solid.slug] ?? Triangle,
    image: solid.images?.heroImage ?? "",
    color: colorMap[solid.slug] ?? "text-amber-400",
  }));

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-cream)]">
      {/* Hero Section with Animated Background */}
      <AnimatedHero className="min-h-[60vh] sm:min-h-[70vh]">
        <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-8 sm:min-h-[70vh] sm:gap-6 sm:px-6 sm:py-12 lg:gap-8 lg:px-8 lg:py-16">
          <div className="flex flex-col items-center gap-4 text-center sm:gap-6">
            <AnimatedHeroItem>
              <p className="font-heading max-w-2xl px-4 text-lg text-[var(--color-warm-gray)] sm:text-2xl">
                Welcome to the world of
              </p>
            </AnimatedHeroItem>

            <AnimatedHeroItem>
              <div className="flex items-center gap-2 sm:gap-4">
                <CircleDot className="h-8 w-8 text-[var(--color-gold)] sm:h-12 sm:w-12" />
                <h1 className="font-display text-hero tracking-tight text-[var(--color-cream)]">
                  SACRED{" "}
                  <span className="text-[var(--color-gold)]">GEOMETRY</span>
                </h1>
                <CircleDot className="h-8 w-8 text-[var(--color-gold)] sm:h-12 sm:w-12" />
              </div>
            </AnimatedHeroItem>

            <AnimatedHeroItem>
              <div className="flex flex-wrap justify-center gap-2 px-4">
                <Badge
                  variant="outline"
                  className="border-[var(--border-gold)] bg-[var(--color-gold)]/10 text-xs text-[var(--color-gold)] sm:text-sm"
                >
                  5 Platonic Solids
                </Badge>
                <Badge
                  variant="outline"
                  className="border-[var(--border-gold)] bg-[var(--color-gold)]/10 text-xs text-[var(--color-gold)] sm:text-sm"
                >
                  Sacred Patterns
                </Badge>
                <Badge
                  variant="outline"
                  className="border-[var(--border-gold)] bg-[var(--color-gold)]/10 text-xs text-[var(--color-gold)] sm:text-sm"
                >
                  Golden Ratio
                </Badge>
              </div>
            </AnimatedHeroItem>

            <AnimatedHeroItem>
              <p className="max-w-3xl px-4 text-sm text-[var(--color-warm-gray)] sm:text-lg">
                Discover the mathematical principles and timeless patterns that form
                the foundation of our universe. From the Platonic Solids to the
                Flower of Life, explore the geometries that have inspired mystics,
                scientists, and artists throughout history.
              </p>
            </AnimatedHeroItem>
          </div>

          <AnimatedHeroItem>
            <div className="mt-4 flex w-full flex-col items-center gap-3 px-4 sm:mt-8 sm:w-auto sm:flex-row sm:gap-4">
              <AnimatedButton variant="primary" className="w-full sm:w-auto">
                <Button
                  asChild
                  size="3"
                  className="w-full bg-[var(--color-gold)] font-semibold text-[var(--color-obsidian)] shadow-lg shadow-[var(--glow-gold)] transition-colors hover:bg-[var(--color-gold-bright)] sm:w-auto"
                >
                  <Link href={ROUTES.platonicSolids.path}>
                    <span className="hidden sm:inline">
                      Explore Platonic Solids →
                    </span>
                    <span className="sm:hidden">Platonic Solids →</span>
                  </Link>
                </Button>
              </AnimatedButton>
              <AnimatedButton variant="outline" className="w-full sm:w-auto">
                <Button
                  asChild
                  size="3"
                  variant="outline"
                  className="w-full border-[var(--color-gold)]/50 text-[var(--color-gold)] transition-[border-color,background-color] hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 sm:w-auto"
                >
                  <Link href={ROUTES.patterns.path}>Sacred Patterns →</Link>
                </Button>
              </AnimatedButton>
            </div>
          </AnimatedHeroItem>
        </div>
      </AnimatedHero>

      <Separator className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent" />

      {/* Interactive Tabs Section */}
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <Tabs defaultValue="solids" className="mx-auto max-w-6xl">
          <TabsList className="grid w-full grid-cols-2 rounded-lg border border-[var(--border-gold)] bg-[var(--color-warm-charcoal)] p-1">
            <TabsTrigger
              value="solids"
              className="rounded-md text-[var(--color-warm-gray)] transition-[background-color,color,box-shadow] data-[state=active]:bg-[var(--color-gold)] data-[state=active]:text-[var(--color-obsidian)] data-[state=active]:shadow-[0_0_12px_var(--glow-gold)]"
            >
              Platonic Solids
            </TabsTrigger>
            <TabsTrigger
              value="patterns"
              className="rounded-md text-[var(--color-warm-gray)] transition-[background-color,color,box-shadow] data-[state=active]:bg-[var(--color-gold)] data-[state=active]:text-[var(--color-obsidian)] data-[state=active]:shadow-[0_0_12px_var(--glow-gold)]"
            >
              Sacred Patterns
            </TabsTrigger>
          </TabsList>

          {/* Platonic Solids Tab */}
          <TabsContent value="solids" className="mt-4 sm:mt-6 lg:mt-8">
            <AnimateOnScroll className="mb-4 text-center sm:mb-6 lg:mb-8">
              <Heading
                size={{ initial: "6", sm: "7" }}
                className="font-heading mb-2 text-[var(--color-cream)] sm:mb-3"
              >
                The Five Perfect Solids
              </Heading>
              <Text
                size={{ initial: "2", sm: "3" }}
                className="text-[var(--color-warm-gray)]"
              >
                Each solid represents a fundamental element and possesses
                complete geometric regularity
              </Text>
            </AnimateOnScroll>

            <StaggerChildren
              className="grid grid-cols-2 gap-4 md:grid-cols-3 sm:gap-6 lg:grid-cols-5 lg:gap-8"
              staggerDelay={0.08}
            >
              {platonicSolids.map((solid) => {
                const Icon = solid.icon;
                return (
                  <StaggerItem key={solid.name}>
                    <Link href={solid.path} className="group block">
                      <AnimatedCard className="p-3 sm:p-4">
                        <div className="flex flex-col items-center gap-2 sm:gap-3">
                          <GeometryImage className="relative h-16 w-full sm:h-24">
                            <Image
                              src={solid.image}
                              alt={solid.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                              className="object-contain"
                              style={{
                                filter:
                                  "brightness(0) saturate(100%) invert(85%) sepia(66%) saturate(466%) hue-rotate(358deg) brightness(98%) contrast(91%)",
                              }}
                            />
                          </GeometryImage>
                          <Icon
                            className={`h-4 w-4 sm:h-5 sm:w-5 ${solid.color}`}
                          />
                          <Text className="text-center text-[10px] font-medium leading-tight text-[var(--color-gold-bright)] sm:text-xs">
                            {solid.name}
                          </Text>
                          <Badge
                            variant="secondary"
                            className="bg-[var(--color-dark-bronze)] px-1.5 py-0.5 text-[10px] text-[var(--color-warm-gray)] sm:text-xs"
                          >
                            {solid.element}
                          </Badge>
                        </div>
                      </AnimatedCard>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>

            <AnimateOnScroll className="mt-4 text-center sm:mt-6 lg:mt-8" delay={0.3}>
              <AnimatedButton variant="outline">
                <Button
                  asChild
                  variant="outline"
                  size={{ initial: "2", sm: "3" }}
                  className="border-[var(--border-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10"
                >
                  <Link href={ROUTES.platonicSolids.path}>
                    <span className="hidden sm:inline">
                      View All Platonic Solids →
                    </span>
                    <span className="sm:hidden">View All →</span>
                  </Link>
                </Button>
              </AnimatedButton>
            </AnimateOnScroll>
          </TabsContent>

          {/* Sacred Patterns Tab */}
          <TabsContent value="patterns" className="mt-4 sm:mt-6 lg:mt-8">
            <AnimateOnScroll className="mb-4 text-center sm:mb-6 lg:mb-8">
              <Heading
                size={{ initial: "6", sm: "7" }}
                className="font-heading mb-2 text-[var(--color-cream)] sm:mb-3"
              >
                Infinite Geometries
              </Heading>
              <Text
                size={{ initial: "2", sm: "3" }}
                className="text-[var(--color-warm-gray)]"
              >
                Patterns that encode universal principles and appear throughout
                nature and consciousness
              </Text>
            </AnimateOnScroll>

            <StaggerChildren
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8"
              staggerDelay={0.12}
            >
              {[
                { slug: "flower-of-life", badge: "Universal Pattern" },
                { slug: "metatrons-cube", badge: "Sacred Blueprint" },
                { slug: "golden-ratio", badge: "Divine Proportion" },
              ].map(({ slug, badge }) => {
                const pattern = getPatterns().find((p) => p.slug === slug);
                if (!pattern) return null;
                return (
                  <StaggerItem key={pattern.slug}>
                    <Link href={getGeometryPath(pattern)} className="group block">
                      <AnimatedCard className="p-6">
                        <div className="flex flex-col items-center gap-4">
                          <GeometryImage className="relative h-32 w-full">
                            <Image
                              src={pattern.images?.heroImage ?? ""}
                              alt={pattern.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-contain"
                              style={{
                                filter:
                                  "brightness(0) saturate(100%) invert(85%) sepia(66%) saturate(466%) hue-rotate(358deg) brightness(98%) contrast(91%)",
                              }}
                            />
                          </GeometryImage>
                          <Heading
                            size="4"
                            className="font-heading text-[var(--color-gold-bright)]"
                          >
                            {pattern.name}
                          </Heading>
                          <Text
                            size="2"
                            className="text-center text-[var(--color-warm-gray)]"
                          >
                            {pattern.description}
                          </Text>
                          <Badge className="bg-[var(--color-gold)]/20 text-[var(--color-gold)]">
                            {badge}
                          </Badge>
                        </div>
                      </AnimatedCard>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>

            <AnimateOnScroll className="mt-4 text-center sm:mt-6 lg:mt-8" delay={0.3}>
              <AnimatedButton variant="outline" className="w-full sm:w-auto">
                <Button
                  asChild
                  variant="outline"
                  size={{ initial: "2", sm: "3" }}
                  className="w-full border-[var(--border-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 sm:w-auto"
                >
                  <Link href={ROUTES.patterns.path}>
                    Explore All Patterns →
                  </Link>
                </Button>
              </AnimatedButton>
            </AnimateOnScroll>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
