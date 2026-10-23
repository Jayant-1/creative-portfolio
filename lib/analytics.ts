/**
 * lib/analytics.ts
 *
 * Analytics and conversion-event helpers for the portfolio.
 *
 * Data minimization:
 * - Callers use fixed event names and non-sensitive properties, never contact form contents.
 * - Known sensitive keys are dropped; email/phone patterns are redacted as a second safeguard.
 * - Pattern matching is not a guarantee that arbitrary input contains no personal information.
 * - Multi-provider dispatch: Seamlessly routes events to Plausible, Fathom, Umami, Google Analytics,
 *   Vercel Analytics, or local custom event listeners without hard vendor lock-in.
 * - In non-production or debug mode, prints clean color-coded telemetry to the console.
 */

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void;
    fathom?: { trackEvent: (eventName: string, value?: Record<string, string | number | boolean>) => void };
    umami?: { track: (eventName: string, data?: Record<string, string | number | boolean>) => void };
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AnalyticsEventName =
  | "contact_email_click"
  | "contact_form_attempt"
  | "contact_form_delivery"
  | "resume_view"
  | "github_click"
  | "live_demo_launch"
  | "component_copy"
  | "navigation_click";

export type AnalyticsPrimitive = string | number | boolean;
export type AnalyticsProperties = Record<string, AnalyticsPrimitive | undefined>;

/** Forbidden property keys that could contain PII or credentials */
const FORBIDDEN_KEYS = new Set([
  "name",
  "fullname",
  "firstname",
  "lastname",
  "username",
  "user_name",
  "sendername",
  "sender_name",
  "email",
  "emailaddress",
  "useremail",
  "user_email",
  "senderemail",
  "sender_email",
  "my_email",
  "phone",
  "phonenumber",
  "telephone",
  "telephonenumber",
  "mobile",
  "mobilenumber",
  "cellphone",
  "cell",
  "contactnumber",
  "message",
  "usermessage",
  "user_message",
  "body",
  "text",
  "content",
  "subject",
  "password",
  "token",
  "authtoken",
  "apikey",
  "bearer",
  "credential",
  "credentials",
  "secret",
  "address",
  "ip",
  "ipaddress",
  "userip",
  "clientip",
  "ssn",
  "creditcard",
]);

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;

/**
 * Sanitizes an analytics property value to prevent accidental leakage of sensitive strings.
 */
function sanitizeValue(value: AnalyticsPrimitive): AnalyticsPrimitive {
  if (typeof value !== "string") {
    return value;
  }

  let sanitized = value.replace(EMAIL_REGEX, "[REDACTED_EMAIL]");
  sanitized = sanitized.replace(PHONE_REGEX, "[REDACTED_PHONE]");
  return sanitized;
}

/**
 * Sanitizes properties:
 * 1. Drops any forbidden keys (PII fields).
 * 2. Redacts regex email and phone occurrences inside values.
 * 3. Strips undefined or null values.
 */
