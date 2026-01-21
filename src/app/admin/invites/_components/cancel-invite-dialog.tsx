"use client";

import { useState } from "react";
import { Loader2, XCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Invite } from "@/lib/db/schema";

interface CancelInviteDialogProps {
  invite: Invite | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

/**
 * Confirmation dialog for cancelling a pending invite.
 */
export function CancelInviteDialog({
  invite,
  open,
  onOpenChange,
  onConfirm,
}: CancelInviteDialogProps) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleConfirm = async () => {
    setIsCancelling(true);
    try {
      await onConfirm();
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-[var(--border-gold)]/30 bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 font-display uppercase tracking-widest text-foreground">
            <XCircle className="h-5 w-5 text-[var(--color-gold)]" />
            Cancel Invite
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Cancel the invite for{" "}
            <span className="font-medium text-foreground">
              {invite?.email}
            </span>
            ? The invite link will no longer work.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isCancelling}
            className="border-[var(--color-gold)]/30 text-muted-foreground hover:border-[var(--color-gold)] hover:bg-transparent hover:text-foreground"
          >
            Keep Invite
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isCancelling}
            className="bg-[var(--color-gold)] text-primary-foreground hover:bg-[var(--color-gold-bright)]"
          >
            {isCancelling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Invite"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
