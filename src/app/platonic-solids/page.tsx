import type { Metadata } from "next";
import { Box, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import {
  Triangle,
  Box as BoxIcon,
  Octagon,
  Sparkles,
  Droplets,
} from "lucide-react";
import { ROUTES } from "@/util/routes";
import { Badge } from "@/components/ui/badge";
import { getPlatonicSolids, getGeometryPath } from "@/lib/data";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard, GeometryImage } from "@/components/animated-card";

// Icon mapping for Platonic Solids
const iconMap: Record<string, typeof Triangle> = {
  tetrahedron: Triangle,
  hexahedron: BoxIcon,
  octahedron: Octagon,
  dodecahedron: Sparkles,
  icosahedron: Droplets,
};

// Color mapping for Platonic Solids
const colorMap: Record<string, string> = {
  tetrahedron: "text-red-400",
  hexahedron: "text-green-400",
  octahedron: "text-cyan-400",
  dodecahedron: "text-purple-400",
  icosahedron: "text-blue-400",
};

export const metadata: Metadata = {
  title: "Platonic Solids",
  description:
    "Explore the five Platonic solids: Tetrahedron, Hexahedron, Octahedron, Dodecahedron, and Icosahedron. Discover their mathematical properties, elemental associations, and sacred significance.",
  openGraph: {
    title: "Platonic Solids | WavePoint",
    description:
      "The five perfect three-dimensional forms: Tetrahedron (Fire), Hexahedron (Earth), Octahedron (Air), Dodecahedron (Ether), and Icosahedron (Water).",
  },
};

const platonicSolids = getPlatonicSolids()
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((solid) => ({
    slug: solid.slug,
    name: solid.name,
    title: solid.title,
    description: solid.description,
    path: getGeometryPath(solid),
    element: solid.relatedBy?.element
      ? solid.relatedBy.element.charAt(0).toUpperCase() +
        solid.relatedBy.element.slice(1)
      : "Unknown",
    faces: solid.mathProperties?.faces,
    vertices: solid.mathProperties?.vertices,
    edges: solid.mathProperties?.edges,
    icon: iconMap[solid.slug] ?? Triangle,
    color: colorMap[solid.slug] ?? "text-amber-400",
    image: solid.images?.heroImage ?? "",
  }));

export default function PlatonicSolidsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-cream)]">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Header */}
        <AnimateOnScroll className="mx-auto mb-8 max-w-4xl text-center sm:mb-12 lg:mb-16">
          <Heading size="9" className="font-display text-[var(--color-cream)]" mb="4">
            {ROUTES.platonicSolids.name}
          </Heading>
          <Box mb="2">
            <Text size="5" className="text-[var(--color-gold)]">
              {ROUTES.platonicSolids.description}
            </Text>
          </Box>
          <Text size="3" className="mx-auto max-w-3xl text-[var(--color-warm-gray)]">
            Discovered by the ancient Greeks and explored by Plato, these five
            perfect solids are the only three-dimensional shapes where every
            face, edge, and angle is identical. Each represents a fundamental
            element and holds profound significance in sacred geometry.
          </Text>
        </AnimateOnScroll>

        {/* Platonic Solids Grid */}
        <StaggerChildren
          className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          staggerDelay={0.1}
        >
          {platonicSolids.map((solid) => {
            const Icon = solid.icon;
            return (
              <StaggerItem key={solid.path}>
                <Link href={solid.path} className="group block">
                  <AnimatedCard className="h-full p-6">
                    <div className="flex flex-col gap-4">
                      {/* Image */}
                      <GeometryImage className="relative h-48 w-full">
                        <Image
                          src={solid.image}
                          alt={solid.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain"
                          style={{
                            filter:
                              "brightness(0) saturate(100%) invert(85%) sepia(66%) saturate(466%) hue-rotate(358deg) brightness(98%) contrast(91%)",
                          }}
                        />
                      </GeometryImage>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-5 w-5 ${solid.color}`} />
                          <Heading size="5" className="text-[var(--color-gold-bright)]">
                            {solid.name}
                          </Heading>
                        </div>
                      </div>

                      <Text size="2" className="text-[var(--color-warm-gray)]">
                        {solid.description}
                      </Text>

                      <div className="flex flex-wrap justify-between gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-[var(--color-dark-bronze)] text-[var(--color-gold)]"
                        >
                          {solid.element}
                        </Badge>

                        <Text
                          size="1"
                          className="font-medium text-[var(--color-gold)] transition-colors group-hover:text-[var(--color-gold-bright)]"
                        >
                          Explore →
                        </Text>
                      </div>
                    </div>
                  </AnimatedCard>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        {/* Additional Info */}
        <AnimateOnScroll delay={0.3}>
          <AnimatedCard className="mx-auto mt-8 max-w-4xl p-4 sm:mt-12 sm:p-6 lg:mt-16 lg:p-8">
            <Heading size="6" className="mb-4 font-heading text-[var(--color-gold)]">
              The Sacred Five
            </Heading>
            <Text className="mb-4 text-[var(--color-warm-gray)]">
              These five shapes are unique in all of geometry. No other regular
              polyhedra exist beyond these. This mathematical limitation gives
              them profound significance—they represent the complete set of
              possible perfect three-dimensional forms.
            </Text>
            <Text className="text-[var(--color-warm-gray)]">
              The ancient Greeks believed these shapes were the building blocks
              of reality itself. Modern physics has discovered surprising
              connections between these geometries and the structure of atoms,
              molecules, and even the fabric of spacetime.
            </Text>
          </AnimatedCard>
        </AnimateOnScroll>
      </div>
    </main>
  );
}
