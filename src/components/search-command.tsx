"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search, X, ArrowRight, Clock } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  getGeometryPath,
  getAllGeometries,
  getPlatonicSolids,
  getPatterns,
} from "@/lib/data";
import type { Geometry } from "@/lib/data/geometries.types";
import { searchPatterns, getPatternCount } from "@/lib/numbers";
import type { NumberPattern } from "@/lib/numbers";
import { cn } from "@/lib/utils";

// Helper function to highlight matching text
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={index}
        className="bg-[var(--color-gold)]/20 text-[var(--color-gold-text)] font-medium rounded-sm px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

// Recent searches localStorage helpers
const RECENT_SEARCHES_KEY = 'sacred-geometry-recent-searches';
const MAX_RECENT_SEARCHES = 5;

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const recent = getRecentSearches();
    // Remove query if it exists (to avoid duplicates)
    const filtered = recent.filter(q => q.toLowerCase() !== query.toLowerCase());
    // Add to front and limit to MAX_RECENT_SEARCHES
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Silently fail
  }
}

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  // Load recent searches when modal opens
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with localStorage on open
      setRecentSearches(getRecentSearches());
    }
  }, [open]);

  // Initialize Fuse.js with all geometries
  const fuse = useMemo(() => {
    const allGeometries = getAllGeometries();
    return new Fuse(allGeometries, {
      keys: [
        { name: "name", weight: 0.4 },
        { name: "aliases", weight: 0.3 },
        { name: "description", weight: 0.15 },
        { name: "relatedBy.property", weight: 0.1 },
        { name: "relatedBy.element", weight: 0.05 },
      ],
      threshold: 0.4, // 0 = exact match, 1 = match anything
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, []);

  // ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Score a geometry based on how well it matches the query
  const scoreResult = (geometry: Geometry, query: string): number => {
    const lowerQuery = query.toLowerCase();
    const lowerName = geometry.name.toLowerCase();
    let score = 0;

    // Exact name match (highest priority)
    if (lowerName === lowerQuery) {
      score += 100;
    }
    // Name starts with query
    else if (lowerName.startsWith(lowerQuery)) {
      score += 80;
    }
    // Name contains query
    else if (lowerName.includes(lowerQuery)) {
      score += 60;
    }

    // Check aliases
    if (geometry.aliases) {
      for (const alias of geometry.aliases) {
        const lowerAlias = alias.toLowerCase();
        if (lowerAlias === lowerQuery) {
          score += 90;
        } else if (lowerAlias.startsWith(lowerQuery)) {
          score += 70;
        } else if (lowerAlias.includes(lowerQuery)) {
          score += 50;
        }
      }
    }

    // Description contains query
    if (geometry.description?.toLowerCase().includes(lowerQuery)) {
      score += 30;
    }

    // Properties contain query
    if (geometry.relatedBy?.property?.some(p => p.toLowerCase().includes(lowerQuery))) {
      score += 20;
    }

    return score;
  };

  // Search geometries using Fuse.js for fuzzy matching
  const searchQuery = typeof query === "string" ? query.trim() : "";
  const rawResults = searchQuery.length > 0 ? fuse.search(searchQuery) : [];

  // Combine Fuse.js fuzzy score with custom relevance scoring
  const results = rawResults
    .map(fuseResult => ({
      geometry: fuseResult.item,
      fuseScore: 1 - (fuseResult.score ?? 0), // Invert Fuse score: higher is better
      customScore: scoreResult(fuseResult.item, searchQuery)
    }))
    .map(item => ({
      ...item,
      // Blend scores: 40% fuzzy match quality, 60% semantic relevance
      combinedScore: (item.fuseScore * 40) + (item.customScore * 0.6)
    }))
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .map(item => item.geometry);

  // Group results by category
  const platonicResults = results.filter((g) => g.category === "platonic");
  const patternResults = results.filter((g) => g.category === "pattern");

  // Search numbers using existing helper (limit to 6)
  const numberResults = searchQuery.length > 0
    ? searchPatterns(searchQuery).slice(0, 6)
    : [];

  // Handle selection and navigation
  const handleSelect = (geometry: Geometry) => {
    // Save the search query to recent searches
    if (searchQuery.length > 0) {
      saveRecentSearch(searchQuery);
    }
    setOpen(false);
    setQuery(""); // Clear query on selection
    router.push(getGeometryPath(geometry));
  };

  // Handle number pattern selection
  const handleNumberSelect = (pattern: NumberPattern) => {
    if (searchQuery.length > 0) {
      saveRecentSearch(searchQuery);
    }
    setOpen(false);
    setQuery("");
    router.push(`/numbers/${pattern.slug}`);
  };

  // Handle clicking a recent search
  const handleRecentSearch = (recentQuery: string) => {
    setQuery(recentQuery);
  };

  // Clear recent searches
  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  // Reset query when dialog closes
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setQuery("");
    }
  };

  // Handle query change with type safety
  const handleQueryChange = (value: string) => {
    setQuery(value ?? "");
  };

  // Get counts for discovery state
  const platonicCount = getPlatonicSolids().length;
  const patternCount = getPatterns().length;
  const numberCount = getPatternCount();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "overflow-hidden p-0",
          // Glassmorphic background
          "bg-[var(--glass-bg)] backdrop-blur-xl",
          // Luminous gold border
          "border border-[var(--glass-border)]",
          // Multi-layered shadow for outer glow and inner depth
          "[box-shadow:var(--glass-glow),var(--glass-inner-shadow)]",
          // Desktop positioning - larger modal
          "sm:!top-[12vh] sm:!translate-y-0 sm:max-h-[76vh] sm:rounded-xl sm:max-w-2xl",
          // Mobile - bottom sheet style
          "!top-auto !bottom-0 !translate-y-0 max-h-[85vh] w-full max-w-full rounded-t-xl rounded-b-none sm:!bottom-auto"
        )}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Search Geometries</DialogTitle>
        <Command shouldFilter={false} loop className="bg-transparent">
          {/* Search Input with Clear Button */}
          <div className={cn(
            "relative flex items-center",
            "bg-[var(--glass-bg-elevated)]",
            "border-b border-[var(--glass-border)]",
            "[box-shadow:inset_0_-1px_0_rgba(212,168,75,0.1)]"
          )}>
            <CommandInput
              placeholder="Search geometries..."
              value={query}
              onValueChange={handleQueryChange}
              className={cn(
                "text-foreground placeholder:text-muted-foreground",
                "text-base sm:text-lg h-14 sm:h-16 pr-12",
                // Enhanced gold tint on the search icon
                "[&_svg]:text-[var(--color-gold)]/60 [&_svg]:drop-shadow-[0_0_3px_rgba(212,168,75,0.3)] [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-6 sm:[&_svg]:w-6"
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setQuery("")}
                className={cn(
                  "absolute right-4 p-1.5 rounded-md",
                  "text-muted-foreground hover:text-muted-foreground",
                  "hover:bg-muted/50",
                  "transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <CommandList className="max-h-[50vh] sm:max-h-[480px]">
            {/* Discovery State - show when no query and no recent searches */}
            {!searchQuery && recentSearches.length === 0 && (
              <div className="py-6 sm:py-8 px-4 sm:px-6">
                {/* Quick access categories - vertical card layout */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <Link
                    href="/platonic-solids"
                    className={cn(
                      "flex flex-col items-center text-center p-4 sm:p-5 rounded-lg",
                      "bg-[var(--glass-bg-elevated)]",
                      "border border-[var(--glass-border)]/50",
                      "hover:bg-muted/50",
                      "hover:border-[var(--color-gold)]/40",
                      "hover:[box-shadow:0_0_20px_rgba(212,168,75,0.08)]",
                      "transition-all duration-200 ease-out"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-background/60 border border-[var(--glass-border)]/30 flex items-center justify-center mb-3">
                      <span className="text-[var(--color-gold)] font-heading text-2xl sm:text-3xl">{platonicCount}</span>
                    </div>
                    <p className="text-sm sm:text-base font-medium text-foreground leading-tight">Platonic Solids</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Perfect forms</p>
                  </Link>

                  <Link
                    href="/numbers"
                    className={cn(
                      "flex flex-col items-center text-center p-4 sm:p-5 rounded-lg",
                      "bg-[var(--glass-bg-elevated)]",
                      "border border-[var(--glass-border)]/50",
                      "hover:bg-muted/50",
                      "hover:border-[var(--color-gold)]/40",
                      "hover:[box-shadow:0_0_20px_rgba(212,168,75,0.08)]",
                      "transition-all duration-200 ease-out"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-background/60 border border-[var(--glass-border)]/30 flex items-center justify-center mb-3">
                      <span className="text-[var(--color-gold)] font-heading text-2xl sm:text-3xl">{numberCount}</span>
                    </div>
                    <p className="text-sm sm:text-base font-medium text-foreground leading-tight">Numbers</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Repeating sequences</p>
                  </Link>

                  <Link
                    href="/sacred-patterns"
                    className={cn(
                      "flex flex-col items-center text-center p-4 sm:p-5 rounded-lg",
                      "bg-[var(--glass-bg-elevated)]",
                      "border border-[var(--glass-border)]/50",
                      "hover:bg-muted/50",
                      "hover:border-[var(--color-gold)]/40",
                      "hover:[box-shadow:0_0_20px_rgba(212,168,75,0.08)]",
                      "transition-all duration-200 ease-out"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-background/60 border border-[var(--glass-border)]/30 flex items-center justify-center mb-3">
                      <span className="text-[var(--color-gold)] font-heading text-2xl sm:text-3xl">{patternCount}</span>
                    </div>
                    <p className="text-sm sm:text-base font-medium text-foreground leading-tight">Sacred Patterns</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Universal geometry</p>
                  </Link>
                </div>

                {/* Popular searches */}
                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-[var(--glass-border)]/30">
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 px-1">Popular searches</p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {["Flower of Life", "Metatron", "Golden Ratio", "111", "444"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className={cn(
                          "px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base rounded-full",
                          "bg-background/60",
                          "text-muted-foreground",
                          "border border-[var(--glass-border)]/30",
                          "hover:text-[var(--color-gold)]",
                          "hover:border-[var(--color-gold)]/40",
                          "hover:bg-[var(--glass-bg-elevated)]",
                          "transition-all duration-200 ease-out",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        )}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Searches - show when no query but has recent searches */}
            {!searchQuery && recentSearches.length > 0 && (
              <CommandGroup
                heading="Recent Searches"
                className={cn(
                  "[&_[cmdk-group-heading]]:text-[var(--color-gold)]",
                  "[&_[cmdk-group-heading]]:font-heading",
                  "[&_[cmdk-group-heading]]:text-sm",
                  "[&_[cmdk-group-heading]]:sm:text-base",
                  "[&_[cmdk-group-heading]]:uppercase",
                  "[&_[cmdk-group-heading]]:tracking-wider",
                  "[&_[cmdk-group-heading]]:px-4",
                  "[&_[cmdk-group-heading]]:sm:px-5",
                  "[&_[cmdk-group-heading]]:py-3"
                )}
              >
                {recentSearches.map((recentQuery, index) => (
                  <CommandItem
                    key={index}
                    value={recentQuery}
                    onSelect={() => handleRecentSearch(recentQuery)}
                    className={cn(
                      "cursor-pointer rounded-md mx-2 sm:mx-3 my-0.5 py-3 sm:py-4 px-3 sm:px-4",
                      "transition-all duration-200 ease-out",
                      "data-[selected=true]:bg-muted/60",
                      "data-[selected=true]:border-l-2 data-[selected=true]:border-[var(--color-gold)]",
                      "data-[selected=true]:[box-shadow:inset_2px_0_8px_rgba(212,168,75,0.1)]",
                      "hover:bg-[var(--glass-bg-elevated)]"
                    )}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 w-full">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--color-gold)]/50" />
                      <span className="flex-1 text-base sm:text-lg text-foreground">{recentQuery}</span>
                    </div>
                  </CommandItem>
                ))}
                <CommandItem
                  onSelect={handleClearRecent}
                  className={cn(
                    "cursor-pointer mx-2 sm:mx-3 mt-2 py-2.5 px-3 sm:px-4 rounded-md",
                    "text-muted-foreground",
                    "hover:text-[var(--color-gold)]",
                    "hover:bg-[var(--glass-bg-elevated)]",
                    "transition-all duration-200 ease-out",
                    "border-t border-[var(--glass-border)]/30"
                  )}
                >
                  <span className="text-sm">Clear recent searches</span>
                </CommandItem>
              </CommandGroup>
            )}

            {/* Empty State - no results found (only show when there's a search query) */}
            <CommandEmpty>
              {searchQuery && (
                <div className="py-10 sm:py-12 px-6 sm:px-8 text-center">
                  {/* Visual indicator */}
                  <div className="mx-auto mb-5 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground" />
                  </div>

                  {/* Message */}
                  <p className="text-muted-foreground text-base sm:text-lg font-medium mb-2">
                    No results for &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="text-muted-foreground text-sm sm:text-base mb-8">
                    Try a different term or explore suggestions below
                  </p>

                  {/* Suggestion pills */}
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
                    {["flower", "tetrahedron", "golden", "circle", "life"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        className={cn(
                          "px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base rounded-full",
                          "bg-muted",
                          "text-[var(--color-gold)]",
                          "border border-[var(--border-gold)]/50",
                          "hover:bg-card",
                          "hover:border-[var(--color-gold)]/70",
                          "transition-[background-color,border-color] duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        )}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>

                  {/* Browse links */}
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm sm:text-base">
                    <Link
                      href="/platonic-solids"
                      className="text-[var(--color-gold)]/80 hover:text-[var(--color-gold)] transition-colors flex items-center gap-1.5"
                      onClick={() => setOpen(false)}
                    >
                      <span>Platonic Solids</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/numbers"
                      className="text-[var(--color-gold)]/80 hover:text-[var(--color-gold)] transition-colors flex items-center gap-1.5"
                      onClick={() => setOpen(false)}
                    >
                      <span>Numbers</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/sacred-patterns"
                      className="text-[var(--color-gold)]/80 hover:text-[var(--color-gold)] transition-colors flex items-center gap-1.5"
                      onClick={() => setOpen(false)}
                    >
                      <span>Sacred Patterns</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </CommandEmpty>

            {/* Platonic Solids Group */}
            {platonicResults.length > 0 && (
              <CommandGroup
                heading="Platonic Solids"
                className={cn(
                  "[&_[cmdk-group-heading]]:text-[var(--color-gold)]",
                  "[&_[cmdk-group-heading]]:font-heading",
                  "[&_[cmdk-group-heading]]:text-sm",
                  "[&_[cmdk-group-heading]]:sm:text-base",
                  "[&_[cmdk-group-heading]]:uppercase",
                  "[&_[cmdk-group-heading]]:tracking-wider",
                  "[&_[cmdk-group-heading]]:px-4",
                  "[&_[cmdk-group-heading]]:sm:px-5",
                  "[&_[cmdk-group-heading]]:py-3"
                )}
              >
                {platonicResults.map((geometry) => (
                  <CommandItem
                    key={geometry.id}
                    value={`${geometry.name} ${geometry.aliases?.join(" ") ?? ""}`}
                    onSelect={() => handleSelect(geometry)}
                    className={cn(
                      "cursor-pointer rounded-md mx-2 sm:mx-3 my-0.5 py-3 sm:py-4 px-3 sm:px-4",
                      "transition-all duration-200 ease-out",
                      "data-[selected=true]:bg-muted/60",
                      "data-[selected=true]:border-l-2 data-[selected=true]:border-[var(--color-gold)]",
                      "data-[selected=true]:[box-shadow:inset_2px_0_8px_rgba(212,168,75,0.1)]",
                      "hover:bg-[var(--glass-bg-elevated)]"
                    )}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 w-full">
                      {/* Geometry Image */}
                      {geometry.images?.heroImage && (
                        <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-md overflow-hidden bg-muted/30">
                          <Image
                            src={geometry.images.heroImage}
                            alt={geometry.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1 svg-gold"
                          />
                        </div>
                      )}

                      {/* Geometry Details */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-base sm:text-lg truncate text-foreground">
                          {highlightText(geometry.name, searchQuery)}
                        </span>
                        {geometry.description && (
                          <span className="text-muted-foreground text-sm sm:text-base truncate">
                            {highlightText(geometry.description, searchQuery)}
                          </span>
                        )}
                      </div>

                      {/* Element Badge */}
                      {geometry.relatedBy?.element && (
                        <Badge
                          variant="outline"
                          className="shrink-0 capitalize text-sm sm:text-base bg-transparent border-[var(--border-copper)] text-[var(--color-copper-text)]"
                        >
                          {geometry.relatedBy.element}
                        </Badge>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Patterns Group */}
            {patternResults.length > 0 && (
              <CommandGroup
                heading="Patterns"
                className={cn(
                  "[&_[cmdk-group-heading]]:text-[var(--color-gold)]",
                  "[&_[cmdk-group-heading]]:font-heading",
                  "[&_[cmdk-group-heading]]:text-sm",
                  "[&_[cmdk-group-heading]]:sm:text-base",
                  "[&_[cmdk-group-heading]]:uppercase",
                  "[&_[cmdk-group-heading]]:tracking-wider",
                  "[&_[cmdk-group-heading]]:px-4",
                  "[&_[cmdk-group-heading]]:sm:px-5",
                  "[&_[cmdk-group-heading]]:py-3"
                )}
              >
                {patternResults.map((geometry) => (
                  <CommandItem
                    key={geometry.id}
                    value={`${geometry.name} ${geometry.aliases?.join(" ") ?? ""}`}
                    onSelect={() => handleSelect(geometry)}
                    className={cn(
                      "cursor-pointer rounded-md mx-2 sm:mx-3 my-0.5 py-3 sm:py-4 px-3 sm:px-4",
                      "transition-all duration-200 ease-out",
                      "data-[selected=true]:bg-muted/60",
                      "data-[selected=true]:border-l-2 data-[selected=true]:border-[var(--color-gold)]",
                      "data-[selected=true]:[box-shadow:inset_2px_0_8px_rgba(212,168,75,0.1)]",
                      "hover:bg-[var(--glass-bg-elevated)]"
                    )}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 w-full">
                      {/* Geometry Image */}
                      {geometry.images?.heroImage && (
                        <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-md overflow-hidden bg-muted/30">
                          <Image
                            src={geometry.images.heroImage}
                            alt={geometry.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1 svg-gold"
                          />
                        </div>
                      )}

                      {/* Geometry Details */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-base sm:text-lg truncate text-foreground">
                          {highlightText(geometry.name, searchQuery)}
                        </span>
                        {geometry.description && (
                          <span className="text-muted-foreground text-sm sm:text-base truncate">
                            {highlightText(geometry.description, searchQuery)}
                          </span>
                        )}
                      </div>

                      {/* Element Badge (if applicable) */}
                      {geometry.relatedBy?.element && (
                        <Badge
                          variant="outline"
                          className="shrink-0 capitalize text-sm sm:text-base bg-transparent border-[var(--border-copper)] text-[var(--color-copper-text)]"
                        >
                          {geometry.relatedBy.element}
                        </Badge>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Numbers Group */}
            {numberResults.length > 0 && (
              <CommandGroup
                heading="Numbers"
                className={cn(
                  "[&_[cmdk-group-heading]]:text-[var(--color-gold)]",
                  "[&_[cmdk-group-heading]]:font-heading",
                  "[&_[cmdk-group-heading]]:text-sm",
                  "[&_[cmdk-group-heading]]:sm:text-base",
                  "[&_[cmdk-group-heading]]:uppercase",
                  "[&_[cmdk-group-heading]]:tracking-wider",
                  "[&_[cmdk-group-heading]]:px-4",
                  "[&_[cmdk-group-heading]]:sm:px-5",
                  "[&_[cmdk-group-heading]]:py-3"
                )}
              >
                {numberResults.map((pattern) => (
                  <CommandItem
                    key={pattern.id}
                    value={`${pattern.id} ${pattern.title} ${pattern.keywords.join(" ")}`}
                    onSelect={() => handleNumberSelect(pattern)}
                    className={cn(
                      "cursor-pointer rounded-md mx-2 sm:mx-3 my-0.5 py-3 sm:py-4 px-3 sm:px-4",
                      "transition-all duration-200 ease-out",
                      "data-[selected=true]:bg-muted/60",
                      "data-[selected=true]:border-l-2 data-[selected=true]:border-[var(--color-gold)]",
                      "data-[selected=true]:[box-shadow:inset_2px_0_8px_rgba(212,168,75,0.1)]",
                      "hover:bg-[var(--glass-bg-elevated)]"
                    )}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 w-full">
                      {/* Number Badge */}
                      <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-md bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 flex items-center justify-center">
                        <span className="text-[var(--color-gold-text)] font-heading text-sm sm:text-base">
                          {pattern.id}
                        </span>
                      </div>

                      {/* Pattern Details */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-base sm:text-lg truncate text-foreground">
                          {highlightText(pattern.title, searchQuery)}
                        </span>
                        <span className="text-muted-foreground text-sm sm:text-base truncate">
                          {highlightText(pattern.essence, searchQuery)}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>

          {/* Keyboard hints footer */}
          <div
            className={cn(
              "flex items-center justify-between px-4 sm:px-5 py-3",
              "border-t border-[var(--glass-border)]",
              "bg-[var(--glass-bg-elevated)]",
              "[box-shadow:inset_0_1px_0_rgba(245,240,230,0.03)]"
            )}
          >
            <div className="hidden sm:flex items-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <kbd className={cn(
                  "px-2 py-1 rounded",
                  "bg-background/60 backdrop-blur-sm",
                  "border border-[var(--glass-border)]/50",
                  "text-muted-foreground font-mono text-xs"
                )}>
                  ↑↓
                </kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center gap-2">
                <kbd className={cn(
                  "px-2 py-1 rounded",
                  "bg-background/60 backdrop-blur-sm",
                  "border border-[var(--glass-border)]/50",
                  "text-muted-foreground font-mono text-xs"
                )}>
                  ↵
                </kbd>
                <span>select</span>
              </span>
              <span className="flex items-center gap-2">
                <kbd className={cn(
                  "px-2 py-1 rounded",
                  "bg-background/60 backdrop-blur-sm",
                  "border border-[var(--glass-border)]/50",
                  "text-muted-foreground font-mono text-xs"
                )}>
                  esc
                </kbd>
                <span>close</span>
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {results.length + numberResults.length > 0
                ? `${results.length + numberResults.length} result${results.length + numberResults.length === 1 ? "" : "s"}`
                : ""}
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
