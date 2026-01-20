"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Card } from "@radix-ui/themes";

import { cn } from "@/lib/utils";
import type { Invite } from "@/lib/invites";

interface InviteCardProps {
  invite: Invite;
  inviteUrl: string;
}

/**
 * Individual invite card with status badge and copy link functionality.
 */
export function InviteCard({ invite, inviteUrl }: InviteCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const isRedeemed = invite.status === "redeemed";
  const dateLabel = isRedeemed
    ? `Joined ${formatDate(invite.redeemedAt)}`
    : `Invited ${formatDate(invite.createdAt)}`;

  return (
    <Card className="border border-[var(--border-gold)]/30 bg-[var(--color-obsidian)] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Email and metadata */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-gold)]/40">&#x25C7;</span>
            <span className="truncate font-medium text-[var(--color-cream)]">
              {invite.email}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="font-mono tracking-wider text-[var(--color-gold)]">
              {invite.code}
            </span>
            <span className="text-[var(--color-dim)]">&middot;</span>
            <span className="text-[var(--color-warm-gray)]">{dateLabel}</span>
          </div>
        </div>

        {/* Right: Status badge and copy button */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "rounded px-2 py-0.5 text-xs",
              isRedeemed
                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
            )}
          >
            {isRedeemed ? "Joined" : "Pending"}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm text-[var(--color-gold)] transition-colors hover:text-[var(--color-gold-bright)]"
            aria-label={copied ? "Copied" : "Copy invite link"}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}

/**
 * Format a date for display (e.g., "Jan 15")
 */
function formatDate(date: Date | null | undefined): string {
  if (!date) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
