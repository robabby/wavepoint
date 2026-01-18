import { randomBytes, createHash } from "crypto";

/**
 * Generate a cryptographically secure random token
 * @param bytes - Number of bytes (default: 32)
 * @returns Base64url-encoded token string
 */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/**
 * Hash a token using SHA-256
 * @param token - Plain text token
 * @returns Hex-encoded hash
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Verify a token against its hash (constant-time comparison)
 * @param token - Plain text token to verify
 * @param hash - Expected hash
 * @returns True if token matches hash
 */
export function verifyToken(token: string, hash: string): boolean {
  const tokenHash = hashToken(token);

  // Constant-time comparison to prevent timing attacks
  if (tokenHash.length !== hash.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < tokenHash.length; i++) {
    result |= tokenHash.charCodeAt(i) ^ hash.charCodeAt(i);
  }

  return result === 0;
}
