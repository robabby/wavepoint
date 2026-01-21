"use client";

import { Text } from "@radix-ui/themes";
import { PatternCard } from "./PatternCard";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import type { NumberPattern } from "@/lib/numbers";

interface NumberSearchResultsProps {
  query: string;
  results: NumberPattern[];
}

/**
 * Display search results for the numbers page live search.
 */
export function NumberSearchResults({
  query,
  results,
}: NumberSearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <Text className="text-muted-foreground">
          No matches for &ldquo;{query}&rdquo; — Press Enter to explore anyway
        </Text>
      </div>
    );
  }

  return (
    <div>
      <Text
        size="2"
        className="mb-6 block text-center text-muted-foreground"
      >
        {results.length} pattern{results.length !== 1 ? "s" : ""} found
      </Text>
      <StaggerChildren
        className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6"
        staggerDelay={0.05}
      >
        {results.map((pattern) => (
          <StaggerItem key={pattern.id}>
            <PatternCard pattern={pattern} />
          </StaggerItem>
        ))}
      </StaggerChildren>
    </div>
  );
}
