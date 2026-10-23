import { chromium, firefox, webkit } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const base = process.argv[2] || process.env.BASE_URL || "http://localhost:3000";
const output = path.resolve(process.env.AUDIT_OUTPUT_DIR || "audit-results");
const report = { target: base, timestamp: new Date().toISOString(), checks: [], failures: [] };
for (const [engine, type] of Object.entries({ chromium, firefox, webkit })) {
  const browser = await type.launch();
  try {
    for (const width of [320, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 844 } });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(new URL("/components/overlapping-text-hero", base).href);
      const iframe = page.locator("#sandbox-stage iframe");
      const frame = page.frameLocator("#sandbox-stage iframe");
      await frame.locator(".font-sixCap").waitFor();
      const examples = page.getByRole("group", { name: "Component examples" }).getByRole("button");
      for (let index = 0; index < 3; index++) {
        await examples.nth(index).click();
        await frame.locator(".font-sixCap").evaluate(async () => { await document.fonts.ready; });
        // Preserve the original letter/portrait animation; inspect after it settles.
        await page.waitForTimeout(3400);
        const geometry = await frame.locator(".font-sixCap").evaluate((heading) => {
          const rect = heading.getBoundingClientRect();
          return { left: rect.left, right: rect.right, viewport: innerWidth, height: innerHeight };
        });
        assert.equal(geometry.viewport, 1280, "Keep the original desktop canvas width");
        assert.equal(geometry.height, 800, "Keep the original desktop canvas height");
        assert(geometry.left >= -1 && geometry.right <= geometry.viewport + 1, "The complete headline must fit inside the canvas");
        const fit = await iframe.evaluate((element) => {
          const frameRect = element.getBoundingClientRect();
          const box = element.parentElement.getBoundingClientRect();
          return { frameWidth: frameRect.width, frameHeight: frameRect.height, boxWidth: box.width, boxHeight: box.height };
        });
        assert(fit.frameWidth <= fit.boxWidth + 1 && fit.frameHeight <= fit.boxHeight + 1, "Scaled canvas must fit its reserved stage");
        assert(Math.abs(fit.frameWidth / fit.frameHeight - 1.6) < 0.01, "Preserve the original canvas aspect ratio");
        await frame.locator("body").evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(300);
        const portrait = await frame.locator("img").evaluate((element) => ({
          opacity: Number(getComputedStyle(element.parentElement).opacity),
          scrollY: window.scrollY,
        }));
        assert(portrait.scrollY > 0 && portrait.opacity > 0.95, "Scrolling must reveal the portrait as in the original component");
        await frame.locator("body").evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(200);
        const startOpacity = await frame.locator("img").evaluate((element) => Number(getComputedStyle(element.parentElement).opacity));
        assert(startOpacity < 0.05, "Returning to the start must hide the portrait");
        report.checks.push({ engine, width, preset: index, geometry, fit, passed: true });
      }
      assert.equal(errors.length, 0, errors.join("\n"));
      await context.close();
    }
  } catch (error) {
    report.failures.push({ engine, error: error.message });
  } finally {
    await browser.close();
  }
}
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, "scaled-preview.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ checks: report.checks.length, failures: report.failures }, null, 2));
process.exitCode = report.failures.length ? 1 : 0;
