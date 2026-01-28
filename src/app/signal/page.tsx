import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessSignal } from "@/lib/features/access";
import { SignalMarketingPage } from "@/components/signal";
import { SignalFeatureHub } from "./signal-feature-hub";

export const metadata: Metadata = {
  title: "Signal",
  description: "Track your angel number synchronicities.",
};

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

  return <SignalFeatureHub />;
}
