import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessSignal } from "@/lib/features/access";
import { SacredSpinner } from "@/components/signal";
import { SightingsContent } from "./sightings-content";

export const metadata: Metadata = {
  title: "Sightings",
  description: "Browse and filter your angel number sightings.",
};

export default async function SightingsPage() {
  const session = await auth();

  if (!canAccessSignal(session)) {
    notFound();
  }

  if (!session?.user) {
    redirect("/?auth=sign-in");
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <SacredSpinner size="lg" label="Loading sightings..." />
        </div>
      }
    >
      <SightingsContent />
    </Suspense>
  );
}
