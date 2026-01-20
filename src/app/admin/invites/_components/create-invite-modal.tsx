"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Copy, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createInviteSchema, type CreateInviteInput } from "@/lib/invites";

interface CreateInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CreateResult {
  inviteUrl: string;
  email: string;
}

/**
 * Modal for creating a new invite.
 * Shows form initially, then success state with copyable link.
 */
export function CreateInviteModal({
  open,
  onOpenChange,
}: CreateInviteModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateResult | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<CreateInviteInput>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleClose = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      form.reset();
      setError(null);
      setResult(null);
      setCopied(false);
    }
    onOpenChange(open);
  };

  const handleDone = () => {
    handleClose(false);
    router.refresh();
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const onSubmit = async (data: CreateInviteInput) => {
    setError(null);

    try {
      const response = await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json() as {
        error?: string;
        inviteUrl?: string;
        invite?: { email: string };
      };

      if (!response.ok) {
        setError(responseData.error ?? "Failed to create invite");
        return;
      }

      // Validate response has expected data
      if (!responseData.inviteUrl || !responseData.invite?.email) {
        setError("Invalid response from server");
        return;
      }

      setResult({
        inviteUrl: responseData.inviteUrl,
        email: responseData.invite.email,
      });
    } catch (err) {
      console.error("Create invite error:", err);
      setError("Failed to create invite. Please try again.");
    }
  };

  const inputClassName =
    "h-11 border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50 text-[var(--color-cream)] placeholder:text-[var(--color-dim)] focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-[var(--border-gold)]/30 bg-[var(--color-obsidian)] sm:max-w-md">
        {result ? (
          // Success state
          <>
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-widest text-[var(--color-cream)]">
                Invite Created
              </DialogTitle>
              <DialogDescription className="text-[var(--color-warm-gray)]">
                Invite link ready to share with {result.email}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="rounded-md border border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/30 p-3">
                <p className="break-all font-mono text-sm text-[var(--color-gold)]">
                  {result.inviteUrl}
                </p>
              </div>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="w-full border-[var(--color-gold)]/30 text-[var(--color-gold)] hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold-bright)]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>

            <DialogFooter>
              <Button
                onClick={handleDone}
                className="w-full bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)]"
              >
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          // Form state
          <>
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-widest text-[var(--color-cream)]">
                Create Invite
              </DialogTitle>
              <DialogDescription className="text-[var(--color-warm-gray)]">
                Grant access to the inner circle
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-md border border-red-400/50 bg-red-400/10 px-3 py-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
                    <span className="text-sm text-red-400">{error}</span>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--color-cream)]">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="someone@example.com"
                          autoComplete="off"
                          disabled={form.formState.isSubmitting}
                          className={inputClassName}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)]"
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Invite"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
