/**
 * Stripe Webhook Handler for Signal Subscriptions
 *
 * Handles subscription lifecycle events:
 * - checkout.session.completed
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.paid
 * - invoice.payment_failed
 */

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/env";
import {
  upsertSubscription,
  updateSubscriptionStatus,
} from "@/lib/db/queries/subscriptions";
import type Stripe from "stripe";

/**
 * Verify Signal webhook signature.
 * Uses STRIPE_SIGNAL_WEBHOOK_SECRET if set, otherwise falls back to STRIPE_WEBHOOK_SECRET.
 */
function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const secret = env.STRIPE_SIGNAL_WEBHOOK_SECRET ?? env.STRIPE_WEBHOOK_SECRET;
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

/**
 * Get the current period end from subscription items.
 * In newer Stripe API versions, period is on items rather than subscription directly.
 */
function getCurrentPeriodEnd(subscription: Stripe.Subscription): Date | null {
  const firstItem = subscription.items?.data?.[0];
  if (firstItem?.current_period_end) {
    return new Date(firstItem.current_period_end * 1000);
  }
  return null;
}

/**
 * Get subscription ID from invoice.
 * In newer Stripe API versions, subscription is in parent.subscription_details.
 */
function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const subscriptionDetails = invoice.parent?.subscription_details;
  if (!subscriptionDetails?.subscription) {
    return null;
  }

  return typeof subscriptionDetails.subscription === "string"
    ? subscriptionDetails.subscription
    : subscriptionDetails.subscription.id;
}

/**
 * Handle subscription created event.
 * Creates or updates the subscription record in our database.
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) {
    console.error("Missing userId in subscription metadata");
    return;
  }

  const periodEnd = getCurrentPeriodEnd(subscription);

  await upsertSubscription({
    userId,
    tier: "insight",
    stripeCustomerId:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id,
    stripeSubscriptionId: subscription.id,
    status: subscription.status === "active" ? "active" : "past_due",
    currentPeriodEnd: periodEnd ?? undefined,
  });

  console.log(`Signal subscription created for user ${userId}`);
}

/**
 * Handle subscription updated event.
 * Updates status and period end date.
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const status =
    subscription.status === "active"
      ? "active"
      : subscription.status === "past_due"
        ? "past_due"
        : "cancelled";

  const periodEnd = getCurrentPeriodEnd(subscription);

  await updateSubscriptionStatus(subscription.id, {
    status,
    currentPeriodEnd: periodEnd ?? undefined,
  });

  console.log(`Signal subscription ${subscription.id} updated to ${status}`);
}

/**
 * Handle subscription deleted (cancelled) event.
 * Downgrades user to free tier.
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await updateSubscriptionStatus(subscription.id, {
    tier: "free",
    status: "cancelled",
  });

  console.log(`Signal subscription ${subscription.id} cancelled`);
}

/**
 * Handle invoice paid event.
 * Ensures subscription is marked active after successful payment.
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = getSubscriptionIdFromInvoice(invoice);
  if (!subscriptionId) {
    return;
  }

  // Fetch the subscription to get current period end
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const periodEnd = getCurrentPeriodEnd(subscription);

  await updateSubscriptionStatus(subscriptionId, {
    status: "active",
    currentPeriodEnd: periodEnd ?? undefined,
  });

  console.log(`Invoice paid for subscription ${subscriptionId}`);
}

/**
 * Handle invoice payment failed event.
 * Marks subscription as past_due.
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = getSubscriptionIdFromInvoice(invoice);
  if (!subscriptionId) {
    return;
  }

  await updateSubscriptionStatus(subscriptionId, {
    status: "past_due",
  });

  console.log(`Invoice payment failed for subscription ${subscriptionId}`);
}

/**
 * Handle checkout session completed for subscriptions.
 * This is needed when subscription is created via checkout session.
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  // Only handle Signal subscription checkouts
  if (session.metadata?.type !== "signal_insight") {
    return;
  }

  const userId = session.metadata.userId;
  if (!userId) {
    console.error("Missing userId in checkout session metadata");
    return;
  }

  // Get the subscription ID from the session
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    console.error("No subscription ID in checkout session");
    return;
  }

  // Fetch the full subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const periodEnd = getCurrentPeriodEnd(subscription);

  await upsertSubscription({
    userId,
    tier: "insight",
    stripeCustomerId:
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id ?? undefined,
    stripeSubscriptionId: subscriptionId,
    status: subscription.status === "active" ? "active" : "past_due",
    currentPeriodEnd: periodEnd ?? undefined,
  });

  console.log(`Signal subscription created via checkout for user ${userId}`);
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription") {
          await handleCheckoutSessionCompleted(session);
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`Error processing webhook event ${event.type}:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
