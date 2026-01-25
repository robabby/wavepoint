"use client";

import mixpanel from "mixpanel-browser";
import { env } from "@/env";

let initialized = false;

export function initMixpanel() {
  if (initialized || typeof window === "undefined") return;

  const token = env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return;

  const isDevelopment = process.env.NODE_ENV === "development";

  mixpanel.init(token, {
    debug: isDevelopment,
    track_pageview: true,
    persistence: "localStorage",
    autocapture: true,
    // Disable session recording in development to prevent mutex timeout errors
    // caused by rapid HMR reloads and dev server behavior
    record_sessions_percent: isDevelopment ? 0 : 100,
  });

  initialized = true;
}

export function identify(
  userId: string,
  properties?: Record<string, unknown>
) {
  if (!initialized) return;
  mixpanel.identify(userId);
  if (properties) {
    mixpanel.people.set(properties);
  }
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return;
  mixpanel.track(event, properties);
}

export function reset() {
  if (!initialized) return;
  mixpanel.reset();
}
