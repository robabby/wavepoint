"use client";

import { cn } from "@/lib/utils";

interface SidebarUserSectionProps {
  email: string;
  isCollapsed?: boolean;
  className?: string;
}

/**
 * User identity section at top of sidebar.
 * Shows avatar (or initial circle) and email.
 */
export function SidebarUserSection({
  email,
  isCollapsed = false,
  className,
}: SidebarUserSectionProps) {
  // Get first letter of email for initial
  const initial = email.charAt(0).toUpperCase();

  if (isCollapsed) {
    return (
      <div className={cn("flex justify-center py-3", className)}>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            "bg-[var(--sidebar-accent)] text-sm font-medium text-foreground"
          )}
        >
          {initial}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3 px-4 py-3", className)}>
      {/* Avatar circle with initial */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          "bg-[var(--sidebar-accent)] text-sm font-medium text-foreground"
        )}
      >
        {initial}
      </div>

      {/* Email (truncated) */}
      <span className="font-body truncate text-sm text-muted-foreground">
        {email}
      </span>
    </div>
  );
}
