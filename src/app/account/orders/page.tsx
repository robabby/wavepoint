import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heading, Text } from "@radix-ui/themes";
import { Package } from "lucide-react";
import { auth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Orders",
  description: "View your order history and track shipments.",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/?auth=sign-in");
  }

  return (
    <div>
      <Heading
        as="h1"
        size="6"
        className="mb-6 font-heading text-foreground"
      >
        Orders
      </Heading>

      {/* Empty state */}
      <Card className="border-[var(--border-gold)]/30 bg-background">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold)]/10">
            <Package className="h-8 w-8 text-[var(--color-gold)]" />
          </div>
          <Heading
            as="h2"
            size="5"
            className="mb-2 font-heading text-foreground"
          >
            No orders yet
          </Heading>
          <Text className="mb-6 max-w-sm text-muted-foreground">
            When you make a purchase, your orders will appear here.
          </Text>
          <Button asChild>
            <Link href="/shop">Browse Shop</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
