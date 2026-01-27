"use client";

import { useState } from "react";
import { Heading, Text } from "@radix-ui/themes";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateBirthName } from "@/hooks/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedCard } from "@/components/animated-card";

interface BirthNameFormProps {
  initialBirthName: string | null;
  className?: string;
}

/**
 * Form for updating birth name to unlock name-based numerology numbers.
 */
export function BirthNameForm({
  initialBirthName,
  className,
}: BirthNameFormProps) {
  const { updateBirthName, isUpdating } = useUpdateBirthName();
  const [birthName, setBirthName] = useState(initialBirthName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await updateBirthName(birthName.trim() || null);
      setSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save birth name");
    }
  };

  const hasChanges =
    (birthName.trim() || null) !== (initialBirthName ?? null);
  const isExisting = !!initialBirthName;

  return (
    <AnimatedCard className={cn("p-6", className)}>
      <Heading size="4" className="mb-2 font-display text-[var(--color-gold)]">
        Birth Name
      </Heading>
      <Text size="2" className="mb-4 block text-muted-foreground">
        Your full name at birth reveals Expression, Soul Urge, Personality, and
        Maturity numbers.
      </Text>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="birthName">Full name at birth</Label>
          <Input
            id="birthName"
            type="text"
            value={birthName}
            onChange={(e) => setBirthName(e.target.value)}
            placeholder="Enter your full birth name"
            className="bg-background"
          />
          <Text size="1" className="text-muted-foreground">
            Use the name that appears on your birth certificate.
          </Text>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
            <Text size="2" className="text-destructive">
              {error}
            </Text>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3">
            <Text size="2" className="text-green-500">
              Birth name saved. Your numerology has been updated.
            </Text>
          </div>
        )}

        <Button
          type="submit"
          disabled={isUpdating || !hasChanges}
          className="bg-[var(--color-gold)] text-background hover:bg-[var(--color-gold)]/90"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isExisting ? (
            "Update"
          ) : (
            "Save"
          )}
        </Button>
      </form>
    </AnimatedCard>
  );
}
