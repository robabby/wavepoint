"use client";

import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/lib/shop/cart-context";
import { EASE_STANDARD } from "@/lib/animation-constants";
import { cn } from "@/lib/utils";

interface CartIconProps {
  className?: string;
}

export function CartIcon({ className }: CartIconProps) {
  const { itemCount, openCart } = useCart();
  const hasItems = itemCount > 0;

  return (
    <button
      onClick={openCart}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-md transition-[background-color,color] duration-300",
        hasItems
          ? "text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10"
          : "text-muted-foreground hover:bg-card hover:text-[var(--color-gold)]",
        className
      )}
      aria-label={`Shopping cart with ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
    >
      <ShoppingCart className="h-5 w-5" />

      {/* Item count badge with glow effect */}
      <AnimatePresence>
        {hasItems && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_STANDARD }}
            className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-gold)] text-xs font-medium text-primary-foreground shadow-[0_0_8px_var(--glow-gold)]"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
