/**
 * Brevo Sync for Waitlist Signups
 *
 * Syncs waitlist signups to Brevo CRM for marketing automation.
 * Uses fire-and-forget pattern - failures are logged but don't block operations.
 *
 * Contact attributes (created in Brevo dashboard):
 * - WAITLIST_SOURCE: Feature the user signed up for (e.g., "signal")
 * - WAITLIST_SIGNUP_DATE: ISO date of signup
 */

import { env } from "@/env";
import type { WaitlistSource } from "./schemas";

const BREVO_API_BASE = "https://api.brevo.com/v3";

/**
 * Check if Brevo waitlist sync is configured
 * Requires both API key and waitlist list ID
 */
export function isBrevoWaitlistConfigured(): boolean {
  return !!env.BREVO_API_KEY && !!env.BREVO_WAITLIST_LIST_ID;
}

/**
 * Create or update a Brevo contact when someone joins a waitlist
 * Adds contact to Waitlist list with signup details
 */
export async function syncWaitlistToBrevo(
  email: string,
  source: WaitlistSource
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  if (!env.BREVO_API_KEY || !env.BREVO_WAITLIST_LIST_ID) {
    console.warn(
      "Brevo waitlist sync not configured: missing BREVO_API_KEY or BREVO_WAITLIST_LIST_ID"
    );
    return { success: false, error: "Brevo sync not configured" };
  }

  try {
    // Brevo createContact API - creates or updates if contact exists
    const response = await fetch(`${BREVO_API_BASE}/contacts`, {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        listIds: [parseInt(env.BREVO_WAITLIST_LIST_ID, 10)],
        attributes: {
          WAITLIST_SOURCE: source,
          WAITLIST_SIGNUP_DATE: new Date().toISOString(),
        },
        updateEnabled: true, // Update if contact already exists
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo create contact error:", response.status, errorText);
      return { success: false, error: "Failed to sync contact to Brevo" };
    }

    // Brevo returns empty body on 204 or when updating existing contact
    const text = await response.text();
    if (!text) {
      return { success: true };
    }

    const data = JSON.parse(text) as { id?: number };
    return {
      success: true,
      contactId: data.id?.toString(),
    };
  } catch (error) {
    console.error("Brevo waitlist sync error:", error);
    return { success: false, error: "Brevo service unavailable" };
  }
}

/**
 * Fire-and-forget wrapper for waitlist sync
 * Logs errors but doesn't propagate them
 */
export function syncWaitlistToBrevoAsync(
  email: string,
  source: WaitlistSource
): void {
  if (!isBrevoWaitlistConfigured()) return;

  void syncWaitlistToBrevo(email, source).catch((err) => {
    console.error(`Failed to sync waitlist signup to Brevo for ${email}:`, err);
  });
}
