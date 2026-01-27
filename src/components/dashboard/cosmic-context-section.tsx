"use client";

import { useCurrentCosmicContext } from "@/hooks/signal";
import { DashboardCosmicContextCard } from "@/components/signal";

/**
 * Section 1: Today's Cosmic Context
 *
 * Displays current moon phase with glow, sun sign, planetary positions,
 * and active retrogrades. Uses existing ephemeris API.
 */
export function CosmicContextSection() {
  const {
    cosmicContext,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useCurrentCosmicContext();

  return (
    <section>
      <DashboardCosmicContextCard
        cosmicContext={cosmicContext}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
        onRefresh={refetch}
      />
    </section>
  );
}
