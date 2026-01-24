"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Loader2 } from "lucide-react";
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
import { signUpSchema, type SignUpFormData } from "@/lib/auth/schemas";
import { registerUser, signInWithCredentials } from "@/lib/auth/actions";
import { useAuthModal, type AuthView } from "./auth-provider";
import { PasswordInput } from "./password-input";
import { cn } from "@/lib/utils";
import { env } from "@/env";
import { track } from "@/lib/analytics";

interface SignUpFormProps {
  onSwitchView: (view: AuthView) => void;
}

// Shared input styling
const inputClassName = cn(
  "h-11 border-[var(--border-gold)]/30 bg-card/50",
  "text-foreground placeholder:text-muted-foreground",
  "focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20"
);

export function SignUpForm({ onSwitchView }: SignUpFormProps) {
  const [error, setError] = useState<string | null>(null);
  const { closeModal, inviteData } = useAuthModal();
  const invitesRequired = env.NEXT_PUBLIC_INVITES_REQUIRED;

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      inviteCode: "",
    },
  });

  // Pre-fill form when inviteData is present (from /invite/[code] landing page)
  useEffect(() => {
    if (inviteData) {
      form.setValue("inviteCode", inviteData.code);
      form.setValue("email", inviteData.email);
    }
  }, [inviteData, form]);

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);

    // Register the user
    const registerResult = await registerUser(data);

    if (!registerResult.success) {
      setError(registerResult.error);
      return;
    }

    // Auto sign-in after successful registration
    const signInResult = await signInWithCredentials({
      email: data.email,
      password: data.password,
    });

    if (signInResult.success) {
      track("Sign Up", {
        signup_method: "email",
      });
      closeModal();
    } else {
      // Registration succeeded but sign-in failed - redirect to sign-in
      onSwitchView("sign-in");
    }
  };

  // Whether we have pre-filled invite data (readonly mode)
  const hasPrefilledInvite = !!inviteData;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-3">
          {/* Warning banner when invites required but no pre-filled code */}
          {invitesRequired && !hasPrefilledInvite && (
            <div className="rounded-md border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 p-3">
              <p className="text-sm text-foreground">
                Registration is invite-only
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                You need an invite code to join. Already have one? Enter it below.
              </p>
            </div>
          )}

          {/* Invite code field (shown when invites required) */}
          {invitesRequired && (
            <FormField
              control={form.control}
              name="inviteCode"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-foreground">
                    Invite Code
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="SG-XXXXXX"
                        autoComplete="off"
                        disabled={form.formState.isSubmitting || hasPrefilledInvite}
                        readOnly={hasPrefilledInvite}
                        className={cn(
                          inputClassName,
                          "font-mono uppercase tracking-wider",
                          hasPrefilledInvite && "bg-card/30 cursor-not-allowed"
                        )}
                        {...field}
                      />
                      {hasPrefilledInvite && (
                        <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                      )}
                    </div>
                  </FormControl>
                  {!hasPrefilledInvite && (
                    <p className="text-xs text-muted-foreground">
                      Format: SG-XXXXXX
                    </p>
                  )}
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            />
          )}

          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-foreground">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={form.formState.isSubmitting || hasPrefilledInvite}
                    readOnly={hasPrefilledInvite}
                    className={cn(
                      inputClassName,
                      hasPrefilledInvite && "bg-card/30 cursor-not-allowed"
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />

          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-foreground">
                  Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    disabled={form.formState.isSubmitting}
                    className={inputClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
        </div>

        {/* Error display */}
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-red-400/50 bg-red-400/10 px-3 py-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full h-11 bg-[var(--color-gold)] text-primary-foreground hover:bg-[var(--color-gold-bright)] disabled:opacity-50"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        {/* Switch to sign-in */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onSwitchView("sign-in")}
            className="cursor-pointer text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
          >
            Sign in
          </button>
        </p>
      </form>
    </Form>
  );
}
