"use client";

import Image from "next/image";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { AnimatedCard } from "@/components/animated-card";
import { Badge } from "@/components/ui/badge";
import { getProductPath } from "@/lib/data/products";
import { formatPrice, getPriceRange } from "@/lib/shop/printful";
import type { Product, PrintfulVariant } from "@/lib/shop/types";

interface ProductCardProps {
  product: Product;
  variants: PrintfulVariant[];
  thumbnail: string;
}

const categoryLabels: Record<string, string> = {
  apparel: "Apparel",
  drinkware: "Drinkware",
  accessories: "Accessories",
};

export function ProductCard({ product, variants, thumbnail }: ProductCardProps) {
  const priceRange = getPriceRange(variants);
  const priceDisplay =
    priceRange.min === priceRange.max
      ? formatPrice(priceRange.min)
      : `From ${formatPrice(priceRange.min)}`;

  return (
    <Link
      href={getProductPath(product)}
      aria-label={`View ${product.name} - ${priceDisplay}`}
      className="group block h-full"
    >
      <AnimatedCard className="h-full p-3 sm:p-6">
        <div className="flex h-full flex-col gap-4">
          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-background">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Text className="text-muted-foreground">No image</Text>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-1 flex-col gap-2">
            <Heading size="5" className="text-[var(--color-gold-bright)]">
              {product.name}
            </Heading>

            {product.edition && (
              <Badge
                variant="outline"
                className="w-fit border-[var(--color-gold)] text-[var(--color-gold)]"
              >
                {product.edition}
              </Badge>
            )}

            <Text size="2" className="text-muted-foreground">
              {product.tagline}
            </Text>
          </div>

          {/* Price and Category */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge
              variant="secondary"
              className="bg-muted text-[var(--color-gold)]"
            >
              {categoryLabels[product.category] ?? product.category}
            </Badge>

            <Text size="4" weight="bold" className="text-foreground">
              {priceDisplay}
            </Text>
          </div>

          {/* CTA */}
          <Text
            size="2"
            className="font-medium text-[var(--color-gold)] transition-colors group-hover:text-[var(--color-gold-bright)]"
          >
            View Details →
          </Text>
        </div>
      </AnimatedCard>
    </Link>
  );
}
