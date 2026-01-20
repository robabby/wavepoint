"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

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

interface DeleteInviteDialogProps {
  invite: Invite | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

/**
 * Modal confirmation dialog for permanently deleting a cancelled invite.
 */
export function DeleteInviteDialog({
  invite,
  open,
  onOpenChange,
  onConfirm,
}: DeleteInviteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-[var(--border-gold)]/30 bg-[var(--color-obsidian)]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 font-display uppercase tracking-widest text-[var(--color-cream)]">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Delete Invite
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[var(--color-warm-gray)]">
            Permanently delete the invite for{" "}
            <span className="font-medium text-[var(--color-cream)]">
              {invite?.email}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="border-[var(--color-gold)]/30 text-[var(--color-warm-gray)] hover:border-[var(--color-gold)] hover:bg-transparent hover:text-[var(--color-cream)]"
          >
            Keep Invite
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Permanently"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
