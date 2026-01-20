import { Flex, Grid, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GeometryNavigation } from "@/components/geometry-navigation";
import {
  getGeometryBySlug,
  getPatterns,
  getGeometryPath,
} from "@/lib/data";
import { getPatternContent } from "@/lib/content";
import { DetailHero, HeroText, HeroGeometry } from "@/components/detail-hero";
import { PulsingGeometry } from "@/components/pulsing-geometry";
import { ContentLayout } from "@/components/content-layout";
import {
  StructuredData,
  createArticleSchema,
} from "@/components/structured-data";

/**
 * Generate static params for all Patterns
 */
export async function generateStaticParams() {
  return getPatterns().map((pattern) => ({
    slug: pattern.slug,
  }));
}

/**
 * Generate metadata for Pattern pages
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const geometry = getGeometryBySlug(slug);

  if (!geometry) {
    return {
      title: "Pattern Not Found",
    };
  }

  return {
    title: geometry.name,
    description: geometry.description,
  };
}

/**
 * Pattern Detail Page (Dynamic Route)
 */
export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Load geometry data from data model
  const geometry = getGeometryBySlug(slug);

  // Load MDX content
  const mdxContent = await getPatternContent(slug);

  if (!geometry) {
    notFound();
  }

  const { title, description, images, name } = geometry;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://wavepoint.space";

  return (
    <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-cream)]">
      <StructuredData
        data={createArticleSchema({
          url: `${baseUrl}${getGeometryPath(geometry)}`,
          headline: name,
          description: description ?? "",
        })}
      />
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl">
          {/* Hero Section - Data from geometry model */}
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
                    className="font-display text-[var(--color-cream)]"
                  >
                    {title ?? name}
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
                    alt={name}
                    width={400}
                    height={400}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md object-contain"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(85%) sepia(66%) saturate(466%) hue-rotate(358deg) brightness(98%) contrast(91%)",
                    }}
                  />
                </PulsingGeometry>
              </HeroGeometry>
            </Grid>
          </DetailHero>

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
            <div className="text-center text-[var(--color-warm-gray)]">
              <Text>Content coming soon...</Text>
            </div>
          )}

          {/* Navigation */}
          <GeometryNavigation currentSlug={slug} category="pattern" />
        </div>
      </div>
    </main>
  );
}
