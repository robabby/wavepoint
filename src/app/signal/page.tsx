import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessSignal } from "@/lib/features/access";
import { DashboardContent } from "./dashboard-content";
import { SacredSpinner, SignalMarketingPage } from "@/components/signal";

export const metadata: Metadata = {
  title: "Signal",
  description: "Track your angel number synchronicities.",
};

function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SacredSpinner size="lg" label="Loading..." />
    </div>
  );
}

export default async function SignalPage() {
  const session = await auth();

  // Show marketing page when feature is disabled (unless admin)
  if (!canAccessSignal(session)) {
    return <SignalMarketingPage />;
  }

  // Require auth for the actual Signal app
  if (!session?.user) {
    redirect("/?auth=sign-in");
  }

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
