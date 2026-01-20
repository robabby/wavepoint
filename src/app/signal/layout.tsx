import type { ReactNode } from "react";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessSignal } from "@/lib/features/access";
import { SignalProviders } from "./providers";

export default async function SignalLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Get session first for access check
  const session = await auth();

  // Feature flag guard - 404 when disabled (unless admin)
  if (!canAccessSignal(session)) {
    notFound();
  }

  // Auth guard - redirect to login when not authenticated
  if (!session?.user) {
    redirect("/?auth=sign-in");
  }

  return <SignalProviders>{children}</SignalProviders>;
}
