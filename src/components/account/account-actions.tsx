"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Package, MapPin, KeyRound, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
}

function ActionCard({
  icon: Icon,
  title,
  description,
  href,
  onClick,
  disabled = false,
  variant = "default",
}: ActionCardProps) {
  const content = (
    <Card
      className={cn(
        "border-[var(--border-gold)]/30 bg-[var(--color-obsidian)] transition-colors",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:border-[var(--border-gold)]",
        variant === "destructive" && !disabled && "hover:border-red-500/50"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              variant === "destructive"
                ? "bg-red-500/10"
                : "bg-[var(--color-gold)]/10"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                variant === "destructive"
                  ? "text-red-400"
                  : "text-[var(--color-gold)]"
              )}
            />
          </div>
          <CardTitle
            className={cn(
              "text-base",
              variant === "destructive"
                ? "text-red-400"
                : "text-[var(--color-cream)]"
            )}
          >
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-[var(--color-warm-gray)]">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );

  if (disabled) {
    return content;
  }

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}

/**
 * Account actions grid component.
 * Displays action cards for orders, address, password, delete account, and sign out.
 */
export function AccountActions() {
  const handleSignOut = () => {
    void signOut({ callbackUrl: "/" });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ActionCard
        icon={Package}
        title="Orders"
        description="View your order history and track shipments"
        href="/account/orders"
      />
      <ActionCard
        icon={MapPin}
        title="Shipping Address"
        description="Manage your default shipping address"
        disabled
      />
      <ActionCard
        icon={KeyRound}
        title="Change Password"
        description="Update your account password"
        disabled
      />
      <ActionCard
        icon={Trash2}
        title="Delete Account"
        description="Permanently delete your account and data"
        variant="destructive"
        disabled
      />
      <div className="sm:col-span-2">
        <Button
          variant="outline"
          className="w-full border-[var(--border-gold)]/30 text-[var(--color-warm-gray)] hover:border-[var(--border-gold)] hover:text-[var(--color-cream)]"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
