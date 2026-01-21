"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  useCallback,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "wavepoint-theme";

/**
 * Resolve system preference to light or dark.
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Get stored theme preference or default to system.
 */
function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage may not be available
  }
  return "system";
}

/**
 * Apply theme to document for Tailwind's dark mode.
 */
function applyThemeToDocument(resolved: ResolvedTheme) {
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * Resolve theme preference to actual theme.
 */
function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

// External store for theme state
let themeState: Theme = "system";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
  return themeState;
}

function getServerSnapshot(): Theme {
  return "system";
}

function setThemeState(newTheme: Theme) {
  themeState = newTheme;
  try {
    localStorage.setItem(STORAGE_KEY, newTheme);
  } catch {
    // localStorage may not be available
  }
  // Notify subscribers
  listeners.forEach((listener) => listener());
}

// Initialize from localStorage on client
if (typeof window !== "undefined") {
  themeState = getStoredTheme();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Use useSyncExternalStore for theme preference
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Derive resolved theme
  const resolvedTheme = resolveTheme(theme);

  // Apply theme to document when it changes
  useEffect(() => {
    applyThemeToDocument(resolvedTheme);
  }, [resolvedTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        // Force re-render by notifying listeners
        listeners.forEach((listener) => listener());
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme state and controls.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
