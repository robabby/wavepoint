import type { Metadata } from "next";
import { Box, Heading, Text } from "@radix-ui/themes";
import { ShoppingBag } from "lucide-react";
import { getProducts } from "@/lib/data/products";
import { getProductWithVariants } from "@/lib/shop/printful";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard } from "@/components/animated-card";
import { ProductCard } from "@/components/shop/product-card";
import { ShopComingSoon } from "@/components/shop/shop-coming-soon";
import { auth } from "@/lib/auth";
import { canAccessShop } from "@/lib/features/access";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Sacred geometry merchandise featuring Metatron's Cube. Hoodies, mugs, and more with meaningful designs.",
  openGraph: {
    title: "Shop | WavePoint",
    description:
      "Wear and use sacred geometry daily. Premium merchandise featuring Metatron's Cube and other sacred patterns.",
  },
};

export default async function ShopPage() {
  const session = await auth();

  if (!canAccessShop(session)) {
    return <ShopComingSoon />;
  }

  const products = getProducts();

  // Hydrate products with Printful data
  const productsWithVariants = await Promise.all(
    products.map((product) => getProductWithVariants(product))
  );

  return (
    <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-cream)]">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Header */}
        <AnimateOnScroll className="mx-auto mb-8 max-w-4xl text-center sm:mb-12 lg:mb-16">
          <Heading size="9" className="font-display text-[var(--color-cream)]" mb="4">
            Shop
          </Heading>
          <Box mb="2">
            <Text size="5" className="text-[var(--color-gold)]">
              Sacred geometry merchandise
            </Text>
          </Box>
          <Text size="3" className="mx-auto max-w-3xl text-[var(--color-warm-gray)]">
            Wear and use these timeless patterns in your daily life. Each piece
            features sacred geometry designs that have inspired seekers for
            millennia.
          </Text>
        </AnimateOnScroll>

        {/* Product Grid */}
        {productsWithVariants.length === 0 ? (
          <AnimateOnScroll>
            <AnimatedCard className="mx-auto max-w-2xl p-8 text-center">
              <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-[var(--color-warm-gray)]/50" />
              <Heading size="6" className="mb-4 font-heading text-[var(--color-gold)]">
                No Products Available
              </Heading>
              <Text className="text-[var(--color-warm-gray)]">
                We&apos;re working on adding new sacred geometry merchandise.
                Check back soon!
              </Text>
            </AnimatedCard>
          </AnimateOnScroll>
        ) : (
          <StaggerChildren
            className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            staggerDelay={0.1}
          >
            {productsWithVariants.map(({ product, variants, thumbnail }) => (
              <StaggerItem key={product.id} className="h-full">
                <ProductCard
                  product={product}
                  variants={variants}
                  thumbnail={thumbnail}
                />
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}

        {/* Additional Info */}
        <AnimateOnScroll delay={0.3}>
          <AnimatedCard className="mx-auto mt-8 max-w-4xl p-4 sm:mt-12 sm:p-6 lg:mt-16 lg:p-8">
            <Heading size="6" className="mb-4 font-heading text-[var(--color-gold)]">
              About Our Products
            </Heading>
            <Text className="mb-4 text-[var(--color-warm-gray)]">
              Each item is printed on demand using high-quality materials and
              eco-friendly inks. By ordering only what is needed, we minimize
              waste and ensure every piece is made with care.
            </Text>
            <Text className="text-[var(--color-warm-gray)]">
              All designs feature Metatron&#39;s Cube—the sacred pattern that
              contains within it all five Platonic Solids and represents the
              blueprint of creation itself.
            </Text>
          </AnimatedCard>
        </AnimateOnScroll>
      </div>
    </main>
  );
}
