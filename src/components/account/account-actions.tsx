"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { KeyRound, Trash2, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

interface ActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
}

function ActionCard({
  icon: Icon,
  title,
  description,
  href,
  onClick,
  disabled = false,
  variant = "default",
}: ActionCardProps) {
  const content = (
    <Card
      className={cn(
        "border-[var(--border-gold)]/30 bg-background transition-colors",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:border-[var(--border-gold)]",
        variant === "destructive" && !disabled && "hover:border-red-500/50"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              variant === "destructive"
                ? "bg-red-500/10"
                : "bg-[var(--color-gold)]/10"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                variant === "destructive"
                  ? "text-red-400"
                  : "text-[var(--color-gold)]"
              )}
            />
          </div>
          <CardTitle
            className={cn(
              "text-base",
              variant === "destructive"
                ? "text-red-400"
                : "text-foreground"
            )}
          >
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );

  if (disabled) {
    return content;
  }

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}

/**
 * Account actions grid component.
 * Displays action cards for password, delete account, and sign out.
 */
export function AccountActions() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  // Reset confirmation when dialog closes
  const handleDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setDeleteConfirmed(false);
      setDeleteError(null);
    }
  };

  const handleSignOut = () => {
    void signOut({ callbackUrl: "/" });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to delete account");
      }

      // Sign out and redirect to home
      void signOut({ callbackUrl: "/" });
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete account"
      );
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <ActionCard
          icon={KeyRound}
          title="Change Password"
          description="Update your account password"
          disabled
        />
        <ActionCard
          icon={Trash2}
          title="Delete Account"
          description="Permanently delete your account and data"
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
        />
        <div className="sm:col-span-2">
          <Button
            variant="outline"
            className="w-full border-[var(--border-gold)]/30 text-muted-foreground hover:border-[var(--border-gold)] hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={handleDialogChange}>
        <AlertDialogContent className="border-red-500/30 bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete your account? This action cannot
              be undone. All your data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={deleteConfirmed}
              onChange={(e) => setDeleteConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-[var(--border-gold)]/50 bg-transparent accent-red-600"
            />
            <span className="text-sm text-muted-foreground">
              I understand this will permanently delete my account and all
              associated data
            </span>
          </label>
          {deleteError && (
            <div className="rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {deleteError}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-[var(--border-gold)]/30 text-muted-foreground hover:border-[var(--border-gold)] hover:text-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting || !deleteConfirmed}
              className="bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
