import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { CheckCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { db, spiritualProfiles } from "@/lib/db";
import { getUserSubscription } from "@/lib/db/queries/subscriptions";
import { isSignalEnabled } from "@/lib/signal";
import { SettingsClient } from "@/components/settings/settings-client";

interface SettingsPageProps {
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/?auth=sign-in");
  }

  // Fetch profile data
  const [profile] = await db
    .select()
    .from(spiritualProfiles)
    .where(eq(spiritualProfiles.userId, session.user.id));

  // Fetch subscription data if Signal is enabled
  const signalEnabled = isSignalEnabled();
  const subscription = signalEnabled
    ? await getUserSubscription(session.user.id)
    : null;

  const tier =
    subscription?.tier === "insight" && subscription?.status === "active"
      ? "insight"
      : "free";

  // Check for Stripe success/cancelled query params
  const params = await searchParams;
  const showSuccess = params.success === "true";
  const showCancelled = params.cancelled === "true";

  const birthData = profile
    ? {
        birthDate: profile.birthDate.toISOString().split("T")[0],
        birthTime: profile.birthTime,
        birthTimeApproximate: profile.birthTimeApproximate,
        birthCity: profile.birthCity,
        birthCountry: profile.birthCountry,
        birthLatitude: parseFloat(profile.birthLatitude),
        birthLongitude: parseFloat(profile.birthLongitude),
        birthTimezone: profile.birthTimezone,
      }
    : undefined;

  return (
    <>
      {/* Stripe success banner */}
      {showSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <p className="text-sm text-green-400">
            Welcome to Signal Insight! Your subscription is now active.
          </p>
        </div>
      )}

      {/* Stripe cancelled banner */}
      {showCancelled && (
        <div className="mb-6 rounded-lg border border-muted-foreground/30 bg-muted/10 p-4">
          <p className="text-sm text-muted-foreground">
            Checkout was cancelled. No charges were made.
          </p>
        </div>
      )}

      <SettingsClient
        birthData={birthData}
        birthName={profile?.birthName}
        hasProfile={!!profile}
        showSubscription={signalEnabled}
        subscriptionTier={tier}
        subscriptionStatus={
          subscription?.status as "active" | "cancelled" | "past_due" | undefined
        }
        subscriptionPeriodEnd={subscription?.currentPeriodEnd}
      />
    </>
  );
}
