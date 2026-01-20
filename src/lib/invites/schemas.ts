import { z } from "zod";

/**
 * Invite code format: SG-XXXXXX (6 alphanumeric characters)
 * Uses charset without ambiguous characters (no 0/O/1/I)
 */
export const INVITE_CODE_PATTERN = /^SG-[A-HJ-NP-Z2-9]{6}$/;

/**
 * Invite status values
 */
export const INVITE_STATUSES = ["pending", "redeemed"] as const;
export type InviteStatus = (typeof INVITE_STATUSES)[number];

/**
 * Schema for validating invite code format
 */
export const inviteCodeSchema = z
  .string()
  .toUpperCase()
  .regex(INVITE_CODE_PATTERN, "Invalid invite code format");

/**
 * Schema for validating email in invite context
 */
export const inviteEmailSchema = z
  .string()
  .email("Invalid email address")
  .transform((email) => email.toLowerCase().trim());

/**
 * Schema for creating a new invite (admin action)
 */
export const createInviteSchema = z.object({
  email: inviteEmailSchema,
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;

/**
 * Schema for validating invite during registration
 */
export const validateInviteSchema = z.object({
  code: inviteCodeSchema,
  email: inviteEmailSchema,
});

export type ValidateInviteInput = z.infer<typeof validateInviteSchema>;
