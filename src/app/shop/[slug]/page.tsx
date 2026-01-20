import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getProductBySlug, getProductPath } from "@/lib/data/products";
import { getGeometryBySlug, getGeometryPath } from "@/lib/data";
import { getProductWithVariants, getPriceRange } from "@/lib/shop/printful";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ProductDetails } from "@/components/shop/product-details";
import {
  StructuredData,
  createProductSchema,
} from "@/components/structured-data";
import { ShopComingSoon } from "@/components/shop/shop-coming-soon";
import { auth } from "@/lib/auth";
import { canAccessShop } from "@/lib/features/access";

/**
 * Generate static params for all products
 */
export async function generateStaticParams() {
  return getProducts().map((product) => ({
    slug: product.slug,
  }));
}

/**
 * Generate metadata for product pages
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | WavePoint Shop`,
      description: product.description,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();

  if (!canAccessShop(session)) {
    return <ShopComingSoon />;
  }

  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch variants from Printful
  const { variants, thumbnail } = await getProductWithVariants(product);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://wavepoint.space";

  // Get price range for structured data
  const { min: minPrice, max: maxPrice } = getPriceRange(variants);

  // Get linked geometry info if available
  const geometry = product.geometrySlug
    ? getGeometryBySlug(product.geometrySlug)
    : null;
  const geometryLink = geometry
    ? { path: getGeometryPath(geometry), name: geometry.name }
    : undefined;

  return (
    <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-cream)]">
      <StructuredData
        data={createProductSchema({
          url: `${baseUrl}${getProductPath(product)}`,
          name: product.name,
          description: product.description,
          image: thumbnail,
          price: minPrice,
          priceCurrency: "USD",
          availability:
            variants.some((v) => v.inStock) ? "InStock" : "OutOfStock",
          ...(minPrice !== maxPrice && {
            lowPrice: minPrice,
            highPrice: maxPrice,
          }),
        })}
      />
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <AnimateOnScroll>
            <ProductDetails product={product} variants={variants} geometryLink={geometryLink} />
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
