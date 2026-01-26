"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  useCallback,
  type ReactNode,
} from "react";

// =============================================================================
// Types
// =============================================================================

interface SidebarContextValue {
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
}

// =============================================================================
// Constants
// =============================================================================

const STORAGE_KEY = "wavepoint-sidebar-collapsed";

// =============================================================================
// External Store (useSyncExternalStore pattern from theme-context)
// =============================================================================

let collapsedState = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): boolean {
  return collapsedState;
}

function getServerSnapshot(): boolean {
  // Default to expanded on server
  return false;
}

function setCollapsedState(collapsed: boolean) {
  collapsedState = collapsed;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
  } catch {
    // localStorage may not be available
  }
  // Notify subscribers
  listeners.forEach((listener) => listener());
}

/**
 * Get stored collapsed preference from localStorage.
 */
function getStoredCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      return JSON.parse(stored) === true;
    }
  } catch {
    // localStorage may not be available
  }
  return false; // Default: expanded
}

// Initialize from localStorage on client
if (typeof window !== "undefined") {
  collapsedState = getStoredCollapsed();
}

// =============================================================================
// Context
// =============================================================================

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

// =============================================================================
// Provider
// =============================================================================

export function SidebarProvider({ children }: { children: ReactNode }) {
  // Use useSyncExternalStore for collapsed state
  const isCollapsed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Sync with localStorage on mount (handles SSR hydration)
  useEffect(() => {
    const stored = getStoredCollapsed();
    if (stored !== collapsedState) {
      collapsedState = stored;
      listeners.forEach((listener) => listener());
    }
  }, []);

  const setCollapsed = useCallback((collapsed: boolean) => {
    setCollapsedState(collapsed);
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState(!collapsedState);
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setCollapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Hook to access sidebar collapsed state and controls.
 */
export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
