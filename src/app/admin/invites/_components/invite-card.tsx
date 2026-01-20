"use client";

import { useState } from "react";
import { Check, Copy, MoreHorizontal, XCircle, Trash2 } from "lucide-react";
import { Card } from "@radix-ui/themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Invite } from "@/lib/db/schema";

interface InviteCardProps {
  invite: Invite;
  inviteUrl: string;
  onCancelClick?: (invite: Invite) => void;
  onDeleteClick?: (invite: Invite) => void;
}

/**
 * Individual invite card with status badge and copy link functionality.
 */
export function InviteCard({
  invite,
  inviteUrl,
  onCancelClick,
  onDeleteClick,
}: InviteCardProps) {
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
  const isCancelled = invite.status === "cancelled";
  const isPending = invite.status === "pending";

  const dateLabel = isRedeemed
    ? `Joined ${formatDate(invite.redeemedAt)}`
    : isCancelled
      ? `Cancelled ${formatDate(invite.cancelledAt)}`
      : `Invited ${formatDate(invite.createdAt)}`;

  // Show action menu for pending (cancel) and cancelled (delete) invites
  const showActionMenu = isPending || isCancelled;

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

        {/* Right: Status badge, copy button, and action menu */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "rounded px-2 py-0.5 text-xs",
              isRedeemed
                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : isCancelled
                  ? "border border-red-400/30 bg-red-400/10 text-red-400"
                  : "border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
            )}
          >
            {isRedeemed ? "Joined" : isCancelled ? "Cancelled" : "Pending"}
          </span>
          {!isCancelled && (
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
          )}
          {showActionMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[var(--color-warm-gray)] hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)]"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-[var(--border-gold)]/30 bg-[var(--color-obsidian)]"
              >
                {isPending && onCancelClick && (
                  <DropdownMenuItem
                    onClick={() => onCancelClick(invite)}
                    className="cursor-pointer text-[var(--color-warm-gray)] focus:bg-[var(--color-gold)]/10 focus:text-[var(--color-gold)]"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Invite
                  </DropdownMenuItem>
                )}
                {isCancelled && onDeleteClick && (
                  <DropdownMenuItem
                    onClick={() => onDeleteClick(invite)}
                    variant="destructive"
                    className="cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Permanently
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
