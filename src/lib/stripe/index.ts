/**
 * Stripe Client
 *
 * Shared server-side Stripe client for Signal subscriptions and other payment features.
 */

import Stripe from "stripe";
import { env } from "@/env";

/**
 * Server-side Stripe client
 */
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});
