/**
 * Admin Authorization
 *
 * Helpers for checking admin access based on email allowlist.
 * Used by admin routes to restrict access.
 */

import type { Session } from "next-auth";
import { env } from "@/env";

/**
 * Parse the admin emails from environment variable
 * Returns an array of lowercase, trimmed emails
 */
function getAdminEmails(): string[] {
  const adminEmails = env.ADMIN_EMAILS ?? "";
  return adminEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Check if a session belongs to an admin user
 * Returns false if session is null or user email is not in admin list
 */
export function isAdmin(session: Session | null): boolean {
  if (!session?.user?.email) {
    return false;
  }

  const adminEmails = getAdminEmails();
  return adminEmails.includes(session.user.email.toLowerCase());
}

/**
 * Get the user's email from a session if they are an admin
 * Returns null if not an admin
 */
export function getAdminEmail(session: Session | null): string | null {
  if (!isAdmin(session)) {
    return null;
  }
  return session?.user?.email ?? null;
}
