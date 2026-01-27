export const resonanceKeys = {
  all: ["resonance"] as const,
  bySighting: (sightingId: string) => [...resonanceKeys.all, sightingId] as const,
  summary: () => [...resonanceKeys.all, "summary"] as const,
};
