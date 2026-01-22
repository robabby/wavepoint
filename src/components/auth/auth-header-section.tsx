"use client";

import { useSession, signOut } from "next-auth/react";
import { SignInButton } from "./sign-in-button";
import { UserMenu } from "./user-menu";
import { cn } from "@/lib/utils";

interface AuthHeaderSectionProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

/**
 * Controller component that renders either SignInButton or UserMenu
 * based on the current authentication state.
 */
export function AuthHeaderSection({
  variant = "desktop",
  className,
}: AuthHeaderSectionProps) {
  const { data: session, status } = useSession();

  // Show loading skeleton to prevent layout shift
  if (status === "loading") {
    return (
      <div
        className={cn(
          "animate-pulse rounded bg-card",
          variant === "desktop" ? "h-8 w-16" : "h-12 w-full rounded-lg",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  // Authenticated: show UserMenu
  if (session?.user?.email) {
    return (
      <UserMenu
        variant={variant}
        email={session.user.email}
        isAdmin={session.user.isAdmin}
        onSignOut={() => signOut({ callbackUrl: "/" })}
        className={className}
      />
    );
  }

  // Unauthenticated: show Sign In button
  return <SignInButton variant={variant} className={className} />;
}
