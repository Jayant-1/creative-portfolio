const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.argv[2] || process.env.BASE_URL || "http://localhost:3000";
const OUTPUT_DIR = path.resolve(__dirname, "../../audit-results/2026-10-21/post-repair");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const ROUTES = [
  { name: "home", path: "/" },
  { name: "project", path: "/projects/astropixel" },
  { name: "component", path: "/components/overlapping-text-hero" },
];

const SAMPLES = 3;

// Release Gate Thresholds
const THRESHOLDS = {
  minPerformance: 90,
  maxLcp: 2.5,   // seconds
  maxTbt: 200,   // milliseconds
  maxCls: 0.1,   // unitless
};

function runLighthouse(url, outputPath) {
  const cmd = `node node_modules/lighthouse/cli/index.js "${url}" --output=json --output-path="${outputPath}" --chrome-flags="--headless --no-sandbox" --quiet`;
  execSync(cmd, { stdio: "inherit", timeout: 120000 });
  const raw = fs.readFileSync(outputPath, "utf8");
  return JSON.parse(raw);
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function main() {
  console.log("=======================================================");
  console.log("Starting Mobile Performance Benchmark Suite (Lighthouse 13.5.0)");
  console.log(`Target Host: ${BASE_URL}`);
  console.log(`Samples per route: ${SAMPLES}`);
  console.log(`Output Directory: ${OUTPUT_DIR}`);
  console.log("=======================================================\n");

  const summary = {};

  for (const route of ROUTES) {
    const fullUrl = `${BASE_URL}${route.path}`;
    console.log(`\n--- Benchmarking route: ${route.name} (${fullUrl}) ---`);
    const routeRuns = [];

    for (let i = 1; i <= SAMPLES; i++) {
      const reportFile = path.join(OUTPUT_DIR, `${route.name}-run-${i}.json`);
      console.log(`  Run ${i}/${SAMPLES}...`);
      try {
        const report = runLighthouse(fullUrl, reportFile);
        const perfScore = Math.round((report.categories.performance?.score || 0) * 100);
        const lcpMs = report.audits["largest-contentful-paint"]?.numericValue || 0;
        const lcpSec = +(lcpMs / 1000).toFixed(3);
        const tbtMs = Math.round(report.audits["total-blocking-time"]?.numericValue || 0);
        const cls = +(report.audits["cumulative-layout-shift"]?.numericValue || 0).toFixed(3);
        const fcpSec = +((report.audits["first-contentful-paint"]?.numericValue || 0) / 1000).toFixed(3);
        const transferBytes = report.audits["total-byte-weight"]?.numericValue || 0;

        const metrics = {
          run: i,
          performance: perfScore,
          lcp: lcpSec,
          tbt: tbtMs,
          cls: cls,
          fcp: fcpSec,
          transferBytes,
        };
        console.log(`    Result: Perf=${perfScore}, LCP=${lcpSec}s, TBT=${tbtMs}ms, CLS=${cls}`);
        routeRuns.push(metrics);
      } catch (err) {
        console.error(`    Run ${i} failed:`, err.message);
      }
    }

    if (routeRuns.length > 0) {
      summary[route.name] = {
        runs: routeRuns,
        median: {
          performance: median(routeRuns.map((r) => r.performance)),
          lcp: +(median(routeRuns.map((r) => r.lcp))).toFixed(3),
          tbt: Math.round(median(routeRuns.map((r) => r.tbt))),
          cls: +(median(routeRuns.map((r) => r.cls))).toFixed(3),
        },
      };
    }
  }

  console.log("\n=======================================================");
  console.log("BENCHMARK SUMMARY (Medians over mobile runs):");
  console.log("=======================================================");
  for (const [name, data] of Object.entries(summary)) {
    console.log(
      `  ${name.toUpperCase()}: Perf = ${data.median.performance} | LCP = ${data.median.lcp}s | TBT = ${data.median.tbt}ms | CLS = ${data.median.cls}`
    );
  }

  // Release Gate Threshold Evaluation
  console.log("\n=======================================================");
  console.log("EVALUATING RELEASE GATE THRESHOLDS:");
  console.log(`  - Minimum Performance Score: >= ${THRESHOLDS.minPerformance}`);
  console.log(`  - Maximum LCP: <= ${THRESHOLDS.maxLcp}s`);
  console.log(`  - Maximum TBT: <= ${THRESHOLDS.maxTbt}ms`);
  console.log(`  - Maximum CLS: <= ${THRESHOLDS.maxCls}`);
  console.log("=======================================================");

  const gateFailures = [];

  for (const route of ROUTES) {
    const routeData = summary[route.name];
    if (!routeData || !routeData.median) {
      const err = `[${route.name.toUpperCase()}] No benchmark data collected for route ${route.path}`;
      gateFailures.push(err);
      console.error(`  ❌ ${err}`);
      continue;
    }

    const { performance, lcp, tbt, cls } = routeData.median;
    const checks = [
      {
        metric: "Performance Score",
        passed: performance >= THRESHOLDS.minPerformance,
        actual: performance,
        expected: `>= ${THRESHOLDS.minPerformance}`,
      },
      {
        metric: "LCP",
        passed: lcp <= THRESHOLDS.maxLcp,
        actual: `${lcp}s`,
        expected: `<= ${THRESHOLDS.maxLcp}s`,
      },
      {
        metric: "TBT",
        passed: tbt <= THRESHOLDS.maxTbt,
        actual: `${tbt}ms`,
        expected: `<= ${THRESHOLDS.maxTbt}ms`,
      },
      {
        metric: "CLS",
        passed: cls <= THRESHOLDS.maxCls,
        actual: cls,
        expected: `<= ${THRESHOLDS.maxCls}`,
      },
    ];

    const routeFailures = checks.filter((c) => !c.passed);
    if (routeFailures.length > 0) {
      for (const f of routeFailures) {
        const failureMsg = `[${route.name.toUpperCase()}] ${f.metric} gate missed: actual ${f.actual}, expected ${f.expected}`;
        gateFailures.push(failureMsg);
        console.error(`  ❌ ${failureMsg}`);
      }
    } else {
      console.log(`  ✅ [${route.name.toUpperCase()}] Satisfies all release gate thresholds`);
    }
  }

  const summaryPath = path.join(OUTPUT_DIR, "benchmark-summary.json");
  const reportPayload = {
    targetHost: BASE_URL,
    timestamp: new Date().toISOString(),
    thresholds: THRESHOLDS,
    gateStatus: gateFailures.length === 0 ? "PASSED" : "FAILED",
    gateFailures,
    routes: summary,
  };
  fs.writeFileSync(summaryPath, JSON.stringify(reportPayload, null, 2));
  console.log(`\nDetailed summary saved to: ${summaryPath}`);

  if (gateFailures.length > 0) {
    console.error("\n=======================================================");
    console.error(`RELEASE GATE CHECK: FAILED (${gateFailures.length} violation(s))`);
    console.error("=======================================================");
    gateFailures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
    process.exit(1);
  }

  console.log("\n=======================================================");
  console.log("RELEASE GATE CHECK: PASSED");
  console.log("All routes passed all performance thresholds cleanly.");
  console.log("=======================================================\n");
}

main().catch((err) => {
  console.error("Benchmark failed:", err);
  process.exit(1);
});
