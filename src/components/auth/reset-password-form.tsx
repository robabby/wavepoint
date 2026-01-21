"use client";

/**
 * Reset Password Form
 *
 * Form for setting a new password using a reset token.
 * Used on the /auth/reset-password page.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { resetPassword } from "@/lib/auth/password-reset-actions";
import { PasswordInput } from "./password-input";
import { cn } from "@/lib/utils";

interface ResetPasswordFormProps {
  token: string;
}

// Form schema - just password since token comes from URL
const formSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

// Shared input styling
const inputClassName = cn(
  "h-11 border-[var(--border-gold)]/30 bg-card/50",
  "text-foreground placeholder:text-muted-foreground",
  "focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20"
);

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);

    const result = await resetPassword(token, data.password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setIsSuccess(true);
    // Redirect to home with sign-in modal open after 2 seconds
    setTimeout(() => router.push("/?auth=sign-in"), 2000);
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-lg text-foreground">
            Password Reset Successfully
          </h3>
          <p className="text-sm text-muted-foreground">
            Your password has been changed. Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-3">
          {/* Password field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-foreground">
                  New Password
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
              Resetting password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </Form>
  );
}
