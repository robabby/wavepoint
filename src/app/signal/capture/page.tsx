import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessSignal } from "@/lib/features/access";
import { CaptureClient } from "./capture-client";

export default async function CapturePage() {
  const session = await auth();

  // 404 when feature is disabled (unless admin)
  if (!canAccessSignal(session)) {
    notFound();
  }

  // Require auth for capture
  if (!session?.user) {
    redirect("/?auth=sign-in");
  }

  return <CaptureClient />;
}
