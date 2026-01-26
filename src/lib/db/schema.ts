import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  unique,
  index,
  date,
  time,
  boolean,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Users table - stores account information
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  image: text("image"), // Required by Auth.js adapter (unused for credentials-only auth)
  // Identity fields (Phase 5 groundwork)
  username: text("username").unique(), // Nullable, lowercase, alphanumeric + underscores
  displayName: text("display_name"), // Freeform display name
  failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

/**
 * Verification tokens - for email verification, password reset, and account unlock
 */
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(), // email
    tokenHash: text("token_hash").notNull().unique(), // SHA-256 hash (not plain token)
    type: text("type").notNull(), // 'email_verification' | 'password_reset' | 'account_unlock'
    expires: timestamp("expires", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  },
  (table) => [
    unique("verification_tokens_identifier_type_unique").on(
      table.identifier,
      table.type
    ),
  ]
);

/**
 * Accounts - OAuth provider accounts (required by Auth.js adapter, unused for credentials-only)
 */
export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

/**
 * Sessions - Auth.js session storage
 */
export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

/**
 * Addresses - single shipping address per user
 */
export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull().default("US"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// =============================================================================
// Signal - Angel number tracking
// =============================================================================

/**
 * Signal sightings - captured angel numbers with optional context
 */
export const signalSightings = pgTable(
  "signal_sightings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    number: text("number").notNull(), // "1111", "444", etc.
    note: text("note"),
    moodTags: text("mood_tags").array(),
    tz: text("tz"), // IANA timezone at submission, e.g. "America/Los_Angeles"
    cosmicContext: jsonb("cosmic_context"), // Planetary positions at capture time
    timestamp: timestamp("timestamp", { mode: "date" }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("signal_sightings_user_id_idx").on(table.userId),
    index("signal_sightings_number_idx").on(table.number),
    index("signal_sightings_timestamp_idx").on(table.timestamp),
  ]
);

/**
 * Signal interpretations - AI-generated meanings (1:1 with sightings)
 */
export const signalInterpretations = pgTable(
  "signal_interpretations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sightingId: uuid("sighting_id")
      .notNull()
      .unique() // 1:1 relationship
      .references(() => signalSightings.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    model: text("model").notNull(), // "claude-3-haiku", "fallback", etc.
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [index("signal_interpretations_sighting_id_idx").on(table.sightingId)]
);

/**
 * Signal user activity stats - streak and engagement tracking
 */
export const signalUserActivityStats = pgTable("signal_user_activity_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  totalActiveDays: integer("total_active_days").notNull().default(0),
  lastActiveDate: text("last_active_date"), // 'YYYY-MM-DD'
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

/**
 * Signal user number stats - denormalized stats for performance
 */
export const signalUserNumberStats = pgTable(
  "signal_user_number_stats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    number: text("number").notNull(),
    count: integer("count").notNull().default(0),
    firstSeen: timestamp("first_seen", { mode: "date" }).notNull(),
    lastSeen: timestamp("last_seen", { mode: "date" }).notNull(),
  },
  (table) => [
    unique("signal_user_number_stats_user_number_unique").on(
      table.userId,
      table.number
    ),
    index("signal_user_number_stats_user_id_idx").on(table.userId),
  ]
);

// Signal relations for Drizzle's relational queries
export const signalSightingsRelations = relations(signalSightings, ({ one }) => ({
  interpretation: one(signalInterpretations, {
    fields: [signalSightings.id],
    references: [signalInterpretations.sightingId],
  }),
}));

export const signalInterpretationsRelations = relations(
  signalInterpretations,
  ({ one }) => ({
    sighting: one(signalSightings, {
      fields: [signalInterpretations.sightingId],
      references: [signalSightings.id],
    }),
  })
);

/**
 * Signal subscriptions - subscription tier tracking for Signal Insight
 */
export const signalSubscriptions = pgTable("signal_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  tier: text("tier").notNull().default("free"), // 'free' | 'insight'
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull().default("active"), // 'active' | 'cancelled' | 'past_due'
  currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

/**
 * Signal subscription usage - tracks regeneration usage per billing period
 */
export const signalSubscriptionUsage = pgTable(
  "signal_subscription_usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    periodStart: timestamp("period_start", { mode: "date" }).notNull(),
    regenerationsUsed: integer("regenerations_used").notNull().default(0),
  },
  (table) => [
    unique("signal_subscription_usage_user_period_unique").on(
      table.userId,
      table.periodStart
    ),
    index("signal_subscription_usage_user_id_idx").on(table.userId),
  ]
);

// =============================================================================
// Spiritual Profiles - Astrology data for personalization
// =============================================================================

/**
 * Spiritual profiles - stores birth data and calculated natal chart
 *
 * Each user has at most one profile. Birth time is optional but enables
 * Rising sign calculation. Full chart data stored as JSONB with denormalized
 * columns for fast queries on common fields.
 */
export const spiritualProfiles = pgTable(
  "spiritual_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),

    // Birth Date (required)
    birthDate: date("birth_date", { mode: "date" }).notNull(),

    // Birth Time (optional - many users don't know their birth time)
    birthTime: time("birth_time"),
    birthTimeApproximate: boolean("birth_time_approximate").notNull().default(false),

    // Birth Location (required for chart calculation)
    birthCity: text("birth_city").notNull(),
    birthCountry: text("birth_country").notNull(),
    birthLatitude: numeric("birth_latitude", { precision: 9, scale: 6 }).notNull(),
    birthLongitude: numeric("birth_longitude", { precision: 10, scale: 6 }).notNull(),
    birthTimezone: text("birth_timezone").notNull(), // IANA timezone

    // The Big Three (denormalized for fast queries)
    sunSign: text("sun_sign"), // 'aries', 'taurus', etc.
    sunDegree: numeric("sun_degree", { precision: 5, scale: 2 }), // 0.00 to 29.99
    moonSign: text("moon_sign"),
    moonDegree: numeric("moon_degree", { precision: 5, scale: 2 }),
    risingSign: text("rising_sign"), // NULL if no birth time
    risingDegree: numeric("rising_degree", { precision: 5, scale: 2 }),

    // Element Balance (pre-computed for pattern matching)
    elementFire: integer("element_fire").notNull().default(0),
    elementEarth: integer("element_earth").notNull().default(0),
    elementAir: integer("element_air").notNull().default(0),
    elementWater: integer("element_water").notNull().default(0),

    // Modality Balance (pre-computed)
    modalityCardinal: integer("modality_cardinal").notNull().default(0),
    modalityFixed: integer("modality_fixed").notNull().default(0),
    modalityMutable: integer("modality_mutable").notNull().default(0),

    // Full Chart Data (JSONB for detailed positions)
    chartData: jsonb("chart_data"),

    // Calculation Metadata
    calculatedAt: timestamp("calculated_at", { withTimezone: true, mode: "date" }),
    calculationVersion: text("calculation_version"),

    // Visibility (Phase 5 groundwork)
    profileVisibility: text("profile_visibility").notNull().default("private"), // 'private' | 'public'

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    index("spiritual_profiles_sun_sign_idx").on(table.sunSign),
    index("spiritual_profiles_moon_sign_idx").on(table.moonSign),
    index("spiritual_profiles_rising_sign_idx").on(table.risingSign),
  ]
);

// =============================================================================
// Invites - Closed beta access gating
// =============================================================================

/**
 * Invites table - controls who can register during closed beta
 */
export const invites = pgTable("invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(), // 'SG-X7K9M2'
  email: text("email").notNull().unique(), // One active invite per email
  status: text("status").notNull().default("pending"), // 'pending' | 'redeemed' | 'cancelled'
  brevoContactId: text("brevo_contact_id"), // Brevo contact ID for CRM updates
  redeemedBy: uuid("redeemed_by").references(() => users.id, {
    onDelete: "set null",
  }),
  redeemedAt: timestamp("redeemed_at", { mode: "date" }),
  cancelledAt: timestamp("cancelled_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// =============================================================================
// Contact - Contact form submissions
// =============================================================================

/**
 * Contact submissions - public contact form entries
 * Rate limited by IP (5/hour)
 */
export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject").notNull(), // general, press, partnership, feedback, other
    message: text("message").notNull(),
    ipAddress: text("ip_address").notNull(), // For rate limiting
    brevoContactId: text("brevo_contact_id"), // Brevo contact ID for CRM tracking
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("contact_submissions_email_idx").on(table.email),
    index("contact_submissions_ip_address_created_at_idx").on(
      table.ipAddress,
      table.createdAt
    ),
  ]
);

// =============================================================================
// Waitlist - Feature waitlist signups
// =============================================================================

/**
 * Waitlist signups - collect emails for upcoming features
 * Rate limited by IP (5/hour)
 */
export const waitlistSignups = pgTable(
  "waitlist_signups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    source: text("source").notNull(), // "signal"
    ipAddress: text("ip_address"),
    brevoContactId: text("brevo_contact_id"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("waitlist_signups_email_source_idx").on(table.email, table.source),
    index("waitlist_signups_source_idx").on(table.source),
  ]
);

// Type exports for use in application code
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

export type SignalSighting = typeof signalSightings.$inferSelect;
export type NewSignalSighting = typeof signalSightings.$inferInsert;

export type SignalInterpretation = typeof signalInterpretations.$inferSelect;
export type NewSignalInterpretation = typeof signalInterpretations.$inferInsert;

export type SignalUserNumberStats = typeof signalUserNumberStats.$inferSelect;
export type NewSignalUserNumberStats = typeof signalUserNumberStats.$inferInsert;

export type SignalUserActivityStats = typeof signalUserActivityStats.$inferSelect;
export type NewSignalUserActivityStats = typeof signalUserActivityStats.$inferInsert;

export type SignalSubscription = typeof signalSubscriptions.$inferSelect;
export type NewSignalSubscription = typeof signalSubscriptions.$inferInsert;

export type SignalSubscriptionUsage = typeof signalSubscriptionUsage.$inferSelect;
export type NewSignalSubscriptionUsage = typeof signalSubscriptionUsage.$inferInsert;

export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;

export type WaitlistSignup = typeof waitlistSignups.$inferSelect;
export type NewWaitlistSignup = typeof waitlistSignups.$inferInsert;

export type SpiritualProfile = typeof spiritualProfiles.$inferSelect;
export type NewSpiritualProfile = typeof spiritualProfiles.$inferInsert;
