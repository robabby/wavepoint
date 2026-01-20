/**
 * Invite Service
 *
 * Database operations for invite management.
 * Uses result types for explicit error handling.
 */

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { invites, type Invite } from "@/lib/db/schema";
import { generateInviteCode } from "./codes";

// =============================================================================
// Result Types
// =============================================================================

export interface CreateInviteResult {
  success: boolean;
  data?: Invite;
  error?: string;
}

export interface GetInviteResult {
  success: boolean;
  data?: Invite;
  error?: string;
}

export interface ValidateInviteResult {
  success: boolean;
  data?: Invite;
  error?: string;
}

export interface RedeemInviteResult {
  success: boolean;
  data?: Invite;
  error?: string;
}

export interface CancelInviteResult {
  success: boolean;
  data?: Invite;
  error?: string;
}

export interface DeleteInviteResult {
  success: boolean;
  error?: string;
}

// =============================================================================
// Service Functions
// =============================================================================

/**
 * Create a new invite for an email address
 * Generates a unique code and stores the invite
 */
export async function createInvite(email: string): Promise<CreateInviteResult> {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if email already has an invite
  const existing = await db.query.invites.findFirst({
    where: eq(invites.email, normalizedEmail),
  });

  if (existing) {
    return {
      success: false,
      error: "This email has already been invited",
    };
  }

  // Generate a unique code (retry if collision, though unlikely)
  let code = generateInviteCode();
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    const existingCode = await db.query.invites.findFirst({
      where: eq(invites.code, code),
    });

    if (!existingCode) break;
    code = generateInviteCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    return {
      success: false,
      error: "Failed to generate unique code",
    };
  }

  // Create the invite
  const [invite] = await db
    .insert(invites)
    .values({
      code,
      email: normalizedEmail,
      status: "pending",
    })
    .returning();

  return {
    success: true,
    data: invite,
  };
}

/**
 * Get an invite by code
 */
export async function getInviteByCode(code: string): Promise<GetInviteResult> {
  const normalizedCode = code.toUpperCase().trim();

  const invite = await db.query.invites.findFirst({
    where: eq(invites.code, normalizedCode),
  });

  if (!invite) {
    return {
      success: false,
      error: "Invalid invite code",
    };
  }

  return {
    success: true,
    data: invite,
  };
}

/**
 * Get an invite by email
 */
export async function getInviteByEmail(
  email: string
): Promise<GetInviteResult> {
  const normalizedEmail = email.toLowerCase().trim();

  const invite = await db.query.invites.findFirst({
    where: eq(invites.email, normalizedEmail),
  });

  if (!invite) {
    return {
      success: false,
      error: "No invite found for this email",
    };
  }

  return {
    success: true,
    data: invite,
  };
}

/**
 * Validate an invite code + email combination
 * Used during registration to verify the user can sign up
 */
export async function validateInvite(
  code: string,
  email: string
): Promise<ValidateInviteResult> {
  const normalizedCode = code.toUpperCase().trim();
  const normalizedEmail = email.toLowerCase().trim();

  const invite = await db.query.invites.findFirst({
    where: eq(invites.code, normalizedCode),
  });

  if (!invite) {
    return {
      success: false,
      error: "Invalid invite code",
    };
  }

  if (invite.status === "redeemed") {
    return {
      success: false,
      error: "This invite has already been used",
    };
  }

  if (invite.email !== normalizedEmail) {
    return {
      success: false,
      error: "This invite was sent to a different email address",
    };
  }

  return {
    success: true,
    data: invite,
  };
}

/**
 * Mark an invite as redeemed after successful registration
 */
export async function redeemInvite(
  inviteId: string,
  userId: string
): Promise<RedeemInviteResult> {
  const [updated] = await db
    .update(invites)
    .set({
      status: "redeemed",
      redeemedBy: userId,
      redeemedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(invites.id, inviteId))
    .returning();

  if (!updated) {
    return {
      success: false,
      error: "Failed to redeem invite",
    };
  }

  return {
    success: true,
    data: updated,
  };
}

/**
 * List all invites (for admin UI)
 * Sorted by creation date, newest first
 */
export async function listInvites(): Promise<Invite[]> {
  return db.query.invites.findMany({
    orderBy: (invites, { desc }) => [desc(invites.createdAt)],
  });
}

/**
 * Get invite statistics (for admin UI)
 */
export async function getInviteStats(): Promise<{
  total: number;
  pending: number;
  redeemed: number;
  cancelled: number;
}> {
  const all = await db.query.invites.findMany();

  return {
    total: all.length,
    pending: all.filter((i) => i.status === "pending").length,
    redeemed: all.filter((i) => i.status === "redeemed").length,
    cancelled: all.filter((i) => i.status === "cancelled").length,
  };
}

/**
 * Get an invite by ID
 */
export async function getInviteById(id: string): Promise<GetInviteResult> {
  const invite = await db.query.invites.findFirst({
    where: eq(invites.id, id),
  });

  if (!invite) {
    return {
      success: false,
      error: "Invite not found",
    };
  }

  return {
    success: true,
    data: invite,
  };
}

/**
 * Cancel a pending invite (soft delete)
 * Only pending invites can be cancelled
 */
export async function cancelInvite(inviteId: string): Promise<CancelInviteResult> {
  // First get the invite to check status
  const existing = await db.query.invites.findFirst({
    where: eq(invites.id, inviteId),
  });

  if (!existing) {
    return {
      success: false,
      error: "Invite not found",
    };
  }

  if (existing.status === "redeemed") {
    return {
      success: false,
      error: "Cannot cancel a redeemed invite",
    };
  }

  if (existing.status === "cancelled") {
    return {
      success: false,
      error: "Invite is already cancelled",
    };
  }

  const [updated] = await db
    .update(invites)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(invites.id, inviteId))
    .returning();

  if (!updated) {
    return {
      success: false,
      error: "Failed to cancel invite",
    };
  }

  return {
    success: true,
    data: updated,
  };
}

/**
 * Permanently delete a cancelled invite (hard delete)
 * Only cancelled invites can be deleted
 */
export async function deleteInvite(inviteId: string): Promise<DeleteInviteResult> {
  // First get the invite to check status
  const existing = await db.query.invites.findFirst({
    where: eq(invites.id, inviteId),
  });

  if (!existing) {
    return {
      success: false,
      error: "Invite not found",
    };
  }

  if (existing.status !== "cancelled") {
    return {
      success: false,
      error: "Only cancelled invites can be deleted",
    };
  }

  await db.delete(invites).where(eq(invites.id, inviteId));

  return {
    success: true,
  };
}
