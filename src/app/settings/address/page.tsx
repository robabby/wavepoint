import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, addresses } from "@/lib/db";
import { AddressDisplay } from "@/components/account/address-display";

export const metadata: Metadata = {
  title: "Shipping Address",
  description: "Manage your shipping address for orders.",
};

export default async function AddressPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/?auth=sign-in");
  }

  const address = await db.query.addresses.findFirst({
    where: eq(addresses.userId, session.user.id),
  });

  return <AddressDisplay address={address ?? null} />;
}
