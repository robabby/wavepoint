/**
 * Brevo Contact Sync for Invites
 *
 * Syncs invite status to Brevo CRM for tracking.
 * Uses fire-and-forget pattern - failures are logged but don't block operations.
 *
 * Contact attributes (created in Brevo dashboard):
 * - INVITE_STATUS: "invited" | "joined"
 * - INVITE_CODE: "SG-XXXXXX"
 * - INVITED_AT: ISO date
 * - JOINED_AT: ISO date
 */

import { env } from "@/env";

const BREVO_API_BASE = "https://api.brevo.com/v3";

/**
 * Check if Brevo sync is configured
 * Requires both API key and beta list ID
 */
export function isBrevoSyncConfigured(): boolean {
  return !!env.BREVO_API_KEY && !!env.BREVO_BETA_LIST_ID;
}

/**
 * Create or update a Brevo contact when an invite is created
 * Adds contact to Beta Users list with "invited" status
 */
export async function syncInviteToBrevo(
  email: string,
  code: string
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  if (!env.BREVO_API_KEY || !env.BREVO_BETA_LIST_ID) {
    console.warn("Brevo sync not configured: missing BREVO_API_KEY or BREVO_BETA_LIST_ID");
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
        listIds: [parseInt(env.BREVO_BETA_LIST_ID, 10)],
        attributes: {
          INVITE_STATUS: "invited",
          INVITE_CODE: code,
          INVITED_AT: new Date().toISOString(),
        },
        updateEnabled: true, // Update if contact already exists
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo create contact error:", response.status, errorText);
      return { success: false, error: "Failed to sync contact to Brevo" };
    }

    const data = (await response.json()) as { id?: number };
    return {
      success: true,
      contactId: data.id?.toString(),
    };
  } catch (error) {
    console.error("Brevo sync error:", error);
    return { success: false, error: "Brevo service unavailable" };
  }
}

/**
 * Update a Brevo contact when an invite is redeemed
 * Sets status to "joined" and records join date
 */
export async function updateBrevoInviteStatus(
  email: string,
  status: "joined"
): Promise<{ success: boolean; error?: string }> {
  if (!env.BREVO_API_KEY) {
    console.warn("Brevo sync not configured: missing BREVO_API_KEY");
    return { success: false, error: "Brevo sync not configured" };
  }

  try {
    // Brevo updateContact API - update by email identifier
    const response = await fetch(
      `${BREVO_API_BASE}/contacts/${encodeURIComponent(email.toLowerCase().trim())}`,
      {
        method: "PUT",
        headers: {
          "api-key": env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          attributes: {
            INVITE_STATUS: status,
            JOINED_AT: new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo update contact error:", response.status, errorText);
      return { success: false, error: "Failed to update Brevo contact" };
    }

    return { success: true };
  } catch (error) {
    console.error("Brevo update error:", error);
    return { success: false, error: "Brevo service unavailable" };
  }
}

/**
 * Fire-and-forget wrapper for invite creation sync
 * Logs errors but doesn't propagate them
 */
export function syncInviteToBrevoAsync(email: string, code: string): void {
  if (!isBrevoSyncConfigured()) return;

  void syncInviteToBrevo(email, code).catch((err) => {
    console.error(`Failed to sync invite to Brevo for ${email}:`, err);
  });
}

/**
 * Fire-and-forget wrapper for invite redemption sync
 * Logs errors but doesn't propagate them
 *
 * Note: Only requires BREVO_API_KEY (not list ID) since it only updates
 * existing contact attributes, not list membership.
 */
export function updateBrevoInviteStatusAsync(email: string): void {
  if (!env.BREVO_API_KEY) return;

  void updateBrevoInviteStatus(email, "joined").catch((err) => {
    console.error(`Failed to update Brevo invite status for ${email}:`, err);
  });
}

/**
 * Remove a contact from Brevo (delete entirely)
 * Used when cancelling or deleting invites
 */
export async function removeContactFromBrevo(
  email: string
): Promise<{ success: boolean; error?: string }> {
  if (!env.BREVO_API_KEY) {
    console.warn("Brevo sync not configured: missing BREVO_API_KEY");
    return { success: false, error: "Brevo sync not configured" };
  }

  try {
    // Brevo deleteContact API - delete by email identifier
    const response = await fetch(
      `${BREVO_API_BASE}/contacts/${encodeURIComponent(email.toLowerCase().trim())}`,
      {
        method: "DELETE",
        headers: {
          "api-key": env.BREVO_API_KEY,
          Accept: "application/json",
        },
      }
    );

    // 404 means contact doesn't exist - treat as success
    if (response.status === 404) {
      return { success: true };
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo delete contact error:", response.status, errorText);
      return { success: false, error: "Failed to remove Brevo contact" };
    }

    return { success: true };
  } catch (error) {
    console.error("Brevo delete error:", error);
    return { success: false, error: "Brevo service unavailable" };
  }
}

/**
 * Fire-and-forget wrapper for contact removal
 * Logs errors but doesn't propagate them
 */
export function removeContactFromBrevoAsync(email: string): void {
  if (!env.BREVO_API_KEY) return;

  void removeContactFromBrevo(email).catch((err) => {
    console.error(`Failed to remove Brevo contact for ${email}:`, err);
  });
}
