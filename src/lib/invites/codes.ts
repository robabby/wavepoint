/**
 * Invite Code Generation
 *
 * Generates unique invite codes in format: SG-XXXXXX
 * Uses charset without ambiguous characters (no 0/O/1/I)
 */

/** Characters used for code generation (no ambiguous chars) */
const CODE_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Length of the random portion of the code */
const CODE_LENGTH = 6;

/** Prefix for all invite codes */
const CODE_PREFIX = "SG";

/**
 * Generate a cryptographically random invite code
 * Format: SG-XXXXXX (e.g., SG-X7K9M2)
 */
export function generateInviteCode(): string {
  const randomPart = Array.from({ length: CODE_LENGTH }, () =>
    CODE_CHARSET.charAt(Math.floor(Math.random() * CODE_CHARSET.length))
  ).join("");

  return `${CODE_PREFIX}-${randomPart}`;
}

/**
 * Normalize an invite code (uppercase, trim whitespace)
 */
export function normalizeInviteCode(code: string): string {
  return code.toUpperCase().trim();
}
