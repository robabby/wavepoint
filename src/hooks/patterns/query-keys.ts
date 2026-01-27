export const patternsKeys = {
  all: ["patterns"] as const,
  user: () => [...patternsKeys.all, "user"] as const,
};
