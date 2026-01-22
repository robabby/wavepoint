/**
 * Waitlist Module
 *
 * Handles waitlist signups for upcoming features (e.g., Signal).
 * - Validates input with Zod schemas
 * - Stores signups in database
 * - Syncs to Brevo for marketing automation
 */

export {
  waitlistSignupSchema,
  waitlistSources,
  type WaitlistSource,
  type WaitlistSignupInput,
} from "./schemas";

export {
  isBrevoWaitlistConfigured,
  syncWaitlistToBrevo,
  syncWaitlistToBrevoAsync,
} from "./brevo";
