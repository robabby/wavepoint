"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
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

interface SignUpFormProps {
  onSwitchView: (view: AuthView) => void;
}

// Shared input styling
const inputClassName = cn(
  "h-11 border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50",
  "text-[var(--color-cream)] placeholder:text-[var(--color-dim)]",
  "focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20"
);

export function SignUpForm({ onSwitchView }: SignUpFormProps) {
  const [error, setError] = useState<string | null>(null);
  const { closeModal } = useAuthModal();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

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
      closeModal();
    } else {
      // Registration succeeded but sign-in failed - redirect to sign-in
      onSwitchView("sign-in");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-3">
          {/* Name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    autoComplete="name"
                    disabled={form.formState.isSubmitting}
                    className={inputClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />

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

          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
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
          className="w-full h-11 bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)] disabled:opacity-50"
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
        <p className="text-center text-sm text-[var(--color-warm-gray)]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onSwitchView("sign-in")}
            className="text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
          >
            Sign in
          </button>
        </p>
      </form>
    </Form>
  );
}
