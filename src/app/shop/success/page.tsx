/**
 * Checkout Success Page
 *
 * Shown after successful Stripe payment.
 */

import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Heading, Text } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { getCheckoutSession } from "@/lib/shop/stripe";
import { ClearCartOnSuccess } from "./clear-cart";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

async function OrderDetails({ sessionId }: { sessionId: string }) {
  // Validate session ID format (Stripe session IDs start with "cs_")
  if (!sessionId.startsWith("cs_")) {
    return null;
  }

  try {
    const session = await getCheckoutSession(sessionId);
    const customerEmail = session.customer_details?.email;

    return (
      <div className="space-y-2 text-center">
        <Text className="text-muted-foreground">
          Order confirmation sent to:
        </Text>
        <Text weight="medium" className="text-foreground">
          {customerEmail}
        </Text>
      </div>
    );
  } catch {
    return null;
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  return (
    <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      {/* Clear cart after successful checkout */}
      <ClearCartOnSuccess />

      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        {/* Success Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-gold)]/20">
          <CheckCircle className="h-10 w-10 text-[var(--color-gold)]" />
        </div>

        {/* Heading */}
        <Heading
          as="h1"
          size="7"
          className="font-heading text-foreground"
        >
          Thank You!
        </Heading>

        <Text size="4" className="text-muted-foreground">
          Your order has been placed successfully. We&apos;ll send you a
          confirmation email with tracking information once your items ship.
        </Text>

        {/* Order Details */}
        {sessionId && (
          <Suspense
            fallback={
              <Text className="text-muted-foreground">
                Loading order details...
              </Text>
            }
          >
            <OrderDetails sessionId={sessionId} />
          </Suspense>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-4">
          <Link href="/shop">
            <Button
              variant="outline"
              className="border-[var(--color-gold)] text-[var(--color-gold)] hover:border-[var(--color-gold-bright)] hover:bg-[var(--color-gold)]/20 hover:text-[var(--color-gold-bright)]"
            >
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-[var(--color-gold)] text-primary-foreground hover:bg-[var(--color-gold-bright)]">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
