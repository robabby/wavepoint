"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
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
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/auth/schemas";
import { type AuthView } from "./auth-provider";
import { cn } from "@/lib/utils";

interface ForgotPasswordFormProps {
  onSwitchView: (view: AuthView) => void;
}

// Shared input styling
const inputClassName = cn(
  "h-11 border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50",
  "text-[var(--color-cream)] placeholder:text-[var(--color-dim)]",
  "focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20"
);

export function ForgotPasswordForm({ onSwitchView }: ForgotPasswordFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (_data: ForgotPasswordFormData) => {
    // Simulate network delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitted(true);
  };

  // Success state - "Coming Soon" placeholder
  if (isSubmitted) {
    return (
      <div className="space-y-4">
        {/* Back to sign-in */}
        <button
          type="button"
          onClick={() => onSwitchView("sign-in")}
          className="flex cursor-pointer items-center gap-1 text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </button>

        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-gold)]/10">
            <CheckCircle className="h-6 w-6 text-[var(--color-gold)]" />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-lg text-[var(--color-cream)]">
              Coming Soon
            </h3>
            <p className="text-sm text-[var(--color-warm-gray)]">
              Password reset functionality is not yet available.
              Please contact support if you need to recover your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Back to sign-in */}
        <button
          type="button"
          onClick={() => onSwitchView("sign-in")}
          className="flex cursor-pointer items-center gap-1 text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </button>

        <div className="space-y-3">
          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
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

        {/* Submit button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full h-11 bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)] disabled:opacity-50"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send Reset Link
            </>
          )}
        </Button>

        {/* Info text */}
        <p className="text-center text-xs text-[var(--color-dim)]">
          We&apos;ll send a password reset link to your email address.
        </p>
      </form>
    </Form>
  );
}
