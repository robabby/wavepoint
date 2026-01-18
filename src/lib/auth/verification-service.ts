/**
 * Email Verification Service
 *
 * Orchestrates email verification flow: token creation, email sending, and verification.
 * Uses token-service for token management and email module for sending.
 */

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { env } from "@/env";
import { sendEmail, isEmailConfigured } from "@/lib/email/brevo";
import {
  verificationEmailTemplate,
  type VerificationEmailVars,
} from "@/lib/email/templates/verification";
import {
  createVerificationToken,
  consumeToken,
  getResendCooldownSeconds,
  getTokenExpiryHours,
} from "./token-service";

/** Internal result type for send verification (not exported to avoid duplication with client types) */
interface SendVerificationResult {
  success: boolean;
  error?: string;
  cooldownSeconds?: number;
}

/** Internal result type for verify email (not exported to avoid duplication with client types) */
interface VerifyEmailResult {
  success: boolean;
  error?: string;
}

/**
 * Send verification email to user
 * Includes rate limiting (2 minute cooldown between sends)
 */
export async function sendVerificationEmail(
  email: string
): Promise<SendVerificationResult> {
  const normalizedEmail = email.toLowerCase();

  // Check if email is configured
  if (!isEmailConfigured()) {
    console.warn("Email verification skipped: BREVO_API_KEY not configured");
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

  // Already verified - no need to send
  if (user.emailVerified) {
    return { success: true };
  }

  // Rate limiting check
  const cooldownSeconds = await getResendCooldownSeconds(
    normalizedEmail,
    "email_verification"
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
    "email_verification"
  );

  // Build verification URL
  const verificationUrl = `${env.APP_URL}/auth/verify?token=${token}`;

  // Render template
  const expiresInHours = getTokenExpiryHours("email_verification");
  const templateVars: VerificationEmailVars = { verificationUrl, expiresInHours };

  // Send email
  const result = await sendEmail({
    to: [{ email: normalizedEmail }],
    subject: verificationEmailTemplate.subject,
    htmlContent: verificationEmailTemplate.html(templateVars),
    textContent: verificationEmailTemplate.text?.(templateVars),
  });

  if (!result.success) {
    console.error("Failed to send verification email:", result.error);
    return { success: false, error: "Failed to send verification email" };
  }

  return { success: true };
}

/**
 * Verify email with token
 * Marks user.emailVerified timestamp
 */
export async function verifyEmailWithToken(
  token: string
): Promise<VerifyEmailResult> {
  // Consume token (validates and deletes)
  const result = await consumeToken(token, "email_verification");

  if (!result.success || !result.identifier) {
    return { success: false, error: result.error ?? "Invalid token" };
  }

  // Update user's emailVerified timestamp
  await db
    .update(users)
    .set({ emailVerified: new Date(), updatedAt: new Date() })
    .where(eq(users.email, result.identifier));

  return { success: true };
}

