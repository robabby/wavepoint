/**
 * Contact Form Notification Email
 *
 * Sends notification email to admin when contact form is submitted.
 */

import { env } from "@/env";
import { sendEmail, isEmailConfigured } from "@/lib/email";
import { SUBJECT_OPTIONS, type SubjectValue } from "./schemas";

/**
 * Get human-readable subject label from value
 */
function getSubjectLabel(value: SubjectValue): string {
  return SUBJECT_OPTIONS.find((opt) => opt.value === value)?.label ?? value;
}

/**
 * Send contact form notification email to admin
 */
export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: SubjectValue;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.warn("Contact notification not sent: email not configured");
    return { success: false, error: "Email not configured" };
  }

  // Use configured notification email or fallback to FROM address
  const notificationEmail =
    env.CONTACT_NOTIFICATION_EMAIL ?? env.EMAIL_FROM_ADDRESS;

  const subjectLabel = getSubjectLabel(data.subject);

  const htmlContent = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1714; margin-bottom: 24px;">New Contact Form Submission</h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 100px;">Name:</td>
          <td style="padding: 8px 0; color: #1a1714;">${escapeHtml(data.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Email:</td>
          <td style="padding: 8px 0; color: #1a1714;">
            <a href="mailto:${escapeHtml(data.email)}" style="color: #b87333;">${escapeHtml(data.email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Subject:</td>
          <td style="padding: 8px 0; color: #1a1714;">${escapeHtml(subjectLabel)}</td>
        </tr>
      </table>

      <div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Message:</p>
        <p style="margin: 0; color: #1a1714; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
      </div>

      <p style="margin-top: 24px; font-size: 12px; color: #999;">
        This email was sent from the WavePoint contact form.
      </p>
    </div>
  `;

  const textContent = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Subject: ${subjectLabel}

Message:
${data.message}

---
This email was sent from the WavePoint contact form.
  `.trim();

  return sendEmail({
    to: [{ email: notificationEmail }],
    subject: `[WavePoint] ${subjectLabel}: ${data.name}`,
    htmlContent,
    textContent,
  });
}

/**
 * Escape HTML to prevent XSS in email content
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
