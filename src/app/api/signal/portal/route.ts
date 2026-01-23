/**
 * POST /api/signal/portal - Create a Stripe Customer Portal session
 *
 * Creates a session for subscribers to manage their billing.
 * Requires authentication and an active subscription.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/shop/stripe";
import { getUserSubscription } from "@/lib/db/queries/subscriptions";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's subscription to find their Stripe customer ID
    const subscription = await getUserSubscription(session.user.id);

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    // Get the origin for return URL
    const origin = new URL(request.url).origin;

    // Create the portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${origin}/signal/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Portal session error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
