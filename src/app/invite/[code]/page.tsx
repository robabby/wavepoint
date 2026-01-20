import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getInviteByCode } from "@/lib/invites";
import { InviteWelcome } from "./_components/invite-welcome";
import { InvalidInvite } from "./_components/invalid-invite";
import { AlreadyRedeemed } from "./_components/already-redeemed";
import { AlreadyLoggedIn } from "./_components/already-logged-in";

export const metadata: Metadata = {
  title: "Invitation | WavePoint",
  robots: "noindex, nofollow",
};

/**
 * Invite Landing Page
 *
 * Server Component that validates invite code and renders appropriate UI:
 * - Valid invite: Welcome screen with CTA to sign up
 * - Invalid code: Error message with return home button
 * - Already redeemed: Message with sign in button
 * - User logged in: Handles email match/mismatch cases
 */
export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const session = await auth();

  // Look up the invite by code
  const result = await getInviteByCode(code);

  // Invalid code - not found in database
  if (!result.success || !result.data) {
    return <InvalidInvite />;
  }

  const invite = result.data;

  // Already redeemed
  if (invite.status === "redeemed") {
    return <AlreadyRedeemed />;
  }

  // User is logged in - show appropriate message
  if (session?.user) {
    return <AlreadyLoggedIn invite={invite} session={session} />;
  }

  // Valid invite, not logged in - show welcome
  return <InviteWelcome invite={invite} />;
}
