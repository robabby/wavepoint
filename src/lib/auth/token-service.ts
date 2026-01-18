/**
 * Token Service
 *
 * Manages verification tokens for email verification, password reset, and account unlock.
 * Uses secure token generation and SHA-256 hashing for storage.
 */

import { and, eq, gt, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { verificationTokens } from "@/lib/db/schema";
import { generateToken, hashToken } from "./tokens";

export type TokenType = "email_verification" | "password_reset" | "account_unlock";

export interface CreateTokenResult {
  token: string; // Plain token to send in URL
  expires: Date;
}

export interface ConsumeTokenResult {
  success: boolean;
  identifier?: string; // email
  error?: string;
}

/** Token expiry times in hours by type */
const TOKEN_EXPIRY_HOURS: Record<TokenType, number> = {
  email_verification: 24,
  password_reset: 1,
  account_unlock: 24,
};

/**
 * Get token expiry hours for a token type
 */
export function getTokenExpiryHours(type: TokenType): number {
  return TOKEN_EXPIRY_HOURS[type];
}

/**
 * Create a verification token for an identifier (email)
 * Uses upsert to atomically replace any existing token of the same type
 */
export async function createVerificationToken(
  identifier: string,
  type: TokenType
): Promise<CreateTokenResult> {
  const normalizedIdentifier = identifier.toLowerCase();
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiryHours = TOKEN_EXPIRY_HOURS[type];
  const expires = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

  // Upsert: insert new token or update existing one (atomic operation)
  // The unique constraint on (identifier, type) ensures only one token exists
  await db
    .insert(verificationTokens)
    .values({
      identifier: normalizedIdentifier,
      tokenHash,
      type,
      expires,
    })
    .onConflictDoUpdate({
      target: [verificationTokens.identifier, verificationTokens.type],
      set: {
        tokenHash,
        expires,
        createdAt: new Date(),
      },
    });

  return { token, expires };
}

/**
 * Consume a token - validates and deletes it (single-use)
 * Returns the identifier (email) if valid
 */
export async function consumeToken(
  token: string,
  type: TokenType
): Promise<ConsumeTokenResult> {
  const tokenHash = hashToken(token);

  // Find the token (must be valid type and not expired)
  const record = await db.query.verificationTokens.findFirst({
    where: and(
      eq(verificationTokens.tokenHash, tokenHash),
      eq(verificationTokens.type, type),
      gt(verificationTokens.expires, new Date())
    ),
  });

  if (!record) {
    return { success: false, error: "Invalid or expired token" };
  }

  // Delete the token (single-use)
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.id, record.id));

  return { success: true, identifier: record.identifier };
}

/**
 * Check cooldown for resending verification emails
 * Returns seconds until resend is allowed, or 0 if allowed now
 */
export async function getResendCooldownSeconds(
  identifier: string,
  type: TokenType,
  cooldownMinutes = 2
): Promise<number> {
  const normalizedIdentifier = identifier.toLowerCase();
  const cooldownThreshold = new Date(Date.now() - cooldownMinutes * 60 * 1000);

  const recentToken = await db.query.verificationTokens.findFirst({
    where: and(
      eq(verificationTokens.identifier, normalizedIdentifier),
      eq(verificationTokens.type, type),
      gt(verificationTokens.createdAt, cooldownThreshold)
    ),
  });

  if (!recentToken?.createdAt) {
    return 0;
  }

  const timeSinceCreated = Date.now() - recentToken.createdAt.getTime();
  const remainingMs = cooldownMinutes * 60 * 1000 - timeSinceCreated;
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

/**
 * Cleanup expired tokens (can be run periodically via cron)
 * Returns the number of tokens deleted
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const result = await db
    .delete(verificationTokens)
    .where(lt(verificationTokens.expires, new Date()));

  return result.rowCount ?? 0;
}
