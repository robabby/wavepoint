import type { Metadata } from "next";
import { Flex, Grid, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GeometryNavigation } from "@/components/geometry-navigation";
import {
  getGeometryBySlug,
  getPlatonicSolids,
  getGeometryPath,
} from "@/lib/data";
import { getPlatonicSolidContent } from "@/lib/content";
import { DetailHero, HeroText, HeroGeometry } from "@/components/detail-hero";
import { PulsingGeometry, VisualRepCard } from "@/components/pulsing-geometry";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { AnimatedCard } from "@/components/animated-card";
import { ContentLayout } from "@/components/content-layout";
import {
  StructuredData,
  createArticleSchema,
} from "@/components/structured-data";

/**
 * Generate static params for all Platonic Solids
 */
export async function generateStaticParams() {
  return getPlatonicSolids().map((solid) => ({
    slug: solid.slug,
  }));
}

/**
 * Generate metadata for Platonic Solid pages
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const geometry = getGeometryBySlug(slug);

  if (!geometry) {
    return {
      title: "Platonic Solid Not Found",
    };
  }

  const element = geometry.relatedBy?.element
    ? geometry.relatedBy.element.charAt(0).toUpperCase() +
      geometry.relatedBy.element.slice(1)
    : null;

  return {
    title: geometry.name,
    description: geometry.description,
    openGraph: {
      title: `${geometry.name} | WavePoint`,
      description: element
        ? `${geometry.description} Associated with the element of ${element}.`
        : geometry.description,
    },
  };
}

export default async function PlatonicSolidPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const geometry = getGeometryBySlug(slug);
  const mdxContent = await getPlatonicSolidContent(slug);

  if (!geometry) {
    notFound();
  }

  const {
    title,
    name,
    description,
    images,
    mathProperties,
    relatedBy,
    dualOfTitle,
  } = geometry;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://wavepoint.space";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <StructuredData
        data={createArticleSchema({
          url: `${baseUrl}${getGeometryPath(geometry)}`,
          headline: name,
          description: description ?? "",
        })}
      />
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl">
          {/* Header with Image */}
          <DetailHero>
            <Grid
              columns={{ initial: "1", md: "2" }}
              gap={{ initial: "6", md: "8" }}
              className="mb-4 sm:mb-8 lg:mb-12"
            >
              {/* Text Content */}
              <HeroText>
                <Flex direction="column" gap="6" justify="center">
                  <Heading
                    size={{ initial: "7", md: "9" }}
                    className="font-display text-foreground"
                  >
                    {title}
                  </Heading>

                  <Text
                    size={{ initial: "3", md: "5" }}
                    className="text-[var(--color-gold)]"
                  >
                    {description}
                  </Text>
                </Flex>
              </HeroText>

              {/* Hero Image */}
              <HeroGeometry className="flex items-center justify-center">
                <PulsingGeometry>
                  <Image
                    src={images?.heroImage ?? ""}
                    alt={title ?? "Platonic Solid"}
                    width={400}
                    height={400}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md object-contain svg-gold"
                  />
                </PulsingGeometry>
              </HeroGeometry>
            </Grid>
          </DetailHero>

          {/* Visual Representations */}
          <AnimateOnScroll>
            <AnimatedCard className="mb-4 p-4 sm:mb-6 sm:p-6 lg:mb-8 lg:p-8">
              <Heading mb="6" size="6" className="font-heading text-[var(--color-gold)]">
                Visual Representations
              </Heading>

              <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap={{ initial: "4", sm: "6", lg: "8" }}>
                <VisualRepCard index={0}>
                  <Flex direction="column" gap="3" align="center">
                    <PulsingGeometry interactive={false} className="relative h-40 w-full">
                      <Image
                        src={images?.solidImage ?? ""}
                        alt={`${title} Solid`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain svg-gold"
                      />
                    </PulsingGeometry>
                    <Text weight="bold" className="text-[var(--color-gold-bright)]">
                      Solid View
                    </Text>
                    <Text size="2" className="text-center text-muted-foreground">
                      All faces visible
                    </Text>
                  </Flex>
                </VisualRepCard>

                <VisualRepCard index={1}>
                  <Flex direction="column" gap="3" align="center">
                    <PulsingGeometry interactive={false} className="relative h-40 w-full">
                      <Image
                        src={images?.wireframeImage ?? ""}
                        alt={`${title} Wireframe`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain svg-gold"
                      />
                    </PulsingGeometry>
                    <Text weight="bold" className="text-[var(--color-gold-bright)]">
                      Wireframe
                    </Text>
                    <Text size="2" className="text-center text-muted-foreground">
                      Edge structure
                    </Text>
                  </Flex>
                </VisualRepCard>

                <VisualRepCard index={2}>
                  <Flex direction="column" gap="3" align="center">
                    <PulsingGeometry interactive={false} className="relative h-40 w-full">
                      <Image
                        src={images?.netImage ?? ""}
                        alt={`${title} Net`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain svg-gold"
                      />
                    </PulsingGeometry>
                    <Text weight="bold" className="text-[var(--color-gold-bright)]">
                      Unfolded Net
                    </Text>
                    <Text size="2" className="text-center text-muted-foreground">
                      2D pattern
                    </Text>
                  </Flex>
                </VisualRepCard>
              </Grid>
            </AnimatedCard>
          </AnimateOnScroll>

          {/* Mathematical Properties */}
          <AnimateOnScroll delay={0.1}>
            <AnimatedCard className="mb-4 p-4 sm:mb-6 sm:p-6 lg:mb-8 lg:p-8">
              <Heading size="6" className="font-heading text-[var(--color-gold)]" mb="6">
                Mathematical Properties
              </Heading>

              <Grid columns={{ initial: "1", sm: "3" }} gap={{ initial: "4", sm: "6", lg: "8" }}>
                <Flex direction="column" gap="3" align="center" className="p-4">
                  <Text size="8" weight="bold" className="text-[var(--color-gold)]">
                    {mathProperties?.faces}
                  </Text>
                  <Text size="4" weight="medium" className="text-foreground">
                    Faces
                  </Text>
                  <Text size="2" className="text-muted-foreground">
                    {mathProperties?.faceShape}
                  </Text>
                </Flex>
                <Flex direction="column" gap="3" align="center" className="p-4">
                  <Text size="8" weight="bold" className="text-[var(--color-gold)]">
                    {mathProperties?.vertices}
                  </Text>
                  <Text size="4" weight="medium" className="text-foreground">
                    Vertices
                  </Text>
                  <Text size="2" className="text-muted-foreground">
                    Corners
                  </Text>
                </Flex>
                <Flex direction="column" gap="3" align="center" className="p-4">
                  <Text size="8" weight="bold" className="text-[var(--color-gold)]">
                    {mathProperties?.edges}
                  </Text>
                  <Text size="4" weight="medium" className="text-foreground">
                    Edges
                  </Text>
                  <Text size="2" className="text-muted-foreground">
                    Lines
                  </Text>
                </Flex>
              </Grid>
            </AnimatedCard>
          </AnimateOnScroll>

          {/* Symbolic Properties Metadata */}
          <AnimateOnScroll delay={0.2}>
            <AnimatedCard className="mb-4 p-4 sm:mb-6 sm:p-6 lg:mb-8 lg:p-8">
              <Heading size="6" className="font-heading text-[var(--color-gold)]" mb="6">
                Associations
              </Heading>

              <Grid columns={{ initial: "1", sm: "2" }} gap={{ initial: "4", sm: "6" }}>
                <Flex direction="column" gap="2">
                  <Text
                    weight="bold"
                    className="text-sm uppercase tracking-wide text-[var(--color-gold-bright)]"
                  >
                    Element
                  </Text>
                  <Text size="5" className="text-foreground">
                    {relatedBy?.element
                      ? relatedBy.element.charAt(0).toUpperCase() +
                        relatedBy.element.slice(1)
                      : "N/A"}
                  </Text>
                </Flex>
                <Flex direction="column" gap="2">
                  <Text
                    weight="bold"
                    className="text-sm uppercase tracking-wide text-[var(--color-gold-bright)]"
                  >
                    Dual
                  </Text>
                  <Text size="5" className="text-foreground">
                    {dualOfTitle}
                  </Text>
                </Flex>
              </Grid>
            </AnimatedCard>
          </AnimateOnScroll>

          {/* MDX Content - Narrative sections with ToC and collapsible behavior */}
          {mdxContent ? (
            <ContentLayout
              sections={
                geometry.relationships && geometry.relationships.length > 0
                  ? [
                      ...mdxContent.sections,
                      { id: "related-geometries", title: "Related Geometries" },
                    ]
                  : mdxContent.sections
              }
            >
              {mdxContent.content}
            </ContentLayout>
          ) : (
            <div className="text-center text-muted-foreground">
              <Text>Content coming soon...</Text>
            </div>
          )}

          {/* Navigation */}
          <GeometryNavigation currentSlug={slug} category="platonic" />
        </div>
      </div>
    </main>
  );
}
