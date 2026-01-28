"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { CircleDot, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/sidebar";
import { EASE_STANDARD } from "@/lib/animation-constants";
import { SidebarUserSection } from "./sidebar-user-section";
import { SidebarMoonPhase } from "./sidebar-moon-phase";
import { SidebarCaptureButton } from "./sidebar-capture-button";
import { SidebarNav } from "./sidebar-nav";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// =============================================================================
// Types
// =============================================================================

interface AppSidebarProps {
  email: string;
  isAdmin?: boolean;
  onSignOut: () => void;
  className?: string;
}

// =============================================================================
// Constants
// =============================================================================

const SIDEBAR_WIDTH_EXPANDED = 288; // w-72
const SIDEBAR_WIDTH_COLLAPSED = 64; // w-16

// =============================================================================
// Component
// =============================================================================

/**
 * Desktop persistent sidebar for authenticated users.
 *
 * Features:
 * - User identity section
 * - Moon phase display with animated glow
 * - Capture CTA button
 * - Practice and Account navigation
 * - Collapsible to icon rail
 */
export function AppSidebar({
  email,
  isAdmin = false,
  onSignOut,
  className,
}: AppSidebarProps) {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r lg:flex",
        "bg-[var(--sidebar)] border-[var(--sidebar-border)]",
        className
      )}
      initial={false}
      animate={{
        width: isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
      }}
      transition={{
        duration: 0.2,
        ease: EASE_STANDARD,
      }}
    >
      {/* Header with logo and collapse toggle */}
      {/* h-[65px] matches main header: h-16 (64px) content + 1px border */}
      <div
        className={cn(
          "flex h-[65px] shrink-0 items-center border-b border-[var(--sidebar-border)]",
          isCollapsed ? "justify-center" : "justify-between px-4"
        )}
      >
        {/* Logo - collapses to icon only */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <CircleDot className="h-5 w-5 shrink-0 text-[var(--color-gold)]" />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15, ease: EASE_STANDARD }}
                className="overflow-hidden whitespace-nowrap font-display text-lg tracking-wide text-foreground"
              >
                WAVE<span className="text-[var(--color-gold)]">POINT</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Collapse toggle */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={toggle}
                      aria-expanded={!isCollapsed}
                      aria-label="Collapse sidebar"
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        "text-muted-foreground transition-colors",
                        "hover:bg-[var(--sidebar-accent)] hover:text-foreground"
                      )}
                    >
                      <PanelLeftClose className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-body">
                    Collapse sidebar
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrollable content */}
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden py-4">
        {/* Capture button */}
        <SidebarCaptureButton isCollapsed={isCollapsed} />

        {/* Divider */}
        <div className="my-3 border-t border-[var(--sidebar-border)]" />

        {/* Moon phase (links to today's calendar) */}
        <SidebarMoonPhase isCollapsed={isCollapsed} />

        {/* User section (links to profile) */}
        <SidebarUserSection email={email} isCollapsed={isCollapsed} />

        {/* Divider */}
        <div className="my-3 border-t border-[var(--sidebar-border)]" />

        {/* Navigation */}
        <SidebarNav
          isAdmin={isAdmin}
          isCollapsed={isCollapsed}
          onSignOut={onSignOut}
          className="flex-1"
        />
      </div>

      {/* Expand toggle (only visible when collapsed) */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="shrink-0 border-t border-[var(--sidebar-border)] p-3"
          >
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggle}
                    aria-expanded={!isCollapsed}
                    aria-label="Expand sidebar"
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      "text-muted-foreground transition-colors",
                      "hover:bg-[var(--sidebar-accent)] hover:text-foreground"
                    )}
                  >
                    <PanelLeft className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-body">
                  Expand sidebar
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}

/**
 * Spacer component for main content area.
 * Provides the correct margin-left based on sidebar state.
 */
export function SidebarSpacer({ className }: { className?: string }) {
  const { isCollapsed } = useSidebar();

  return (
    <motion.div
      className={cn("hidden lg:block shrink-0", className)}
      initial={false}
      animate={{
        width: isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
      }}
      transition={{
        duration: 0.2,
        ease: EASE_STANDARD,
      }}
      aria-hidden="true"
    />
  );
}
