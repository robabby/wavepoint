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
import { CartIcon } from "@/components/shop/cart-icon";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { useCanAccessShop, useCanAccessAuth } from "@/lib/features/access";
import { AuthHeaderSection } from "@/components/auth/auth-header-section";

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
        isActive ? "text-[var(--color-gold)]" : "text-[var(--color-warm-gray)]"
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
      return pathname.startsWith(path);
    },
    [pathname]
  );

  const shopEnabled = useCanAccessShop();
  const authEnabled = useCanAccessAuth();

  const navItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [
      {
        path: ROUTES.platonicSolids.path,
        desktopLabel: "Platonic Solids",
        mobileLabel: "Solids",
      },
      {
        path: ROUTES.sacredPatterns.path,
        desktopLabel: "Patterns",
        mobileLabel: "Patterns",
      },
    ];

    if (shopEnabled) {
      items.push({
        path: "/shop",
        desktopLabel: "Shop",
        mobileLabel: "Shop",
      });
    }

    return items;
  }, [shopEnabled]);

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

      <header className="sticky top-0 z-50 w-full border-b border-[var(--border-gold)] bg-[var(--color-obsidian)]/95 backdrop-blur-xl">
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
            <span className="font-heading text-lg font-semibold text-[var(--color-cream)] sm:text-xl">
              WavePoint
            </span>
          </Link>

          {/* Mobile Actions: Cart + Menu */}
          <div className="flex items-center gap-1 sm:hidden">
            {shopEnabled && (
              <>
                <CartIcon />
                <div className="h-6 w-px bg-[var(--border-gold)]/30" />
              </>
            )}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-warm-gray)] transition-colors hover:bg-[var(--color-warm-charcoal)] hover:text-[var(--color-gold)]"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop: Navigation + Utility Actions */}
          <div className="hidden items-center gap-6 sm:flex">
            {/* Navigation */}
            <nav
              aria-label="Primary"
              className="flex items-center gap-6"
              onKeyDown={handleNavKeyDown}
            >
              {navItems.map((item, index) => (
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

            {/* Utility Actions: Search, Cart, Auth */}
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
                className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-warm-gray)] transition-colors hover:bg-[var(--color-warm-charcoal)] hover:text-[var(--color-gold)]"
                aria-label="Search (⌘K)"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart Icon - only when shop is enabled */}
              {shopEnabled && <CartIcon />}

              {/* Auth Section - only when auth is enabled */}
              {authEnabled && <AuthHeaderSection variant="desktop" />}
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer - only when shop is enabled */}
      {shopEnabled && <CartDrawer />}

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm sm:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: EASE_STANDARD }}
              className="fixed right-0 top-0 z-50 h-full w-72 border-l border-[var(--border-gold)] bg-[var(--color-obsidian)] shadow-2xl sm:hidden"
            >
              {/* Drawer Header */}
              <div className="flex h-16 items-center justify-between border-b border-[var(--border-gold)]/50 px-4">
                <span className="font-heading text-sm font-medium text-[var(--color-gold)]">
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-warm-gray)] transition-colors hover:bg-[var(--color-warm-charcoal)] hover:text-[var(--color-gold)]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
                {/* Search Button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    // Small delay to allow drawer to close before opening search
                    setTimeout(() => {
                      const event = new KeyboardEvent("keydown", {
                        key: "k",
                        metaKey: true,
                        bubbles: true,
                      });
                      document.dispatchEvent(event);
                    }, 150);
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-[var(--color-warm-gray)] transition-colors hover:bg-[var(--color-warm-charcoal)] hover:text-[var(--color-gold)]"
                >
                  <Search className="h-5 w-5 text-[var(--color-gold)]/70" />
                  <span className="font-medium">Search</span>
                </button>

                {/* Divider */}
                <div className="my-2 h-px bg-[var(--border-gold)]/30" />

                {/* Navigation Links */}
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 font-medium transition-colors hover:bg-[var(--color-warm-charcoal)]",
                      isActive(item.path)
                        ? "text-[var(--color-gold)]"
                        : "text-[var(--color-warm-gray)] hover:text-[var(--color-gold)]"
                    )}
                  >
                    {isActive(item.path) && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                    )}
                    <span className={isActive(item.path) ? "" : "ml-4"}>
                      {item.desktopLabel}
                    </span>
                  </Link>
                ))}

                {/* Auth Section - only when auth is enabled */}
                {authEnabled && (
                  <>
                    <div className="my-2 h-px bg-[var(--border-gold)]/30" />
                    <AuthHeaderSection variant="mobile" />
                  </>
                )}
              </nav>

              {/* Decorative geometric accent */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-10">
                <CircleDot className="h-24 w-24 text-[var(--color-gold)]" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
