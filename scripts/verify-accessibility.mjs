import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";

const base = process.argv[2] || process.env.BASE_URL || "http://localhost:3000";
const output = path.resolve(process.env.AUDIT_OUTPUT_DIR || "audit-results");
const report = { target: base, timestamp: new Date().toISOString(), pages: [], failures: [] };
const browser = await chromium.launch();
try {
  const response = await fetch(new URL("/sitemap.xml", base));
  if (!response.ok) throw new Error("Cannot load sitemap for accessibility coverage");
  const routes = [...(await response.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  if (routes.length !== 17) throw new Error("Expected all 17 canonical routes");
  routes.push("/blog");
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const route of routes) {
      const response = await page.goto(new URL(route, base).href);
      if (response.status() !== 200) throw new Error(`${route}: HTTP ${response.status()}`);
      await page.evaluate(() => document.fonts.ready);
      // Evaluate the actual settled presentation, preserving its entrance animation.
      await page.waitForTimeout(3500);
      const result = await new AxeBuilder({ page }).analyze();
      report.pages.push({ route, width, axeVersion: result.testEngine.version, violations: result.violations, incomplete: result.incomplete });
      for (const violation of result.violations) report.failures.push({ route, width, id: violation.id, nodes: violation.nodes.map((node) => node.target) });
      console.log(`${width}px ${route}: ${result.violations.length} violations; ${result.incomplete.length} rules need manual review`);
    }
    await context.close();
  }
} catch (error) {
  report.failures.push({ error: error.message });
} finally {
  await browser.close();
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "accessibility-axe.json"), JSON.stringify(report, null, 2));
  console.log(`${report.pages.length} page/viewport checks; ${report.failures.length} failures`);
  process.exitCode = report.failures.length ? 1 : 0;
}
