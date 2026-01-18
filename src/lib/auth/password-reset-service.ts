/**
 * Password Reset Service
 *
 * Orchestrates password reset flow: token creation, email sending, and password update.
 * Uses token-service for token management and email module for sending.
 */

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { env } from "@/env";
import { sendEmail, isEmailConfigured } from "@/lib/email/brevo";
import {
  passwordResetEmailTemplate,
  type PasswordResetEmailVars,
} from "@/lib/email/templates/password-reset";
import {
  createVerificationToken,
  consumeToken,
  getResendCooldownSeconds,
  getTokenExpiryHours,
} from "./token-service";

/** Internal result type for send password reset (not exported to avoid duplication with client types) */
interface SendPasswordResetResult {
  success: boolean;
  error?: string;
  cooldownSeconds?: number;
}

/** Internal result type for reset password (not exported to avoid duplication with client types) */
interface ResetPasswordResult {
  success: boolean;
  error?: string;
}

/**
 * Send password reset email to user
 * Includes rate limiting (2 minute cooldown between sends)
 *
 * Security: Never reveals whether email exists in system
 */
export async function sendPasswordResetEmail(
  email: string
): Promise<SendPasswordResetResult> {
  const normalizedEmail = email.toLowerCase();

  // Check if email is configured
  if (!isEmailConfigured()) {
    console.warn("Password reset skipped: BREVO_API_KEY not configured");
    return { success: true }; // Silent success in dev without email
  }

  // Check if user exists
  const user = await db.query.users.findFirst({
    where: eq(users.email, normalizedEmail),
  });

  if (!user) {
    // Don't reveal if email exists - return success anyway (security)
    return { success: true };
  }

  // Rate limiting check
  const cooldownSeconds = await getResendCooldownSeconds(
    normalizedEmail,
    "password_reset"
  );
  if (cooldownSeconds > 0) {
    return {
      success: false,
      error: "Please wait before requesting another email",
      cooldownSeconds,
    };
  }

  // Create token
  const { token } = await createVerificationToken(
    normalizedEmail,
    "password_reset"
  );

  // Build reset URL
  const resetUrl = `${env.APP_URL}/auth/reset-password?token=${token}`;

  // Render template
  const expiresInHours = getTokenExpiryHours("password_reset");
  const templateVars: PasswordResetEmailVars = { resetUrl, expiresInHours };

  // Send email
  const result = await sendEmail({
    to: [{ email: normalizedEmail }],
    subject: passwordResetEmailTemplate.subject,
    htmlContent: passwordResetEmailTemplate.html(templateVars),
    textContent: passwordResetEmailTemplate.text?.(templateVars),
  });

  if (!result.success) {
    console.error("Failed to send password reset email:", result.error);
    return { success: false, error: "Failed to send password reset email" };
  }

  return { success: true };
}

/**
 * Reset password with token
 * Consumes token and updates user password
 */
export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  // Consume token (validates and deletes)
  const result = await consumeToken(token, "password_reset");

  if (!result.success || !result.identifier) {
    return { success: false, error: result.error ?? "Invalid token" };
  }

  // Hash new password with cost factor 12 (matches registration)
  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Update user's password
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.email, result.identifier));

  return { success: true };
}
