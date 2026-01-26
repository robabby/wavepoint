"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfilePromptCardProps {
  /** Optional custom title (default: "Unlock Personalized Insights") */
  title?: string;
  /** Optional custom description */
  description?: string;
  /** Optional custom link text (default: "Create your profile") */
  linkText?: string;
  /** Optional className */
  className?: string;
}

/**
 * Inviting card prompting users without a profile to create one.
 * Used across features (Signal, Calendar) for users who haven't set up their cosmic profile.
 */
export function ProfilePromptCard({
  title = "Unlock Personalized Insights",
  description = "Add your birth details to see how angel numbers connect to your cosmic blueprint.",
  linkText = "Create your profile",
  className,
}: ProfilePromptCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg",
        "border border-[var(--border-gold)]/30 bg-card/50",
        className
      )}
    >
      {/* Left accent gradient */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-[var(--color-gold)] via-[var(--color-copper)] to-[var(--color-gold)]" />

      <div className="flex items-start gap-4 p-4 pl-5">
        {/* Animated sparkles icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-0.5 flex-shrink-0"
        >
          <Sparkles className="h-5 w-5 text-[var(--color-gold)]" />
        </motion.div>

        <div className="flex-1">
          <h3 className="font-heading text-base text-[var(--color-gold)]">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
          <Link
            href="/profile"
            className={cn(
              "mt-3 inline-flex items-center gap-1 text-sm",
              "text-[var(--color-gold)] transition-colors",
              "hover:text-[var(--color-gold-bright)]"
            )}
          >
            {linkText}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
