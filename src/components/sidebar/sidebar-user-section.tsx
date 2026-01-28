"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarUserSectionProps {
  email: string;
  isCollapsed?: boolean;
  className?: string;
}

/**
 * User identity section in sidebar.
 * Shows avatar (or initial circle) and email, links to profile.
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
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/profile"
              className={cn(
                "mx-3 flex h-10 w-10 items-center justify-center rounded-lg",
                "transition-colors",
                "hover:bg-[var(--sidebar-accent)]"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  "bg-[var(--sidebar-accent)] text-sm font-medium text-foreground"
                )}
              >
                {initial}
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-body">
            Profile
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link
      href="/profile"
      className={cn(
        "mx-4 flex items-center gap-3 rounded-lg px-3 py-2.5",
        "transition-colors",
        "hover:bg-[var(--sidebar-accent)]",
        className
      )}
    >
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
    </Link>
  );
}
