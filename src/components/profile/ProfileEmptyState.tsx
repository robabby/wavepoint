"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { Sparkles } from "lucide-react";
import { AnimatedCard } from "@/components/animated-card";

/**
 * Empty state shown when user hasn't set up their profile yet.
 */
export function ProfileEmptyState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <AnimatedCard className="max-w-md p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold)]/10">
            <Sparkles className="h-8 w-8 text-[var(--color-gold)]" />
          </div>
        </div>

        <Heading size="6" className="mb-3 font-display text-foreground">
          Discover your cosmic blueprint
        </Heading>

        <Text className="mb-6 text-muted-foreground">
          Your birth chart is a snapshot of the sky at the moment you were born.
          It influences how you interpret the numbers you notice.
        </Text>

        <Link
          href="/settings#birth-data"
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-gold)]/10 px-6 py-3 text-sm font-medium text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)]/20"
        >
          Set up your profile
        </Link>
      </AnimatedCard>
    </div>
  );
}
