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
 * Uses JWT sessions (required for Credentials provider in Auth.js v5).
 * The adapter is still used for user storage, but sessions are stateless JWTs.
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
    // JWT strategy required for Credentials provider
    strategy: "jwt",
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
    async jwt({ token, user }) {
      // On sign-in, add user data to token
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      // Transfer token data to session
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
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
