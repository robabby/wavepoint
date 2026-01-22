import type { ReactNode } from "react";
import { SignalProviders } from "./providers";

export default function SignalLayout({ children }: { children: ReactNode }) {
  return <SignalProviders>{children}</SignalProviders>;
}
