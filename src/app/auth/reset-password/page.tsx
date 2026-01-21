"use client";

/**
 * Password Reset Page
 *
 * Handles password reset when user clicks the link in their email.
 * Shows form to enter new password, or error if token is missing/invalid.
 */

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import Link from "next/link";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // No token provided
  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border border-[var(--border-gold)] bg-background p-8 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 font-heading text-xl text-foreground">
            Invalid Reset Link
          </h1>
          <p className="mt-2 text-muted-foreground">
            No reset token was provided. Please request a new password reset
            link.
          </p>
          <Button
            asChild
            className="mt-6 bg-[var(--color-gold)] text-primary-foreground hover:bg-[var(--color-gold-bright)]"
          >
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show reset form
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-[var(--border-gold)] bg-background p-8">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-xl text-foreground">
            Reset Your Password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter a new password for your account.
          </p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--color-gold)]" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
