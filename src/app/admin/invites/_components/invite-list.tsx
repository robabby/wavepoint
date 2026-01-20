"use client";

import { useState } from "react";
import { Heading, Text } from "@radix-ui/themes";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Invite } from "@/lib/invites";
import { InviteCard } from "./invite-card";
import { CreateInviteModal } from "./create-invite-modal";

interface InviteListProps {
  invites: Invite[];
  stats: {
    total: number;
    pending: number;
    redeemed: number;
  };
  baseUrl: string;
}

/**
 * Client component for the invites page content.
 * Includes page header with create button, stats, list, and modal.
 */
export function InviteList({ invites, stats, baseUrl }: InviteListProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const buildInviteUrl = (code: string) => `${baseUrl}/invite/${code}`;

  return (
    <>
      {/* Page header with title and create button */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Heading
            size="6"
            className="mb-2 font-display uppercase tracking-widest text-[var(--color-cream)]"
          >
            Invites
          </Heading>
          <Text size="2" className="text-[var(--color-warm-gray)]">
            Manage beta access to the inner circle
          </Text>
        </div>
        {invites.length > 0 && (
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)]"
          >
            <Plus className="h-4 w-4" />
            Create Invite
          </Button>
        )}
      </div>

      {/* Empty state */}
      {invites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border-gold)]/20 bg-[var(--color-obsidian)] px-6 py-16 text-center">
          <span className="mb-4 text-3xl text-[var(--color-gold)]/40">
            &#x25C7;
          </span>
          <h3 className="mb-2 text-lg font-medium text-[var(--color-cream)]">
            No invites yet
          </h3>
          <p className="mb-6 max-w-sm text-[var(--color-warm-gray)]">
            Create your first invite to begin building the inner circle.
          </p>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)]"
          >
            <Plus className="h-4 w-4" />
            Create Invite
          </Button>
        </div>
      ) : (
        <>
          {/* Stats bar */}
          <div className="mb-6 flex items-center gap-4 text-sm text-[var(--color-warm-gray)]">
            <span>
              <strong className="font-medium text-[var(--color-cream)]">
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
          </div>

          {/* Invite cards */}
          <div className="space-y-3">
            {invites.map((invite) => (
              <InviteCard
                key={invite.id}
                invite={invite}
                inviteUrl={buildInviteUrl(invite.code)}
              />
            ))}
          </div>
        </>
      )}

      <CreateInviteModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
