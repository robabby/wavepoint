"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { initMixpanel, identify, reset } from "./mixpanel";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    initMixpanel();
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      identify(session.user.id, {
        $email: session.user.email,
        $name: session.user.name,
      });
    } else if (status === "unauthenticated") {
      reset();
    }
  }, [session, status]);

  return <>{children}</>;
}
