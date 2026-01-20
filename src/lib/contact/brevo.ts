/**
 * Brevo Contact Sync for Contact Form
 *
 * Syncs contact form submissions to Brevo CRM for tracking.
 * Uses fire-and-forget pattern - failures are logged but don't block operations.
 *
 * Contact attributes (created in Brevo dashboard):
 * - INQUIRY_NAME: Submitter's name
 * - INQUIRY_SUBJECT: Contact form subject
 * - INQUIRY_DATE: ISO date of submission
 */

import { env } from "@/env";

const BREVO_API_BASE = "https://api.brevo.com/v3";

/**
 * Check if Brevo contact sync is configured
 * Requires both API key and contact list ID
 */
export function isBrevoContactSyncConfigured(): boolean {
  return !!env.BREVO_API_KEY && !!env.BREVO_CONTACT_LIST_ID;
}

/**
 * Create or update a Brevo contact when a contact form is submitted
 * Adds contact to Contact Form list with submission details
 */
export async function syncContactToBrevo(
  email: string,
  name: string,
  subject: string
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  if (!env.BREVO_API_KEY || !env.BREVO_CONTACT_LIST_ID) {
    console.warn(
      "Brevo contact sync not configured: missing BREVO_API_KEY or BREVO_CONTACT_LIST_ID"
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
        listIds: [parseInt(env.BREVO_CONTACT_LIST_ID, 10)],
        attributes: {
          INQUIRY_NAME: name.trim(),
          INQUIRY_SUBJECT: subject,
          INQUIRY_DATE: new Date().toISOString(),
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
    console.error("Brevo contact sync error:", error);
    return { success: false, error: "Brevo service unavailable" };
  }
}

/**
 * Fire-and-forget wrapper for contact form sync
 * Logs errors but doesn't propagate them
 */
export function syncContactToBrevoAsync(
  email: string,
  name: string,
  subject: string
): void {
  if (!isBrevoContactSyncConfigured()) return;

  void syncContactToBrevo(email, name, subject).catch((err) => {
    console.error(`Failed to sync contact to Brevo for ${email}:`, err);
  });
}
