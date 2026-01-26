export const signalKeys = {
  all: ["signal"] as const,
  sightings: () => [...signalKeys.all, "sightings"] as const,
  sightingsList: (filters?: { number?: string; since?: string }) =>
    [...signalKeys.sightings(), filters] as const,
  sighting: (id: string) => [...signalKeys.sightings(), id] as const,
  stats: () => [...signalKeys.all, "stats"] as const,
  heatmap: () => [...signalKeys.all, "heatmap"] as const,
  cosmicContext: () => [...signalKeys.all, "cosmicContext"] as const,
};
