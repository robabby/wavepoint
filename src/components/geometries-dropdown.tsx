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
          "group relative flex items-center gap-1 text-xs font-medium transition-colors sm:text-sm",
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
          // Glass background matching mobile drawer aesthetic
          "bg-[var(--glass-bg)] backdrop-blur-xl",
          // Gold border with subtle shadow
          "border-[var(--glass-border)]",
          "shadow-lg shadow-black/20",
          "min-w-[180px]"
        )}
      >
        <DropdownMenuItem asChild>
          <Link
            href={ROUTES.platonicSolids.path}
            className={cn(
              "cursor-pointer px-3 py-2.5 text-sm",
              "text-muted-foreground",
              "focus:bg-[var(--glass-bg-elevated)] focus:text-[var(--color-gold)]",
              pathname.startsWith(ROUTES.platonicSolids.path) &&
                "text-[var(--color-gold)]"
            )}
          >
            Platonic Solids
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={ROUTES.patterns.path}
            className={cn(
              "cursor-pointer px-3 py-2.5 text-sm",
              "text-muted-foreground",
              "focus:bg-[var(--glass-bg-elevated)] focus:text-[var(--color-gold)]",
              pathname.startsWith(ROUTES.patterns.path) &&
                "text-[var(--color-gold)]"
            )}
          >
            Patterns
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
