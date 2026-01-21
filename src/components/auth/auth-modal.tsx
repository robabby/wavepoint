"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuthModal, type AuthView } from "./auth-provider";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";
import { ForgotPasswordForm } from "./forgot-password-form";

/**
 * Header content configuration by view
 */
const VIEW_CONFIG: Record<AuthView, { title: string; description: string }> = {
  "sign-in": {
    title: "Welcome Back",
    description: "Sign in to access your account",
  },
  "sign-up": {
    title: "Create Account",
    description: "Join to save addresses and track orders",
  },
  "forgot-password": {
    title: "Reset Password",
    description: "We'll send you a reset link",
  },
};

/**
 * AuthModal component
 *
 * A dialog-based modal for authentication flows (sign-in, sign-up, forgot-password).
 * Uses mobile bottom sheet pattern on small screens, centered dialog on desktop.
 *
 * Must be rendered within AuthProvider to access modal state.
 */
export function AuthModal() {
  const { isOpen, view, closeModal, setView } = useAuthModal();
  const config = VIEW_CONFIG[view];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent
        className={cn(
          // Base styling
          "overflow-hidden p-0",
          "bg-background border-[var(--border-gold)]",
          // Desktop: centered with offset from top
          "sm:!top-[20vh] sm:!translate-y-0 sm:max-w-md sm:rounded-lg",
          // Mobile: bottom sheet
          "!top-auto !bottom-0 !translate-y-0 max-h-[85vh] w-full max-w-full rounded-t-xl rounded-b-none sm:!bottom-auto"
        )}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-heading text-xl text-foreground">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 pb-6">
          {view === "sign-in" && <SignInForm onSwitchView={setView} />}
          {view === "sign-up" && <SignUpForm onSwitchView={setView} />}
          {view === "forgot-password" && <ForgotPasswordForm onSwitchView={setView} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
