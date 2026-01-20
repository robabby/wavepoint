"use client";

import { User } from "lucide-react";
import { useAuthModal } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SignInButtonProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

/**
 * Sign In button that opens the auth modal.
 * Supports desktop (outline button) and mobile (full-width row) variants.
 */
export function SignInButton({
  variant = "desktop",
  className,
}: SignInButtonProps) {
  const { openModal } = useAuthModal();

  if (variant === "mobile") {
    return (
      <button
        onClick={() => openModal("sign-in")}
        className={cn(
          "flex w-full items-center gap-4 rounded-lg px-4 py-4 text-lg font-medium text-left",
          "text-[var(--color-cream)] transition-all duration-200 ease-out",
          "hover:bg-[var(--glass-bg-elevated)] hover:text-[var(--color-gold)]",
          className
        )}
      >
        <User className="h-5 w-5 text-[var(--color-gold)]/70" />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => openModal("sign-in")}
      className={cn(
        "cursor-pointer border-[var(--border-gold)] bg-transparent",
        "text-[var(--color-warm-gray)]",
        "hover:border-[var(--color-gold)]/50 hover:bg-[var(--color-dark-bronze)]",
        "hover:text-[var(--color-gold)]",
        className
      )}
    >
      Sign In
    </Button>
  );
}
