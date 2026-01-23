import type { ReactNode } from "react";

// QueryProvider is now at root layout level, so Signal pages
// no longer need their own providers wrapper.
export default function SignalLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
