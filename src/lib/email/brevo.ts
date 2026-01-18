/**
 * Brevo Email API Client
 *
 * Sends transactional emails via Brevo REST API.
 * Follows the external API client pattern from printful.ts.
 */

import { env } from "@/env";
import type { EmailMessage, EmailSendResult } from "./types";

const BREVO_API_BASE = "https://api.brevo.com/v3";

/**
 * Check if email sending is configured
 */
export function isEmailConfigured(): boolean {
  return !!env.BREVO_API_KEY;
}

/**
 * Send an email via Brevo transactional API
 */
export async function sendEmail(message: EmailMessage): Promise<EmailSendResult> {
  if (!env.BREVO_API_KEY) {
    console.warn("Email not configured: BREVO_API_KEY not set");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const response = await fetch(`${BREVO_API_BASE}/smtp/email`, {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: env.EMAIL_FROM_NAME,
          email: env.EMAIL_FROM_ADDRESS,
        },
        to: message.to,
        subject: message.subject,
        htmlContent: message.htmlContent,
        textContent: message.textContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo API error:", response.status, errorText);
      return { success: false, error: "Failed to send email" };
    }

    const data = (await response.json()) as { messageId?: string };
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: "Email service unavailable" };
  }
}
