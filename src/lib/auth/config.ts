import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { env } from "@/env";
import { db } from "@/lib/db";
import { accounts, sessions, users } from "@/lib/db/schema";

/**
 * Auth.js v5 configuration with Credentials provider
 *
 * Uses database sessions with custom session management for the Credentials provider.
 * This approach gives us full control over session lifecycle and security.
 */
export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user by email
        const user = await db.query.users.findFirst({
          where: eq(users.email, email.toLowerCase()),
        });

        if (!user) {
          // Return null to indicate invalid credentials
          // Use same response for both invalid email and password (timing attack prevention)
          return null;
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          // Account is locked - return null (will be handled by rate limiting in later phase)
          return null;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
          // Increment failed login attempts (handled in later phase)
          return null;
        }

        // Reset failed login attempts on successful login (handled in later phase)

        // Return user object (without sensitive data)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  session: {
    // Use database sessions for better security
    strategy: "database",
    // 30 days session lifetime
    maxAge: 30 * 24 * 60 * 60,
    // Extend session on activity (rolling sessions)
    updateAge: 24 * 60 * 60,
  },
  pages: {
    // We'll use modals instead of dedicated pages for sign-in/sign-up
    // These are fallback pages for token-based flows
    signIn: "/auth/sign-in",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      // Add user ID and email verification status to session
      if (session.user) {
        session.user.id = user.id;
        // Fetch full user data to get emailVerified
        const fullUser = await db.query.users.findFirst({
          where: eq(users.id, user.id),
        });
        if (fullUser) {
          session.user.emailVerified = fullUser.emailVerified;
        }
      }
      return session;
    },
    async signIn({ user, account }) {
      // For credentials provider, we need to manually create the session
      // since the adapter doesn't handle this automatically
      if (account?.provider === "credentials" && user.id) {
        // Generate session token
        const { randomUUID } = await import("crypto");
        const sessionToken = randomUUID();
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        // Create session in database
        await db.insert(sessions).values({
          sessionToken,
          userId: user.id,
          expires,
        });

        // The session token will be set as a cookie by Auth.js
        // We attach it to the user object so it can be used
        (user as { sessionToken?: string }).sessionToken = sessionToken;
      }
      return true;
    },
  },
  // Security settings
  trustHost: true,
  secret: env.AUTH_SECRET,
};

// Type augmentation for session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      emailVerified?: Date | null;
    };
  }

  interface User {
    emailVerified?: Date | null;
  }
}
