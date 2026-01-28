import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessSignal } from "@/lib/features/access";
import { SightingClient } from "./sighting-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SightingPage({ params }: Props) {
  const session = await auth();

  // 404 when feature is disabled (unless admin)
  if (!canAccessSignal(session)) {
    notFound();
  }

  // Require auth for sighting detail
  if (!session?.user) {
    redirect("/?auth=sign-in");
  }

  return <SightingClient params={params} />;
}
