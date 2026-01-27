export const geometryKeys = {
  all: ["geometry"] as const,
  affinities: () => [...geometryKeys.all, "affinities"] as const,
};
