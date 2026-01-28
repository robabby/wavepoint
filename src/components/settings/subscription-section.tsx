"use client";

import { SubscriptionStatus } from "@/components/signal/subscription-status";

interface SubscriptionSectionProps {
  tier: "free" | "insight";
  status?: "active" | "cancelled" | "past_due" | null;
  currentPeriodEnd?: Date | null;
}

export function SubscriptionSection({ tier, status, currentPeriodEnd }: SubscriptionSectionProps) {
  return (
    <SubscriptionStatus
      tier={tier}
      status={status}
      currentPeriodEnd={currentPeriodEnd}
    />
  );
}
