import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Hook that returns true only on the client after hydration.
 * Uses useSyncExternalStore for proper SSR handling without hydration mismatch.
 */
export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // Client value
    () => false  // Server value
  );
}
