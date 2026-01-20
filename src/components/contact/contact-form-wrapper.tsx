"use client";

import { useSession } from "next-auth/react";
import { ContactForm } from "./contact-form";

/**
 * Wrapper that provides session-aware email pre-filling for ContactForm.
 * Waits for session status to avoid hydration mismatch between server/client.
 */
export function ContactFormWrapper() {
  const { data: session, status } = useSession();

  // Wait for session to load to avoid hydration mismatch
  // Server renders with status="loading", client may have session data
  if (status === "loading") {
    return null;
  }

  const userEmail = session?.user?.email ?? undefined;
  return <ContactForm defaultEmail={userEmail} />;
}
