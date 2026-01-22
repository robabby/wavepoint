"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/util/routes";
import { EASE_STANDARD } from "@/lib/animation-constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Geometries dropdown for desktop navigation.
 * Shows "Geometries" trigger with dropdown containing Platonic Solids and Patterns links.
 * Active state matches existing AnimatedNavLink styling.
 */
export function GeometriesDropdown() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/geometries");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group relative flex cursor-pointer items-center gap-1 text-xs font-medium transition-colors sm:text-sm",
          "hover:text-[var(--color-gold)] focus:outline-none focus-visible:text-[var(--color-gold)]",
          isActive ? "text-[var(--color-gold)]" : "text-muted-foreground"
        )}
      >
        <span>Geometries</span>
        <ChevronDown className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />

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
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={12}
        className={cn(
          // Glass background with depth
          "bg-[var(--glass-bg)] backdrop-blur-xl",
          // Refined gold border
          "border border-[var(--glass-border)]",
          // Layered shadow for depth
          "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          // Sizing
          "min-w-[220px] p-2"
        )}
      >
        <DropdownMenuItem asChild>
          <Link
            href={ROUTES.platonicSolids.path}
            className={cn(
              // Layout with left border space
              "group relative flex cursor-pointer items-center gap-3 py-3 pl-5 pr-4",
              // Typography - elegant serif
              "font-heading text-sm tracking-wide",
              // Force override all background states
              "!bg-transparent",
              // Force text colors (override base component)
              pathname.startsWith(ROUTES.platonicSolids.path)
                ? "!text-[var(--color-gold)]"
                : "!text-muted-foreground hover:!text-[var(--color-gold)] focus:!text-[var(--color-gold)]",
              // Smooth transitions
              "transition-all duration-200",
              "focus:outline-none"
            )}
          >
            {/* Left border accent - appears on hover/active */}
            <span
              className={cn(
                "absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full transition-all duration-200",
                pathname.startsWith(ROUTES.platonicSolids.path)
                  ? "bg-[var(--color-gold)] shadow-[0_0_8px_var(--glow-gold)]"
                  : "bg-transparent group-hover:bg-[var(--color-gold)]/60"
              )}
            />
            Platonic Solids
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={ROUTES.patterns.path}
            className={cn(
              // Layout with left border space
              "group relative flex cursor-pointer items-center gap-3 py-3 pl-5 pr-4",
              // Typography - elegant serif
              "font-heading text-sm tracking-wide",
              // Force override all background states
              "!bg-transparent",
              // Force text colors (override base component)
              pathname.startsWith(ROUTES.patterns.path)
                ? "!text-[var(--color-gold)]"
                : "!text-muted-foreground hover:!text-[var(--color-gold)] focus:!text-[var(--color-gold)]",
              // Smooth transitions
              "transition-all duration-200",
              "focus:outline-none"
            )}
          >
            {/* Left border accent - appears on hover/active */}
            <span
              className={cn(
                "absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full transition-all duration-200",
                pathname.startsWith(ROUTES.patterns.path)
                  ? "bg-[var(--color-gold)] shadow-[0_0_8px_var(--glow-gold)]"
                  : "bg-transparent group-hover:bg-[var(--color-gold)]/60"
              )}
            />
            Patterns
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
