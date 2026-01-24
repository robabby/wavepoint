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
import { signInSchema, type SignInFormData } from "@/lib/auth/schemas";
import { signInWithCredentials } from "@/lib/auth/actions";
import { useAuthModal, type AuthView } from "./auth-provider";
import { PasswordInput } from "./password-input";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

interface SignInFormProps {
  onSwitchView: (view: AuthView) => void;
}

// Shared input styling
const inputClassName = cn(
  "h-11 border-[var(--border-gold)]/30 bg-card/50",
  "text-foreground placeholder:text-muted-foreground",
  "focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20"
);

export function SignInForm({ onSwitchView }: SignInFormProps) {
  const [error, setError] = useState<string | null>(null);
  const { closeModal } = useAuthModal();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setError(null);
    const result = await signInWithCredentials(data);

    if (result.success) {
      track("Sign In", {
        login_method: "email",
        success: true,
      });
      closeModal();
    } else {
      track("Sign In", {
        login_method: "email",
        success: false,
      });
      setError(result.error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-3">
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
                <FormLabel className="text-sm font-medium text-foreground">
                  Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Your password"
                    autoComplete="current-password"
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

        {/* Forgot password link */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onSwitchView("forgot-password")}
            className="cursor-pointer text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
          >
            Forgot password?
          </button>
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Switch to sign-up */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => onSwitchView("sign-up")}
            className="cursor-pointer text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
          >
            Create one
          </button>
        </p>
      </form>
    </Form>
  );
}
