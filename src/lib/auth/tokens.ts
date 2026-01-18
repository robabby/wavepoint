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
