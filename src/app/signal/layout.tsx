import type { ReactNode } from "react";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { isSignalEnabled } from "@/lib/signal/feature-flags";
import { SignalProviders } from "./providers";

export default async function SignalLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Feature flag guard - 404 when disabled
  if (!isSignalEnabled()) {
    notFound();
  }

  // Auth guard - redirect to login when not authenticated
  const session = await auth();
  if (!session?.user) {
    redirect("/?auth=sign-in");
  }

  return <SignalProviders>{children}</SignalProviders>;
}
