/**
 * Waitlist Validation Schemas
 *
 * Zod schemas for validating waitlist signup requests.
 */

import { z } from "zod";

/**
 * Available waitlist sources
 * Extensible for future features
 */
export const waitlistSources = ["signal", "calendar"] as const;
export type WaitlistSource = (typeof waitlistSources)[number];

/**
 * Waitlist signup request schema
 */
export const waitlistSignupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  source: z.enum(waitlistSources),
});

export type WaitlistSignupInput = z.infer<typeof waitlistSignupSchema>;
