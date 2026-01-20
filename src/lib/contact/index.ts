/**
 * Contact Module
 *
 * Public contact form with Brevo CRM integration.
 * - Stores submissions in database
 * - Syncs to Brevo CRM (fire-and-forget)
 * - Sends notification email to admin
 * - Rate limited by IP (5/hour)
 */

export {
  contactFormSchema,
  SUBJECT_OPTIONS,
  type ContactFormData,
  type SubjectValue,
} from "./schemas";
export {
  isBrevoContactSyncConfigured,
  syncContactToBrevo,
  syncContactToBrevoAsync,
} from "./brevo";
export { sendContactNotification } from "./notification";
