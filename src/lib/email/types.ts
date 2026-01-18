/**
 * Email Service Types
 *
 * Defines interfaces for email sending and templates.
 * Provider-agnostic to allow switching from Brevo if needed.
 */

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailMessage {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
