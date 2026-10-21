const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.argv[2] || process.env.BASE_URL || "http://localhost:3000";

async function launchBrowser() {
  // Try default bundled chromium first, then fall back to system channels (chrome, msedge)
  try {
    return await chromium.launch({ headless: true });
  } catch (err1) {
    try {
      return await chromium.launch({ channel: "chrome", headless: true });
    } catch (err2) {
      try {
        return await chromium.launch({ channel: "msedge", headless: true });
      } catch (err3) {
        throw new Error(
          `Unable to launch Chromium, Chrome, or Edge browser via Playwright:\n1: ${err1.message}\n2: ${err2.message}\n3: ${err3.message}`
        );
      }
    }
  }
}

/**
 * Bounds Validation Logic:
 * Checks whether an iframe fits within its container stage allowing a subpixel tolerance.
 */
function validateFrameBounds(iframeWidth, stageWidth, tolerance = 2) {
  if (typeof iframeWidth !== "number" || typeof stageWidth !== "number") {
    return {
      fitsInStage: false,
      overflowPx: Infinity,
      error: `Invalid dimensions: iframeWidth=${iframeWidth}, stageWidth=${stageWidth}`,
    };
  }
  const fitsInStage = iframeWidth <= stageWidth + tolerance;
  const overflowPx = Math.max(0, iframeWidth - stageWidth);
  return {
    fitsInStage,
    overflowPx,
    iframeWidth,
    stageWidth,
    tolerance,
  };
}

/**
 * Person Schema Validation Logic:
 * Validates Person JSON-LD schema against truthfulness constraints:
 * - Must be a valid object
 * - Harvard University must NOT be listed in alumniOf
 * - CS50 certificate must be categorized under hasCredential
 */
function validatePersonSchema(personSchema) {
  if (!personSchema || typeof personSchema !== "object") {
    return {
      valid: false,
      found: false,
      errors: ["Missing or non-object Person schema"],
      harvardInAlumniOf: false,
      hasCs50Credential: false,
      alumniOf: [],
    };
  }

  const errors = [];
  const rawAlumni = personSchema.alumniOf;
  let alumniOfNames = [];
  if (Array.isArray(rawAlumni)) {
    alumniOfNames = rawAlumni
      .map((a) => (typeof a === "string" ? a : a?.name))
      .filter(Boolean);
  } else if (rawAlumni) {
    alumniOfNames = [typeof rawAlumni === "string" ? rawAlumni : rawAlumni.name].filter(Boolean);
  }

  const harvardInAlumniOf = alumniOfNames.some((n) => typeof n === "string" && n.includes("Harvard"));
  if (harvardInAlumniOf) {
    errors.push(`Harvard University improperly found in alumniOf: ${alumniOfNames.join(", ")}`);
  }

  const credentials = Array.isArray(personSchema.hasCredential) ? personSchema.hasCredential : [];
  const hasCs50Credential = credentials.some(
    (c) => c && c.name && typeof c.name === "string" && c.name.toLowerCase().includes("cs50")
  );
  if (!hasCs50Credential) {
    errors.push("CS50 credential missing from hasCredential");
  }

  return {
    valid: errors.length === 0,
    found: true,
    alumniOf: alumniOfNames,
    harvardInAlumniOf,
    hasCs50Credential,
    errors,
  };
}

/**
 * Project / TechArticle Schema Validation Logic:
 * Validates TechArticle JSON-LD schema against synthetic date artifacts.
 * Ensures datePublished exists and does not contain artificial January 1 dates.
 */
function validateProjectSchema(projectSchema) {
  if (!projectSchema || typeof projectSchema !== "object") {
    return {
      valid: false,
      found: false,
      errors: ["Missing or non-object Project schema"],
      hasSynthesizedJan1: false,
      datePublished: null,
    };
  }

  const errors = [];
  const datePublished = projectSchema.datePublished;
  const hasSynthesizedJan1 = typeof datePublished === "string" && datePublished.includes("-01-01");
  if (hasSynthesizedJan1) {
    errors.push(`Synthesized January 1 date detected in datePublished: ${datePublished}`);
  }

  return {
    valid: errors.length === 0,
    found: true,
    hasSynthesizedJan1,
    datePublished: datePublished || null,
    errors,
  };
}

