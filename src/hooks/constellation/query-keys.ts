export const constellationKeys = {
  all: ["constellation"] as const,
  entries: () => [...constellationKeys.all, "entries"] as const,
};
