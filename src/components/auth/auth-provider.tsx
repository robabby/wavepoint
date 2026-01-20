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
 * Invite data passed from /invite/[code] landing page
 */
export interface InviteData {
  code: string;
  email: string;
}

/**
 * Auth modal context value
 */
interface AuthModalContextValue {
  isOpen: boolean;
  view: AuthView;
  inviteData: InviteData | null;
  openModal: (view?: AuthView, invite?: InviteData) => void;
  closeModal: () => void;
  setView: (view: AuthView) => void;
  clearInviteData: () => void;
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
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Detect ?auth=sign-in (or sign-up, forgot-password) URL param and open modal
  // Also parse invite and email params for pre-filling signup form
  useEffect(() => {
    const authParam = searchParams.get("auth");
    const inviteParam = searchParams.get("invite");
    const emailParam = searchParams.get("email");

    if (isAuthView(authParam)) {
      // Defer state update to avoid cascading render warning
      // This is intentional: we're syncing URL state to React state
      requestAnimationFrame(() => {
        setView(authParam);
        setIsOpen(true);

        // If both invite params present, store invite data
        if (inviteParam && emailParam) {
          setInviteData({ code: inviteParam, email: emailParam });
        }
      });
      // Clean up URL by removing auth-related params
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("auth");
      newParams.delete("invite");
      newParams.delete("email");
      const newUrl = newParams.toString()
        ? `${pathname}?${newParams.toString()}`
        : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  const openModal = useCallback(
    (initialView: AuthView = "sign-in", invite?: InviteData) => {
      setView(initialView);
      setIsOpen(true);
      if (invite) {
        setInviteData(invite);
      }
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Reset view to sign-in when closing (for next open)
    setView("sign-in");
    // Clear invite data on close
    setInviteData(null);
  }, []);

  const handleSetView = useCallback((newView: AuthView) => {
    setView(newView);
  }, []);

  const clearInviteData = useCallback(() => {
    setInviteData(null);
  }, []);

  const modalValue = useMemo<AuthModalContextValue>(
    () => ({
      isOpen,
      view,
      inviteData,
      openModal,
      closeModal,
      setView: handleSetView,
      clearInviteData,
    }),
    [isOpen, view, inviteData, openModal, closeModal, handleSetView, clearInviteData]
  );

  return (
    <SessionProvider>
      <AuthModalContext.Provider value={modalValue}>
        {children}
      </AuthModalContext.Provider>
    </SessionProvider>
  );
}