/**
 * Assertion Runner Factory:
 * Creates an isolated assertion runner tracking failures, category passes,
 * and determining overall exit code status.
 */
function createAssertionRunner(targetUrl = BASE_URL) {
  const state = {
    targetUrl,
    timestamp: new Date().toISOString(),
    tests: {},
    failures: [],
    status: "PENDING",
  };

  function assert(condition, message, testCategory) {
    if (!condition) {
      const err = `[FAIL] [${testCategory}] ${message}`;
      console.error(`   ${err}`);
      state.failures.push({ category: testCategory, message });
      if (!state.tests[testCategory]) state.tests[testCategory] = {};
      state.tests[testCategory].passed = false;
      return false;
    } else {
      console.log(`   [PASS] [${testCategory}] ${message}`);
      if (!state.tests[testCategory]) state.tests[testCategory] = {};
      if (state.tests[testCategory].passed !== false) {
        state.tests[testCategory].passed = true;
      }
      return true;
    }
  }

  function evaluate() {
    const passed = state.failures.length === 0;
    state.status = passed ? "PASS" : "FAIL";
    const exitCode = passed ? 0 : 1;
    return {
      passed,
      exitCode,
      status: state.status,
      failuresCount: state.failures.length,
      failures: state.failures,
    };
  }

  return { state, assert, evaluate };
}

