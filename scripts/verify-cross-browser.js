process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";
const { chromium, firefox, webkit } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || process.argv[2] || "http://localhost:3000";
const OUTPUT_FILE = path.resolve(process.env.AUDIT_OUTPUT_DIR || path.join(__dirname, "../audit-results"), "cross-browser-verified.json");

const VIEWPORTS = [
  { label: "mobile-320", width: 320, height: 740 },
  { label: "mobile-390", width: 390, height: 844 },
  { label: "tablet-768", width: 768, height: 1024 },
  { label: "desktop-1440", width: 1440, height: 900 },
];

const ROUTES = [
  "/",
  "/about", "/experience", "/projects", "/components", "/blog",
  "/components/overlapping-text-hero",
  "/components/telescope-hero", "/components/binary-grid", "/components/bubble-text",
  "/components/magnetic-button", "/components/radial-gradient-card",
  "/projects/astropixel",
  "/projects/krypton", "/projects/3d-portfolio", "/projects/malaria-detection", "/projects/neuralnet",
  "/contact",
];

async function runCrossBrowser() {
  console.log("=======================================================");
  console.log("Running Multi-Engine Cross-Browser Verification");
  console.log(`Target Host: ${BASE_URL}`);
  console.log("Engines: Chromium, Firefox, WebKit");
  console.log("=======================================================\n");

  const results = [];
  const gateFailures = [];
  const engines = [
    { name: "chromium", launcher: () => chromium.launch({ headless: true }) },
    { name: "firefox", launcher: () => firefox.launch({ headless: true }) },
    { name: "webkit", launcher: () => webkit.launch({ headless: true }) },
  ];

  for (const engine of engines) {
    console.log(`\n>>> Testing Engine: ${engine.name.toUpperCase()} <<<`);
    let browser;
    try {
      browser = await engine.launcher();
    } catch (err) {
      const msg = `Engine launch failed: ${engine.name} (${err.message})`;
      console.error(`❌ ${msg}`);
      gateFailures.push(msg);
      continue;
    }

    const version = browser.version();
    console.log(`    Version: ${version}`);

    for (const vp of VIEWPORTS) {
      for (const route of ROUTES) {
        const fullUrl = `${BASE_URL}${route}`;
        const pageRecord = {
          engine: engine.name,
          version,
          viewport: vp.label,
          width: vp.width,
          route,
          url: fullUrl,
          status: null,
          errors: [],
          h1: null,
          documentWidth: null,
          frames: [],
        };

        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
        });
        const page = await context.newPage();

        page.on("pageerror", (err) => {
          pageRecord.errors.push(err.message);
        });

        try {
          const res = await page.goto(fullUrl, { waitUntil: "load", timeout: 30000 });
          pageRecord.status = res ? res.status() : 0;

          if (route.includes("/components/")) {
            await page.waitForSelector("#sandbox-stage iframe", { state: "attached", timeout: 10000 }).catch(() => {});
            // Allow client-side ResizeObserver / matchMedia layout effect to complete
            await page.waitForTimeout(1500);
          } else {
            await page.waitForTimeout(600);
          }

          const evalData = await page.evaluate(() => {
            const h1 = document.querySelector("h1");
            const docWidth = document.documentElement.scrollWidth;
            const iframes = Array.from(document.querySelectorAll("#sandbox-stage iframe")).map((f) => {
              const r = f.getBoundingClientRect();
              const p = f.parentElement ? f.parentElement.getBoundingClientRect() : null;
              return {
                iframeWidth: r.width,
                parentWidth: p ? p.width : null,
                styleWidth: f.style.width,
                styleTransform: f.style.transform,
              };
            });

            return {
              h1Text: h1 ? h1.textContent.trim().replace(/\s+/g, " ") : null,
              docWidth,
              iframes,
            };
          });

          pageRecord.h1 = evalData.h1Text;
          pageRecord.documentWidth = evalData.docWidth;
          pageRecord.frames = evalData.iframes;

          const fitsBounds = (!route.includes("/components/") || evalData.iframes.length === 1) && evalData.iframes.every(f => f.parentWidth > 0 && f.iframeWidth > 0 && f.iframeWidth <= f.parentWidth + 2);
          const fitsDoc = evalData.docWidth <= vp.width + 2;

          if (pageRecord.status !== 200) {
            gateFailures.push(`[${engine.name}] ${vp.label} ${route} returned HTTP ${pageRecord.status} (expected 200)`);
          }
          if (!pageRecord.h1) gateFailures.push(`[${engine.name}] ${route} is missing its primary heading`);
          if (pageRecord.errors.length > 0) {
            gateFailures.push(`[${engine.name}] ${vp.label} ${route} had ${pageRecord.errors.length} page error(s): ${pageRecord.errors.join("; ")}`);
          }
          if (!fitsDoc) {
            gateFailures.push(`[${engine.name}] ${vp.label} ${route} document overflow: ${evalData.docWidth}px > viewport ${vp.width}px`);
          }
          if (!fitsBounds) {
            gateFailures.push(`[${engine.name}] ${vp.label} ${route} iframe exceeded parent bounds`);
          }

          console.log(
            `    [${engine.name}] ${vp.label} ${route} -> Status: ${pageRecord.status} | DocWidth: ${evalData.docWidth}px (Expected: ${vp.width}px) | FrameFit: ${fitsBounds ? "PASS" : "FAIL"}`
          );
        } catch (err) {
          pageRecord.errors.push(err.message);
          gateFailures.push(`[${engine.name}] ${vp.label} ${route} exception: ${err.message}`);
          console.error(`    [${engine.name}] ${vp.label} ${route} -> ERROR: ${err.message}`);
        } finally {
          results.push(pageRecord);
          await context.close();
        }
      }
    }

    await browser.close();
  }

  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\nCross-browser results saved to: ${OUTPUT_FILE}`);

  const expectedTotalRuns = engines.length * VIEWPORTS.length * ROUTES.length;
  if (results.length < expectedTotalRuns) {
    gateFailures.push(`Only completed ${results.length} of ${expectedTotalRuns} planned browser tests`);
  }

  if (gateFailures.length > 0) {
    console.error("\n=======================================================");
    console.error(`CROSS-BROWSER GATE VERIFICATION: FAILED (${gateFailures.length} failure(s))`);
    console.error("=======================================================");
    gateFailures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
    process.exit(1);
  }

  console.log("\n=======================================================");
  console.log("CROSS-BROWSER GATE VERIFICATION: PASSED");
  console.log(`All ${results.length} tests across Chromium, Firefox, WebKit passed with zero errors, zero document overflow, and clean iframe bounds.`);
  console.log("=======================================================\n");
}

runCrossBrowser().catch((err) => {
  console.error("Cross-browser run failed:", err);
  process.exit(1);
});
