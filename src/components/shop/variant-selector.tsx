"use client";

import { useMemo } from "react";
import { Flex, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import type { PrintfulVariant } from "@/lib/shop/types";

interface VariantSelectorProps {
  variants: PrintfulVariant[];
  selectedVariantId: number | null;
  onVariantChange: (variantId: number) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onVariantChange,
}: VariantSelectorProps) {
  // Extract unique sizes and colors
  const { sizes, colors, hasMultipleColors } = useMemo(() => {
    const sizeSet = new Set<string>();
    const colorSet = new Set<string>();

    for (const variant of variants) {
      sizeSet.add(variant.size);
      colorSet.add(variant.color);
    }

    return {
      sizes: Array.from(sizeSet),
      colors: Array.from(colorSet),
      hasMultipleColors: colorSet.size > 1,
    };
  }, [variants]);

  // Get selected variant
  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const selectedSize = selectedVariant?.size ?? sizes[0];
  const selectedColor = selectedVariant?.color ?? colors[0];

  // Find variant by size and color
  const findVariant = (size: string, color: string) => {
    return variants.find((v) => v.size === size && v.color === color);
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    const variant = findVariant(size, selectedColor ?? colors[0] ?? "Default");
    if (variant) {
      onVariantChange(variant.id);
    }
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    const variant = findVariant(selectedSize ?? sizes[0] ?? "One Size", color);
    if (variant) {
      onVariantChange(variant.id);
    }
  };

  // Check if a size is available for the selected color
  const isSizeAvailable = (size: string) => {
    const variant = findVariant(size, selectedColor ?? colors[0] ?? "Default");
    return variant?.inStock ?? false;
  };

  // Check if a color is available for the selected size
  const isColorAvailable = (color: string) => {
    const variant = findVariant(selectedSize ?? sizes[0] ?? "One Size", color);
    return variant?.inStock ?? false;
  };

  return (
    <Flex direction="column" gap="6">
      {/* Size Selector */}
      {sizes.length > 1 && (
        <div>
          <Text
            weight="bold"
            className="mb-3 block text-sm uppercase tracking-wide text-[var(--color-gold-bright)]"
          >
            Size
          </Text>
          <Flex gap="2" wrap="wrap">
            {sizes.map((size) => {
              const isSelected = size === selectedSize;
              const isAvailable = isSizeAvailable(size);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeSelect(size)}
                  disabled={!isAvailable}
                  aria-label={`Select size ${size}${!isAvailable ? " (out of stock)" : ""}${isSelected ? " (selected)" : ""}`}
                  aria-pressed={isSelected}
                  className={cn(
                    "min-w-[3rem] rounded-md border px-3 py-2 text-sm font-medium transition-[border-color,background-color]",
                    isSelected
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-primary-foreground"
                      : "border-[var(--border-gold)] bg-transparent text-foreground hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10",
                    !isAvailable &&
                      "cursor-not-allowed opacity-40 line-through hover:bg-transparent"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </Flex>
        </div>
      )}

      {/* Color Selector */}
      {hasMultipleColors && (
        <div>
          <Text
            weight="bold"
            className="mb-3 block text-sm uppercase tracking-wide text-[var(--color-gold-bright)]"
          >
            Color
          </Text>
          <Flex gap="2" wrap="wrap">
            {colors.map((color) => {
              const isSelected = color === selectedColor;
              const isAvailable = isColorAvailable(color);

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  disabled={!isAvailable}
                  aria-label={`Select color ${color}${!isAvailable ? " (out of stock)" : ""}${isSelected ? " (selected)" : ""}`}
                  aria-pressed={isSelected}
                  className={cn(
                    "rounded-md border px-4 py-2 text-sm font-medium transition-[border-color,background-color]",
                    isSelected
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-primary-foreground"
                      : "border-[var(--border-gold)] bg-transparent text-foreground hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10",
                    !isAvailable &&
                      "cursor-not-allowed opacity-40 line-through hover:bg-transparent"
                  )}
                >
                  {color}
                </button>
              );
            })}
          </Flex>
        </div>
      )}

      {/* Out of stock message */}
      {selectedVariant && !selectedVariant.inStock && (
        <Text className="text-red-400">
          This variant is currently out of stock
        </Text>
      )}
    </Flex>
  );
}
