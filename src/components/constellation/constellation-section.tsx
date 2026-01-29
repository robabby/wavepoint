"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X, RotateCcw, Plus, Search } from "lucide-react";
import { Heading } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import {
  useConstellation,
  useUpdateConstellationStatus,
  useAddConstellation,
} from "@/hooks/constellation";
import { getArchetypeBySlug, ARCHETYPE_SLUGS } from "@/lib/archetypes";
import type { Archetype } from "@/lib/archetypes";
import { getMajorArcanaBySlug, MAJOR_ARCANA_SLUGS } from "@/lib/tarot";
import type { MajorArcanaCard } from "@/lib/tarot";
import { ELEMENT_STYLES, DEFAULT_ELEMENT_STYLE } from "@/lib/theme/element-styles";
import { TAROT_STYLES } from "@/lib/theme/tarot-styles";
import { ArchetypeGlyph } from "@/components/archetypes/ArchetypeGlyph";
import { TarotCardFrame } from "@/components/tarot/TarotCardFrame";
import { EASE_STANDARD } from "@/lib/animation-constants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  staggerContainerVariants,
  fadeUpVariants,
} from "@/components/signal/animation-config";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import type { ConstellationEntry } from "@/lib/constellation";

const PLANET_SYMBOLS: Record<string, string> = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "⛢",
  neptune: "♆",
};

function formatProvenance(derivedFrom: string | null): string {
  if (!derivedFrom) return "";
  if (derivedFrom.startsWith("birth-date:")) return "via birth date";
  // e.g. "life-path:9" → "via Life Path 9"
  const [position, digit] = derivedFrom.split(":");
  if (!position || !digit) return "";
  const label = position
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `via ${label} ${digit}`;
}

/**
 * Self-contained constellation section for the profile page.
 */
