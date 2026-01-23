/**
 * POST /api/signal/subscribe - Create a subscription checkout session
 *
 * Creates a Stripe checkout session for Signal Insight subscription.
 * Requires authentication.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getUserSubscription } from "@/lib/db/queries/subscriptions";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has an active subscription
    const existingSubscription = await getUserSubscription(session.user.id);
    if (
      existingSubscription?.tier === "insight" &&
      existingSubscription?.status === "active"
    ) {
      return NextResponse.json(
        { error: "Already subscribed to Signal Insight" },
        { status: 400 }
      );
    }

    // Get the origin for success/cancel URLs
    const origin = new URL(request.url).origin;

    // Get or create Stripe customer
    let customerId = existingSubscription?.stripeCustomerId;

    if (!customerId) {
      // Search for existing customer by email
      const customers = await stripe.customers.list({
        email: session.user.email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0]!.id;
      } else {
        // Create new customer
        const customer = await stripe.customers.create({
          email: session.user.email,
          name: session.user.name ?? undefined,
          metadata: {
            userId: session.user.id,
          },
        });
        customerId = customer.id;
      }
    }

    // Create subscription checkout session
    // Note: Price ID should be set in Stripe Dashboard and referenced here
    // For now, we'll use a lookup key pattern that can be configured
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          // Use a price lookup key - this allows changing prices without code changes
          // Set this in Stripe Dashboard: Products > Signal Insight > Add Price > Lookup Key: "signal_insight_monthly"
          price_data: {
            currency: "usd",
            product_data: {
              name: "Signal Insight",
              description: "Personalized AI interpretations for your number sightings",
            },
            unit_amount: 499, // $4.99/month - placeholder, actual price TBD via market research
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/signal/settings?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/signal/settings?cancelled=true`,
      subscription_data: {
        metadata: {
          userId: session.user.id,
        },
      },
      metadata: {
        userId: session.user.id,
        type: "signal_insight",
      },
    });

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Subscription checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
