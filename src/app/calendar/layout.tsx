import type { ReactNode } from "react";

// QueryProvider is at root layout level, so Calendar pages
// don't need their own providers wrapper.
export default function CalendarLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
