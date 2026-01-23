"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { DelightMoment } from "@/lib/signal/delight";
import { SIGNAL_TIMING } from "./animation-config";

export interface DelightToastProps {
  delight: DelightMoment | null;
  onDismiss: () => void;
  /** Auto-dismiss after duration (ms). Default: 5000 */
  duration?: number;
}

/**
 * Toast notification for delight moments.
 * Slides in from top, auto-dismisses after duration.
 */
export function DelightToast({
  delight,
  onDismiss,
  duration = 5000,
}: DelightToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Set up auto-dismiss timer when delight changes
  useEffect(() => {
    if (delight) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Set up auto-dismiss
      timerRef.current = setTimeout(onDismiss, duration);
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [delight, duration, onDismiss]);

  const handleClick = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onDismiss();
  };

  return (
    <AnimatePresence>
      {delight && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: SIGNAL_TIMING.small, ease: "easeOut" }}
          onClick={handleClick}
          className="fixed left-1/2 top-20 z-50 -translate-x-1/2 cursor-pointer"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3 rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-4 py-3 shadow-lg backdrop-blur-sm">
            {/* Icon */}
            <span
              className="text-2xl"
              role="img"
              aria-label={delight.type.replace("_", " ")}
            >
              {delight.icon}
            </span>

            {/* Content */}
            <div className="min-w-0">
              <p className="font-heading text-sm font-medium tracking-wide text-[var(--color-gold)]">
                {delight.title}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {delight.message}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="absolute bottom-0 left-4 right-4 h-0.5 origin-left rounded-full bg-[var(--color-gold)]/40"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
