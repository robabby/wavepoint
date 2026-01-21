"use client";

/**
 * Email Verification Banner
 *
 * Shows a dismissible banner for users with unverified email addresses.
 * Includes resend functionality with rate limiting feedback.
 */

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Mail, X, Loader2, CheckCircle } from "lucide-react";
import { requestVerificationEmail } from "@/lib/auth/verification-actions";
import { cn } from "@/lib/utils";

export function EmailVerificationBanner() {
  const { data: session, update: updateSession } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Countdown timer for cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (sending || cooldown > 0) return;

    setSending(true);
    setError(null);
    setSent(false);

    const result = await requestVerificationEmail();

    setSending(false);

    if (result.success) {
      setSent(true);
      setCooldown(120); // 2 minute cooldown
      // Refresh session to check for updated emailVerified
      void updateSession();
    } else {
      setError(result.error);
      if (result.cooldownSeconds) {
        setCooldown(result.cooldownSeconds);
      }
    }
  }, [sending, cooldown, updateSession]);

  // Format cooldown as m:ss
  const formatCooldown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  // Don't show if:
  // - Not logged in
  // - Email is verified
  // - User dismissed banner
  if (!session?.user || session.user.emailVerified || dismissed) {
    return null;
  }

  return (
    <div className="border-b border-[var(--color-gold)]/30 bg-muted">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-3">
          <Mail className="h-5 w-5 flex-shrink-0 text-[var(--color-gold)]" />
          <p className="text-sm text-foreground">
            <span className="hidden sm:inline">
              Please verify your email address to access all features.
            </span>
            <span className="sm:hidden">Verify your email.</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {sent ? (
            <span className="flex items-center gap-1.5 text-sm text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Sent!</span>
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={sending || cooldown > 0}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                "bg-[var(--color-gold)] text-primary-foreground",
                "hover:bg-[var(--color-gold-bright)]",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Sending...</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Resend in {formatCooldown(cooldown)}
                  </span>
                  <span className="sm:hidden">{formatCooldown(cooldown)}</span>
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Resend email</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-[var(--color-gold)]"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="border-t border-red-400/30 bg-red-400/10 px-4 py-2 sm:px-6 lg:px-8">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
