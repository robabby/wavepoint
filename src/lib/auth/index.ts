import NextAuth from "next-auth";

import { authConfig } from "./config";

/**
 * Auth.js instance with handlers and utilities
 */
export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

// Re-export utilities
export * from "./tokens";
