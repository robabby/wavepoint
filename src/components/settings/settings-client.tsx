"use client";

import { useEffect } from "react";
import { ThemeSelector } from "./theme-selector";
import { BirthDataSection } from "./birth-data-section";
import { SubscriptionSection } from "./subscription-section";
import { DataPersonalizationCard } from "./data-personalization-card";
import { AccountActions } from "@/components/account/account-actions";

interface SettingsClientProps {
  birthData?: {
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
  showSubscription: boolean;
  subscriptionTier: "free" | "insight";
  subscriptionStatus?: "active" | "cancelled" | "past_due" | null;
  subscriptionPeriodEnd?: Date | null;
}

function SectionDivider() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent" />
  );
}

export function SettingsClient({
  birthData,
  birthName,
  hasProfile,
  showSubscription,
  subscriptionTier,
  subscriptionStatus,
  subscriptionPeriodEnd,
}: SettingsClientProps) {
  // Hash navigation support for SPA navigation
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // Small delay to ensure DOM is rendered
      const timer = setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Section 1: Appearance */}
      <section id="appearance">
        <h2 className="mb-4 font-heading text-lg text-foreground">
          Appearance
        </h2>
        <ThemeSelector />
      </section>

      <SectionDivider />

      {/* Section 2: Birth Data */}
      <section id="birth-data">
        <h2 className="mb-4 font-heading text-lg text-foreground">
          Birth Data
        </h2>
        <BirthDataSection
          initialData={birthData}
          birthName={birthName}
          hasProfile={hasProfile}
        />
      </section>

      <SectionDivider />

      {/* Section 3: Subscription & Billing */}
      {showSubscription && (
        <>
          <section id="subscription">
            <h2 className="mb-4 font-heading text-lg text-foreground">
              Subscription & Billing
            </h2>
            <SubscriptionSection
              tier={subscriptionTier}
              status={subscriptionStatus}
              currentPeriodEnd={subscriptionPeriodEnd}
            />
          </section>

          <SectionDivider />
        </>
      )}

      {/* Section 4: Data & Personalization */}
      <section id="data-personalization">
        <h2 className="mb-4 font-heading text-lg text-foreground">
          Data & Personalization
        </h2>
        <DataPersonalizationCard />
      </section>

      <SectionDivider />

      {/* Section 5: Account */}
      <section id="account">
        <h2 className="mb-4 font-heading text-lg text-foreground">
          Account
        </h2>
        <AccountActions />
      </section>
    </div>
  );
}
