"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heading, Text } from "@radix-ui/themes";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Invite } from "@/lib/db/schema";
import { InviteCard } from "./invite-card";
import { CreateInviteModal } from "./create-invite-modal";
import { CancelInviteDialog } from "./cancel-invite-dialog";
import { DeleteInviteDialog } from "./delete-invite-dialog";

interface InviteListProps {
  invites: Invite[];
  stats: {
    total: number;
    pending: number;
    redeemed: number;
    cancelled: number;
  };
  baseUrl: string;
}

/**
 * Client component for the invites page content.
 * Includes page header with create button, stats, tabs, list, and modals.
 */
export function InviteList({ invites, stats, baseUrl }: InviteListProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);

  const buildInviteUrl = (code: string) => `${baseUrl}/invite/${code}`;

  // Filter invites by status
  const activeInvites = invites.filter(
    (i) => i.status === "pending" || i.status === "redeemed"
  );
  const cancelledInvites = invites.filter((i) => i.status === "cancelled");

  const handleCancelClick = (invite: Invite) => {
    setSelectedInvite(invite);
    setCancelDialogOpen(true);
  };

  const handleDeleteClick = (invite: Invite) => {
    setSelectedInvite(invite);
    setDeleteDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedInvite) return;

    try {
      const response = await fetch(`/api/admin/invites/${selectedInvite.id}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        console.error("Failed to cancel invite:", data.error);
        return;
      }

      setCancelDialogOpen(false);
      setSelectedInvite(null);
      router.refresh();
    } catch (error) {
      console.error("Cancel invite error:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedInvite) return;

    try {
      const response = await fetch(`/api/admin/invites/${selectedInvite.id}`, {
        method: "DELETE",
      });

      if (!response.ok && response.status !== 204) {
        const data = (await response.json()) as { error?: string };
        console.error("Failed to delete invite:", data.error);
        return;
      }

      setDeleteDialogOpen(false);
      setSelectedInvite(null);
      router.refresh();
    } catch (error) {
      console.error("Delete invite error:", error);
    }
  };

  return (
    <>
      {/* Page header with title and create button */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Heading
            size="6"
            className="mb-2 font-display uppercase tracking-widest text-foreground"
          >
            Invites
          </Heading>
          <Text size="2" className="text-muted-foreground">
            Manage beta access to the inner circle
          </Text>
        </div>
        {invites.length > 0 && (
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-[var(--color-gold)] text-primary-foreground hover:bg-[var(--color-gold-bright)]"
          >
            <Plus className="h-4 w-4" />
            Create Invite
          </Button>
        )}
      </div>

      {/* Empty state - only show when no invites at all */}
      {invites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border-gold)]/20 bg-background px-6 py-16 text-center">
          <span className="mb-4 text-3xl text-[var(--color-gold)]/40">
            &#x25C7;
          </span>
          <h3 className="mb-2 text-lg font-medium text-foreground">
            No invites yet
          </h3>
          <p className="mb-6 max-w-sm text-muted-foreground">
            Create your first invite to begin building the inner circle.
          </p>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-[var(--color-gold)] text-primary-foreground hover:bg-[var(--color-gold-bright)]"
          >
            <Plus className="h-4 w-4" />
            Create Invite
          </Button>
        </div>
      ) : (
        <>
          {/* Stats bar */}
          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>
              <strong className="font-medium text-foreground">
                {stats.total}
              </strong>{" "}
              total
            </span>
            <span>&middot;</span>
            <span>
              <strong className="font-medium text-[var(--color-gold)]">
                {stats.pending}
              </strong>{" "}
              pending
            </span>
            <span>&middot;</span>
            <span>
              <strong className="font-medium text-emerald-400">
                {stats.redeemed}
              </strong>{" "}
              joined
            </span>
            {stats.cancelled > 0 && (
              <>
                <span>&middot;</span>
                <span>
                  <strong className="font-medium text-red-400">
                    {stats.cancelled}
                  </strong>{" "}
                  cancelled
                </span>
              </>
            )}
          </div>

          {/* Tabs for Active/Cancelled */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-4 bg-card/30">
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-[var(--color-gold)]/10 data-[state=active]:text-[var(--color-gold)]"
              >
                Active ({activeInvites.length})
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="data-[state=active]:bg-red-400/10 data-[state=active]:text-red-400"
              >
                Cancelled ({cancelledInvites.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {activeInvites.length === 0 ? (
                <div className="rounded-lg border border-[var(--border-gold)]/20 bg-background px-6 py-12 text-center">
                  <p className="text-muted-foreground">
                    No active invites. All invites have been cancelled.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeInvites.map((invite) => (
                    <InviteCard
                      key={invite.id}
                      invite={invite}
                      inviteUrl={buildInviteUrl(invite.code)}
                      onCancelClick={handleCancelClick}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled">
              {cancelledInvites.length === 0 ? (
                <div className="rounded-lg border border-[var(--border-gold)]/20 bg-background px-6 py-12 text-center">
                  <p className="text-muted-foreground">
                    No cancelled invites.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cancelledInvites.map((invite) => (
                    <InviteCard
                      key={invite.id}
                      invite={invite}
                      inviteUrl={buildInviteUrl(invite.code)}
                      onDeleteClick={handleDeleteClick}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

      <CreateInviteModal open={modalOpen} onOpenChange={setModalOpen} />

      <CancelInviteDialog
        invite={selectedInvite}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelConfirm}
      />

      <DeleteInviteDialog
        invite={selectedInvite}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
