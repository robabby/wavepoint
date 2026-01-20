"use client";

import Link from "next/link";
import { User, CircleUser, Settings, LogOut, Sparkles, Shield } from "lucide-react";
import { useCanAccessSignal } from "@/lib/features/access";
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
  const signalEnabled = useCanAccessSignal();

  if (variant === "mobile") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-gold)]/20">
            <User className="h-4 w-4 text-[var(--color-gold)]" />
          </div>
          <span className="truncate text-sm text-[var(--color-warm-gray)]">
            {email}
          </span>
        </div>

        {/* Account link */}
        <Link
          href="/account"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-3 font-medium",
            "text-[var(--color-warm-gray)] transition-colors",
            "hover:bg-[var(--color-warm-charcoal)] hover:text-[var(--color-gold)]"
          )}
        >
          <Settings className="ml-1 h-5 w-5" />
          <span>Account</span>
        </Link>

        {/* Signal link - only when feature is enabled */}
        {signalEnabled && (
          <Link
            href="/signal"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-3 font-medium",
              "text-[var(--color-warm-gray)] transition-colors",
              "hover:bg-[var(--color-warm-charcoal)] hover:text-[var(--color-gold)]"
            )}
          >
            <Sparkles className="ml-1 h-5 w-5" />
            <span>Signal</span>
          </Link>
        )}

        {/* Admin link - only for admins */}
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-3 font-medium",
              "text-[var(--color-warm-gray)] transition-colors",
              "hover:bg-[var(--color-warm-charcoal)] hover:text-[var(--color-gold)]"
            )}
          >
            <Shield className="ml-1 h-5 w-5" />
            <span>Admin</span>
          </Link>
        )}

        {/* Sign Out */}
        <button
          onClick={onSignOut}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-3 font-medium",
            "text-[var(--color-warm-gray)] transition-colors",
            "hover:bg-[var(--color-warm-charcoal)] hover:text-[var(--color-gold)]"
          )}
        >
          <LogOut className="ml-1 h-5 w-5" />
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
            "text-[var(--color-warm-gray)]",
            "hover:bg-[var(--color-warm-charcoal)] hover:text-[var(--color-gold)]",
            className
          )}
          aria-label="User menu"
        >
          <CircleUser className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 border-[var(--border-gold)] bg-[var(--color-obsidian)]"
      >
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm text-[var(--color-warm-gray)]">
            {email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[var(--border-gold)]/30" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/account"
              className="text-[var(--color-warm-gray)] focus:bg-[var(--color-warm-charcoal)] focus:text-[var(--color-gold)]"
            >
              <Settings className="mr-2 h-4 w-4" />
              Account
            </Link>
          </DropdownMenuItem>
          {signalEnabled && (
            <DropdownMenuItem asChild>
              <Link
                href="/signal"
                className="text-[var(--color-warm-gray)] focus:bg-[var(--color-warm-charcoal)] focus:text-[var(--color-gold)]"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Signal
              </Link>
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link
                href="/admin"
                className="text-[var(--color-warm-gray)] focus:bg-[var(--color-warm-charcoal)] focus:text-[var(--color-gold)]"
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
          className="text-[var(--color-warm-gray)] focus:bg-[var(--color-warm-charcoal)] focus:text-[var(--color-gold)]"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
