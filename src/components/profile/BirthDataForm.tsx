"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heading, Text } from "@radix-ui/themes";
import { Loader2 } from "lucide-react";
import { useUpdateProfile, useCalculateChart } from "@/hooks/profile";
import type { BigThree, ElementBalance } from "@/lib/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedCard } from "@/components/animated-card";

interface BirthDataFormProps {
  initialData?: {
    birthDate?: string;
    birthTime?: string | null;
    birthTimeApproximate?: boolean;
    birthCity?: string;
    birthCountry?: string;
    birthLatitude?: number;
    birthLongitude?: number;
    birthTimezone?: string;
  };
}

interface PreviewResult {
  bigThree: BigThree;
  elementBalance: ElementBalance;
}

/**
 * Birth data form for creating/editing spiritual profile.
 */
export function BirthDataForm({ initialData }: BirthDataFormProps) {
  const router = useRouter();
  const { updateProfile, isUpdating } = useUpdateProfile();
  const { calculateChart, isCalculating } = useCalculateChart();

  // Form state
  const [birthDate, setBirthDate] = useState(initialData?.birthDate ?? "");
  const [birthTime, setBirthTime] = useState(initialData?.birthTime ?? "");
  const [unknownTime, setUnknownTime] = useState(!initialData?.birthTime);
  const [birthCity, setBirthCity] = useState(initialData?.birthCity ?? "");
  const [birthCountry, setBirthCountry] = useState(initialData?.birthCountry ?? "");
  const [birthLatitude, setBirthLatitude] = useState(initialData?.birthLatitude?.toString() ?? "");
  const [birthLongitude, setBirthLongitude] = useState(initialData?.birthLongitude?.toString() ?? "");

  // Preview state
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePreview = async () => {
    setError(null);

    if (!birthDate || !birthLatitude || !birthLongitude) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const result = await calculateChart({
        birthDate,
        birthTime: unknownTime ? null : birthTime || null,
        birthLatitude: parseFloat(birthLatitude),
        birthLongitude: parseFloat(birthLongitude),
      });

      setPreview({
        bigThree: result.bigThree,
        elementBalance: result.elementBalance,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate chart");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!birthDate || !birthCity || !birthCountry || !birthLatitude || !birthLongitude) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await updateProfile({
        birthDate: new Date(birthDate),
        birthTime: unknownTime ? null : birthTime || null,
        birthTimeApproximate: false,
        birthCity,
        birthCountry,
        birthLatitude: parseFloat(birthLatitude),
        birthLongitude: parseFloat(birthLongitude),
      });

      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Birth Date */}
      <div className="space-y-2">
        <Label htmlFor="birthDate">Birth Date *</Label>
        <Input
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
          className="bg-background"
        />
        <Text size="1" className="text-muted-foreground">
          Date determines Sun and Moon signs.
        </Text>
      </div>

      {/* Birth Time */}
      <div className="space-y-2">
        <Label htmlFor="birthTime">Birth Time (optional)</Label>
        <div className="flex items-center gap-4">
          <Input
            id="birthTime"
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            disabled={unknownTime}
            className="flex-1 bg-background"
          />
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={unknownTime}
              onChange={(e) => {
                setUnknownTime(e.target.checked);
                if (e.target.checked) setBirthTime("");
              }}
              className="h-4 w-4 rounded border-[var(--color-gold)]/30 bg-background text-[var(--color-gold)] focus:ring-[var(--color-gold)]"
            />
            <span className="text-sm text-muted-foreground">
              I don&apos;t know
            </span>
          </label>
        </div>
        <Text size="1" className="text-muted-foreground">
          Time enables Rising sign calculation.
        </Text>
      </div>

      {/* Birth Location */}
      <div className="space-y-4">
        <Label>Birth Location *</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input
              placeholder="City"
              value={birthCity}
              onChange={(e) => setBirthCity(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <div>
            <Input
              placeholder="Country"
              value={birthCountry}
              onChange={(e) => setBirthCountry(e.target.value)}
              required
              className="bg-background"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input
              type="number"
              step="any"
              placeholder="Latitude"
              value={birthLatitude}
              onChange={(e) => setBirthLatitude(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <div>
            <Input
              type="number"
              step="any"
              placeholder="Longitude"
              value={birthLongitude}
              onChange={(e) => setBirthLongitude(e.target.value)}
              required
              className="bg-background"
            />
          </div>
        </div>
        <Text size="1" className="text-muted-foreground">
          Don&apos;t know your coordinates?{" "}
          <a
            href="https://www.latlong.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-gold)] underline underline-offset-2 hover:text-[var(--color-gold)]/80"
          >
            Find them on latlong.net
          </a>
        </Text>
      </div>

      {/* Privacy note */}
      <Text size="1" className="text-muted-foreground/60">
        Your birth data is yours. It&apos;s used to calculate your chart and personalize interpretations. Never shared.
      </Text>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
          <Text size="2" className="text-destructive">
            {error}
          </Text>
        </div>
      )}

      {/* Preview section */}
      {preview && (
        <AnimatedCard className="p-6">
          <Heading size="4" className="mb-4 font-display text-[var(--color-gold)]">
            Preview
          </Heading>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <Text size="1" className="block uppercase tracking-wider text-muted-foreground">
                Sun
              </Text>
              <Text size="4" className="capitalize text-foreground">
                {preview.bigThree.sun.sign}
              </Text>
            </div>
            <div className="text-center">
              <Text size="1" className="block uppercase tracking-wider text-muted-foreground">
                Moon
              </Text>
              <Text size="4" className="capitalize text-foreground">
                {preview.bigThree.moon.sign}
              </Text>
            </div>
            <div className="text-center">
              <Text size="1" className="block uppercase tracking-wider text-muted-foreground">
                Rising
              </Text>
              <Text size="4" className="capitalize text-foreground">
                {preview.bigThree.rising?.sign ?? "—"}
              </Text>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handlePreview}
          disabled={isCalculating || !birthDate || !birthLatitude || !birthLongitude}
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            "Preview Chart"
          )}
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUpdating}
            className="bg-[var(--color-gold)] text-background hover:bg-[var(--color-gold)]/90"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
