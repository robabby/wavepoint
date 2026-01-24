"use client";

import mixpanel from "mixpanel-browser";
import { env } from "@/env";

let initialized = false;

export function initMixpanel() {
  if (initialized || typeof window === "undefined") return;

  const token = env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return;

  mixpanel.init(token, {
    debug: process.env.NODE_ENV === "development",
    track_pageview: true,
    persistence: "localStorage",
    autocapture: true,
    record_sessions_percent: 100,
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
