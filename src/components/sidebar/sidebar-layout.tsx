"use client";

import {
  useState,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { SidebarProvider, useSidebar } from "@/lib/sidebar";
import { AppSidebar } from "./app-sidebar";
import { SidebarMobileDrawer } from "./sidebar-mobile-drawer";

// =============================================================================
// Context for Header Integration
// =============================================================================

interface SidebarLayoutContextValue {
  isAuthenticated: boolean;
  openMobileDrawer: () => void;
}

const SidebarLayoutContext = createContext<SidebarLayoutContextValue>({
  isAuthenticated: false,
  openMobileDrawer: () => {},
});

/**
 * Hook for header to determine if user is authenticated and get mobile drawer trigger.
 */
export function useSidebarLayoutContext() {
  return useContext(SidebarLayoutContext);
}

// =============================================================================
// Types
// =============================================================================

interface SidebarLayoutProps {
  children: ReactNode;
}

// =============================================================================
// Outer Component
// =============================================================================

/**
 * Sidebar layout wrapper that conditionally renders the sidebar
 * based on authentication state.
 *
 * - Authenticated: Shows desktop sidebar and provides mobile drawer
 * - Unauthenticated: Passes through children unchanged
 */
export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { data: session, status } = useSession();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const openMobileDrawer = useCallback(() => {
    setMobileDrawerOpen(true);
  }, []);

  const closeMobileDrawer = useCallback(() => {
    setMobileDrawerOpen(false);
  }, []);

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  // While loading or unauthenticated
  const isAuthenticated =
    status === "authenticated" && !!session?.user?.email;
  const email = session?.user?.email ?? "";
  const isAdmin = session?.user?.isAdmin ?? false;

  // Always provide context so header can check auth status
  const contextValue: SidebarLayoutContextValue = {
    isAuthenticated,
    openMobileDrawer,
  };

  // Unauthenticated: no sidebar, just pass through
  if (!isAuthenticated) {
    return (
      <SidebarLayoutContext.Provider value={contextValue}>
        {children}
      </SidebarLayoutContext.Provider>
    );
  }

  // Authenticated: wrap with sidebar provider and render layout
  return (
    <SidebarLayoutContext.Provider value={contextValue}>
      <SidebarProvider>
        <AuthenticatedLayoutInner
          email={email}
          isAdmin={isAdmin}
          mobileDrawerOpen={mobileDrawerOpen}
          onCloseMobileDrawer={closeMobileDrawer}
          onSignOut={handleSignOut}
        >
          {children}
        </AuthenticatedLayoutInner>
      </SidebarProvider>
    </SidebarLayoutContext.Provider>
  );
}

// =============================================================================
// Inner Component (consumes sidebar context)
// =============================================================================

interface AuthenticatedLayoutInnerProps {
  email: string;
  isAdmin: boolean;
  mobileDrawerOpen: boolean;
  onCloseMobileDrawer: () => void;
  onSignOut: () => void;
  children: ReactNode;
}

function AuthenticatedLayoutInner({
  email,
  isAdmin,
  mobileDrawerOpen,
  onCloseMobileDrawer,
  onSignOut,
  children,
}: AuthenticatedLayoutInnerProps) {
  const { isCollapsed } = useSidebar();

  // Calculate sidebar width for margin
  const sidebarWidth = isCollapsed ? 64 : 288;

  return (
    <>
      {/* Desktop sidebar - hidden on mobile */}
      <AppSidebar email={email} isAdmin={isAdmin} onSignOut={onSignOut} />

      {/* Mobile drawer */}
      <SidebarMobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={onCloseMobileDrawer}
        email={email}
        isAdmin={isAdmin}
        onSignOut={onSignOut}
      />

      {/* Main content wrapper with dynamic margin for sidebar */}
      <div
        className={cn(
          "flex min-h-screen flex-col",
          "transition-[margin-left] duration-200 ease-out",
          // Only apply sidebar margin on desktop (lg+)
          "lg:ml-[var(--sidebar-width)]"
        )}
        style={
          {
            "--sidebar-width": `${sidebarWidth}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </>
  );
}
