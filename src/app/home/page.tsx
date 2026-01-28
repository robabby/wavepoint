import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessSignal } from "@/lib/features/access";
import { DashboardContent } from "@/components/home/dashboard-content";
import { SacredSpinner } from "@/components/signal";

export const metadata: Metadata = {
  title: "Home",
  description: "Your WavePoint dashboard.",
};

function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SacredSpinner size="lg" label="Loading..." />
    </div>
  );
}

export default async function HomePage() {
  const session = await auth();

  // /home is authenticated-only
  if (!session?.user) {
    redirect("/");
  }

  // Require Signal access for dashboard content
  if (!canAccessSignal(session)) {
    redirect("/");
  }

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
