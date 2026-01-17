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
  getSacredPatterns,
} from "@/lib/data";
import type { Geometry } from "@/lib/data/geometries.types";
import { cn } from "@/lib/utils";

// Helper function to highlight matching text
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={index}
        className="bg-[var(--color-gold)]/20 text-[var(--color-gold-bright)] font-medium rounded-sm px-0.5"
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
  const patternCount = getSacredPatterns().length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "overflow-hidden p-0",
          "bg-[var(--color-obsidian)] border-[var(--border-gold)]",
          // Desktop positioning
          "sm:!top-[15vh] sm:!translate-y-0 sm:max-h-[70vh] sm:rounded-lg sm:max-w-lg",
          // Mobile - bottom sheet style
          "!top-auto !bottom-0 !translate-y-0 max-h-[85vh] w-full max-w-full rounded-t-xl rounded-b-none sm:!bottom-auto"
        )}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Search Geometries</DialogTitle>
        <Command shouldFilter={false} loop className="bg-transparent">
          {/* Search Input with Clear Button */}
          <div className="relative flex items-center bg-[var(--color-warm-charcoal)]/30">
            <CommandInput
              placeholder="Search geometries..."
              value={query}
              onValueChange={handleQueryChange}
              className="text-[var(--color-cream)] placeholder:text-[var(--color-dim)] text-base h-12 sm:h-14 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 p-1.5 rounded-md text-[var(--color-dim)] hover:text-[var(--color-warm-gray)] hover:bg-[var(--color-dark-bronze)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obsidian)]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <CommandList className="max-h-[50vh] sm:max-h-[400px]">
            {/* Discovery State - show when no query and no recent searches */}
            {!searchQuery && recentSearches.length === 0 && (
              <div className="py-6 px-4">
                {/* Quick access categories */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/platonic-solids"
                    className={cn(
                      "flex items-center gap-3 p-3 sm:p-4 rounded-lg",
                      "bg-[var(--color-warm-charcoal)]/40",
                      "border border-[var(--border-gold)]/30",
                      "hover:bg-[var(--color-dark-bronze)]/50",
                      "hover:border-[var(--color-gold)]/50",
                      "transition-[background-color,border-color] duration-200"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded bg-[var(--color-dark-bronze)] flex items-center justify-center">
                      <span className="text-[var(--color-gold)] font-heading text-lg sm:text-xl">{platonicCount}</span>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-medium text-[var(--color-cream)]">Platonic Solids</p>
                      <p className="text-xs sm:text-sm text-[var(--color-dim)]">Perfect forms</p>
                    </div>
                  </Link>

                  <Link
                    href="/sacred-patterns"
                    className={cn(
                      "flex items-center gap-3 p-3 sm:p-4 rounded-lg",
                      "bg-[var(--color-warm-charcoal)]/40",
                      "border border-[var(--border-gold)]/30",
                      "hover:bg-[var(--color-dark-bronze)]/50",
                      "hover:border-[var(--color-gold)]/50",
                      "transition-[background-color,border-color] duration-200"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded bg-[var(--color-dark-bronze)] flex items-center justify-center">
                      <span className="text-[var(--color-gold)] font-heading text-lg sm:text-xl">{patternCount}</span>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-medium text-[var(--color-cream)]">Sacred Patterns</p>
                      <p className="text-xs sm:text-sm text-[var(--color-dim)]">Universal geometry</p>
                    </div>
                  </Link>
                </div>

                {/* Popular searches */}
                <div className="mt-4 pt-4 border-t border-[var(--border-gold)]/20">
                  <p className="text-xs sm:text-sm text-[var(--color-dim)] mb-3 px-1">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["Flower of Life", "Metatron", "Golden Ratio", "Vesica Piscis"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className={cn(
                          "px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full",
                          "bg-[var(--color-dark-bronze)]/50",
                          "text-[var(--color-warm-gray)]",
                          "border border-transparent",
                          "hover:text-[var(--color-gold)]",
                          "hover:border-[var(--border-gold)]/50",
                          "transition-[color,border-color] duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obsidian)]"
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
                  "[&_[cmdk-group-heading]]:text-xs",
                  "[&_[cmdk-group-heading]]:sm:text-sm",
                  "[&_[cmdk-group-heading]]:uppercase",
                  "[&_[cmdk-group-heading]]:tracking-wider",
                  "[&_[cmdk-group-heading]]:px-3",
                  "[&_[cmdk-group-heading]]:py-2"
                )}
              >
                {recentSearches.map((recentQuery, index) => (
                  <CommandItem
                    key={index}
                    value={recentQuery}
                    onSelect={() => handleRecentSearch(recentQuery)}
                    className={cn(
                      "cursor-pointer rounded-md mx-2 my-0.5 py-3 px-3",
                      "transition-[background-color] duration-200",
                      "data-[selected=true]:bg-[var(--color-dark-bronze)]/60",
                      "data-[selected=true]:border-l-2 data-[selected=true]:border-[var(--color-gold)]",
                      "hover:bg-[var(--color-warm-charcoal)]/50"
                    )}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--color-gold)]/50" />
                      <span className="flex-1 text-sm sm:text-base text-[var(--color-cream)]">{recentQuery}</span>
                    </div>
                  </CommandItem>
                ))}
                <CommandItem
                  onSelect={handleClearRecent}
                  className={cn(
                    "cursor-pointer mx-2 mt-2 py-2 px-3 rounded-md",
                    "text-[var(--color-dim)]",
                    "hover:text-[var(--color-gold)]",
                    "hover:bg-[var(--color-dark-bronze)]/30",
                    "transition-colors",
                    "border-t border-[var(--border-gold)]/20"
                  )}
                >
                  <span className="text-xs">Clear recent searches</span>
                </CommandItem>
              </CommandGroup>
            )}

            {/* Empty State - no results found (only show when there's a search query) */}
            <CommandEmpty>
              {searchQuery && (
                <div className="py-8 px-6 text-center">
                  {/* Visual indicator */}
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[var(--color-dark-bronze)] flex items-center justify-center">
                    <Search className="h-5 w-5 text-[var(--color-dim)]" />
                  </div>

                  {/* Message */}
                  <p className="text-[var(--color-warm-gray)] text-sm font-medium mb-2">
                    No results for &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="text-[var(--color-dim)] text-xs mb-6">
                    Try a different term or explore suggestions below
                  </p>

                  {/* Suggestion pills */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {["flower", "tetrahedron", "golden", "circle", "life"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-full",
                          "bg-[var(--color-dark-bronze)]",
                          "text-[var(--color-gold)]",
                          "border border-[var(--border-gold)]/50",
                          "hover:bg-[var(--color-warm-charcoal)]",
                          "hover:border-[var(--color-gold)]/70",
                          "transition-[background-color,border-color] duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obsidian)]"
                        )}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>

                  {/* Browse links */}
                  <div className="flex justify-center gap-6 text-xs">
                    <Link
                      href="/platonic-solids"
                      className="text-[var(--color-gold)]/80 hover:text-[var(--color-gold)] transition-colors flex items-center gap-1"
                      onClick={() => setOpen(false)}
                    >
                      <span>Platonic Solids</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <Link
                      href="/sacred-patterns"
                      className="text-[var(--color-gold)]/80 hover:text-[var(--color-gold)] transition-colors flex items-center gap-1"
                      onClick={() => setOpen(false)}
                    >
                      <span>Sacred Patterns</span>
                      <ArrowRight className="h-3 w-3" />
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
                  "[&_[cmdk-group-heading]]:text-xs",
                  "[&_[cmdk-group-heading]]:sm:text-sm",
                  "[&_[cmdk-group-heading]]:uppercase",
                  "[&_[cmdk-group-heading]]:tracking-wider",
                  "[&_[cmdk-group-heading]]:px-3",
                  "[&_[cmdk-group-heading]]:py-2"
                )}
              >
                {platonicResults.map((geometry) => (
                  <CommandItem
                    key={geometry.id}
                    value={`${geometry.name} ${geometry.aliases?.join(" ") ?? ""}`}
                    onSelect={() => handleSelect(geometry)}
                    className={cn(
                      "cursor-pointer rounded-md mx-2 my-0.5 py-3 px-3",
                      "transition-[background-color] duration-200",
                      "data-[selected=true]:bg-[var(--color-dark-bronze)]/60",
                      "data-[selected=true]:border-l-2 data-[selected=true]:border-[var(--color-gold)]",
                      "hover:bg-[var(--color-warm-charcoal)]/50"
                    )}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {/* Geometry Image */}
                      {geometry.images?.heroImage && (
                        <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-md overflow-hidden bg-[var(--color-dark-bronze)]/30">
                          <Image
                            src={geometry.images.heroImage}
                            alt={geometry.name}
                            fill
                            sizes="40px"
                            className="object-contain p-1"
                            style={{
                              filter:
                                "brightness(0) saturate(100%) invert(85%) sepia(66%) saturate(466%) hue-rotate(358deg) brightness(98%) contrast(91%)",
                            }}
                          />
                        </div>
                      )}

                      {/* Geometry Details */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-sm sm:text-base truncate text-[var(--color-cream)]">
                          {highlightText(geometry.name, searchQuery)}
                        </span>
                        {geometry.description && (
                          <span className="text-[var(--color-warm-gray)] text-xs sm:text-sm truncate">
                            {highlightText(geometry.description, searchQuery)}
                          </span>
                        )}
                      </div>

                      {/* Element Badge */}
                      {geometry.relatedBy?.element && (
                        <Badge
                          variant="outline"
                          className="shrink-0 capitalize text-xs sm:text-sm bg-transparent border-[var(--border-copper)] text-[var(--color-copper)]"
                        >
                          {geometry.relatedBy.element}
                        </Badge>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Sacred Patterns Group */}
            {patternResults.length > 0 && (
              <CommandGroup
                heading="Sacred Patterns"
                className={cn(
                  "[&_[cmdk-group-heading]]:text-[var(--color-gold)]",
                  "[&_[cmdk-group-heading]]:font-heading",
                  "[&_[cmdk-group-heading]]:text-xs",
                  "[&_[cmdk-group-heading]]:sm:text-sm",
                  "[&_[cmdk-group-heading]]:uppercase",
                  "[&_[cmdk-group-heading]]:tracking-wider",
                  "[&_[cmdk-group-heading]]:px-3",
                  "[&_[cmdk-group-heading]]:py-2"
                )}
              >
                {patternResults.map((geometry) => (
                  <CommandItem
                    key={geometry.id}
                    value={`${geometry.name} ${geometry.aliases?.join(" ") ?? ""}`}
                    onSelect={() => handleSelect(geometry)}
                    className={cn(
                      "cursor-pointer rounded-md mx-2 my-0.5 py-3 px-3",
                      "transition-[background-color] duration-200",
                      "data-[selected=true]:bg-[var(--color-dark-bronze)]/60",
                      "data-[selected=true]:border-l-2 data-[selected=true]:border-[var(--color-gold)]",
                      "hover:bg-[var(--color-warm-charcoal)]/50"
                    )}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {/* Geometry Image */}
                      {geometry.images?.heroImage && (
                        <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-md overflow-hidden bg-[var(--color-dark-bronze)]/30">
                          <Image
                            src={geometry.images.heroImage}
                            alt={geometry.name}
                            fill
                            sizes="40px"
                            className="object-contain p-1"
                            style={{
                              filter:
                                "brightness(0) saturate(100%) invert(85%) sepia(66%) saturate(466%) hue-rotate(358deg) brightness(98%) contrast(91%)",
                            }}
                          />
                        </div>
                      )}

                      {/* Geometry Details */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-sm sm:text-base truncate text-[var(--color-cream)]">
                          {highlightText(geometry.name, searchQuery)}
                        </span>
                        {geometry.description && (
                          <span className="text-[var(--color-warm-gray)] text-xs sm:text-sm truncate">
                            {highlightText(geometry.description, searchQuery)}
                          </span>
                        )}
                      </div>

                      {/* Element Badge (if applicable) */}
                      {geometry.relatedBy?.element && (
                        <Badge
                          variant="outline"
                          className="shrink-0 capitalize text-xs sm:text-sm bg-transparent border-[var(--border-copper)] text-[var(--color-copper)]"
                        >
                          {geometry.relatedBy.element}
                        </Badge>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>

          {/* Keyboard hints footer */}
          <div
            className={cn(
              "flex items-center justify-between px-4 py-2",
              "border-t border-[var(--border-gold)]/20",
              "bg-[var(--color-warm-charcoal)]/30"
            )}
          >
            <div className="hidden sm:flex items-center gap-4 text-xs text-[var(--color-dim)]">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-dark-bronze)] text-[var(--color-warm-gray)] font-mono text-[10px]">
                  ↑↓
                </kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-dark-bronze)] text-[var(--color-warm-gray)] font-mono text-[10px]">
                  ↵
                </kbd>
                <span>select</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-dark-bronze)] text-[var(--color-warm-gray)] font-mono text-[10px]">
                  esc
                </kbd>
                <span>close</span>
              </span>
            </div>
            <span className="text-xs text-[var(--color-dim)]">
              {results.length > 0 ? `${results.length} result${results.length === 1 ? "" : "s"}` : ""}
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
