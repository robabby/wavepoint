"use client";

import { useState } from "react";
import { Pencil, MapPin, Clock, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { BirthDataForm } from "@/components/profile";
import { BirthNameForm } from "@/components/numerology";

interface BirthDataSectionProps {
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
  birthName?: string | null;
  hasProfile: boolean;
}

export function BirthDataSection({ initialData, birthName, hasProfile }: BirthDataSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!hasProfile) {
    return (
      <div className="space-y-6">
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            Add your birth data to unlock personalized transits, chart calculations, and numerology insights.
          </p>
          <BirthDataForm onSuccess={() => setIsEditing(false)} />
        </div>
        <div className="relative">
          <div className="pointer-events-none opacity-50">
            <BirthNameForm initialBirthName={null} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-lg border border-[var(--border-gold)]/30 bg-card/95 px-4 py-3 text-center shadow-lg backdrop-blur-sm">
              <p className="text-sm font-medium text-foreground">
                Enter your birth data first
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Your birth name unlocks Expression, Soul Urge, Personality, and Maturity numbers.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <BirthDataForm
          initialData={initialData}
          onSuccess={() => setIsEditing(false)}
        />
        {hasProfile && (
          <BirthNameForm initialBirthName={birthName ?? null} />
        )}
        <button
          onClick={() => setIsEditing(false)}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-5">
        <div className="space-y-3">
          {initialData?.birthDate && (
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{initialData.birthDate}</span>
            </div>
          )}
          {initialData?.birthTime && (
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{initialData.birthTime.slice(0, 5)}</span>
            </div>
          )}
          {initialData?.birthCity && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {initialData.birthCity}, {initialData.birthCountry}
              </span>
            </div>
          )}
          {birthName && (
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{birthName}</span>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className={cn(
          "mt-3 inline-flex items-center gap-1.5 text-sm",
          "text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
        )}
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit birth data
      </button>
    </div>
  );
}
