"use client";

/**
 * Email Verification Page
 *
 * Handles email verification when user clicks the link in their email.
 * Shows loading, success, or error states.
 */

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { verifyEmail } from "@/lib/auth/verification-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type VerifyState = "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Derive initial state from token presence
  const [state, setState] = useState<VerifyState>(token ? "loading" : "error");
  const [error, setError] = useState<string | null>(
    token ? null : "No verification token provided"
  );

  // Track if verification has been attempted to avoid duplicate calls
  const verificationAttempted = useRef(false);

  useEffect(() => {
    // Only verify once and only if we have a token
    if (!token || verificationAttempted.current) return;
    verificationAttempted.current = true;

    // Perform verification asynchronously
    verifyEmail(token).then((result) => {
      if (result.success) {
        setState("success");
        // Full page reload to ensure fresh session (dismisses verification banner)
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        setState("error");
        setError(result.error ?? "Verification failed");
      }
    });
  }, [token]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-[var(--border-gold)] bg-[var(--color-obsidian)] p-8 text-center">
        {state === "loading" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[var(--color-gold)]" />
            <h1 className="mt-4 font-heading text-xl text-[var(--color-cream)]">
              Verifying your email...
            </h1>
            <p className="mt-2 text-[var(--color-warm-gray)]">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h1 className="mt-4 font-heading text-xl text-[var(--color-cream)]">
              Email Verified!
            </h1>
            <p className="mt-2 text-[var(--color-warm-gray)]">
              Your email has been verified successfully. Redirecting to home...
            </p>
            <Button
              onClick={() => {
                window.location.href = "/";
              }}
              className="mt-6 bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)]"
            >
              Continue to Home
            </Button>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="mt-4 font-heading text-xl text-[var(--color-cream)]">
              Verification Failed
            </h1>
            <p className="mt-2 text-[var(--color-warm-gray)]">
              {error ?? "This verification link is invalid or has expired."}
            </p>
            <p className="mt-4 text-sm text-[var(--color-dim)]">
              Please try signing in and requesting a new verification email.
            </p>
            <Button
              asChild
              className="mt-6 bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)]"
            >
              <Link href="/">Return to Home</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--color-gold)]" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
