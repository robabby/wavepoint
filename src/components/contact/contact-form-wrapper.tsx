"use client";

import { useSession } from "next-auth/react";
import { ContactForm } from "./contact-form";

/**
 * Wrapper that provides session-aware email pre-filling for ContactForm.
 * Uses useSession to get the current user's email if logged in.
 */
export function ContactFormWrapper() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? undefined;

  return <ContactForm defaultEmail={userEmail} />;
}
