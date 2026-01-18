"use client";

import { Mail, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthModal, type AuthView } from "./auth-provider";

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
 * Placeholder form for sign-in view
 * Will be replaced by SignInForm in SG-270
 */
function SignInPlaceholder({ onSwitchView }: { onSwitchView: (view: AuthView) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Email field placeholder */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-cream)]">Email</label>
          <div className="h-11 rounded-md border border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50" />
        </div>
        {/* Password field placeholder */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-cream)]">Password</label>
          <div className="h-11 rounded-md border border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50" />
        </div>
      </div>

      {/* Forgot password link */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSwitchView("forgot-password")}
          className="text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit button placeholder */}
      <Button
        disabled
        className="w-full h-11 bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)] disabled:opacity-50"
      >
        Sign In
      </Button>

      {/* Switch to sign-up */}
      <p className="text-center text-sm text-[var(--color-warm-gray)]">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitchView("sign-up")}
          className="text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
        >
          Create one
        </button>
      </p>
    </div>
  );
}

/**
 * Placeholder form for sign-up view
 * Will be replaced by SignUpForm in SG-270
 */
function SignUpPlaceholder({ onSwitchView }: { onSwitchView: (view: AuthView) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Name field placeholder */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-cream)]">Name</label>
          <div className="h-11 rounded-md border border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50" />
        </div>
        {/* Email field placeholder */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-cream)]">Email</label>
          <div className="h-11 rounded-md border border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50" />
        </div>
        {/* Password field placeholder */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-cream)]">Password</label>
          <div className="h-11 rounded-md border border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50" />
        </div>
      </div>

      {/* Submit button placeholder */}
      <Button
        disabled
        className="w-full h-11 bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)] disabled:opacity-50"
      >
        Create Account
      </Button>

      {/* Switch to sign-in */}
      <p className="text-center text-sm text-[var(--color-warm-gray)]">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitchView("sign-in")}
          className="text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

/**
 * Placeholder form for forgot-password view
 * Will be replaced by ForgotPasswordForm in SG-270
 */
function ForgotPasswordPlaceholder({ onSwitchView }: { onSwitchView: (view: AuthView) => void }) {
  return (
    <div className="space-y-4">
      {/* Back to sign-in */}
      <button
        type="button"
        onClick={() => onSwitchView("sign-in")}
        className="flex items-center gap-1 text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </button>

      <div className="space-y-3">
        {/* Email field placeholder */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-cream)]">Email</label>
          <div className="h-11 rounded-md border border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50" />
        </div>
      </div>

      {/* Submit button placeholder */}
      <Button
        disabled
        className="w-full h-11 bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)] disabled:opacity-50"
      >
        <Mail className="mr-2 h-4 w-4" />
        Send Reset Link
      </Button>

      {/* Info text */}
      <p className="text-center text-xs text-[var(--color-dim)]">
        We&apos;ll send a password reset link to your email address.
      </p>
    </div>
  );
}

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
          "bg-[var(--color-obsidian)] border-[var(--border-gold)]",
          // Desktop: centered with offset from top
          "sm:!top-[20vh] sm:!translate-y-0 sm:max-w-md sm:rounded-lg",
          // Mobile: bottom sheet
          "!top-auto !bottom-0 !translate-y-0 max-h-[85vh] w-full max-w-full rounded-t-xl rounded-b-none sm:!bottom-auto"
        )}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-heading text-xl text-[var(--color-cream)]">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-[var(--color-warm-gray)]">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 pb-6">
          {view === "sign-in" && <SignInPlaceholder onSwitchView={setView} />}
          {view === "sign-up" && <SignUpPlaceholder onSwitchView={setView} />}
          {view === "forgot-password" && <ForgotPasswordPlaceholder onSwitchView={setView} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
