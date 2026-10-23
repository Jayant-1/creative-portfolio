import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const base = process.argv[2] || process.env.BASE_URL || "http://localhost:3000";
const output = path.resolve(process.env.AUDIT_OUTPUT_DIR || "audit-results");
const results = [];
const browser = await chromium.launch();
try {
  // Mock every external request: no contact message or test telemetry can leave this test.
  for (const status of [500, 200]) {
    const context = await browser.newContext();
    let submissions = 0;
    await context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin === new URL(base).origin) return route.continue();
      if (url.hostname === "api.emailjs.com") {
        submissions++;
        return route.fulfill({ status, contentType: "text/plain", body: status === 200 ? "OK" : "Test delivery failure" });
      }
      return route.abort();
    });
    const page = await context.newPage();
    await page.goto(`${base}/contact`);
    await page.getByRole("button", { name: "Next (1/2)" }).click();
    assert(await page.getByRole("alert").filter({ hasText: "Please write a message" }).isVisible(), "Empty note needs validation");
    await page.locator("#ca-contact-message").fill("Release test: never sent to a real recipient.");
    await page.getByRole("button", { name: "Next (1/2)" }).click();
    await page.locator("#ca-contact-name").fill("Release test");
    await page.locator("#ca-contact-email").fill("release-test@example.com");
    await page.getByRole("button", { name: "Send (2/2)" }).click();
    if (status === 500) {
      await page.getByRole("link", { name: "Open mail client" }).waitFor();
      assert.equal(await page.locator("#ca-contact-name").inputValue(), "Release test");
      assert.equal(await page.locator("#ca-contact-message").inputValue(), "Release test: never sent to a real recipient.");
    } else {
      await page.getByRole("button", { name: "Send another note" }).waitFor();
    }
    assert.equal(submissions, 1, "One form action must produce one delivery attempt");
    results.push({ test: `mock-contact-${status}`, passed: true });
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const slug of ["overlapping-text-hero", "telescope-hero", "binary-grid", "bubble-text", "magnetic-button", "radial-gradient-card"]) {
    await page.goto(`${base}/components/${slug}`);
    const frame = page.frameLocator("#sandbox-stage iframe");
    await frame.locator("#isolated-preview-root").waitFor();
    const examples = page.getByRole("group", { name: "Component examples" }).getByRole("button");
    assert.equal(await examples.count(), 3);
    for (let i = 0; i < 3; i++) {
      await examples.nth(i).click();
      await page.waitForTimeout(150);
      assert.equal(await examples.nth(i).getAttribute("aria-pressed"), "true");
    }
    await page.getByRole("tab", { name: "Code", exact: true }).click();
    await page.getByRole("tab", { name: "Preview", exact: true }).click();
    await page.getByRole("button", { name: "Replay animations", exact: true }).click();
    results.push({ test: `${slug}-presets-code-replay`, passed: true });
  }
  const bad = new URLSearchParams({ config: JSON.stringify({ title: { invalid: true }, __proto__: null, fontSize: [] }), stiffness: "Infinity" });
  await page.goto(`${base}/preview/overlapping-text-hero?${bad}`);
  await page.waitForTimeout(1000);
  assert.equal(errors.length, 0, errors.join("\n"));
  results.push({ test: "malformed-preview-link", passed: true });
  await context.close();
} catch (error) {
  results.push({ passed: false, error: error.message });
  process.exitCode = 1;
} finally {
  await browser.close();
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "interactions.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}