export function ConstellationSection() {
  const { entries, isLoading } = useConstellation();
  const { updateStatus } = useUpdateConstellationStatus();
  const { addEntry } = useAddConstellation();
  const [isEditing, setIsEditing] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const jungianEntries = useMemo(
    () => entries.filter((e) => e.system === "jungian"),
    [entries]
  );
  const tarotEntries = useMemo(
    () => entries.filter((e) => e.system === "tarot"),
    [entries]
  );

  const hasIncompleteProfile = useMemo(() => {
    // Check if there are no entries at all or only partial
    return entries.length === 0 && !isLoading;
  }, [entries, isLoading]);

  if (isLoading) {
    return (
      <section
        role="region"
        aria-label="Your Archetypal Constellation"
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="h-7 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-[var(--border-gold)]/10 bg-card/20"
            />
          ))}
        </div>
      </section>
    );
  }

  if (entries.length === 0) {
    return (
      <section
        role="region"
        aria-label="Your Archetypal Constellation"
        className="rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-6 text-center"
      >
        <Heading
          size="4"
          className="mb-2 font-display text-[var(--color-gold)]"
        >
          Your Archetypal Constellation
        </Heading>
        <p className="text-sm text-muted-foreground">
          Add your birth data to discover your archetypal constellation.
        </p>
        <Link
          href="/settings#birth-data"
          className="mt-3 inline-block text-sm text-[var(--color-gold)] hover:underline"
        >
          Add birth data →
        </Link>
      </section>
    );
  }

  return (
    <section role="region" aria-label="Your Archetypal Constellation" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Heading
          size="4"
          className="font-display text-[var(--color-gold)]"
        >
          Your Archetypal Constellation
        </Heading>
        <button
          onClick={() => setIsEditing(!isEditing)}
          aria-pressed={isEditing}
          className="text-xs text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
        >
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>

      {/* Confidence banner for incomplete profile */}
      {hasIncompleteProfile && (
        <div className="rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 px-4 py-2">
          <p className="text-xs text-muted-foreground">
            Add your full birth data for a complete constellation.{" "}
            <Link
              href="/settings#birth-data"
              className="text-[var(--color-gold)] hover:underline"
            >
              Update birth data →
            </Link>
          </p>
        </div>
      )}

      {/* Archetypes group */}
      {jungianEntries.length > 0 && (
        <div>
          <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
            Archetypes
          </p>
          <motion.div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3"
            variants={prefersReducedMotion ? undefined : staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {jungianEntries.map((entry) => (
                <JungianItem
                  key={entry.identifier}
                  entry={entry}
                  isEditing={isEditing}
                  onDismiss={() =>
                    void updateStatus({
                      system: "jungian",
                      identifier: entry.identifier,
                      status: "dismissed",
                    })
                  }
                  onRestore={() =>
                    void updateStatus({
                      system: "jungian",
                      identifier: entry.identifier,
                      status: "active",
                    })
                  }
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Tarot Birth Cards group */}
      {tarotEntries.length > 0 && (
        <div>
          <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
            Birth Cards
          </p>
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            variants={prefersReducedMotion ? undefined : staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {tarotEntries.map((entry) => (
                <TarotItem
                  key={entry.identifier}
                  entry={entry}
                  isEditing={isEditing}
                  onDismiss={() =>
                    void updateStatus({
                      system: "tarot",
                      identifier: entry.identifier,
                      status: "dismissed",
                    })
                  }
                  onRestore={() =>
                    void updateStatus({
                      system: "tarot",
                      identifier: entry.identifier,
                      status: "active",
                    })
                  }
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Add picker in edit mode */}
      {isEditing && (
        <AddPicker
          existingIdentifiers={entries.map((e) => e.identifier)}
          onAdd={(system, identifier) => void addEntry({ system, identifier })}
        />
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Jungian archetype item
// ---------------------------------------------------------------------------

function JungianItem({
  entry,
  isEditing,
  onDismiss,
  onRestore,
  prefersReducedMotion,
}: {
  entry: ConstellationEntry;
  isEditing: boolean;
  onDismiss: () => void;
  onRestore: () => void;
  prefersReducedMotion: boolean;
}) {
  const archetype = getArchetypeBySlug(entry.identifier) as Archetype | undefined;
  if (!archetype) return null;

  const styles = ELEMENT_STYLES[archetype.element] ?? DEFAULT_ELEMENT_STYLE;
  const planetSymbol = PLANET_SYMBOLS[archetype.planet] ?? "";
  const isDismissed = entry.status === "dismissed";
  const provenance = formatProvenance(entry.derivedFrom);

  return (
    <motion.div
      layout
      variants={prefersReducedMotion ? undefined : fadeUpVariants}
      exit={
        prefersReducedMotion
          ? undefined
          : { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: EASE_STANDARD } }
      }
      className={cn(
        "group relative rounded-xl border p-3",
        "bg-card/30 transition-colors",
        isDismissed
          ? "border-dashed border-[var(--border-gold)]/10 opacity-40"
          : "border-[var(--border-gold)]/20"
      )}
    >
      <div className="flex items-start gap-3">
        <ArchetypeGlyph glyph={planetSymbol} element={archetype.element} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-sm tracking-wide text-foreground">
              {archetype.name.toUpperCase()}
            </h4>
            {isEditing && (
              <button
                onClick={isDismissed ? onRestore : onDismiss}
                aria-label={
                  isDismissed
                    ? `Restore ${archetype.name} to constellation`
                    : `Dismiss ${archetype.name} from constellation`
                }
                className="ml-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {isDismissed ? (
                  <RotateCcw className="h-3.5 w-3.5" />
                ) : (
                  <X className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
          {provenance && (
            <p className="font-heading text-xs text-muted-foreground">
              {provenance}
            </p>
          )}
          <p className="text-xs text-[var(--color-gold-bright)]/80">
            {archetype.keywords.slice(0, 3).join(" · ")}
          </p>
        </div>
      </div>

      {/* Hover glow */}
      {!isDismissed && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at center, ${styles.glowColor} 0%, transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Tarot birth card item
// ---------------------------------------------------------------------------

function TarotItem({
  entry,
  isEditing,
  onDismiss,
  onRestore,
  prefersReducedMotion,
}: {
  entry: ConstellationEntry;
  isEditing: boolean;
  onDismiss: () => void;
  onRestore: () => void;
  prefersReducedMotion: boolean;
}) {
  const card = getMajorArcanaBySlug(entry.identifier) as MajorArcanaCard | undefined;
  if (!card) return null;

  const isDismissed = entry.status === "dismissed";
  const provenance = formatProvenance(entry.derivedFrom);

  return (
    <motion.div
      layout
      variants={prefersReducedMotion ? undefined : fadeUpVariants}
      exit={
        prefersReducedMotion
          ? undefined
          : { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: EASE_STANDARD } }
      }
      className={cn(
        "group relative rounded-xl border p-3",
        "transition-colors",
        isDismissed
          ? "border-dashed border-[var(--border-gold)]/10 opacity-40 bg-card/30"
          : "border-[var(--border-gold)]/20 bg-gradient-to-br from-[#1a1408] to-[#0d0a04]"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Miniature tarot card thumbnail */}
        <div className="shrink-0">
          <TarotCardFrame className="w-12 rounded-md">
            <div
              className="relative overflow-hidden rounded"
              style={{ aspectRatio: "2 / 3" }}
            >
              <Image
                src={card.imagePath}
                alt={`${card.name} tarot card`}
                fill
                sizes="48px"
                className="object-cover object-top"
              />
            </div>
          </TarotCardFrame>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-sm tracking-wide" style={{ color: TAROT_STYLES.colors.goldBright }}>
              {card.romanNumeral} {card.name.toUpperCase()}
            </h4>
            {isEditing && (
              <button
                onClick={isDismissed ? onRestore : onDismiss}
                aria-label={
                  isDismissed
                    ? `Restore ${card.name} to constellation`
                    : `Dismiss ${card.name} from constellation`
                }
                className="ml-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {isDismissed ? (
                  <RotateCcw className="h-3.5 w-3.5" />
                ) : (
                  <X className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
          {provenance && (
            <p className="font-heading text-xs text-muted-foreground">
              {provenance}
            </p>
          )}
          <p
            className="text-xs"
            style={{ color: TAROT_STYLES.colors.gold, opacity: 0.8 }}
          >
            {card.keywords.slice(0, 3).join(" · ")}
          </p>
        </div>
      </div>

      {/* Hover glow */}
      {!isDismissed && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at center, ${TAROT_STYLES.card.glowColor} 0%, transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Add picker (edit mode)
// ---------------------------------------------------------------------------

function AddPicker({
  existingIdentifiers,
  onAdd,
}: {
  existingIdentifiers: string[];
  onAdd: (system: "jungian" | "tarot", identifier: string) => void;
}) {
  const [search, setSearch] = useState("");

  const existing = useMemo(
    () => new Set(existingIdentifiers),
    [existingIdentifiers]
  );

  const archetypeOptions = useMemo(() => {
    return ARCHETYPE_SLUGS.filter((slug) => !existing.has(slug))
      .map((slug) => getArchetypeBySlug(slug))
      .filter(Boolean) as Archetype[];
  }, [existing]);

  const tarotOptions = useMemo(() => {
    return MAJOR_ARCANA_SLUGS.filter((slug) => !existing.has(slug))
      .map((slug) => getMajorArcanaBySlug(slug))
      .filter(Boolean) as MajorArcanaCard[];
  }, [existing]);

  const filteredArchetypes = useMemo(() => {
    if (!search) return archetypeOptions;
    const q = search.toLowerCase();
    return archetypeOptions.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [archetypeOptions, search]);

  const filteredTarot = useMemo(() => {
    if (!search) return tarotOptions;
    const q = search.toLowerCase();
    return tarotOptions.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [tarotOptions, search]);

  if (archetypeOptions.length === 0 && tarotOptions.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
          aria-label="Add archetype to constellation"
        >
          <Plus className="h-4 w-4" />
          Add to constellation
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 border-[var(--border-gold)]/20 bg-card p-0"
        align="start"
      >
        <div className="border-b border-[var(--border-gold)]/10 p-3">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--border-gold)]/10 bg-card/50 px-3 py-1.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto p-2">
          {filteredArchetypes.length > 0 && (
            <>
              <p className="px-2 py-1 text-xs uppercase tracking-wider text-muted-foreground">
                Archetypes
              </p>
              {filteredArchetypes.map((archetype) => (
                <button
                  key={archetype.slug}
                  onClick={() => onAdd("jungian", archetype.slug)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[var(--color-gold)]/10"
                >
                  <ArchetypeGlyph
                    glyph={PLANET_SYMBOLS[archetype.planet] ?? ""}
                    element={archetype.element}
                    size="sm"
                  />
                  <div>
                    <span className="text-sm text-foreground">
                      {archetype.name}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {archetype.keywords.slice(0, 2).join(", ")}
                    </span>
                  </div>
                </button>
              ))}
            </>
          )}
          {filteredTarot.length > 0 && (
            <>
              <p className="mt-2 px-2 py-1 text-xs uppercase tracking-wider text-muted-foreground">
                Major Arcana
              </p>
              {filteredTarot.map((card) => (
                <button
                  key={card.slug}
                  onClick={() => onAdd("tarot", card.slug)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[var(--color-gold)]/10"
                >
                  <span className="text-sm font-display text-[var(--color-gold)]">
                    {card.romanNumeral}
                  </span>
                  <span className="text-sm text-foreground">{card.name}</span>
                </button>
              ))}
            </>
          )}
          {filteredArchetypes.length === 0 && filteredTarot.length === 0 && (
            <p className="px-2 py-4 text-center text-sm text-muted-foreground">
              No matches found
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
