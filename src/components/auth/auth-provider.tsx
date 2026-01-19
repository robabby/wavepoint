"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

/**
 * Auth modal view states
 */
export type AuthView = "sign-in" | "sign-up" | "forgot-password";

/**
 * Auth modal context value
 */
interface AuthModalContextValue {
  isOpen: boolean;
  view: AuthView;
  openModal: (view?: AuthView) => void;
  closeModal: () => void;
  setView: (view: AuthView) => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

/**
 * Hook to access auth modal state and actions
 * Must be used within AuthProvider
 */
export function useAuthModal(): AuthModalContextValue {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider wraps the application with:
 * - SessionProvider from next-auth for session management
 * - AuthModalContext for modal state (open/close, view state)
 *
 * Usage:
 * ```tsx
 * <AuthProvider>
 *   <App />
 *   <AuthModal />
 * </AuthProvider>
 * ```
 */
/** Valid auth URL param values */
const AUTH_VIEWS: AuthView[] = ["sign-in", "sign-up", "forgot-password"];

function isAuthView(value: string | null): value is AuthView {
  return value !== null && AUTH_VIEWS.includes(value as AuthView);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>("sign-in");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Detect ?auth=sign-in (or sign-up, forgot-password) URL param and open modal
  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (isAuthView(authParam)) {
      // Defer state update to avoid cascading render warning
      // This is intentional: we're syncing URL state to React state
      requestAnimationFrame(() => {
        setView(authParam);
        setIsOpen(true);
      });
      // Clean up URL by removing the auth param
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("auth");
      const newUrl = newParams.toString()
        ? `${pathname}?${newParams.toString()}`
        : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  const openModal = useCallback((initialView: AuthView = "sign-in") => {
    setView(initialView);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Reset view to sign-in when closing (for next open)
    setView("sign-in");
  }, []);

  const handleSetView = useCallback((newView: AuthView) => {
    setView(newView);
  }, []);

  const modalValue = useMemo<AuthModalContextValue>(
    () => ({
      isOpen,
      view,
      openModal,
      closeModal,
      setView: handleSetView,
    }),
    [isOpen, view, openModal, closeModal, handleSetView]
  );

  return (
    <SessionProvider>
      <AuthModalContext.Provider value={modalValue}>
        {children}
      </AuthModalContext.Provider>
    </SessionProvider>
  );
}
