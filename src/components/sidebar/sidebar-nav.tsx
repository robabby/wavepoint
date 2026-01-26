"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Radio,
  Calendar,
  User,
  Settings,
  Shield,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// =============================================================================
// Types
// =============================================================================

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarNavProps {
  isAdmin?: boolean;
  isCollapsed?: boolean;
  onSignOut: () => void;
  className?: string;
}

// =============================================================================
// Navigation Configuration
// =============================================================================

const PRACTICE_SECTION: NavSection = {
  title: "PRACTICE",
  items: [
    { label: "Signal", href: "/signal", icon: Radio },
    { label: "Calendar", href: "/calendar", icon: Calendar },
  ],
};

const ACCOUNT_SECTION: NavSection = {
  title: "ACCOUNT",
  items: [
    { label: "Profile", href: "/profile", icon: User },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
};

const ADMIN_ITEM: NavItem = {
  label: "Admin",
  href: "/admin",
  icon: Shield,
};

// =============================================================================
// Components
// =============================================================================

/**
 * Sidebar navigation with Practice and Account sections.
 */
export function SidebarNav({
  isAdmin = false,
  isCollapsed = false,
  onSignOut,
  className,
}: SidebarNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/signal") {
      return pathname === "/signal" || pathname.startsWith("/signal/");
    }
    if (href === "/calendar") {
      return pathname === "/calendar" || pathname.startsWith("/calendar/");
    }
    if (href === "/profile") {
      return pathname === "/profile" || pathname.startsWith("/profile/");
    }
    if (href === "/settings") {
      return pathname === "/settings" || pathname.startsWith("/settings/");
    }
    return pathname.startsWith(href);
  };

  // Build account items with optional admin
  const accountItems = isAdmin
    ? [...ACCOUNT_SECTION.items, ADMIN_ITEM]
    : ACCOUNT_SECTION.items;

  return (
    <nav className={cn("flex flex-col", className)}>
      {/* Practice Section */}
      <NavSectionComponent
        section={PRACTICE_SECTION}
        isCollapsed={isCollapsed}
        isActive={isActive}
      />

      {/* Divider */}
      <div className="my-2 border-t border-[var(--sidebar-border)]" />

      {/* Account Section */}
      <NavSectionComponent
        section={{ ...ACCOUNT_SECTION, items: accountItems }}
        isCollapsed={isCollapsed}
        isActive={isActive}
      />

      {/* Divider */}
      <div className="my-2 border-t border-[var(--sidebar-border)]" />

      {/* Sign Out */}
      {isCollapsed ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onSignOut}
                className={cn(
                  "mx-3 flex h-10 w-10 items-center justify-center rounded-lg",
                  "text-muted-foreground transition-colors",
                  "hover:bg-[var(--sidebar-accent)] hover:text-foreground"
                )}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-body">
              Sign Out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <button
          onClick={onSignOut}
          className={cn(
            "mx-4 flex items-center gap-3 rounded-lg px-3 py-2.5",
            "text-sm text-muted-foreground transition-colors",
            "hover:bg-[var(--sidebar-accent)] hover:text-foreground"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      )}
    </nav>
  );
}

/**
 * Nav section with title and items.
 */
function NavSectionComponent({
  section,
  isCollapsed,
  isActive,
}: {
  section: NavSection;
  isCollapsed: boolean;
  isActive: (href: string) => boolean;
}) {
  return (
    <div>
      {/* Section title (hidden when collapsed) */}
      {!isCollapsed && (
        <h3 className="mb-2 px-4 font-body text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {section.title}
        </h3>
      )}

      {/* Items */}
      <div className="flex flex-col gap-1">
        {section.items.map((item) => (
          <NavItemComponent
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
            isActive={isActive(item.href)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual nav item.
 */
function NavItemComponent({
  item,
  isCollapsed,
  isActive,
}: {
  item: NavItem;
  isCollapsed: boolean;
  isActive: boolean;
}) {
  const Icon = item.icon;

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "mx-3 flex h-10 w-10 items-center justify-center rounded-lg",
                "transition-colors",
                isActive
                  ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
                  : "text-muted-foreground hover:bg-[var(--sidebar-accent)] hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-body">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "mx-4 flex items-center gap-3 rounded-lg px-3 py-2.5",
        "text-sm font-medium transition-colors",
        isActive
          ? "border-l-2 border-[var(--sidebar-primary)] bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]"
          : "text-muted-foreground hover:bg-[var(--sidebar-accent)] hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}
