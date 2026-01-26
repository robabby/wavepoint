"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  CircleDot,
  Plus,
  Radio,
  User,
  Settings,
  Shield,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_STANDARD } from "@/lib/animation-constants";
import { ROUTES } from "@/util/routes";
import { SidebarUserSection } from "./sidebar-user-section";
import { SidebarMoonPhase } from "./sidebar-moon-phase";

// =============================================================================
// Types
// =============================================================================

interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  isAdmin?: boolean;
  onSignOut: () => void;
}

// =============================================================================
// Navigation Configuration
// =============================================================================

const EXPLORE_SECTION: NavSection = {
  title: "EXPLORE",
  items: [
    { label: "Numbers", href: ROUTES.numbers.path },
    { label: "Astrology", href: "/astrology" },
    { label: "Archetypes", href: ROUTES.archetypes.path },
    { label: "Sacred Geometry", href: ROUTES.sacredGeometry.path },
  ],
};

const PRACTICE_SECTION: NavSection = {
  title: "PRACTICE",
  items: [{ label: "Signal", href: "/signal", icon: Radio }],
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
// Component
// =============================================================================

/**
 * Mobile drawer for authenticated users.
 * Slides in from the left and combines content navigation with sidebar sections.
 */
export function SidebarMobileDrawer({
  isOpen,
  onClose,
  email,
  isAdmin = false,
  onSignOut,
}: SidebarMobileDrawerProps) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const isActive = (href: string) => {
    if (href === "/signal") {
      return pathname === "/signal" || pathname.startsWith("/signal/");
    }
    if (href === "/sacred-geometry") {
      return (
        pathname === "/sacred-geometry" ||
        pathname.startsWith("/platonic-solids") ||
        pathname.startsWith("/sacred-patterns")
      );
    }
    if (href === "/astrology") {
      return pathname === "/astrology" || pathname.startsWith("/astrology/");
    }
    if (href === "/archetypes") {
      return pathname === "/archetypes" || pathname.startsWith("/archetypes/");
    }
    if (href === "/numbers") {
      return pathname === "/numbers" || pathname.startsWith("/numbers/");
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: EASE_STANDARD }}
            className={cn(
              "fixed left-0 top-0 z-50 h-full w-80 lg:hidden",
              // Glassmorphic background
              "bg-[var(--glass-bg)] backdrop-blur-xl",
              // Border and glow
              "border-r border-[var(--glass-border)]",
              "[box-shadow:var(--glass-glow),8px_0_32px_rgba(0,0,0,0.4)]"
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer Header */}
            {/* h-[65px] matches main header: h-16 (64px) content + 1px border */}
            <div
              className={cn(
                "flex h-[65px] items-center justify-between px-5",
                "border-b border-[var(--glass-border)]",
                "bg-[var(--glass-bg-elevated)]"
              )}
            >
              {/* WavePoint Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 transition-opacity hover:opacity-80"
                onClick={onClose}
              >
                <CircleDot className="h-5 w-5 text-[var(--color-gold)]" />
                <span className="font-display text-lg tracking-wide text-foreground">
                  WAVE<span className="text-[var(--color-gold)]">POINT</span>
                </span>
              </Link>
              <button
                onClick={onClose}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  "text-muted-foreground",
                  "transition-all duration-200",
                  "hover:bg-[var(--glass-bg-elevated)] hover:text-[var(--color-gold)]"
                )}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex flex-col overflow-y-auto pb-safe">
              {/* User section */}
              <SidebarUserSection email={email} className="pt-4" />

              {/* Moon phase */}
              <SidebarMoonPhase />

              {/* Divider */}
              <div className="mx-4 my-3 border-t border-[var(--glass-border)]/50" />

              {/* Capture button */}
              <div className="px-4 py-2">
                <Link
                  href="/signal/capture"
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5",
                    "bg-[var(--color-gold)] text-[var(--color-obsidian)]",
                    "font-body text-sm font-medium",
                    "transition-all duration-200",
                    "hover:bg-[var(--color-gold-bright)] hover:shadow-[0_0_20px_var(--glow-gold)]"
                  )}
                >
                  <Plus className="h-4 w-4" />
                  <span>Capture Sighting</span>
                </Link>
              </div>

              {/* Divider */}
              <div className="mx-4 my-3 border-t border-[var(--glass-border)]/50" />

              {/* Navigation sections */}
              <nav className="flex flex-col px-4 py-2">
                {/* Explore section */}
                <MobileNavSection
                  section={EXPLORE_SECTION}
                  isActive={isActive}
                />

                {/* Divider */}
                <div className="my-3 border-t border-[var(--glass-border)]/50" />

                {/* Practice section */}
                <MobileNavSection
                  section={PRACTICE_SECTION}
                  isActive={isActive}
                />

                {/* Divider */}
                <div className="my-3 border-t border-[var(--glass-border)]/50" />

                {/* Account section */}
                <MobileNavSection
                  section={{ ...ACCOUNT_SECTION, items: accountItems }}
                  isActive={isActive}
                />

                {/* Divider */}
                <div className="my-3 border-t border-[var(--glass-border)]/50" />

                {/* Sign Out */}
                <button
                  onClick={onSignOut}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3.5",
                    "text-lg font-medium text-muted-foreground",
                    "transition-all duration-200",
                    "hover:bg-[var(--glass-bg-elevated)] hover:text-foreground"
                  )}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </nav>

              {/* Decorative geometric accent */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-[0.07]">
                <CircleDot className="h-28 w-28 text-[var(--color-gold)]" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function MobileNavSection({
  section,
  isActive,
}: {
  section: NavSection;
  isActive: (href: string) => boolean;
}) {
  return (
    <div>
      <h3 className="mb-2 font-body text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
        {section.title}
      </h3>
      <div className="flex flex-col gap-1">
        {section.items.map((item) => (
          <MobileNavItem
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
          />
        ))}
      </div>
    </div>
  );
}

function MobileNavItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-3.5 text-lg font-medium",
        "transition-all duration-200 ease-out",
        isActive
          ? "border-l-2 border-[var(--color-gold)] bg-muted/50 text-[var(--color-gold)] [box-shadow:inset_2px_0_8px_rgba(212,168,75,0.1)]"
          : "text-foreground hover:bg-[var(--glass-bg-elevated)] hover:text-[var(--color-gold)]"
      )}
    >
      {isActive && (
        <span className="h-2 w-2 rounded-full bg-[var(--color-gold)] shadow-[0_0_8px_var(--glow-gold)]" />
      )}
      {Icon && !isActive && <Icon className="h-5 w-5" />}
      <span className={isActive && !Icon ? "" : Icon ? "" : "ml-5"}>
        {item.label}
      </span>
    </Link>
  );
}
