"use client";

import { Loader2 } from "lucide-react";
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

export interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
  description: string;
}

/**
 * Reusable delete confirmation dialog for Signal.
 * Uses AlertDialog for accessible destructive action confirmation.
 */
export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  title,
  description,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-red-500/30 bg-[var(--color-obsidian)]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[var(--color-cream)]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[var(--color-warm-gray)]">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="border-[var(--border-gold)]/30 bg-transparent text-[var(--color-warm-gray)] hover:border-[var(--border-gold)] hover:bg-transparent hover:text-[var(--color-cream)]"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
