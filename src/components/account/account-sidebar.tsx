"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/account", icon: User },
  // Address page exists but hidden until needed for user profiles
];

interface AccountSidebarProps {
  className?: string;
}

/**
 * Account sidebar navigation component.
 * Desktop: Sticky sidebar with vertical navigation.
 * Mobile: Horizontal tabs at the top.
 */
export function AccountSidebar({ className }: AccountSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className={cn(
          "hidden lg:block lg:w-56 lg:shrink-0",
          className
        )}
      >
        <div className="sticky top-8 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile tabs */}
      <nav className="mb-6 flex gap-2 lg:hidden">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
