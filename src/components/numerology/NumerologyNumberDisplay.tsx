"use client";

import { useState } from "react";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import { getNumberMeaning, isMasterNumber } from "@/lib/numerology";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

const TYPE_DESCRIPTIONS: Record<NumerologyNumberDisplayProps["type"], string> = {
  lifePath: "Your Life Path number reveals your core purpose and the lessons you're here to learn. It's calculated from your full birth date.",
  expression: "Your Expression number shows your natural talents and abilities. It's derived from all the letters in your birth name.",
  soulUrge: "Your Soul Urge (Heart's Desire) reveals your inner motivations and what truly fulfills you. It comes from the vowels in your birth name.",
  personality: "Your Personality number shows how others perceive you and the face you show the world. It's calculated from the consonants in your birth name.",
  birthday: "Your Birthday number is a secondary influence that adds flavor to your personality. It's simply the day of the month you were born.",
  maturity: "Your Maturity number reveals the person you're becoming, especially after age 40. It's the sum of your Life Path and Expression numbers.",
  personalYear: "Your Personal Year indicates the themes and opportunities for the current year in your 9-year cycle.",
  personalMonth: "Your Personal Month shows the specific focus and energy of this month within your Personal Year.",
  personalDay: "Your Personal Day reveals the subtle energy and opportunities available today.",
};

// URL segments for position types that have dedicated pages
const TYPE_URL_SEGMENTS: Partial<
  Record<NumerologyNumberDisplayProps["type"], string>
> = {
  lifePath: "life-path",
  expression: "expression",
  soulUrge: "soul-urge",
  personality: "personality",
  birthday: "birthday",
  maturity: "maturity",
};

// Cycle types keep dialog behavior (no dedicated pages)
const CYCLE_TYPES: NumerologyNumberDisplayProps["type"][] = [
  "personalYear",
  "personalMonth",
  "personalDay",
];

function getNumberPageUrl(
  type: NumerologyNumberDisplayProps["type"],
  digit: number
): string | null {
  const segment = TYPE_URL_SEGMENTS[type];
  if (!segment) return null;
  return `/numbers/${segment}/${digit}`;
}

/**
 * Display a single numerology number with its archetype name and meaning.
 * Supports hero (Life Path), standard (grid items), and compact (cycles) variants.
 * Clicking opens a dialog with extended meaning.
 */
export function NumerologyNumberDisplay({
  digit,
  type,
  locked = false,
  variant = "standard",
  className,
}: NumerologyNumberDisplayProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const meaning = digit ? getNumberMeaning(digit) : null;
  const label = TYPE_LABELS[type];
  const typeDescription = TYPE_DESCRIPTIONS[type];
  const isMaster = digit ? isMasterNumber(digit) : false;
  const isClickable = !locked && digit !== null && meaning;

  // Determine if this type should link to a page or use a dialog
  const isCycleType = CYCLE_TYPES.includes(type);
  const pageUrl = digit !== null ? getNumberPageUrl(type, digit) : null;
  const shouldLink = isClickable && !isCycleType && pageUrl;

  // Hero variant - large centered display for Life Path
  if (variant === "hero") {
    const heroContent = (
      <>
        <Text
          size="1"
          weight="medium"
          className="mb-2 block uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </Text>
        {locked || digit === null ? (
          <div className="text-7xl font-display text-muted-foreground/30">—</div>
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
              <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted-foreground">
                {meaning.brief}
              </p>
            )}
          </>
        )}
      </>
    );

    // Link to dedicated page for position types
    if (shouldLink) {
      return (
        <Link
          href={pageUrl}
          className={cn(
            "block w-full text-center transition-opacity hover:opacity-80",
            className
          )}
        >
          {heroContent}
        </Link>
      );
    }

    // Dialog for cycle types
    return (
      <>
        <button
          type="button"
          onClick={() => isClickable && setDialogOpen(true)}
          disabled={!isClickable}
          className={cn(
            "w-full text-center",
            isClickable && "cursor-pointer transition-opacity hover:opacity-80",
            className
          )}
        >
          {heroContent}
        </button>

        {meaning && isCycleType && (
          <NumberMeaningDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            digit={digit!}
            label={label}
            typeDescription={typeDescription}
            meaning={meaning}
          />
        )}
      </>
    );
  }

  // Compact variant - inline display for cycles (clickable)
  if (variant === "compact") {
    const compactContent = (
      <>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "font-display text-lg font-medium",
            digit === null ? "text-muted-foreground/30" : "text-foreground"
          )}
        >
          {digit ?? "—"}
        </span>
      </>
    );

    // Link to dedicated page for position types
    if (shouldLink) {
      return (
        <Link
          href={pageUrl}
          className={cn(
            "inline-flex items-center gap-1 transition-opacity hover:opacity-80",
            className
          )}
        >
          {compactContent}
        </Link>
      );
    }

    // Dialog for cycle types
    return (
      <>
        <button
          type="button"
          onClick={() => isClickable && setDialogOpen(true)}
          disabled={!isClickable}
          className={cn(
            "inline-flex items-center gap-1",
            isClickable && "cursor-pointer transition-opacity hover:opacity-80",
            className
          )}
        >
          {compactContent}
        </button>

        {meaning && isCycleType && (
          <NumberMeaningDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            digit={digit!}
            label={label}
            typeDescription={typeDescription}
            meaning={meaning}
          />
        )}
      </>
    );
  }

  // Standard variant - card-style display
  const standardContent = (
    <>
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
    </>
  );

  // Link to dedicated page for position types
  if (shouldLink) {
    return (
      <Link
        href={pageUrl}
        className={cn(
          "block w-full text-center transition-opacity hover:opacity-80",
          className
        )}
      >
        {standardContent}
      </Link>
    );
  }

  // Dialog for cycle types or locked/empty states
  return (
    <>
      <button
        type="button"
        onClick={() => isClickable && setDialogOpen(true)}
        disabled={!isClickable}
        className={cn(
          "w-full text-center",
          locked && "cursor-default opacity-60",
          isClickable && "cursor-pointer transition-opacity hover:opacity-80",
          className
        )}
        aria-disabled={locked}
      >
        {standardContent}
      </button>

      {meaning && isCycleType && (
        <NumberMeaningDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          digit={digit!}
          label={label}
          typeDescription={typeDescription}
          meaning={meaning}
        />
      )}
    </>
  );
}

/**
 * Dialog showing the full meaning of a numerology number
 */
function NumberMeaningDialog({
  open,
  onOpenChange,
  digit,
  label,
  typeDescription,
  meaning,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  digit: number;
  label: string;
  typeDescription: string;
  meaning: NonNullable<ReturnType<typeof getNumberMeaning>>;
}) {
  const isMaster = isMasterNumber(digit);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-3">
            <span
              className={cn(
                "font-display text-5xl",
                isMaster ? "text-[var(--color-gold)]" : "text-foreground"
              )}
            >
              {digit}
            </span>
            <div>
              <DialogTitle className="text-left font-display text-xl text-[var(--color-gold)]">
                {meaning.name}
              </DialogTitle>
              <Text size="1" className="text-muted-foreground">
                {label} Number
              </Text>
            </div>
          </div>
          <DialogDescription className="text-left">
            {typeDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Keywords */}
          <div className="flex flex-wrap gap-2">
            {meaning.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 px-3 py-1 text-xs text-[var(--color-gold)]"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* Extended meaning */}
          <div className="space-y-3 text-sm text-muted-foreground">
            {meaning.extended.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
