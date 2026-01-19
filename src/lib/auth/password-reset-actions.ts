"use client";

/**
 * Client-side password reset actions
 *
 * Wraps API calls for password reset flow.
 * Follows the pattern from verification-actions.ts.
 */

export type RequestPasswordResetResult =
  | { success: true }
  | { success: false; error: string; cooldownSeconds?: number };

export type ResetPasswordResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Request a password reset email be sent
 */
export async function requestPasswordReset(
  email: string
): Promise<RequestPasswordResetResult> {
  try {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = (await response.json()) as {
      error?: string;
      cooldownSeconds?: number;
    };

    if (!response.ok) {
      return {
        success: false,
        error: result.error ?? "Failed to send reset email",
        cooldownSeconds: result.cooldownSeconds,
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Reset password with token (called from reset-password page)
 */
export async function resetPassword(
  token: string,
  password: string
): Promise<ResetPasswordResult> {
  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      return {
        success: false,
        error: result.error ?? "Password reset failed",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}
