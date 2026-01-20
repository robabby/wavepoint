import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardContent } from "./dashboard-content";
import { SacredSpinner } from "@/components/signal";

export const metadata: Metadata = {
  title: "Signal",
  description: "Your angel number collection and insights.",
};

function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SacredSpinner size="lg" label="Loading..." />
    </div>
  );
}

export default function SignalDashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
