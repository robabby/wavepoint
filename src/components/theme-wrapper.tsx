"use client";

import { Theme } from "@radix-ui/themes";
import { useTheme } from "@/lib/theme";
import type { ReactNode } from "react";

/**
 * Wraps Radix UI Theme component with resolved theme from context.
 * This must be a client component to access theme state.
 */
export function ThemeWrapper({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  return <Theme appearance={resolvedTheme}>{children}</Theme>;
}
