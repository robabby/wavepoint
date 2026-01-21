"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { VariantSelector } from "@/components/shop/variant-selector";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ImageLightbox } from "@/components/shop/image-lightbox";
import { formatPrice } from "@/lib/shop/printful";
import { cn } from "@/lib/utils";
import type { Product, PrintfulVariant } from "@/lib/shop/types";

interface ProductDetailsProps {
  product: Product;
  variants: PrintfulVariant[];
  geometryLink?: {
    path: string;
    name: string;
  };
}

const categoryLabels: Record<string, string> = {
  apparel: "Apparel",
  drinkware: "Drinkware",
  accessories: "Accessories",
};

export function ProductDetails({ product, variants, geometryLink }: ProductDetailsProps) {
  // Initialize with first in-stock variant, or first variant
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    () => {
      const inStockVariant = variants.find((v) => v.inStock);
      return inStockVariant?.id ?? variants[0]?.id ?? null;
    }
  );
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  // Handle variant change and reset gallery index
  const handleVariantChange = (variantId: number | null) => {
    setSelectedVariantId(variantId);
    setGalleryIndex(0);
  };

  // Get gallery images for the selected variant (from localImages or fallback to variant image)
  const galleryImages: string[] = (() => {
    const variantImage = selectedVariant?.image ?? variants[0]?.image;

    if (product.localImages?.variants && selectedVariant) {
      const localImages = product.localImages.variants[selectedVariant.size];
      if (localImages && localImages.length > 0) {
        // When includeApiImage is true, prepend the Printful image to local images
        if (product.localImages.includeApiImage && variantImage) {
          return [variantImage, ...localImages];
        }
        return localImages;
      }
    }
    // Fallback to single variant image
    return variantImage ? [variantImage] : [];
  })();

  // Derive current image from gallery
  const currentImage = galleryImages[galleryIndex] ?? galleryImages[0] ?? "";

  return (
    <div className="mx-auto max-w-7xl">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/shop" className="text-muted-foreground hover:text-[var(--color-gold)]">
                Shop
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-muted-foreground" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Grid
        columns={{ initial: "1", md: "2" }}
        className="gap-6 md:gap-10 lg:gap-16"
      >
      {/* Product Image */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => currentImage && setLightboxOpen(true)}
          className={cn(
            "relative aspect-square w-full overflow-hidden rounded-lg bg-card",
            "transition-shadow focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-background",
            currentImage && "cursor-zoom-in hover:ring-2 hover:ring-[var(--color-gold)]/50"
          )}
          aria-label={currentImage ? `View ${product.name} fullscreen` : undefined}
          disabled={!currentImage}
        >
          {currentImage ? (
            <Image
              src={currentImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8"
              priority
              loading="eager"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Text className="text-muted-foreground">No image available</Text>
            </div>
          )}
        </button>

        {/* Thumbnail Gallery (only show if multiple images) */}
        {galleryImages.length > 1 && (
          <div className="relative">
            {/* Gradient fade edges to indicate scrollable content */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[var(--color-obsidian)] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-[var(--color-obsidian)] to-transparent" />

            <div className="scrollbar-none flex gap-2 overflow-x-auto px-2 py-1">
              {galleryImages.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setGalleryIndex(index)}
                  className={cn(
                    "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md transition-[box-shadow,opacity]",
                    "hover:ring-2 hover:ring-[var(--color-gold)] hover:ring-offset-2 hover:ring-offset-background",
                    index === galleryIndex
                      ? "ring-2 ring-[var(--color-gold)] ring-offset-2 ring-offset-background"
                      : "opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-contain bg-card p-1"
                  />
                </button>
              ))}
            </div>

            {/* Dot indicators */}
            <div className="mt-3 flex justify-center gap-1.5">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setGalleryIndex(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-[width,background-color]",
                    index === galleryIndex
                      ? "w-4 bg-[var(--color-gold)]"
                      : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground"
                  )}
                  aria-label={`View image ${index + 1}`}
                  aria-current={index === galleryIndex ? "true" : undefined}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <Flex direction="column" gap="6">
        {/* Category Badge */}
        <Badge
          variant="secondary"
          className="w-fit bg-muted text-[var(--color-gold)]"
        >
          {categoryLabels[product.category] ?? product.category}
        </Badge>

        {/* Name and Tagline */}
        <div>
          <Heading
            size={{ initial: "7", md: "8" }}
            className="mb-2 font-display text-foreground"
          >
            {product.name}
          </Heading>
          <Text size="5" className="text-[var(--color-gold)]">
            {product.tagline}
          </Text>
        </div>

        {/* Edition Badge */}
        {product.edition && (
          <Badge
            variant="outline"
            className="w-fit border-[var(--color-gold)] px-3 py-1 text-sm text-[var(--color-gold)]"
          >
            {product.edition}
          </Badge>
        )}

        {/* Price */}
        <Text size="6" weight="bold" className="text-[var(--color-gold)]">
          {selectedVariant ? formatPrice(selectedVariant.price) : "—"}
        </Text>

        {/* Description */}
        <Text className="text-muted-foreground">{product.description}</Text>

        {/* Variant Selector */}
        <div className="rounded-lg border border-[var(--border-gold)] bg-card p-6">
          <VariantSelector
            variants={variants}
            selectedVariantId={selectedVariantId}
            onVariantChange={handleVariantChange}
          />
        </div>

        {/* Selected Variant Info */}
        {selectedVariant && (
          <Text size="2" className="text-muted-foreground">
            Selected: {selectedVariant.name}
          </Text>
        )}

        {/* Geometry Link */}
        {geometryLink && (
          <Link
            href={geometryLink.path}
            className="group flex items-center gap-2 text-[var(--color-gold)] transition-colors hover:text-[var(--color-gold-bright)]"
          >
            <ExternalLink className="h-4 w-4" />
            <Text size="2">Learn about {geometryLink.name}</Text>
          </Link>
        )}

        {/* Add to Cart */}
        <AddToCartButton product={product} selectedVariant={selectedVariant} />
      </Flex>
    </Grid>

      {/* Image Lightbox */}
      <ImageLightbox
        images={galleryImages}
        currentIndex={galleryIndex}
        onIndexChange={setGalleryIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        productName={product.name}
      />
    </div>
  );
}
