"use client";

import { signIn } from "next-auth/react";
import type { SignInFormData, SignUpFormData } from "./schemas";

export type AuthResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Sign in with credentials
 */
export async function signInWithCredentials(
  data: SignInFormData
): Promise<AuthResult> {
  try {
    const result = await signIn("credentials", {
      email: data.email.toLowerCase(),
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Invalid email or password" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Register a new user and auto sign-in
 */
export async function registerUser(
  data: SignUpFormData
): Promise<AuthResult> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.toLowerCase(),
        password: data.password,
      }),
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      return {
        success: false,
        error: result.error ?? "Registration failed",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}
