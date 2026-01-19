"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  addressSchema,
  US_STATES,
  type AddressFormData,
} from "@/lib/address/schemas";
import { cn } from "@/lib/utils";

interface AddressFormProps {
  defaultValues?: AddressFormData;
  onCancel?: () => void;
}

// Shared input styling (matches auth forms)
const inputClassName = cn(
  "h-11 border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)]/50",
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

/**
 * Validate returnTo is a safe internal path (prevents open redirect attacks)
 */
function getSafeReturnTo(url: string | null): string {
  if (!url) return "/account";
  // Must start with / and not contain protocol or double slashes
  if (url.startsWith("/") && !url.startsWith("//") && !url.includes(":")) {
    return url;
  }
  return "/account";
}

export function AddressForm({ defaultValues, onCancel }: AddressFormProps) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues ?? {
      name: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });

  const onSubmit = async (data: AddressFormData) => {
    setError(null);

    try {
      const response = await fetch("/api/account/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as
        | { success: true }
        | { error: string };

      if (!response.ok || "error" in result) {
        setError("error" in result ? result.error : "Failed to save address");
        return;
      }

      // Redirect to returnTo (already validated) or account page
      router.push(returnTo);
      router.refresh();
    } catch {
      setError("Failed to save address. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                Full Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
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

        {/* Address Line 1 */}
        <FormField
          control={form.control}
          name="line1"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                Street Address
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main St"
                  autoComplete="address-line1"
                  disabled={form.formState.isSubmitting}
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        {/* Address Line 2 */}
        <FormField
          control={form.control}
          name="line2"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                Apt, Suite, etc. <span className="text-[var(--color-dim)]">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Apt 4B"
                  autoComplete="address-line2"
                  disabled={form.formState.isSubmitting}
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        {/* City and State row */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                  City
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="New York"
                    autoComplete="address-level2"
                    disabled={form.formState.isSubmitting}
                    className={inputClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />

          {/* State */}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                  State
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className={selectTriggerClassName}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className={selectContentClassName}>
                    {US_STATES.map((state) => (
                      <SelectItem
                        key={state.value}
                        value={state.value}
                        className={selectItemClassName}
                      >
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
        </div>

        {/* ZIP Code */}
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-[var(--color-cream)]">
                ZIP Code
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="10001"
                  autoComplete="postal-code"
                  disabled={form.formState.isSubmitting}
                  className={cn(inputClassName, "max-w-[200px]")}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        {/* Error display */}
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-red-400/50 bg-red-400/10 px-3 py-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-11 bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)] disabled:opacity-50"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Address"
            )}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={form.formState.isSubmitting}
              className="h-11 border-[var(--border-gold)]/30 text-[var(--color-warm-gray)] hover:border-[var(--border-gold)] hover:text-[var(--color-cream)]"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
