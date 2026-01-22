"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { WaitlistSource } from "@/lib/waitlist";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: WaitlistSource;
}

type ModalState = "form" | "submitting" | "success";

/**
 * WaitlistModal component
 *
 * A dialog-based modal for collecting waitlist signups.
 * Uses mobile bottom sheet pattern on small screens, centered dialog on desktop.
 * Matches WavePoint's "modern mystic" aesthetic with gold accents.
 */
export function WaitlistModal({
  open,
  onOpenChange,
  source = "signal",
}: WaitlistModalProps) {
  const [state, setState] = useState<ModalState>("form");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setState("submitting");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to join waitlist");
      }

      setState("success");
    } catch (err) {
      setState("form");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after modal closes
    setTimeout(() => {
      setState("form");
      setEmail("");
      setError(null);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          // Base styling
          "overflow-hidden p-0",
          "bg-background border-[var(--border-gold)]",
          // Subtle radial gradient for depth
          "bg-[radial-gradient(ellipse_at_center,var(--color-gold)/5%_0%,transparent_70%)]",
          // Gold glow on open
          "shadow-[0_0_30px_var(--glow-gold)]",
          // Desktop: centered with offset from top
          "sm:!top-[20vh] sm:!translate-y-0 sm:max-w-md sm:rounded-lg",
          // Mobile: bottom sheet
          "!top-auto !bottom-0 !translate-y-0 max-h-[85vh] w-full max-w-full rounded-t-xl rounded-b-none sm:!bottom-auto"
        )}
      >
        {state === "success" ? (
          // Success state
          <div className="flex flex-col items-center px-6 py-8 text-center">
            <div className="relative mb-4">
              <Sparkles className="h-12 w-12 text-[var(--color-gold)] animate-pulse" />
            </div>
            <h2 className="font-heading text-xl text-foreground mb-2">
              You&apos;re on the list
            </h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              We&apos;ll let you know when Signal is ready for you to explore.
            </p>
            <Button
              onClick={handleClose}
              variant="outline"
              className="border-[var(--border-gold)] text-[var(--color-gold)] hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)] transition-all"
            >
              Done
            </Button>
          </div>
        ) : (
          // Form state
          <>
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="font-heading text-xl text-foreground">
                Join the Signal Waitlist
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Be the first to track your synchronicities
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="px-6 pb-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={state === "submitting"}
                    required
                    className={cn(
                      "h-11",
                      "transition-shadow duration-200",
                      "focus:shadow-[0_0_12px_var(--glow-gold)]",
                      "focus:border-[var(--color-gold)]"
                    )}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={state === "submitting" || !email}
                  className={cn(
                    "w-full h-11",
                    "bg-[var(--color-gold)] text-primary-foreground",
                    "hover:bg-[var(--color-gold-bright)]",
                    "transition-all duration-200",
                    "hover:scale-[1.02] hover:shadow-[0_0_20px_var(--glow-gold)]",
                    "disabled:opacity-50 disabled:hover:scale-100"
                  )}
                >
                  {state === "submitting" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Join Waitlist"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  We&apos;ll only email you when Signal launches.
                </p>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
