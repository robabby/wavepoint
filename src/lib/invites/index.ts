/**
 * Invites Module
 *
 * Closed beta invite system for gating registration.
 */

// Schemas and validation
export {
  INVITE_CODE_PATTERN,
  INVITE_STATUSES,
  type InviteStatus,
  inviteCodeSchema,
  inviteEmailSchema,
  createInviteSchema,
  type CreateInviteInput,
  validateInviteSchema,
  type ValidateInviteInput,
} from "./schemas";

// Code generation
export { generateInviteCode, normalizeInviteCode } from "./codes";

// Service functions and types
export {
  type CreateInviteResult,
  type GetInviteResult,
  type ValidateInviteResult,
  type RedeemInviteResult,
  createInvite,
  getInviteByCode,
  getInviteByEmail,
  validateInvite,
  redeemInvite,
  listInvites,
  getInviteStats,
} from "./service";

// Brevo sync
export {
  isBrevoSyncConfigured,
  syncInviteToBrevo,
  updateBrevoInviteStatus,
  syncInviteToBrevoAsync,
  updateBrevoInviteStatusAsync,
} from "./brevo";

// Re-export database types for convenience
export type { Invite, NewInvite } from "@/lib/db/schema";