export function sanitizeAnalyticsProperties(
  props?: Record<string, unknown>
): Record<string, AnalyticsPrimitive> {
  if (!props) return {};

  const clean: Record<string, AnalyticsPrimitive> = {};

  for (const [key, rawVal] of Object.entries(props)) {
    const lowerKey = key.toLowerCase().replace(/[-_]/g, "");

    if (FORBIDDEN_KEYS.has(lowerKey)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[Analytics Privacy Guard] Dropped prohibited PII key: "${key}"`
        );
      }
      continue;
    }

    if (
      typeof rawVal === "string" ||
      typeof rawVal === "number" ||
      typeof rawVal === "boolean"
    ) {
      clean[key] = sanitizeValue(rawVal);
    }
  }

  return clean;
}

// In-memory deduplication map: prevents rapid double-firing of identical events within 300ms
const recentEvents = new Map<string, number>();
const DEDUPE_WINDOW_MS = 300;

/**
 * Core event dispatch function.
 * Safe to call in SSR (no-op when window is undefined).
 */
export function trackEvent(
  eventName: AnalyticsEventName,
  properties?: Record<string, unknown>
): void {
  if (typeof window === "undefined") {
    return;
  }

  const cleanProps = sanitizeAnalyticsProperties(properties);
  const dedupeKey = `${eventName}:${JSON.stringify(cleanProps)}`;
  const now = Date.now();
  const lastTime = recentEvents.get(dedupeKey);

  if (lastTime && now - lastTime < DEDUPE_WINDOW_MS) {
    return; // Suppress rapid duplicate event
  }
  recentEvents.set(dedupeKey, now);

  // Prune map if large
  if (recentEvents.size > 100) {
    for (const [k, t] of recentEvents.entries()) {
      if (now - t > 10000) recentEvents.delete(k);
    }
  }

  // 1. Dispatch custom browser event for decoupled listeners and testing
  try {
    const customEvent = new CustomEvent("ca:analytics", {
      detail: {
        event: eventName,
        props: cleanProps,
        timestamp: Date.now(),
      },
    });
    window.dispatchEvent(customEvent);
  } catch {
    // Ignore CustomEvent dispatch issues
  }

  // 2. Plausible
  if (typeof window.plausible === "function") {
    try {
      window.plausible(eventName, { props: cleanProps });
    } catch (err) {
      console.warn("[Analytics] Plausible dispatch error:", err);
    }
  }

  // 3. Fathom
  if (window.fathom && typeof window.fathom.trackEvent === "function") {
    try {
      window.fathom.trackEvent(eventName, cleanProps);
    } catch (err) {
      console.warn("[Analytics] Fathom dispatch error:", err);
    }
  }

  // 4. Umami
  if (window.umami && typeof window.umami.track === "function") {
    try {
      window.umami.track(eventName, cleanProps);
    } catch (err) {
      console.warn("[Analytics] Umami dispatch error:", err);
    }
  }

  // 5. Google Analytics (gtag)
  if (typeof window.gtag === "function") {
    try {
      window.gtag("event", eventName, cleanProps);
    } catch (err) {
      console.warn("[Analytics] gtag dispatch error:", err);
    }
  }

  // 6. Vercel Web Analytics
  if (typeof window.va === "function") {
    try {
      window.va("event", { name: eventName, data: cleanProps });
    } catch (err) {
      console.warn("[Analytics] Vercel Analytics dispatch error:", err);
    }
  }

  // 7. Development & Debug Telemetry Logger
  let isDebug = process.env.NODE_ENV !== "production";
  try {
    isDebug ||= window.localStorage?.getItem("ca_debug_analytics") === "true";
  } catch {
    // Storage can be unavailable in private browsing or restrictive embedded contexts.
  }

  if (isDebug) {
    console.info(
      `%c[Telemetry] ${eventName}`,
      "background: #191510; color: #16b06a; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
      cleanProps
    );
  }
}

// ============================================================================
// Specialized Type-Safe Event Helpers
// ============================================================================

/**
 * Track user clicking a mailto: link or copying the public contact email.
 */
export function trackContactEmailClick(
  location: string,
  method: "mailto" | "copy" = "mailto"
): void {
  trackEvent("contact_email_click", {
    location,
    method,
  });
}

/**
 * Track step progression or submission attempts in the contact form.
 * Never logs user input.
 */
export function trackContactFormAttempt(step: 1 | 2): void {
  trackEvent("contact_form_attempt", {
    step,
  });
}

/**
 * Track successful delivery or fallback execution of a contact message.
 * Never logs names, emails, or message bodies.
 */
export function trackContactFormDelivery(
  method: "emailjs" | "mailto_fallback",
  status: "success" | "fallback" | "error"
): void {
  trackEvent("contact_form_delivery", {
    method,
    status,
  });
}

/**
 * Track resume PDF view or download actions.
 */
export function trackResumeView(location: string, format: "pdf" = "pdf"): void {
  trackEvent("resume_view", {
    location,
    format,
  });
}

/**
 * Track clicks to GitHub profile or source code repositories.
 */
export function trackGitHubClick(
  target: "profile" | "repo",
  repoOrUrl?: string,
  location?: string
): void {
  // Strip full GitHub URL down to clean repo name if applicable
  let repoName: string | undefined = undefined;
  if (repoOrUrl) {
    repoName = repoOrUrl.replace("https://github.com/", "").replace(/\/$/, "");
  }

  trackEvent("github_click", {
    target,
    repo: repoName,
    location: location ?? "unknown",
  });
}

/**
 * Track live demo link launches.
 */
export function trackLiveDemoLaunch(project: string, url?: string): void {
  trackEvent("live_demo_launch", {
    project,
    url: url ?? "unknown",
  });
}

/**
 * Track code or install-command copy button clicks.
 */
export function trackComponentCopy(
  component: string,
  type: "install_command" | "code" | "snippet",
  packageManager?: string
): void {
  trackEvent("component_copy", {
    component,
    type,
    package_manager: packageManager ?? "unknown",
  });
}
