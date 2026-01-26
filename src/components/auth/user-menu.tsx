"use client";

import Link from "next/link";
import { User, CircleUser, Settings, LogOut, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  variant?: "desktop" | "mobile";
  email: string;
  isAdmin?: boolean;
  onSignOut: () => void;
  className?: string;
}

/**
 * User menu for authenticated users.
 * Desktop: Dropdown menu with user icon trigger.
 * Mobile: Expanded section with user info and actions.
 */
export function UserMenu({
  variant = "desktop",
  email,
  isAdmin,
  onSignOut,
  className,
}: UserMenuProps) {
  if (variant === "mobile") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {/* User info */}
        <div className="flex items-center gap-4 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-gold)]/20 border border-[var(--glass-border)]/50">
            <User className="h-5 w-5 text-[var(--color-gold)]" />
          </div>
          <span className="truncate text-base text-muted-foreground">
            {email}
          </span>
        </div>

        {/* Profile link */}
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-4 rounded-lg px-4 py-4 text-lg font-medium",
            "text-foreground transition-all duration-200 ease-out",
            "hover:bg-[var(--glass-bg-elevated)] hover:text-[var(--color-gold)]"
          )}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link>

        {/* Settings link */}
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-4 rounded-lg px-4 py-4 text-lg font-medium",
            "text-foreground transition-all duration-200 ease-out",
            "hover:bg-[var(--glass-bg-elevated)] hover:text-[var(--color-gold)]"
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>

        {/* Admin link - only for admins */}
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-4 rounded-lg px-4 py-4 text-lg font-medium",
              "text-foreground transition-all duration-200 ease-out",
              "hover:bg-[var(--glass-bg-elevated)] hover:text-[var(--color-gold)]"
            )}
          >
            <Shield className="h-5 w-5" />
            <span>Admin</span>
          </Link>
        )}

        {/* Sign Out */}
        <button
          onClick={onSignOut}
          className={cn(
            "flex items-center gap-4 rounded-lg px-4 py-4 text-lg font-medium text-left",
            "text-foreground transition-all duration-200 ease-out",
            "hover:bg-[var(--glass-bg-elevated)] hover:text-[var(--color-gold)]"
          )}
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-md",
            "text-muted-foreground",
            "hover:bg-card hover:text-[var(--color-gold)]",
            className
          )}
          aria-label="User menu"
        >
          <CircleUser className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 border-[var(--border-gold)] bg-background"
      >
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm text-muted-foreground">
            {email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[var(--border-gold)]/30" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="text-muted-foreground !focus:bg-card !focus:text-[var(--color-gold-text)]"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="text-muted-foreground !focus:bg-card !focus:text-[var(--color-gold-text)]"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link
                href="/admin"
                className="text-muted-foreground !focus:bg-card !focus:text-[var(--color-gold-text)]"
              >
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-[var(--border-gold)]/30" />
        <DropdownMenuItem
          onClick={onSignOut}
          className="text-muted-foreground !focus:bg-card !focus:text-[var(--color-gold-text)]"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
