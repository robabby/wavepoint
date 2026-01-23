import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { canAccessSignal } from "@/lib/features/access";
import { getUserSubscription } from "@/lib/db/queries/subscriptions";
import { SubscriptionStatus } from "@/components/signal/subscription-status";

export const metadata: Metadata = {
  title: "Signal Settings",
  description: "Manage your Signal subscription.",
};

interface SettingsPageProps {
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await auth();

  // Check feature access
  if (!canAccessSignal(session)) {
    redirect("/signal");
  }

  // Require auth
  if (!session?.user?.id) {
    redirect("/?auth=sign-in");
  }

  // Get subscription data
  const subscription = await getUserSubscription(session.user.id);

  const tier = subscription?.tier === "insight" && subscription?.status === "active"
    ? "insight"
    : "free";

  // Check for success/cancelled query params
  const params = await searchParams;
  const showSuccess = params.success === "true";
  const showCancelled = params.cancelled === "true";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[var(--border-gold)]/20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Link
            href="/signal"
            aria-label="Back to Signal dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <h1 className="font-heading text-lg text-foreground">Settings</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        {/* Success message */}
        {showSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <p className="text-sm text-green-400">
              Welcome to Signal Insight! Your subscription is now active.
            </p>
          </div>
        )}

        {/* Cancelled message */}
        {showCancelled && (
          <div className="mb-6 rounded-lg border border-muted-foreground/30 bg-muted/10 p-4">
            <p className="text-sm text-muted-foreground">
              Checkout was cancelled. No charges were made.
            </p>
          </div>
        )}

        <div className="space-y-8">
          {/* Subscription Section */}
          <section>
            <h2 className="mb-4 font-heading text-lg text-foreground">
              Subscription
            </h2>
            <SubscriptionStatus
              tier={tier}
              status={subscription?.status as "active" | "cancelled" | "past_due" | null}
              currentPeriodEnd={subscription?.currentPeriodEnd}
            />
          </section>

          {/* Account Info */}
          <section>
            <h2 className="mb-4 font-heading text-lg text-foreground">
              Account
            </h2>
            <div className="rounded-lg border border-[var(--border-gold)]/30 bg-card p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground">{session.user.email}</p>
                </div>
                {session.user.name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-foreground">{session.user.name}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
