"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  contactFormSchema,
  SUBJECT_OPTIONS,
  type ContactFormData,
} from "@/lib/contact";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  defaultEmail?: string;
}

// Shared input styling (matches auth forms)
const inputClassName = cn(
  "h-11 border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50",
  "text-[var(--color-cream)] placeholder:text-[var(--color-dim)]",
  "focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20"
);

const textareaClassName = cn(
  "min-h-[150px] resize-none border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50",
  "text-[var(--color-cream)] placeholder:text-[var(--color-dim)]",
  "focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20"
);

const selectTriggerClassName = cn(
  "h-11 w-full border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50",
  "text-[var(--color-cream)]",
  "focus:border-[var(--color-gold)] focus:ring-[var(--color-gold)]/20",
  "data-[placeholder]:text-[var(--color-dim)]"
);

const selectContentClassName = cn(
  "border-[var(--border-gold)]/30 bg-[var(--color-obsidian)]"
);

const selectItemClassName = cn(
  "text-[var(--color-cream)] focus:bg-[var(--color-warm-charcoal)] focus:text-[var(--color-gold)]"
);

export function ContactForm({ defaultEmail }: ContactFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur", // Validate on blur, not on keystroke
    defaultValues: {
      name: "",
      email: defaultEmail ?? "",
      subject: undefined,
      message: "",
    },
  });

  // Update email when session loads (defaultEmail changes from undefined to user's email)
  useEffect(() => {
    if (defaultEmail && !form.getValues("email")) {
      form.setValue("email", defaultEmail);
    }
  }, [defaultEmail, form]);

  const onSubmit = async (data: ContactFormData) => {
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as
        | { success: true; id: string }
        | { error: string };

      if (!response.ok || "error" in result) {
        setError("error" in result ? result.error : "Failed to send message");
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("Connection lost. Your message wasn&apos;t sent.");
    }
  };

  // Success state - simple fade in
  if (isSuccess) {
    return (
      <div className="animate-in fade-in duration-300 space-y-4 text-center py-8">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-gold)]/20">
          <Check className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <h3 className="font-heading text-lg text-[var(--color-cream)]">Sent</h3>
        <p className="text-[var(--color-warm-gray)]">We&apos;ll be in touch.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
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
              <FormMessage className="text-xs text-[var(--color-copper)]" />
            </FormItem>
          )}
        />

        {/* Email */}
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
              <FormMessage className="text-xs text-[var(--color-copper)]" />
            </FormItem>
          )}
        />

        {/* Subject */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                Subject
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={form.formState.isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentClassName}>
                  {SUBJECT_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className={selectItemClassName}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-[var(--color-copper)]" />
            </FormItem>
          )}
        />

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                Message
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's on your mind?"
                  disabled={form.formState.isSubmitting}
                  className={textareaClassName}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-[var(--color-copper)]" />
            </FormItem>
          )}
        />

        {/* Error display - copper border */}
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-[var(--color-copper)]/50 bg-[var(--color-copper)]/10 px-3 py-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-[var(--color-copper)]" />
            <span className="text-sm text-[var(--color-copper)]">{error}</span>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="h-11 w-full bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)] disabled:opacity-50"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send"
          )}
        </Button>
      </form>
    </Form>
  );
}
