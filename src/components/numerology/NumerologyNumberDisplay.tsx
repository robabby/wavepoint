"use client";

import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import { getNumberMeaning, isMasterNumber } from "@/lib/numerology";

export type NumberDisplayVariant = "hero" | "standard" | "compact";

interface NumerologyNumberDisplayProps {
  digit: number | null;
  type:
    | "lifePath"
    | "expression"
    | "soulUrge"
    | "personality"
    | "birthday"
    | "maturity"
    | "personalYear"
    | "personalMonth"
    | "personalDay";
  locked?: boolean;
  variant?: NumberDisplayVariant;
  className?: string;
}

const TYPE_LABELS: Record<NumerologyNumberDisplayProps["type"], string> = {
  lifePath: "Life Path",
  expression: "Expression",
  soulUrge: "Soul Urge",
  personality: "Personality",
  birthday: "Birthday",
  maturity: "Maturity",
  personalYear: "Year",
  personalMonth: "Month",
  personalDay: "Day",
};

/**
 * Display a single numerology number with its archetype name and meaning.
 * Supports hero (Life Path), standard (grid items), and compact (cycles) variants.
 */
export function NumerologyNumberDisplay({
  digit,
  type,
  locked = false,
  variant = "standard",
  className,
}: NumerologyNumberDisplayProps) {
  const meaning = digit ? getNumberMeaning(digit) : null;
  const label = TYPE_LABELS[type];
  const isMaster = digit ? isMasterNumber(digit) : false;

  // Hero variant - large centered display for Life Path
  if (variant === "hero") {
    return (
      <div className={cn("text-center", className)}>
        <Text
          size="1"
          weight="medium"
          className="mb-2 block uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </Text>
        {locked || digit === null ? (
          <>
            <div className="text-7xl font-display text-muted-foreground/30">—</div>
          </>
        ) : (
          <>
            <div
              className={cn(
                "font-display text-7xl text-foreground",
                isMaster && "text-[var(--color-gold)]"
              )}
              style={{
                textShadow: "0 0 40px var(--glow-gold)",
              }}
            >
              {digit}
            </div>
            {meaning && (
              <Heading
                size="4"
                className="mt-2 font-display text-[var(--color-gold)]"
              >
                {meaning.name}
              </Heading>
            )}
            {meaning && (
              <Text
                size="2"
                className="mt-2 block max-w-md text-muted-foreground"
              >
                {meaning.brief}
              </Text>
            )}
          </>
        )}
      </div>
    );
  }

  // Compact variant - inline display for cycles
  if (variant === "compact") {
    return (
      <span className={cn("inline-flex items-center gap-1", className)}>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "font-display text-lg font-medium",
            digit === null
              ? "text-muted-foreground/30"
              : "text-foreground"
          )}
        >
          {digit ?? "—"}
        </span>
      </span>
    );
  }

  // Standard variant - card-style display
  return (
    <div
      className={cn(
        "text-center",
        locked && "cursor-default opacity-60",
        className
      )}
      aria-disabled={locked}
    >
      <Text
        size="1"
        weight="medium"
        className="mb-1 block uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </Text>
      {locked || digit === null ? (
        <div className="text-4xl font-display text-muted-foreground/30">—</div>
      ) : (
        <>
          <div
            className={cn(
              "font-display text-4xl",
              isMaster ? "text-[var(--color-gold)]" : "text-foreground"
            )}
          >
            {digit}
          </div>
          {meaning && (
            <Text size="1" className="mt-1 text-muted-foreground">
              {meaning.name}
            </Text>
          )}
        </>
      )}
    </div>
  );
}
