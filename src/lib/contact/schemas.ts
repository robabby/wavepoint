/**
 * Contact Form Validation Schemas
 *
 * Zod schemas for contact form validation.
 * Used both client-side (react-hook-form) and server-side (API route).
 */

import { z } from "zod";

/**
 * Subject options for contact form dropdown
 */
export const SUBJECT_OPTIONS = [
  { value: "general", label: "General Inquiry" },
  { value: "press", label: "Press/Media" },
  { value: "partnership", label: "Partnership" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
] as const;

export type SubjectValue = (typeof SUBJECT_OPTIONS)[number]["value"];

/**
 * Contact form submission schema
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Must be at least 2 characters")
    .max(100, "Must be less than 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Must be a valid email"),
  subject: z.enum(["general", "press", "partnership", "feedback", "other"], {
    required_error: "Subject is required",
  }),
  message: z
    .string()
    .min(10, "Must be at least 10 characters")
    .max(2000, "Must be less than 2000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
