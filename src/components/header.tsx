"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleDot, Menu, Search, X } from "lucide-react";
import { ROUTES } from "@/util/routes";
import { cn } from "@/lib/utils";
import { SearchCommand } from "@/components/search-command";
import { EASE_STANDARD } from "@/lib/animation-constants";
import { useCanAccessAuth } from "@/lib/features/access";
import { AuthHeaderSection } from "@/components/auth/auth-header-section";
import { ThemeToggle } from "@/components/theme-toggle";

type NavItem = {
  path: string;
  desktopLabel: string;
  mobileLabel: string;
};

// Animated nav link with underline draw effect
function AnimatedNavLink({
  href,
  isActive,
  desktopLabel,
  mobileLabel,
  tabIndex,
  onFocus,
  refCallback,
}: {
  href: string;
  isActive: boolean;
  desktopLabel: string;
  mobileLabel: string;
  tabIndex: number;
  onFocus: () => void;
  refCallback: (node: HTMLAnchorElement | null) => void;
}) {
  return (
    <Link
      href={href}
      ref={refCallback}
      tabIndex={tabIndex}
      aria-current={isActive ? "page" : undefined}
      onFocus={onFocus}
      className={cn(
        "group relative text-xs font-medium transition-colors hover:text-[var(--color-gold)] focus:outline-none focus-visible:text-[var(--color-gold)] sm:text-sm",
        isActive ? "text-[var(--color-gold)]" : "text-muted-foreground"
      )}
    >
      <span className="hidden sm:inline">{desktopLabel}</span>
      <span className="sm:hidden">{mobileLabel}</span>

      {/* Underline - draws on hover, stays if active */}
      <motion.span
        className="absolute -bottom-1 left-0 h-0.5 bg-[var(--color-gold)]"
        initial={false}
        animate={{
          width: isActive ? "100%" : "0%",
          opacity: isActive ? 1 : 0,
        }}
        whileHover={{
          width: "100%",
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
          ease: EASE_STANDARD,
        }}
        style={{
          boxShadow: isActive ? "0 0 8px var(--glow-gold)" : "none",
        }}
      />
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isActive = useCallback(
    (path: string) => {
      if (path === "/") return pathname === "/";
      // Sacred Geometry is active on hub, platonic-solids, or sacred-patterns
      if (path === "/sacred-geometry") {
        return (
          pathname === "/sacred-geometry" ||
          pathname.startsWith("/platonic-solids") ||
          pathname.startsWith("/sacred-patterns")
        );
      }
      // Astrology is active on hub and all sub-paths
      if (path === "/astrology") {
        return pathname === "/astrology" || pathname.startsWith("/astrology/");
      }
      return pathname.startsWith(path);
    },
    [pathname]
  );

  const authEnabled = useCanAccessAuth();

  // Desktop nav items
  // Order: Signal | Numbers | Astrology | Sacred Geometry
  const desktopNavItems = useMemo<NavItem[]>(() => {
    return [
      // Signal appears first (before Numbers) - always visible, shows marketing when disabled
      {
        path: "/signal",
        desktopLabel: "Signal",
        mobileLabel: "Signal",
      },
      // Numbers is always present
      {
        path: ROUTES.numbers.path,
        desktopLabel: "Numbers",
        mobileLabel: "Numbers",
      },
      // Astrology section
      {
        path: "/astrology",
        desktopLabel: "Astrology",
        mobileLabel: "Astrology",
      },
      // Sacred Geometry (replaces dropdown)
      {
        path: ROUTES.sacredGeometry.path,
        desktopLabel: "Sacred Geometry",
        mobileLabel: "Sacred Geometry",
      },
    ];
  }, []);

  // Mobile nav items
  // Order: Signal | Numbers | Astrology | Sacred Geometry
  const mobileNavItems = useMemo<NavItem[]>(() => {
    return [
      // Signal appears first - always visible, shows marketing when disabled
      {
        path: "/signal",
        desktopLabel: "Signal",
        mobileLabel: "Signal",
      },
      // Numbers section
      {
        path: ROUTES.numbers.path,
        desktopLabel: "Numbers",
        mobileLabel: "Numbers",
      },
      // Astrology section
      {
        path: "/astrology",
        desktopLabel: "Astrology",
        mobileLabel: "Astrology",
      },
      // Single Sacred Geometry link (matches desktop)
      {
        path: ROUTES.sacredGeometry.path,
        desktopLabel: "Sacred Geometry",
        mobileLabel: "Sacred Geometry",
      },
    ];
  }, []);

  // For keyboard navigation, use desktop nav items
  const navItems = desktopNavItems;

  const activeIndex = useMemo(() => {
    const index = navItems.findIndex((item) => isActive(item.path));
    return index === -1 ? 0 : index;
  }, [isActive, navItems]);

  const [focusIndex, setFocusIndex] = useState(activeIndex);
  const navRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const homeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    setFocusIndex(activeIndex);
  }, [activeIndex]);

  const focusNavItem = useCallback(
    (index: number) => {
      const clampedIndex =
        (index + navItems.length) % Math.max(navItems.length, 1);
      const node = navRefs.current[clampedIndex];
      setFocusIndex(clampedIndex);
      node?.focus();
    },
    [navItems.length]
  );

  const focusHome = useCallback(() => {
    homeRef.current?.focus();
  }, []);

  const handleHomeKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLAnchorElement>) => {
      if (navItems.length === 0) return;
      const { key } = event;
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "End"].includes(
          key
        )
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      switch (key) {
        case "ArrowRight":
        case "ArrowDown": {
          focusNavItem(0);
          break;
        }
        case "ArrowLeft":
        case "ArrowUp":
        case "End": {
          focusNavItem(navItems.length - 1);
          break;
        }
      }
    },
    [focusNavItem, navItems.length]
  );

  const handleNavKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (navItems.length === 0) return;
      const key = event.key;
      if (
        ![
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
        ].includes(key)
      )
        return;

      if (focusIndex === 0 && ["ArrowLeft", "ArrowUp", "Home"].includes(key)) {
        event.preventDefault();
        event.stopPropagation();
        focusHome();
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      switch (key) {
        case "ArrowLeft": {
          focusNavItem(focusIndex - 1);
          break;
        }
        case "ArrowRight": {
          focusNavItem(focusIndex + 1);
          break;
        }
        case "ArrowUp": {
          focusNavItem(focusIndex - 1);
          break;
        }
        case "ArrowDown": {
          focusNavItem(focusIndex + 1);
          break;
        }
        case "Home": {
          focusNavItem(0);
          break;
        }
        case "End": {
          focusNavItem(navItems.length - 1);
          break;
        }
      }
    },
    [focusHome, focusIndex, focusNavItem, navItems.length]
  );

  return (
    <>
      {/* Global Search Command - listens for ⌘K */}
      <SearchCommand />

      <header className="sticky top-0 z-50 w-full border-b border-[var(--border-gold)] bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href={ROUTES.home.path}
            ref={homeRef}
            className="flex flex-shrink-0 items-center gap-1.5 transition-opacity hover:opacity-80 sm:gap-2"
            onKeyDown={handleHomeKeyDown}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                ease: EASE_STANDARD,
                delay: 0.2,
              }}
            >
              <CircleDot className="h-5 w-5 text-[var(--color-gold)] sm:h-6 sm:w-6" />
            </motion.div>
            <span className="font-display text-lg tracking-wide text-foreground sm:text-xl">
              WAVE<span className="text-[var(--color-gold)]">POINT</span>
            </span>
          </Link>

          {/* Mobile Actions: Search + Theme + Menu */}
          <div className="flex items-center gap-1 sm:hidden">
            {/* Search Icon */}
            <button
              onClick={() => {
                const event = new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                  bubbles: true,
                });
                document.dispatchEvent(event);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-[var(--color-gold)]"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            <div className="h-6 w-px bg-[var(--border-gold)]/30" />

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-[var(--color-gold)]"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop: Navigation + Utility Actions */}
          <div className="hidden items-center gap-6 sm:flex">
            {/* Navigation: Signal | Numbers | Sacred Geometry */}
            <nav
              aria-label="Primary"
              className="flex items-center gap-6"
              onKeyDown={handleNavKeyDown}
            >
              {desktopNavItems.map((item, index) => (
                <AnimatedNavLink
                  key={item.path}
                  href={item.path}
                  isActive={isActive(item.path)}
                  desktopLabel={item.desktopLabel}
                  mobileLabel={item.mobileLabel}
                  tabIndex={focusIndex === index ? 0 : -1}
                  onFocus={() => setFocusIndex(index)}
                  refCallback={(node) => {
                    navRefs.current[index] = node;
                  }}
                />
              ))}
            </nav>

            {/* Separator between nav and utility actions */}
            <div className="h-6 w-px bg-[var(--border-gold)]/30" />

            {/* Utility Actions: Search, Theme, Auth */}
            <div className="flex items-center gap-1">
              {/* Search - icon only, matches utility action style */}
              <button
                onClick={() => {
                  const event = new KeyboardEvent("keydown", {
                    key: "k",
                    metaKey: true,
                    bubbles: true,
                  });
                  document.dispatchEvent(event);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-[var(--color-gold)]"
                aria-label="Search (⌘K)"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Auth Section - only when auth is enabled */}
              {authEnabled && <AuthHeaderSection variant="desktop" />}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm sm:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Glassmorphic Drawer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: EASE_STANDARD }}
              className={cn(
                "fixed right-0 top-0 z-50 h-full w-80 sm:hidden",
                // Glassmorphic background
                "bg-[var(--glass-bg)] backdrop-blur-xl",
                // Luminous gold border
                "border-l border-[var(--glass-border)]",
                // Multi-layered shadow for outer glow and depth
                "[box-shadow:var(--glass-glow),-8px_0_32px_rgba(0,0,0,0.4)]"
              )}
            >
              {/* Drawer Header */}
              <div className={cn(
                "flex h-16 items-center justify-between px-5",
                "border-b border-[var(--glass-border)]",
                "bg-[var(--glass-bg-elevated)]"
              )}>
                <span className="font-heading text-base font-medium text-[var(--color-gold)]">
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
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
              <nav className="flex flex-col gap-1 p-5" aria-label="Mobile navigation">
                {/* Navigation Links - expanded for mobile (no dropdown) */}
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-4 text-lg font-medium",
                      "transition-all duration-200 ease-out",
                      isActive(item.path)
                        ? "bg-muted/50 text-[var(--color-gold)] border-l-2 border-[var(--color-gold)] [box-shadow:inset_2px_0_8px_rgba(212,168,75,0.1)]"
                        : "text-foreground hover:bg-[var(--glass-bg-elevated)] hover:text-[var(--color-gold)]"
                    )}
                  >
                    {isActive(item.path) && (
                      <span className="h-2 w-2 rounded-full bg-[var(--color-gold)] shadow-[0_0_8px_var(--glow-gold)]" />
                    )}
                    <span className={isActive(item.path) ? "" : "ml-5"}>
                      {item.desktopLabel}
                    </span>
                  </Link>
                ))}

                {/* Auth Section - only when auth is enabled */}
                {authEnabled && (
                  <>
                    <div className="my-3 h-px bg-[var(--glass-border)]/50" />
                    <AuthHeaderSection variant="mobile" />
                  </>
                )}
              </nav>

              {/* Decorative geometric accent */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-[0.07]">
                <CircleDot className="h-28 w-28 text-[var(--color-gold)]" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
