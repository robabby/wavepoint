import type { Metadata } from "next";

import { env } from "@/env";
import { getInviteStats, listInvites } from "@/lib/invites";
import { InviteList } from "./_components/invite-list";

export const metadata: Metadata = {
  title: "Invites | Admin",
};

/**
 * Admin invites page.
 * Server component that fetches data and passes to client list.
 */
export default async function AdminInvitesPage() {
  const [invites, stats] = await Promise.all([
    listInvites(),
    getInviteStats(),
  ]);

  return (
    <InviteList
      invites={invites}
      stats={stats}
      baseUrl={env.APP_URL}
    />
  );
}
