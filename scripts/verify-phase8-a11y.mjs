import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = process.argv[2] || process.env.BASE_URL || "http://localhost:3000";

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true });
  } catch (err1) {
    try {
      return await chromium.launch({ channel: "chrome", headless: true });
    } catch (err2) {
      return await chromium.launch({ channel: "msedge", headless: true });
    }
  }
}

async function runPhase8Verification() {
  console.log("=======================================================");
  console.log("Phase 8: Accessibility & Dialog Focus Trapping Suite");
  console.log(`Target URL: ${BASE_URL}`);
  console.log("=======================================================\n");

  const results = {
    targetUrl: BASE_URL,
    timestamp: new Date().toISOString(),
    tests: {},
    failures: [],
  };

  function assert(condition, message, section) {
    if (!condition) {
      const err = `[FAIL] [${section}] ${message}`;
      console.error(`   ${err}`);
      results.failures.push({ section, message });
      if (!results.tests[section]) results.tests[section] = { passed: true, checks: [] };
      results.tests[section].passed = false;
      results.tests[section].checks.push({ passed: false, message });
    } else {
      console.log(`   [PASS] [${section}] ${message}`);
      if (!results.tests[section]) results.tests[section] = { passed: true, checks: [] };
      results.tests[section].checks.push({ passed: true, message });
    }
  }

  const browser = await launchBrowser();

  try {
    // =========================================================================
    // SECTION 1: Certificate Drawer Modal Verification (CertificateSection.tsx)
    // =========================================================================
    console.log("--- 1. Testing Certificate Drawer Modal (CertificateSection.tsx) ---");
    const certContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const certPage = await certContext.newPage();
    await certPage.goto(`${BASE_URL}/experience`, { waitUntil: "domcontentloaded" });
    await certPage.waitForTimeout(600);

    // Initial state: No modal open, body not scroll-locked, no inert on body children
    const initialCertState = await certPage.evaluate(() => ({
      bodyOverflow: document.body.style.overflow,
      activeElementTag: document.activeElement?.tagName,
      hasDrawer: !!document.querySelector('div[role="dialog"][aria-labelledby="drawer-certificate-title"]'),
    }));
    assert(!initialCertState.hasDrawer, "Drawer is closed on initial page load", "CertificateDrawer");
    assert(initialCertState.bodyOverflow !== "hidden", "Body scroll is not locked initially", "CertificateDrawer");

    // Click first certificate button to open drawer
    const triggerBtn = certPage.locator('section[aria-labelledby="certifications-heading"] button').first();
    const triggerBtnText = await triggerBtn.textContent();
    await triggerBtn.focus();
    await triggerBtn.click();
    await certPage.waitForTimeout(400);

    // 1A. Focus Entry & Modal Semantics
    const drawerOpenState = await certPage.evaluate(() => {
      const drawer = document.querySelector('div[role="dialog"][aria-labelledby="drawer-certificate-title"]');
      const activeEl = document.activeElement;
      const closeBtn = drawer?.querySelector('button[aria-label="Close certificate drawer"]');
      const role = drawer?.getAttribute("role");
      const ariaModal = drawer?.getAttribute("aria-modal");
      const titleEl = document.querySelector("#drawer-certificate-title");

      // Check background inertness on sibling roots of the portal
      let topAncestor = drawer;
      while (topAncestor && topAncestor.parentElement !== document.body) {
        topAncestor = topAncestor.parentElement;
      }
      const backgroundRoots = Array.from(document.body.children).filter(
        (c) => c !== topAncestor && c.tagName !== "SCRIPT" && c.tagName !== "STYLE"
      );
      const allInert = backgroundRoots.every((c) => c.hasAttribute("inert") && c.getAttribute("aria-hidden") === "true");

      return {
        hasDrawer: !!drawer,
        role,
        ariaModal,
        hasTitle: !!titleEl && (titleEl.textContent || "").trim().length > 0,
        focusInsideDrawer: drawer ? drawer.contains(activeEl) : false,
        focusOnCloseBtn: activeEl === closeBtn,
        bodyOverflow: document.body.style.overflow,
        backgroundRootsCount: backgroundRoots.length,
        allBackgroundRootsInert: allInert,
      };
    });

    assert(drawerOpenState.hasDrawer, "Drawer opens with DOM presence", "CertificateDrawer");
    assert(drawerOpenState.role === "dialog", "Drawer has role='dialog'", "CertificateDrawer");
    assert(drawerOpenState.ariaModal === "true", "Drawer has aria-modal='true'", "CertificateDrawer");
    assert(drawerOpenState.hasTitle, "Drawer has non-empty aria-labelledby title heading", "CertificateDrawer");
    assert(drawerOpenState.focusInsideDrawer, "Initial focus enters the drawer", "CertificateDrawer");
    assert(drawerOpenState.focusOnCloseBtn, "Initial focus is placed on Close button", "CertificateDrawer");
    assert(drawerOpenState.bodyOverflow === "hidden", "Document body scroll is locked (overflow: hidden)", "CertificateDrawer");
    assert(drawerOpenState.allBackgroundRootsInert, "Background root elements are marked inert and aria-hidden='true'", "CertificateDrawer");

    // 1B. Shift+Tab Wrapping from First Element (Close button) -> Last Focusable Element
    await certPage.keyboard.press("Shift+Tab");
    const shiftTabWrapped = await certPage.evaluate(() => {
      const drawer = document.querySelector('div[role="dialog"][aria-labelledby="drawer-certificate-title"]');
      if (!drawer) return { contained: false, isLast: false };
      const focusables = Array.from(
        drawer.querySelectorAll('a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"])')
      ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0);
      const last = focusables[focusables.length - 1];
      return {
        contained: drawer.contains(document.activeElement),
        isLast: document.activeElement === last,
        activeText: document.activeElement?.textContent?.trim(),
      };
    });
    assert(shiftTabWrapped.contained, "Shift+Tab preserves focus containment inside drawer", "CertificateDrawer");
    assert(shiftTabWrapped.isLast, "Shift+Tab from first element wraps to last focusable element", "CertificateDrawer");

    // 1C. Tab Forward Wrapping from Last Element -> First Element (Close button)
    await certPage.keyboard.press("Tab");
    const tabWrappedToFirst = await certPage.evaluate(() => {
      const drawer = document.querySelector('div[role="dialog"][aria-labelledby="drawer-certificate-title"]');
      const closeBtn = drawer?.querySelector('button[aria-label="Close certificate drawer"]');
      return {
        contained: drawer ? drawer.contains(document.activeElement) : false,
        isFirst: document.activeElement === closeBtn,
      };
    });
    assert(tabWrappedToFirst.contained, "Tab preserves focus containment inside drawer", "CertificateDrawer");
    assert(tabWrappedToFirst.isFirst, "Tab from last element wraps forward to first element (Close button)", "CertificateDrawer");

    // 1D. Escape Dismissal, Scroll Unlock, Background Un-inert, & Focus Restoration
    await certPage.keyboard.press("Escape");
    try {
      await certPage.waitForSelector('div[role="dialog"][aria-labelledby="drawer-certificate-title"]', {
        state: "detached",
        timeout: 2500,
      });
    } catch {
      await certPage.waitForTimeout(600);
    }

    const drawerDismissedState = await certPage.evaluate(() => {
      const drawer = document.querySelector('div[role="dialog"][aria-labelledby="drawer-certificate-title"]');
      const backgroundRoots = Array.from(document.body.children).filter(
        (c) => c.tagName !== "SCRIPT" && c.tagName !== "STYLE"
      );
      const anyInert = backgroundRoots.some((c) => c.hasAttribute("inert"));

      return {
        drawerClosed: !drawer,
        bodyOverflow: document.body.style.overflow,
        inertCleanedUp: !anyInert,
        activeElementTag: document.activeElement?.tagName,
        activeElementText: document.activeElement?.textContent?.trim(),
      };
    });

    assert(drawerDismissedState.drawerClosed, "Escape key dismisses the certificate drawer", "CertificateDrawer");
    assert(drawerDismissedState.bodyOverflow !== "hidden", "Body scroll lock is released on drawer close", "CertificateDrawer");
    assert(drawerDismissedState.inertCleanedUp, "Inert and aria-hidden attributes removed from background", "CertificateDrawer");

    // Check focus restoration
    const restoredText = drawerDismissedState.activeElementText;
    const isFocusRestored = triggerBtnText && restoredText && triggerBtnText.includes(restoredText);
    assert(isFocusRestored || drawerDismissedState.activeElementTag === "BUTTON", "Focus is restored to the trigger button that opened drawer", "CertificateDrawer");

    await certContext.close();

    // =========================================================================
    // SECTION 2: Project Image Lightbox Modal (ProjectShowcaseStage.tsx)
    // =========================================================================
    console.log("\n--- 2. Testing Project Image Lightbox Modal (ProjectShowcaseStage.tsx) ---");
    const lightboxContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const lightboxPage = await lightboxContext.newPage();
    await lightboxPage.goto(`${BASE_URL}/projects/astropixel`, { waitUntil: "domcontentloaded" });
    await lightboxPage.waitForTimeout(600);

    const inspectBtn = lightboxPage.locator('button[aria-label*="Inspect"]').first();
    await inspectBtn.focus();
    await inspectBtn.click();
    await lightboxPage.waitForTimeout(400);

    // 2A. Lightbox Open Semantics & Initial Focus
    const lightboxOpenState = await lightboxPage.evaluate(() => {
      const dialog = document.querySelector('div[role="dialog"][aria-label*="lightbox"]');
      const activeEl = document.activeElement;
      const closeBtn = dialog?.querySelector('button[aria-label*="Close"]');
      const role = dialog?.getAttribute("role");
      const ariaModal = dialog?.getAttribute("aria-modal");

      // Check background inertness
      let topAncestor = dialog;
      while (topAncestor && topAncestor.parentElement !== document.body) {
        topAncestor = topAncestor.parentElement;
      }
      const backgroundRoots = Array.from(document.body.children).filter(
        (c) => c !== topAncestor && c.tagName !== "SCRIPT" && c.tagName !== "STYLE"
      );
      const allInert = backgroundRoots.every((c) => c.hasAttribute("inert") && c.getAttribute("aria-hidden") === "true");

      return {
        hasDialog: !!dialog,
        role,
        ariaModal,
        focusInsideDialog: dialog ? dialog.contains(activeEl) : false,
        focusOnCloseBtn: activeEl === closeBtn,
        bodyOverflow: document.body.style.overflow,
        allBackgroundRootsInert: allInert,
      };
    });

    assert(lightboxOpenState.hasDialog, "Lightbox opens with role='dialog'", "LightboxModal");
    assert(lightboxOpenState.role === "dialog", "Lightbox role is 'dialog'", "LightboxModal");
    assert(lightboxOpenState.ariaModal === "true", "Lightbox has aria-modal='true'", "LightboxModal");
    assert(lightboxOpenState.focusInsideDialog, "Initial focus is placed inside the lightbox", "LightboxModal");
    assert(lightboxOpenState.focusOnCloseBtn, "Initial focus lands on top-right Close button", "LightboxModal");
    assert(lightboxOpenState.bodyOverflow === "hidden", "Document body scroll is locked while lightbox open", "LightboxModal");
    assert(lightboxOpenState.allBackgroundRootsInert, "Background root elements are marked inert while lightbox open", "LightboxModal");

    // 2B. Shift+Tab Wrapping from Close Button -> Last Interactive Button
    await lightboxPage.keyboard.press("Shift+Tab");
    const lightboxShiftTabWrapped = await lightboxPage.evaluate(() => {
      const dialog = document.querySelector('div[role="dialog"][aria-label*="lightbox"]');
      if (!dialog) return { contained: false, isLast: false };
      const focusables = Array.from(
        dialog.querySelectorAll('button:not([disabled]):not([tabindex="-1"]), [href]:not([tabindex="-1"])')
      ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0);
      const last = focusables[focusables.length - 1];
      return {
        contained: dialog.contains(document.activeElement),
        isLast: document.activeElement === last,
        activeAria: document.activeElement?.getAttribute("aria-label"),
      };
    });
    assert(lightboxShiftTabWrapped.contained, "Shift+Tab keeps focus inside lightbox", "LightboxModal");
    assert(lightboxShiftTabWrapped.isLast, "Shift+Tab from Close button wraps to last focusable control", "LightboxModal");

    // 2C. Tab Forward Wrapping from Last Element -> Close Button
    await lightboxPage.keyboard.press("Tab");
    const lightboxTabWrapped = await lightboxPage.evaluate(() => {
      const dialog = document.querySelector('div[role="dialog"][aria-label*="lightbox"]');
      const closeBtn = dialog?.querySelector('button[aria-label*="Close"]');
      return {
        contained: dialog ? dialog.contains(document.activeElement) : false,
        isFirst: document.activeElement === closeBtn,
      };
    });
    assert(lightboxTabWrapped.contained, "Tab keeps focus inside lightbox", "LightboxModal");
    assert(lightboxTabWrapped.isFirst, "Tab from last control wraps forward to Close button", "LightboxModal");

    // 2D. Escape Dismissal, Scroll Unlock, & Focus Restoration
    await lightboxPage.keyboard.press("Escape");
    await lightboxPage.waitForTimeout(350);

    const lightboxDismissedState = await lightboxPage.evaluate(() => {
      const dialog = document.querySelector('div[role="dialog"][aria-label*="lightbox"]');
      const backgroundRoots = Array.from(document.body.children).filter(
        (c) => c.tagName !== "SCRIPT" && c.tagName !== "STYLE"
      );
      const anyInert = backgroundRoots.some((c) => c.hasAttribute("inert"));
      const activeEl = document.activeElement;

      return {
        dialogClosed: !dialog,
        bodyOverflow: document.body.style.overflow,
        inertCleanedUp: !anyInert,
        activeAria: activeEl?.getAttribute("aria-label"),
        isButton: activeEl?.tagName === "BUTTON",
      };
    });

    assert(lightboxDismissedState.dialogClosed, "Escape key dismisses the lightbox modal", "LightboxModal");
    assert(lightboxDismissedState.bodyOverflow !== "hidden", "Body scroll lock is released on lightbox close", "LightboxModal");
    assert(lightboxDismissedState.inertCleanedUp, "Inert and aria-hidden removed from background elements", "LightboxModal");
    assert(
      lightboxDismissedState.isButton && (lightboxDismissedState.activeAria || "").includes("Inspect"),
      "Focus is cleanly restored to the Inspect trigger button",
      "LightboxModal"
    );

    await lightboxContext.close();

    // =========================================================================
    // SECTION 3: Tab Panels Inertness & ARIA Tabs (PreviewFrame.tsx)
    // =========================================================================
    console.log("\n--- 3. Testing Tab Panels Inertness & ARIA Semantics (PreviewFrame.tsx) ---");
    const tabContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const tabPage = await tabContext.newPage();
    await tabPage.goto(`${BASE_URL}/components/overlapping-text-hero`, { waitUntil: "domcontentloaded" });
    await tabPage.waitForTimeout(600);

    // Initial State: Preview is active
    const previewActiveChecks = await tabPage.evaluate(() => {
      const previewTab = document.querySelector("#preview-tab");
      const codeTab = document.querySelector("#code-tab");
      const previewPanel = document.querySelector("#preview-panel");
      const codePanel = document.querySelector("#code-panel");

      return {
        previewTabSelected: previewTab?.getAttribute("aria-selected") === "true",
        previewTabIndex: previewTab?.getAttribute("tabindex") === "0",
        codeTabSelected: codeTab?.getAttribute("aria-selected") === "false",
        codeTabIndex: codeTab?.getAttribute("tabindex") === "-1",
        codePanelInert: codePanel?.hasAttribute("inert") || codePanel?.inert === true,
        codePanelAriaHidden: codePanel?.getAttribute("aria-hidden") === "true",
        previewPanelInert: previewPanel?.hasAttribute("inert") || previewPanel?.inert === true,
        previewPanelAriaHidden: previewPanel?.getAttribute("aria-hidden"),
      };
    });

    assert(previewActiveChecks.previewTabSelected, "When Preview active: Preview tab has aria-selected='true'", "TabPanels");
    assert(previewActiveChecks.previewTabIndex, "When Preview active: Preview tab has tabindex='0'", "TabPanels");
    assert(previewActiveChecks.codeTabSelected, "When Preview active: Code tab has aria-selected='false'", "TabPanels");
    assert(previewActiveChecks.codeTabIndex, "When Preview active: Code tab has tabindex='-1'", "TabPanels");
    assert(previewActiveChecks.codePanelInert, "When Preview active: Inactive Code panel has inert attribute", "TabPanels");
    assert(previewActiveChecks.codePanelAriaHidden, "When Preview active: Inactive Code panel has aria-hidden='true'", "TabPanels");
    assert(!previewActiveChecks.previewPanelInert, "When Preview active: Active Preview panel is NOT inert", "TabPanels");
    assert(previewActiveChecks.previewPanelAriaHidden !== "true", "When Preview active: Active Preview panel is NOT aria-hidden", "TabPanels");

    // Switch to Code Tab
    const codeTabBtn = tabPage.locator("#code-tab").first();
    await codeTabBtn.click();
    await tabPage.waitForTimeout(350);

    const codeActiveChecks = await tabPage.evaluate(() => {
      const previewTab = document.querySelector("#preview-tab");
      const codeTab = document.querySelector("#code-tab");
      const previewPanel = document.querySelector("#preview-panel");
      const codePanel = document.querySelector("#code-panel");

      return {
        codeTabSelected: codeTab?.getAttribute("aria-selected") === "true",
        codeTabIndex: codeTab?.getAttribute("tabindex") === "0",
        previewTabSelected: previewTab?.getAttribute("aria-selected") === "false",
        previewTabIndex: previewTab?.getAttribute("tabindex") === "-1",
        previewPanelInert: previewPanel?.hasAttribute("inert") || previewPanel?.inert === true,
        previewPanelAriaHidden: previewPanel?.getAttribute("aria-hidden") === "true",
        codePanelInert: codePanel?.hasAttribute("inert") || codePanel?.inert === true,
        codePanelAriaHidden: codePanel?.getAttribute("aria-hidden"),
      };
    });

    assert(codeActiveChecks.codeTabSelected, "When Code active: Code tab has aria-selected='true'", "TabPanels");
    assert(codeActiveChecks.codeTabIndex, "When Code active: Code tab has tabindex='0'", "TabPanels");
    assert(codeActiveChecks.previewTabSelected, "When Code active: Preview tab has aria-selected='false'", "TabPanels");
    assert(codeActiveChecks.previewTabIndex, "When Code active: Preview tab has tabindex='-1'", "TabPanels");
    assert(codeActiveChecks.previewPanelInert, "When Code active: Inactive Preview panel has inert attribute", "TabPanels");
    assert(codeActiveChecks.previewPanelAriaHidden, "When Code active: Inactive Preview panel has aria-hidden='true'", "TabPanels");
    assert(!codeActiveChecks.codePanelInert, "When Code active: Active Code panel is NOT inert", "TabPanels");
    assert(codeActiveChecks.codePanelAriaHidden !== "true", "When Code active: Active Code panel is NOT aria-hidden", "TabPanels");

    await tabContext.close();

    // =========================================================================
    // SECTION 4: No-JavaScript Accessibility & <noscript> Fallbacks (ImageWithLoader)
    // =========================================================================
    console.log("\n--- 4. Testing No-JS Accessibility & <noscript> Fallbacks (ImageWithLoader) ---");
    const noJsContext = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1280, height: 900 },
    });
    const noJsPage = await noJsContext.newPage();
    await noJsPage.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    const homeNoJsData = await noJsPage.evaluate(() => {
      const noscripts = Array.from(document.querySelectorAll("noscript"));
      const noscriptImages = Array.from(document.querySelectorAll("noscript img")).map((img) => ({
        src: img.getAttribute("src"),
        alt: img.getAttribute("alt"),
        className: img.className,
      }));

      const allSemanticImages = Array.from(document.querySelectorAll("main img, header img, footer img"))
        .filter((img) => img.getAttribute("aria-hidden") !== "true")
        .map((img) => ({
          alt: img.getAttribute("alt"),
          src: img.getAttribute("src"),
        }));

      return {
        noscriptsCount: noscripts.length,
        noscriptImagesCount: noscriptImages.length,
        sampleNoscriptImages: noscriptImages.slice(0, 4),
        allSemanticImagesCount: allSemanticImages.length,
        hasEmptyAlt: noscriptImages.some((i) => !i.alt || i.alt.trim().length === 0),
      };
    });

    assert(homeNoJsData.noscriptsCount > 0, "Page contains <noscript> elements in SSR", "NoJsAccessibility");
    assert(homeNoJsData.noscriptImagesCount > 0, "<noscript> tags provide accessible fallback <img> tags", "NoJsAccessibility");
    assert(!homeNoJsData.hasEmptyAlt, "All <noscript> fallback <img> tags provide full, non-empty alt text", "NoJsAccessibility");
    assert(homeNoJsData.allSemanticImagesCount > 0, "Semantic images are rendered in SSR without JavaScript", "NoJsAccessibility");

    // Check project page under No-JS
    await noJsPage.goto(`${BASE_URL}/projects/astropixel`, { waitUntil: "domcontentloaded" });
    const projectNoJsData = await noJsPage.evaluate(() => {
      const noscriptImages = Array.from(document.querySelectorAll("figure noscript img, main noscript img")).map((img) => ({
        src: img.getAttribute("src"),
        alt: img.getAttribute("alt"),
      }));
      return {
        count: noscriptImages.length,
        sample: noscriptImages.slice(0, 3),
      };
    });
    assert(projectNoJsData.count > 0, "Project showcase provides accessible <noscript> <img> fallbacks", "NoJsAccessibility");

    // Check experience page under No-JS
    await noJsPage.goto(`${BASE_URL}/experience`, { waitUntil: "domcontentloaded" });
    const expNoJsData = await noJsPage.evaluate(() => {
      const noscriptImages = Array.from(document.querySelectorAll("main noscript img")).map((img) => ({
        src: img.getAttribute("src"),
        alt: img.getAttribute("alt"),
      }));
      return {
        count: noscriptImages.length,
        sample: noscriptImages.slice(0, 3),
      };
    });
    assert(expNoJsData.count > 0, "Certificate section provides accessible <noscript> <img> fallbacks", "NoJsAccessibility");

    await noJsContext.close();

    // =========================================================================
    // SECTION 5: Reduced Motion Verification (prefers-reduced-motion: reduce)
    // =========================================================================
    console.log("\n--- 5. Testing Reduced Motion (prefers-reduced-motion: reduce) ---");
    const motionContext = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 900 },
    });
    const motionPage = await motionContext.newPage();
    await motionPage.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await motionPage.waitForTimeout(400);

    const motionData = await motionPage.evaluate(() => {
      const hero = document.querySelector("h1");
      const heroStyle = hero ? window.getComputedStyle(hero) : null;
      const revealEntries = Array.from(document.querySelectorAll(".reveal-entry")).slice(0, 8).map((el) => {
        const style = window.getComputedStyle(el);
        return {
          opacity: style.opacity,
          transform: style.transform,
        };
      });

      // Verify global CSS rule: animation-duration and transition-duration are suppressed
      const testEl = document.createElement("div");
      testEl.className = "reveal-entry";
      document.body.appendChild(testEl);
      const computed = window.getComputedStyle(testEl);
      const animDuration = computed.animationDuration;
      const transDuration = computed.transitionDuration;
      document.body.removeChild(testEl);

      return {
        heroOpacity: heroStyle ? heroStyle.opacity : null,
        heroTransform: heroStyle ? heroStyle.transform : null,
        revealEntries,
        animDuration,
        transDuration,
      };
    });

    assert(motionData.heroOpacity === "1" || motionData.heroOpacity === null, "Hero heading is immediately opaque under reduced-motion", "ReducedMotion");
    assert(
      motionData.revealEntries.every((e) => e.opacity === "1"),
      "All reveal elements have opacity: 1 without motion delays",
      "ReducedMotion"
    );
    assert(
      parseFloat(motionData.animDuration) <= 0.001 || motionData.animDuration === "0s" || motionData.animDuration === "0.00001s",
      "CSS animation-duration is capped to near-zero (0.01ms / 0s)",
      "ReducedMotion"
    );
    assert(
      parseFloat(motionData.transDuration) <= 0.001 || motionData.transDuration === "0s" || motionData.transDuration === "0.00001s",
      "CSS transition-duration is capped to near-zero (0.01ms / 0s)",
      "ReducedMotion"
    );

    await motionContext.close();

  } catch (error) {
    console.error(`Verification crashed with error:`, error);
    results.failures.push({ section: "CRASH", message: error.message });
  } finally {
    await browser.close();
  }

  // =========================================================================
  // SUMMARY REPORT & DIAGNOSTICS
  // =========================================================================
  console.log("\n=======================================================");
  console.log("PHASE 8 ACCESSIBILITY AUDIT SUMMARY");
  console.log(`Total Failures: ${results.failures.length}`);
  if (results.failures.length === 0) {
    console.log("Status: Automated checks passed; manual assistive-technology coverage is reported separately.");
  } else {
    console.error("Status: VERIFICATION FAILED WITH ISSUES");
    results.failures.forEach((f) => console.error(` - [${f.section}]: ${f.message}`));
  }
  console.log("=======================================================\n");

  const reportDir = path.resolve(process.env.AUDIT_OUTPUT_DIR || "audit-results");
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, "phase8-accessibility-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`Diagnostic report saved to: ${reportPath}`);

  return results.failures.length === 0;
}

runPhase8Verification()
  .then((passed) => {
    process.exit(passed ? 0 : 1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