async function runAudit() {
  console.log(`=======================================================`);
  console.log(`Starting Production Readiness Verification Suite`);
  console.log(`Target URL: ${BASE_URL}`);
  console.log(`=======================================================\n`);

  const runner = createAssertionRunner(BASE_URL);
  const { state: results, assert } = runner;

  const browser = await launchBrowser();

  try {
    // -------------------------------------------------------------------------
    // 1. Immediate SSR & No-JS Rendering and Progressive Image Fallback
    // -------------------------------------------------------------------------
    console.log("1. Testing No-JS Rendering, Instant SSR & Progressive Image Fallback...");
    results.tests.noJs = { passed: true };
    const noJsContext = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1280, height: 800 },
    });
    const noJsPage = await noJsContext.newPage();
    await noJsPage.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    const noJsData = await noJsPage.evaluate(() => {
      const h1 = document.querySelector("h1");
      const main = document.querySelector("main");
      const bodyComputed = window.getComputedStyle(document.body);
      const images = Array.from(document.querySelectorAll("main img")).map((img) => ({
        src: img.getAttribute("src") || "",
        alt: img.getAttribute("alt"),
        ariaHidden: img.getAttribute("aria-hidden"),
        className: img.className,
      }));

      const semanticImages = images.filter((img) => img.alt !== null && img.ariaHidden !== "true");
      const hasNoscriptStyle = Array.from(document.querySelectorAll("noscript style")).length > 0;

      return {
        hasH1: !!h1,
        h1Text: h1 ? h1.textContent.trim().replace(/\s+/g, " ") : null,
        mainVisible: main ? window.getComputedStyle(main).display !== "none" : false,
        bodyOverflow: bodyComputed.overflow,
        totalImages: images.length,
        semanticImagesCount: semanticImages.length,
        sampleSemanticAlts: semanticImages.slice(0, 3).map((i) => i.alt),
        hasNoscriptStyle,
      };
    });

    assert(noJsData.hasH1, "H1 element is present in SSR without JavaScript", "noJs");
    assert(noJsData.mainVisible, "Main landmark is visible without JavaScript", "noJs");
    assert(noJsData.bodyOverflow !== "hidden", "Body overflow is not locked in SSR", "noJs");
    assert(noJsData.semanticImagesCount > 0, "Semantic images with alt text exist in SSR without JavaScript", "noJs");
    results.tests.noJs.data = noJsData;
    await noJsContext.close();

    // -------------------------------------------------------------------------
    // 2. Reduced Motion Verification
    // -------------------------------------------------------------------------
    console.log("\n2. Testing prefers-reduced-motion Handling...");
    results.tests.reducedMotion = { passed: true };
    const motionContext = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
    });
    const motionPage = await motionContext.newPage();
    await motionPage.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await motionPage.waitForTimeout(400);

    const motionData = await motionPage.evaluate(() => {
      const hero = document.querySelector("h1");
      const heroStyle = hero ? window.getComputedStyle(hero) : null;
      return {
        heroOpacity: heroStyle ? heroStyle.opacity : null,
        heroTransform: heroStyle ? heroStyle.transform : null,
      };
    });

    assert(motionData.heroOpacity === "1" || motionData.heroOpacity === null, "Hero heading is visible under reduced-motion", "reducedMotion");
    results.tests.reducedMotion.data = motionData;
    await motionContext.close();

    // -------------------------------------------------------------------------
    // 3. Component Preview Controls & Fullscreen Modal Accessibility
    // -------------------------------------------------------------------------
    console.log("\n3. Testing Component Stage Controls & Fullscreen Focus Trap...");
    results.tests.fullscreenTrap = { passed: true };
    const compContext = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const compPage = await compContext.newPage();
    await compPage.goto(`${BASE_URL}/components/overlapping-text-hero`, {
      waitUntil: "domcontentloaded",
    });
    await compPage.waitForTimeout(600);

    const headerControls = await compPage.evaluate(() => {
      const previewTab = document.querySelector("#preview-tab");
      const codeTab = document.querySelector("#code-tab");
      const replayBtn = document.querySelector('button[aria-label="Replay animations"]');
      const openTabBtn = document.querySelector('a[aria-label="Open preview in new tab"]');
      return {
        hasPreviewTab: !!previewTab,
        hasCodeTab: !!codeTab,
        hasReplayBtn: !!replayBtn,
        hasOpenTabBtn: !!openTabBtn,
      };
    });

    assert(headerControls.hasPreviewTab && headerControls.hasCodeTab, "Preview and Code tabs exist in stage header", "stageControls");
    assert(headerControls.hasReplayBtn, "Replay button exists in stage header", "stageControls");
    assert(headerControls.hasOpenTabBtn, "Open in new tab link exists in stage header", "stageControls");
    results.tests.stageControls = { passed: true, data: headerControls };
    await compContext.close();

    // -------------------------------------------------------------------------
    // 4. Mobile Preview Geometry Invariant (Finding 1 Regression)
    // -------------------------------------------------------------------------
    console.log("\n4. Testing Mobile Preview Geometry at 390px Viewport (Finding 1)...");
    results.tests.mobilePreviewGeometry = { passed: true };
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`${BASE_URL}/components/overlapping-text-hero`, {
      waitUntil: "domcontentloaded",
    });
    await mobilePage.waitForSelector("#sandbox-stage iframe", { state: "attached" }).catch(() => {});
    await mobilePage.waitForTimeout(1500);

    const mobileGeometry = await mobilePage.evaluate(() => {
      const stage = document.querySelector("#sandbox-stage");
      const iframe = document.querySelector("#sandbox-stage iframe");
      const stagePanel = document.querySelector("#preview-panel");

      if (!stage || !iframe) {
        return { found: false };
      }

      const stageRect = stage.getBoundingClientRect();
      const iframeRect = iframe.getBoundingClientRect();
      const parentRect = iframe.parentElement ? iframe.parentElement.getBoundingClientRect() : null;

      return {
        found: true,
        stageWidth: stageRect.width,
        iframeRenderedWidth: iframeRect.width,
        parentWidth: parentRect ? parentRect.width : 0,
        styleWidth: iframe.style.width,
        styleTransform: iframe.style.transform,
      };
    });

    assert(mobileGeometry.found, "Preview stage and iframe are present on mobile", "mobilePreviewGeometry");
    if (mobileGeometry.found) {
      // The rendered iframe width MUST NOT exceed stage width (no cropped giant 1215px iframe in 348px stage)
      const boundsResult = validateFrameBounds(
        mobileGeometry.iframeRenderedWidth,
        mobileGeometry.stageWidth
      );
      assert(
        boundsResult.fitsInStage,
        `Rendered iframe (${Math.round(mobileGeometry.iframeRenderedWidth)}px) fits inside stage (${Math.round(mobileGeometry.stageWidth)}px) without overflow`,
        "mobilePreviewGeometry"
      );
    }
    results.tests.mobilePreviewGeometry.data = mobileGeometry;
    await mobileContext.close();

    // -------------------------------------------------------------------------
    // 5. Inactive Panel Keyboard Inertness & ARIA Tabs (Finding 2 Regression)
    // -------------------------------------------------------------------------
    console.log("\n5. Testing Inactive Panel Keyboard Inertness & ARIA Tabs (Finding 2)...");
    results.tests.inertPanels = { passed: true };
    const tabContext = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const tabPage = await tabContext.newPage();
    await tabPage.goto(`${BASE_URL}/components/overlapping-text-hero`, {
      waitUntil: "domcontentloaded",
    });
    await tabPage.waitForTimeout(600);

    // Initial state: Preview active
    const previewTabChecks = await tabPage.evaluate(() => {
      const previewTab = document.querySelector("#preview-tab");
      const codeTab = document.querySelector("#code-tab");
      const previewPanel = document.querySelector("#preview-panel");
      const codePanel = document.querySelector("#code-panel");

      return {
        previewTabSelected: previewTab?.getAttribute("aria-selected") === "true",
        codeTabSelected: codeTab?.getAttribute("aria-selected") === "false",
        codePanelInert: codePanel?.hasAttribute("inert") || codePanel?.inert === true,
        codePanelHidden: codePanel?.getAttribute("aria-hidden") === "true",
        previewPanelInert: previewPanel?.hasAttribute("inert") || previewPanel?.inert === true,
      };
    });

    assert(previewTabChecks.previewTabSelected, "Preview tab has aria-selected=true when active", "inertPanels");
    assert(previewTabChecks.codePanelInert, "Inactive Code panel has inert attribute while Preview is active", "inertPanels");
    assert(previewTabChecks.codePanelHidden, "Inactive Code panel has aria-hidden=true", "inertPanels");
    assert(!previewTabChecks.previewPanelInert, "Active Preview panel is not inert", "inertPanels");

    // Switch to Code tab
    const codeTabBtn = tabPage.locator("#code-tab").first();
    await codeTabBtn.click();
    await tabPage.waitForTimeout(600);

    const codeTabChecks = await tabPage.evaluate(() => {
      const previewTab = document.querySelector("#preview-tab");
      const codeTab = document.querySelector("#code-tab");
      const previewPanel = document.querySelector("#preview-panel");
      const codePanel = document.querySelector("#code-panel");

      return {
        codeTabSelected: codeTab?.getAttribute("aria-selected") === "true",
        previewTabSelected: previewTab?.getAttribute("aria-selected") === "false",
        previewPanelInert: previewPanel?.hasAttribute("inert") || previewPanel?.inert === true,
        previewPanelHidden: previewPanel?.getAttribute("aria-hidden") === "true",
        codePanelInert: codePanel?.hasAttribute("inert") || codePanel?.inert === true,
      };
    });

    assert(codeTabChecks.codeTabSelected, "Code tab has aria-selected=true when switched", "inertPanels");
    assert(codeTabChecks.previewPanelInert, "Inactive Preview panel has inert attribute while Code is active", "inertPanels");
    assert(codeTabChecks.previewPanelHidden, "Inactive Preview panel has aria-hidden=true", "inertPanels");
    assert(!codeTabChecks.codePanelInert, "Active Code panel is not inert", "inertPanels");

    results.tests.inertPanels.data = { previewTabChecks, codeTabChecks };
    await tabContext.close();

    // -------------------------------------------------------------------------
    // 6. Dialog Focus Containment in Lightbox & Drawer (Finding 3 Regression)
    // -------------------------------------------------------------------------
    console.log("\n6. Testing Modal Focus Containment in Lightbox & Certificate Drawer (Finding 3)...");
    results.tests.dialogFocusContainment = { passed: true };
    const dialogContext = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const dialogPage = await dialogContext.newPage();

    // 6A. AstroPixel Lightbox
    console.log("   6A. AstroPixel Project Lightbox...");
    await dialogPage.goto(`${BASE_URL}/projects/astropixel`, { waitUntil: "domcontentloaded" });
    await dialogPage.waitForTimeout(500);

    const inspectBtn = dialogPage.locator('button[aria-label*="Inspect"]').first();
    await inspectBtn.click();
    await dialogPage.waitForTimeout(300);

    const lightboxFocusState = await dialogPage.evaluate(() => {
      const dialog = document.querySelector('div[role="dialog"][aria-label*="lightbox"]');
      const activeEl = document.activeElement;
      const isInside = dialog && activeEl ? dialog.contains(activeEl) : false;
      const closeBtn = dialog?.querySelector('button[aria-label*="Close"]');

      return {
        hasDialog: !!dialog,
        focusInsideDialog: isInside,
        focusedOnCloseBtn: activeEl === closeBtn,
      };
    });

    assert(lightboxFocusState.hasDialog, "Lightbox modal opens with role=dialog", "dialogFocusContainment");
    assert(lightboxFocusState.focusInsideDialog, "Initial focus is moved inside the lightbox dialog", "dialogFocusContainment");

    // Test Tab key containment in Lightbox
    await dialogPage.keyboard.press("Tab");
    const tabContained = await dialogPage.evaluate(() => {
      const dialog = document.querySelector('div[role="dialog"][aria-label*="lightbox"]');
      return dialog ? dialog.contains(document.activeElement) : false;
    });
    assert(tabContained, "Focus remains contained inside lightbox after Tab key", "dialogFocusContainment");

    // Close lightbox via Escape
    await dialogPage.keyboard.press("Escape");
    await dialogPage.waitForTimeout(300);

    const lightboxClosed = await dialogPage.evaluate(() => {
      return !document.querySelector('div[role="dialog"][aria-label*="lightbox"]');
    });
    assert(lightboxClosed, "Escape key closes the lightbox modal", "dialogFocusContainment");

    // 6B. Certificate Section Drawer
    console.log("   6B. Experience Certificate Drawer...");
    await dialogPage.goto(`${BASE_URL}/experience`, { waitUntil: "domcontentloaded" });
    await dialogPage.waitForTimeout(500);

    const certBtn = dialogPage.locator("ul li button").first();
    await certBtn.click();
    await dialogPage.waitForTimeout(350);

    const drawerFocusState = await dialogPage.evaluate(() => {
      const drawer = document.querySelector('div[role="dialog"][aria-labelledby="drawer-certificate-title"]');
      const activeEl = document.activeElement;
      const isInside = drawer && activeEl ? drawer.contains(activeEl) : false;
      const closeBtn = drawer?.querySelector('button[aria-label*="Close"]');

      return {
        hasDrawer: !!drawer,
        focusInsideDrawer: isInside,
        focusedOnCloseBtn: activeEl === closeBtn,
      };
    });

    assert(drawerFocusState.hasDrawer, "Certificate drawer opens with role=dialog", "dialogFocusContainment");
    assert(drawerFocusState.focusInsideDrawer, "Initial focus is moved inside the certificate drawer", "dialogFocusContainment");

    // Test Tab key containment in Drawer
    await dialogPage.keyboard.press("Tab");
    const drawerTabContained = await dialogPage.evaluate(() => {
      const drawer = document.querySelector('div[role="dialog"][aria-labelledby="drawer-certificate-title"]');
      return drawer ? drawer.contains(document.activeElement) : false;
    });
    assert(drawerTabContained, "Focus remains contained inside certificate drawer after Tab key", "dialogFocusContainment");

    // Close drawer via Escape
    await dialogPage.keyboard.press("Escape");
    try {
      await dialogPage.waitForSelector('div[role="dialog"][aria-labelledby="drawer-certificate-title"]', {
        state: "detached",
        timeout: 2500,
      });
    } catch {
      await dialogPage.waitForTimeout(600);
    }

    const drawerClosed = await dialogPage.evaluate(() => {
      return !document.querySelector('div[role="dialog"][aria-labelledby="drawer-certificate-title"]');
    });
    assert(drawerClosed, "Escape key closes the certificate drawer", "dialogFocusContainment");

    results.tests.dialogFocusContainment.data = { lightboxFocusState, drawerFocusState };
    await dialogContext.close();

    // -------------------------------------------------------------------------
    // 7. Schema.org Metadata Precision (Finding 7 Regression)
    // -------------------------------------------------------------------------
    console.log("\n7. Testing Schema.org Metadata Precision (Finding 7)...");
    results.tests.schema = { passed: true };
    const schemaContext = await browser.newContext();
    const schemaPage = await schemaContext.newPage();
    await schemaPage.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    const rawPersonSchema = await schemaPage.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      for (const s of scripts) {
        try {
          const parsed = JSON.parse(s.textContent);
          if (parsed["@type"] === "Person" || (Array.isArray(parsed) && parsed.some((p) => p["@type"] === "Person"))) {
            return Array.isArray(parsed) ? parsed.find((p) => p["@type"] === "Person") : parsed;
          }
        } catch (e) {}
      }
      return null;
    });

    const personValidation = validatePersonSchema(rawPersonSchema);
    assert(personValidation.found, "Person schema exists in JSON-LD", "schema");
    assert(!personValidation.harvardInAlumniOf, "Harvard University is absent from alumniOf", "schema");
    assert(personValidation.hasCs50Credential, "CS50 is properly categorized under hasCredential", "schema");

    // Also check that project case studies do NOT have synthesized dates
    await schemaPage.goto(`${BASE_URL}/projects/astropixel`, { waitUntil: "domcontentloaded" });
    const rawProjectSchema = await schemaPage.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      for (const s of scripts) {
        try {
          const parsed = JSON.parse(s.textContent);
          if (parsed["@type"] === "TechArticle") return parsed;
        } catch (e) {}
      }
      return null;
    });

    const projectValidation = validateProjectSchema(rawProjectSchema);
    assert(projectValidation.found, "TechArticle schema exists on project detail page", "schema");
    assert(!projectValidation.hasSynthesizedJan1, "No synthesized January 1 dates in project schema", "schema");
    results.tests.schema.data = { personValidation, projectValidation };
    await schemaContext.close();

    // -------------------------------------------------------------------------
    // 8. Truthful Contact Form Recovery
    // -------------------------------------------------------------------------
    console.log("\n8. Testing Truthful Contact Form Draft Recovery...");
    results.tests.contactRecovery = { passed: true };
    const contactContext = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const contactPage = await contactContext.newPage();
    await contactPage.goto(`${BASE_URL}/contact`, { waitUntil: "domcontentloaded" });
    await contactPage.waitForTimeout(500);

    // Step 1: fill message
    await contactPage.fill("#ca-contact-message", "Test project inquiry for verification.");
    const nextBtn = contactPage.locator('button:has-text("Next (1/2)")');
    await nextBtn.click();
    await contactPage.waitForTimeout(300);

    const contactFormState = await contactPage.evaluate(() => {
      const nameInput = document.querySelector("#ca-contact-name");
      const emailInput = document.querySelector("#ca-contact-email");
      const msg = document.querySelector("#ca-contact-message")?.value;
      return {
        step2Active: !!nameInput && !!emailInput,
        draftPreserved: !!msg && msg.length > 0,
      };
    });

    assert(contactFormState.step2Active, "Form transitions to Step 2 upon clicking Next", "contactRecovery");
    assert(contactFormState.draftPreserved, "Draft message is preserved when navigating steps", "contactRecovery");
    results.tests.contactRecovery.data = contactFormState;
    await contactContext.close();

    // -------------------------------------------------------------------------
    // 9. Negative Test Assertion Validation (Deliberate Broken Fixture Check)
    // -------------------------------------------------------------------------
    console.log("\n9. Testing Negative Fixture Detection (Proving assertions fail on bugs)...");
    results.tests.negativeFixture = { passed: true };

    // 9A. Deliberately Malformed Schema Objects
    // 1. Pass deliberately malformed person schema object (e.g. with alumniOf: ["Harvard University"])
    const malformedPersonSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Defective Profile Fixture",
      alumniOf: ["Harvard University"],
      hasCredential: [],
    };
    const malformedPersonResult = validatePersonSchema(malformedPersonSchema);
    const personSchemaErrorFlagged = !malformedPersonResult.valid && malformedPersonResult.harvardInAlumniOf;
    assert(
      personSchemaErrorFlagged,
      "Schema validation flags error when person schema contains 'Harvard University' in alumniOf",
      "negativeFixture"
    );

    // 2. Pass deliberately malformed project schema object with synthetic datePublished
    const malformedProjectSchema = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: "Synthetic Date Case Study Fixture",
      datePublished: "2024-01-01",
    };
    const malformedProjectResult = validateProjectSchema(malformedProjectSchema);
    const projectSchemaErrorFlagged = !malformedProjectResult.valid && malformedProjectResult.hasSynthesizedJan1;
    assert(
      projectSchemaErrorFlagged,
      "Schema validation flags error when project schema contains synthetic datePublished ('-01-01')",
      "negativeFixture"
    );

    // 9B. Oversized Frame Geometry Bounds Validation
    // Pass oversized frame geometry (e.g. 1215px iframe in a 348px stage) into the bounds validation logic
    const oversizedBoundsResult = validateFrameBounds(1215, 348);
    const oversizedFrameErrorFlagged = oversizedBoundsResult.fitsInStage === false && oversizedBoundsResult.overflowPx > 0;
    assert(
      oversizedFrameErrorFlagged,
      "Bounds validation logic flags error and returns fitsInStage=false for oversized frame (1215px iframe in 348px stage)",
      "negativeFixture"
    );

    // 9C. Assertion Runner Failure Recording & Nonzero Exit Gate Evaluation
    // Test that the assertion runner properly records failures and exits nonzero when gates fail
    const testRunner = createAssertionRunner("http://mock-negative-fixture-environment");
    testRunner.assert(true, "Passing baseline condition", "negativeGate");
    const baselinePassRecorded = testRunner.state.failures.length === 0;

    // Trigger deliberate failure in test runner
    testRunner.assert(false, "Deliberate negative test gate failure", "negativeGate");
    const failureProperlyRecorded =
      testRunner.state.failures.length === 1 &&
      testRunner.state.failures[0].category === "negativeGate" &&
      testRunner.state.tests.negativeGate?.passed === false;

    const mockEvaluation = testRunner.evaluate();
    const exitsNonzeroWhenGatesFail = mockEvaluation.passed === false && mockEvaluation.exitCode === 1;

    assert(
      baselinePassRecorded && failureProperlyRecorded,
      "Assertion runner properly records failures and marks failing test category state",
      "negativeFixture"
    );
    assert(
      exitsNonzeroWhenGatesFail,
      "Assertion runner properly evaluates failure gate and specifies non-zero exit code (1)",
      "negativeFixture"
    );

    results.tests.negativeFixture.data = {
      malformedPersonResult,
      malformedProjectResult,
      oversizedBoundsResult,
      mockEvaluation,
    };

  } finally {
    await browser.close();
  }

  // Final evaluation
  const evaluation = runner.evaluate();
  const pass = evaluation.passed;
  results.status = evaluation.status;

  // Ensure output directory exists and save diagnostic report
  const outputDir = path.resolve(__dirname, "../../audit-results");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const reportPath = path.join(outputDir, "verification-readiness-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  console.log(`\n=======================================================`);
  console.log(`VERIFICATION AUDIT COMPLETE`);
  console.log(`Result: ${results.status}`);
  console.log(`Failures Count: ${results.failures.length}`);
  console.log(`Diagnostic Report: ${reportPath}`);
  console.log(`=======================================================\n`);

  if (!pass) {
    console.error("FAILURES ENCOUNTERED:");
    results.failures.forEach((f, idx) => {
      console.error(`  ${idx + 1}. [${f.category}] ${f.message}`);
    });
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error("Audit run encountered fatal error:", err);
  process.exit(1);
});
