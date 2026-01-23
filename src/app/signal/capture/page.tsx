import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessSignal } from "@/lib/features/access";
import { CaptureClient } from "./capture-client";

interface CapturePageProps {
  searchParams: Promise<{ number?: string }>;
}

export default async function CapturePage({ searchParams }: CapturePageProps) {
  const session = await auth();

  // 404 when feature is disabled (unless admin)
  if (!canAccessSignal(session)) {
    notFound();
  }

  // Require auth for capture
  if (!session?.user) {
    redirect("/?auth=sign-in");
  }

  const { number } = await searchParams;

  // Validate number param if provided (should only contain digits)
  const initialNumber = number && /^\d+$/.test(number) ? number : undefined;

  return <CaptureClient initialNumber={initialNumber} />;
}
