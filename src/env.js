import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DATABASE_URL: z.string().startsWith("postgresql://"),
    AUTH_SECRET: z.string().min(32),
    STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
    STRIPE_SIGNAL_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
    APP_URL: z.string().url().default("http://localhost:3000"),
    // Email (Brevo) - optional, email features disabled if not set
    BREVO_API_KEY: z.string().min(1).optional(),
    EMAIL_FROM_ADDRESS: z.string().email().default("noreply@wavepoint.space"),
    EMAIL_FROM_NAME: z.string().default("WavePoint"),
    // Signal (AI interpretations) - optional, AI features disabled if not set
    ANTHROPIC_API_KEY: z.string().min(1).optional(),
    // Upstash Redis (rate limiting) - optional, falls back to in-memory
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
    // Invite system - server-only admin settings
    ADMIN_EMAILS: z.string().optional(), // Comma-separated admin emails
    BREVO_BETA_LIST_ID: z.string().optional(), // Beta Users list ID for invite sync
    BREVO_CONTACT_LIST_ID: z.string().optional(), // Contact form submissions list ID
    BREVO_WAITLIST_LIST_ID: z.string().optional(), // Signal waitlist list ID
    CONTACT_NOTIFICATION_EMAIL: z.string().email().optional(), // Email to receive contact form notifications
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_AUTH_ENABLED: z
      .string()
      .transform((val) => val === "true")
      .default("false"),
    NEXT_PUBLIC_SIGNAL_ENABLED: z
      .string()
      .transform((val) => val === "true")
      .default("false"),
    NEXT_PUBLIC_INVITES_REQUIRED: z
      .string()
      .transform((val) => val === "true")
      .default("false"),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
    NEXT_PUBLIC_MIXPANEL_TOKEN: z.string().min(1).optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_AUTH_ENABLED: process.env.NEXT_PUBLIC_AUTH_ENABLED,
    NEXT_PUBLIC_SIGNAL_ENABLED: process.env.NEXT_PUBLIC_SIGNAL_ENABLED,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_SIGNAL_WEBHOOK_SECRET: process.env.STRIPE_SIGNAL_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    APP_URL: process.env.APP_URL,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
    BREVO_BETA_LIST_ID: process.env.BREVO_BETA_LIST_ID,
    BREVO_CONTACT_LIST_ID: process.env.BREVO_CONTACT_LIST_ID,
    BREVO_WAITLIST_LIST_ID: process.env.BREVO_WAITLIST_LIST_ID,
    CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL,
    NEXT_PUBLIC_INVITES_REQUIRED: process.env.NEXT_PUBLIC_INVITES_REQUIRED,
    NEXT_PUBLIC_MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
