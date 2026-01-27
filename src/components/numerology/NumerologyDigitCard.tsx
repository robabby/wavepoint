"use client";

import Link from "next/link";
import { Text } from "@radix-ui/themes";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNumberMeaning, isMasterNumber, formatPositionList, type CoreNumberType } from "@/lib/numerology";
import { AnimatedCard } from "@/components/animated-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NumerologyDigitCardProps {
  /** The digit to display (1-9, 11, 22, 33) */
  digit: number;
  /** Whether this digit is one of the user's numbers */
  isUserDigit?: boolean;
  /** Which positions this digit appears in for the user */
  userPositions?: CoreNumberType[];
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Card displaying a numerology digit archetype.
 * Links to /numbers/digit/[digit] for the full archetype page.
 * Shows large digit with glow, archetype name, and keywords.
 */
export function NumerologyDigitCard({
  digit,
  isUserDigit = false,
  userPositions = [],
  className,
}: NumerologyDigitCardProps) {
  const meaning = getNumberMeaning(digit);
  const isMaster = isMasterNumber(digit);

  if (!meaning) return null;

  // Take first 2-3 keywords for display
  const displayKeywords = meaning.keywords.slice(0, 3);

  // Format the positions for the tooltip
  const positionText = userPositions.length > 0
    ? `Your ${formatPositionList(userPositions)}`
    : null;

  return (
    <Link href={`/numbers/digit/${digit}`} className="block h-full">
      <AnimatedCard
        className={cn(
          "relative flex h-full flex-col items-center justify-between p-4 sm:p-6 text-center overflow-hidden",
          className
        )}
      >
        {/* User indicator - subtle inner glow effect */}
        {isUserDigit && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              boxShadow: "inset 0 0 30px var(--glow-gold), inset 0 0 60px rgba(212, 175, 55, 0.1)",
            }}
          />
        )}

        {/* Tooltip explaining why highlighted */}
        {isUserDigit && positionText && (
          <Tooltip>
            <TooltipTrigger
              asChild
              onClick={(e) => e.preventDefault()}
            >
              <button
                className="absolute top-2 left-2 z-10 p-1 rounded-full text-[var(--color-gold)]/60 hover:text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-colors"
                aria-label="Why is this highlighted?"
              >
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4}>
              {positionText}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Large digit with glow - aligned top */}
        <div
          className={cn(
            "font-display text-5xl sm:text-6xl",
            isMaster
              ? "text-[var(--color-gold)]"
              : "text-foreground",
            isUserDigit && "text-[var(--color-gold)]"
          )}
          style={{
            textShadow: isMaster || isUserDigit
              ? "0 0 40px var(--glow-gold), 0 0 60px var(--glow-gold)"
              : "0 0 30px var(--glow-gold)",
          }}
        >
          {digit}
        </div>

        {/* Bottom content - anchored together */}
        <div className="mt-auto pt-4">
          {/* Archetype name */}
          <Text
            size="2"
            weight="medium"
            className="font-display text-[var(--color-gold)] block mb-1"
          >
            {meaning.name}
          </Text>

          {/* Keywords */}
          <Text size="1" className="text-muted-foreground">
            {displayKeywords.join(" · ")}
          </Text>
        </div>
      </AnimatedCard>
    </Link>
  );
}
