"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlternativeAttribution } from "@/lib/archetypes";
import { EASE_STANDARD } from "@/lib/animation-constants";

interface AlternativeAttributionsProps {
  attributions: AlternativeAttribution[];
  className?: string;
}

/**
 * Collapsible section displaying alternative attributions from other esoteric traditions.
 * Collapsed by default to not compete with primary attribution.
 */
export function AlternativeAttributions({
  attributions,
  className,
}: AlternativeAttributionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (attributions.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-[var(--border-gold)]/10 bg-card/30",
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between px-4 py-3",
          "text-sm text-muted-foreground transition-colors",
          "hover:text-foreground"
        )}
        aria-expanded={isOpen}
        aria-controls="alternative-attributions-content"
      >
        <span>Alternative Traditions</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: EASE_STANDARD }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="alternative-attributions-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_STANDARD }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-4 pb-4">
              {attributions.map((alt) => (
                <div
                  key={`${alt.tradition}-${alt.value}`}
                  className="flex flex-col gap-0.5"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-[var(--color-copper)]">
                      {alt.tradition}
                    </span>
                    <span className="text-muted-foreground/50">→</span>
                    <span className="text-muted-foreground">{alt.value}</span>
                  </div>
                  {alt.note && (
                    <p className="text-xs text-muted-foreground/70 italic">
                      {alt.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
