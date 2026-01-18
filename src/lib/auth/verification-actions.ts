"use client";

/**
 * Client-side verification actions
 *
 * Wraps API calls for email verification flow.
 * Follows the pattern from actions.ts.
 */

export type SendVerificationResult =
  | { success: true }
  | { success: false; error: string; cooldownSeconds?: number };

export type VerifyEmailResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Request a verification email be sent to the current user
 */
export async function requestVerificationEmail(): Promise<SendVerificationResult> {
  try {
    const response = await fetch("/api/auth/verify/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const result = (await response.json()) as {
      error?: string;
      cooldownSeconds?: number;
    };

    if (!response.ok) {
      return {
        success: false,
        error: result.error ?? "Failed to send verification email",
        cooldownSeconds: result.cooldownSeconds,
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Verify email with token (called from verify page)
 */
export async function verifyEmail(token: string): Promise<VerifyEmailResult> {
  try {
    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      return {
        success: false,
        error: result.error ?? "Verification failed",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}
