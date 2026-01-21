"use client";

import { useState } from "react";
import { ShoppingCart, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/shop/cart-context";
import type { Product, PrintfulVariant } from "@/lib/shop/types";
import { EASE_STANDARD } from "@/lib/animation-constants";

interface AddToCartButtonProps {
  product: Product;
  selectedVariant: PrintfulVariant | undefined;
  disabled?: boolean;
}

type ButtonState = "idle" | "adding" | "added";

export function AddToCartButton({
  product,
  selectedVariant,
  disabled,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [buttonState, setButtonState] = useState<ButtonState>("idle");

  const handleAddToCart = () => {
    if (!selectedVariant || disabled) return;

    setButtonState("adding");

    // Brief delay for visual feedback
    setTimeout(() => {
      addItem({
        productId: product.id,
        printfulVariantId: selectedVariant.id,
        quantity: 1,
        name: product.name,
        variantName: selectedVariant.name,
        price: selectedVariant.price,
        image: selectedVariant.image ?? "",
      });
      setButtonState("added");

      // Reset to idle after showing success
      setTimeout(() => {
        setButtonState("idle");
      }, 2000);
    }, 300);
  };

  const isDisabled =
    disabled || !selectedVariant || !selectedVariant.inStock || buttonState === "adding";

  const getButtonContent = () => {
    switch (buttonState) {
      case "adding":
        return (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-5 w-5 rounded-full border-2 border-[var(--color-obsidian)] border-t-transparent"
            />
            <span>Adding...</span>
          </>
        );
      case "added":
        return (
          <>
            <Check className="h-5 w-5" />
            <span>Added to Cart</span>
          </>
        );
      default:
        if (!selectedVariant) {
          return (
            <>
              <AlertCircle className="h-5 w-5" />
              <span>Select a Variant</span>
            </>
          );
        }
        if (!selectedVariant.inStock) {
          return (
            <>
              <AlertCircle className="h-5 w-5" />
              <span>Out of Stock</span>
            </>
          );
        }
        return (
          <>
            <ShoppingCart className="h-5 w-5" />
            <span>Add to Cart</span>
          </>
        );
    }
  };

  const getButtonClassName = () => {
    const baseClass =
      "flex w-full items-center justify-center gap-2 py-6 text-lg font-medium transition-colors";

    if (buttonState === "added") {
      return `${baseClass} bg-[var(--color-gold)] text-primary-foreground hover:bg-[var(--color-gold)]`;
    }
    if (isDisabled) {
      return `${baseClass} bg-card text-muted-foreground cursor-not-allowed`;
    }
    return `${baseClass} bg-[var(--color-gold)] text-primary-foreground hover:bg-[var(--color-gold-bright)]`;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={buttonState}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.15, ease: EASE_STANDARD }}
      >
        <Button
          onClick={handleAddToCart}
          disabled={isDisabled}
          className={getButtonClassName()}
        >
          {getButtonContent()}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
