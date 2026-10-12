import { track as vercelTrack } from "@vercel/analytics";

type EventParams = Record<string, string | number | boolean | undefined>;
type CleanedParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function cleanParams(params?: EventParams): CleanedParams | undefined {
  if (!params) return undefined;
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string | number | boolean] =>
      entry[1] !== undefined,
  );
  return entries.length ? Object.fromEntries(entries) : undefined;
}

// Fires a custom event into both GA4 (if the gtag script has loaded) and
// Vercel Analytics. Safe to call unconditionally — each sink no-ops quietly
// when it isn't configured (no NEXT_PUBLIC_GA_MEASUREMENT_ID, or local dev).
export function trackEvent(name: string, params?: EventParams) {
  const cleaned = cleanParams(params);

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, cleaned);
  }

  vercelTrack(name, cleaned);
}
