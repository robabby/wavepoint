"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarCaptureButtonProps {
  isCollapsed?: boolean;
  className?: string;
}

/**
 * Primary CTA button for capturing a new sighting.
 * Gold accent styling to stand out in the sidebar.
 */
export function SidebarCaptureButton({
  isCollapsed = false,
  className,
}: SidebarCaptureButtonProps) {
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("px-3", className)}>
              <Link
                href="/capture"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  "bg-[var(--color-gold)] text-[var(--color-obsidian)]",
                  "transition-all duration-200",
                  "hover:bg-[var(--color-gold-bright)] hover:shadow-[0_0_20px_var(--glow-gold)]"
                )}
              >
                <Plus className="h-5 w-5" />
              </Link>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-body">
            Capture Sighting
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn("px-4", className)}>
      <Link
        href="/capture"
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5",
          "bg-[var(--color-gold)] text-[var(--color-obsidian)]",
          "font-body text-sm font-medium",
          "transition-all duration-200",
          "hover:bg-[var(--color-gold-bright)] hover:shadow-[0_0_20px_var(--glow-gold)]"
        )}
      >
        <Plus className="h-4 w-4" />
        <span>Capture</span>
      </Link>
    </div>
  );
}
