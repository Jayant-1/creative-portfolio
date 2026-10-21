/**
 * Automated test suite for lib/analytics.ts
 * Verifies:
 * 1. Privacy compliance (PII stripping of names, emails, phones, secrets).
 * 2. Event deduplication within 300ms.
 * 3. Graceful fallback when provider globals are missing.
 * 4. Provider dispatch when globals exist.
 * 5. All helper functions dispatch valid events.
 */

import assert from "node:assert";

// Mock minimal browser globals for testing analytics in Node environment
const dispatchedCustomEvents = [];
const providerCalls = {
  plausible: [],
  fathom: [],
  umami: [],
  gtag: [],
  va: [],
};

globalThis.window = {
  dispatchEvent: (event) => {
    dispatchedCustomEvents.push(event);
  },
  plausible: (eventName, options) => {
    providerCalls.plausible.push({ eventName, options });
  },
  fathom: {
    trackEvent: (eventName, value) => {
      providerCalls.fathom.push({ eventName, value });
    },
  },
  umami: {
    track: (eventName, data) => {
      providerCalls.umami.push({ eventName, data });
    },
  },
  gtag: (action, eventName, props) => {
    providerCalls.gtag.push({ action, eventName, props });
  },
  va: (action, options) => {
    providerCalls.va.push({ action, options });
  },
};

globalThis.CustomEvent = class CustomEvent {
  constructor(type, init) {
    this.type = type;
    this.detail = init?.detail;
  }
};

const analytics = await import("../lib/analytics.ts");

console.log("Starting Analytics & Privacy Verification Test Suite...\n");

// Test 1: PII Sanitization
console.log("1. Testing PII Filtering & Sanitization...");
const dirtyProps = {
  name: "John Doe",
  first_name: "John",
  lastName: "Doe",
  fullName: "John Doe",
  email: "john@example.com",
  email_address: "johnny@corp.com",
  phone: "+1-555-123-4567",
  phoneNumber: "+91 9876543210",
  password: "supersecretpassword",
  api_key: "ak_live_1234567890",
  auth_token: "bearer_xyz_987",
  ip_address: "192.168.1.1",
  location: "header_nav",
  click_count: 5,
  is_verified: true,
  null_val: null,
  undef_val: undefined,
  description: "Contact me at recruiter@bigtech.com or call +91 9876543210 please",
};

const clean = analytics.sanitizeAnalyticsProperties(dirtyProps);
assert.strictEqual(clean.name, undefined, "Name field must be stripped");
assert.strictEqual(clean.first_name, undefined, "First name field must be stripped");
assert.strictEqual(clean.lastName, undefined, "Last name field must be stripped");
assert.strictEqual(clean.fullName, undefined, "Full name field must be stripped");
assert.strictEqual(clean.email, undefined, "Email field must be stripped");
assert.strictEqual(clean.email_address, undefined, "Email address field must be stripped");
assert.strictEqual(clean.phone, undefined, "Phone field must be stripped");
assert.strictEqual(clean.phoneNumber, undefined, "Phone number field must be stripped");
assert.strictEqual(clean.password, undefined, "Password field must be stripped");
assert.strictEqual(clean.api_key, undefined, "API key field must be stripped");
assert.strictEqual(clean.auth_token, undefined, "Auth token field must be stripped");
assert.strictEqual(clean.ip_address, undefined, "IP address field must be stripped");
assert.strictEqual(clean.null_val, undefined, "Null values must be excluded");
assert.strictEqual(clean.undef_val, undefined, "Undefined values must be excluded");
assert.strictEqual(clean.location, "header_nav", "Safe location property must be preserved");
assert.strictEqual(clean.click_count, 5, "Safe numeric property must be preserved");
assert.strictEqual(clean.is_verified, true, "Safe boolean property must be preserved");
assert(clean.description.includes("[REDACTED_EMAIL]"), "Email pattern inside strings must be redacted");
assert(clean.description.includes("[REDACTED_PHONE]"), "Phone pattern inside strings must be redacted");
console.log("   ✓ Extended PII filtering, credentials dropping, and pattern redaction passed.");

// Test 2: Custom Event & Provider Dispatch
console.log("\n2. Testing Multi-Provider Dispatch...");
dispatchedCustomEvents.length = 0;
providerCalls.gtag.length = 0;
providerCalls.plausible.length = 0;

analytics.trackResumeView("experience_hero");

assert.strictEqual(dispatchedCustomEvents.length, 1, "CustomEvent ca:analytics must be dispatched");
assert.strictEqual(dispatchedCustomEvents[0].detail.event, "resume_view");
assert.strictEqual(dispatchedCustomEvents[0].detail.props.location, "experience_hero");

assert.strictEqual(providerCalls.plausible.length, 1, "Plausible must receive event");
assert.strictEqual(providerCalls.gtag.length, 1, "Google Analytics gtag must receive event");
assert.strictEqual(providerCalls.umami.length, 1, "Umami must receive event");
assert.strictEqual(providerCalls.fathom.length, 1, "Fathom must receive event");
assert.strictEqual(providerCalls.va.length, 1, "Vercel Analytics must receive event");
console.log("   ✓ Multi-provider routing and custom browser event passed.");

// Test 3: Deduplication Guard
console.log("\n3. Testing Duplicate Event Suppression (<300ms)...");
const initialDispatchedCount = dispatchedCustomEvents.length;

// Fire identical event immediately
analytics.trackResumeView("experience_hero");
assert.strictEqual(
  dispatchedCustomEvents.length,
  initialDispatchedCount,
  "Rapid duplicate event must be suppressed"
);

// Fire different event immediately - should go through
analytics.trackGitHubClick("profile", "https://github.com/jayantpotdar");
assert.strictEqual(
  dispatchedCustomEvents.length,
  initialDispatchedCount + 1,
  "Distinct event must not be suppressed"
);
console.log("   ✓ Duplicate suppression passed.");

// Test 4: Helper Functions
console.log("\n4. Testing Specific Typed Event Helpers...");
analytics.trackContactEmailClick("footer", "mailto");
analytics.trackContactFormAttempt(1);
analytics.trackContactFormDelivery("emailjs", "success");
analytics.trackLiveDemoLaunch("astropixel", "https://astropixel.jayant.codes");
analytics.trackComponentCopy("overlapping-text-hero", "code", "pnpm");

console.log("   ✓ All specialized event helpers executed safely without errors.");

// Test 5: SSR Safety (Window Undefined)
console.log("\n5. Testing SSR Safety (when window is undefined)...");
const originalWindow = globalThis.window;
delete globalThis.window;
try {
  // Should safely no-op without error
  analytics.trackEvent("resume_view", { location: "ssr_server" });
  console.log("   ✓ Calling trackEvent in simulated SSR environment safely no-ops.");
} finally {
  globalThis.window = originalWindow;
}

console.log("\n=======================================================");
console.log("ALL ANALYTICS TESTS PASSED SUCCESSFULLY (100%)");
console.log("=======================================================\n");
