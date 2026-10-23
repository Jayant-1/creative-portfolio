import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = process.argv[2] || process.env.BASE_URL || "http://localhost:3000";
const output = path.resolve(process.env.AUDIT_OUTPUT_DIR || path.join(root, "audit-results", new Date().toISOString().replace(/[:.]/g, "-")));
fs.mkdirSync(output, { recursive: true });
const gates = [
  ["types", "node_modules/typescript/bin/tsc", "--noEmit"],
  ["lint", "node_modules/next/dist/bin/next", "lint"],
  ["component-source-parity", "scripts/verify-component-parity.mjs"],
  ["analytics-unit", "scripts/test-analytics-verification.mjs"],
  ["http-seo", "scripts/verify-http.mjs", target],
  ["readiness", "scripts/verify-production-readiness.js", target],
  ["interactions", "scripts/verify-interactions.mjs", target],
  ["scaled-preview", "scripts/verify-scaled-preview.mjs", target],
  ["accessibility-regressions", "scripts/verify-phase8-a11y.mjs", target],
  ["accessibility-axe", "scripts/verify-accessibility.mjs", target],
  ["structured-content", "scripts/verify-aeo-schemas.mjs", target],
  ["browser-engines", "scripts/verify-cross-browser.js", target],
  // Keep performance sequential, after other browsers have exited.
  ["mobile-performance", "scripts/benchmark-performance.js", target],
];
const results = [];
for (const [name, ...args] of gates) {
  console.log(`Checking ${name}…`);
  const log = fs.openSync(path.join(output, `${name}.log`), "w");
  const started = Date.now();
  const result = spawnSync(process.execPath, args, {
    cwd: root, env: { ...process.env, BASE_URL: target, AUDIT_OUTPUT_DIR: output },
    stdio: ["ignore", log, log], timeout: 20 * 60 * 1000,
  });
  fs.closeSync(log);
  results.push({ name, passed: result.status === 0 && !result.error, exitCode: result.status, error: result.error?.message, elapsedMs: Date.now() - started });
  console.log(`${name}: ${results.at(-1).passed ? "PASS" : "FAIL"}`);
}
const report = {
  timestamp: new Date().toISOString(), target, results,
  localBuildId: fs.existsSync(path.join(root, ".next/BUILD_ID"))
    ? fs.readFileSync(path.join(root, ".next/BUILD_ID"), "utf8").trim()
    : null,
  passed: results.every((r) => r.passed),
  scope: "Automated candidate checks. Production deployment, Search Console, real-device/assistive-technology review and field Core Web Vitals require separate evidence.",
};
fs.writeFileSync(path.join(output, "release-summary.json"), JSON.stringify(report, null, 2));
console.log(`Evidence: ${output}`);
process.exitCode = report.passed ? 0 : 1;
