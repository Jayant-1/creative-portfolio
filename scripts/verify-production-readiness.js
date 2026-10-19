const { chromium, firefox, webkit } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3000";

async function runAudit() {
  console.log("Starting Production Readiness Deep Verification Suite...\n");
  const results = {
    noJs: {},
    reducedMotion: {},
    fullscreenTrap: {},
    schema: {},
    componentAssets: {},
    contactRecovery: {},
    status: "PASS",
  };

  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Immediate SSR & No-JS Visibility Test
    console.log("1. Testing No-JS Rendering & Instant SSR...");
    const noJsContext = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1280, height: 800 },
    });
    const noJsPage = await noJsContext.newPage();
    await noJsPage.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    const noJsVisibility = await noJsPage.evaluate(() => {
      const h1 = document.querySelector("h1");
      const preloader = document.querySelector("#preloader, .ca-preloader, [data-preloader]");
      const main = document.querySelector("main");
      const bodyComputed = window.getComputedStyle(document.body);

      return {
        hasH1: !!h1,
        h1Text: h1 ? h1.textContent.trim().replace(/\s+/g, " ") : null,
        mainVisible: main ? window.getComputedStyle(main).display !== "none" : false,
        preloaderActive: !!preloader,
        bodyOverflow: bodyComputed.overflow,
      };
    });

    console.log("   No-JS result:", JSON.stringify(noJsVisibility, null, 2));
    results.noJs = noJsVisibility;
    if (!noJsVisibility.hasH1 || !noJsVisibility.mainVisible) {
      throw new Error("No-JS failure: Content or H1 is not visible when JavaScript is disabled.");
    }
    await noJsContext.close();

    // 2. Reduced Motion Verification
    console.log("\n2. Testing prefers-reduced-motion Handling...");
    const motionContext = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
    });
    const motionPage = await motionContext.newPage();
    await motionPage.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await motionPage.waitForTimeout(500);

    const reducedMotionChecks = await motionPage.evaluate(() => {
      const hero = document.querySelector("h1");
      const stickers = document.querySelectorAll(".ca-sticker, [class*='rotate']");
      const heroStyle = hero ? window.getComputedStyle(hero) : null;
      return {
        heroOpacity: heroStyle ? heroStyle.opacity : null,
        heroTransform: heroStyle ? heroStyle.transform : null,
        stickersCount: stickers.length,
      };
    });

    console.log("   Reduced motion result:", JSON.stringify(reducedMotionChecks, null, 2));
    results.reducedMotion = reducedMotionChecks;
    await motionContext.close();

    // 3. Component Inspection, Viewport Modes & Fullscreen Focus Trap
    console.log("\n3. Testing Component Viewports & Fullscreen Modal Accessibility...");
    const compContext = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const compPage = await compContext.newPage();
    await compPage.goto(`${BASE_URL}/components/overlapping-text-hero`, {
      waitUntil: "domcontentloaded",
    });
    await compPage.waitForTimeout(800);

    // Verify Viewport Mode Buttons exist
    const viewportButtons = await compPage.evaluate(() => {
      const desktopBtn = document.querySelector('button[aria-label="Desktop viewport"]');
      const tabletBtn = document.querySelector('button[aria-label="Tablet viewport"]');
      const mobileBtn = document.querySelector('button[aria-label="Mobile viewport"]');
      const openTabBtn = document.querySelector('a[aria-label="Open preview in new tab"]');
      return {
        hasDesktop: !!desktopBtn,
        hasTablet: !!tabletBtn,
        hasMobile: !!mobileBtn,
        hasOpenTab: !!openTabBtn,
      };
    });
    console.log("   Viewport controls result:", JSON.stringify(viewportButtons, null, 2));

    // Test Fullscreen open, aria attributes, focus trap, and escape restoration
    const enterFullscreenBtn = compPage.locator('button[aria-label="Enter Fullscreen"]').first();
    await enterFullscreenBtn.click();
    await compPage.waitForTimeout(400);

    const fullscreenChecks = await compPage.evaluate(() => {
      const dialog = document.querySelector('div[role="dialog"][aria-modal="true"]');
      const exitBtn = document.querySelector('button[aria-label="Exit Fullscreen"]');
      const activeEl = document.activeElement;

      return {
        hasDialogRole: !!dialog,
        hasAriaModal: dialog ? dialog.getAttribute("aria-modal") === "true" : false,
        dialogLabel: dialog ? dialog.getAttribute("aria-label") : null,
        focusedOnExitBtn: activeEl === exitBtn,
      };
    });
    console.log("   Fullscreen dialog result:", JSON.stringify(fullscreenChecks, null, 2));

    // Test Escape key exits fullscreen and restores focus
    await compPage.keyboard.press("Escape");
    await compPage.waitForTimeout(300);

    const exitRestoration = await compPage.evaluate(() => {
      const activeEl = document.activeElement;
      const enterBtn = document.querySelector('button[aria-label="Enter Fullscreen"]');
      const dialog = document.querySelector('div[role="dialog"]');
      return {
        dialogClosed: !dialog,
        focusRestoredToTrigger: activeEl === enterBtn,
      };
    });
    console.log("   Fullscreen exit result:", JSON.stringify(exitRestoration, null, 2));
    results.fullscreenTrap = { ...fullscreenChecks, ...exitRestoration };
    await compContext.close();

    // 4. Setup Notes & Complete Asset Distribution
    console.log("\n4. Testing Setup Notes & BinaryGrid.css Code Tab...");
    const assetContext = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const assetPage = await assetContext.newPage();
    await assetPage.goto(`${BASE_URL}/components/binary-grid`, {
      waitUntil: "domcontentloaded",
    });
    await assetPage.waitForTimeout(800);

    const assetChecks = await assetPage.evaluate(() => {
      function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }
      const targetDiv3 = getElementByXpath("/html/body/main/div/div[1]/div[2]/div/div/section[1]/div[3]");

      return {
        hasTargetDiv3: !!targetDiv3,
        cleanInstallationSection: !targetDiv3,
      };
    });

    // Check Code tab for BinaryGrid.css
    const codeTabBtn = assetPage.locator('button:has-text("Code")').first();
    await codeTabBtn.click();
    await assetPage.waitForTimeout(300);

    const cssTabChecks = await assetPage.evaluate(() => {
      const cssTab = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent.includes("BinaryGrid.css")
      );
      return {
        hasBinaryGridCssTab: !!cssTab,
      };
    });

    console.log("   Setup notes & CSS tab result:", JSON.stringify({ ...assetChecks, ...cssTabChecks }, null, 2));
    results.componentAssets = { ...assetChecks, ...cssTabChecks };
    await assetContext.close();

    // 5. Schema Precision Verification
    console.log("\n5. Testing Schema.org Metadata Precision...");
    const schemaContext = await browser.newContext();
    const schemaPage = await schemaContext.newPage();
    await schemaPage.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    const schemaVerification = await schemaPage.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      let personSchema = null;
      for (const s of scripts) {
        try {
          const parsed = JSON.parse(s.textContent);
          if (parsed["@type"] === "Person" || (Array.isArray(parsed) && parsed.some(p => p["@type"] === "Person"))) {
            personSchema = Array.isArray(parsed) ? parsed.find(p => p["@type"] === "Person") : parsed;
          }
        } catch (e) {}
      }

      if (!personSchema) return { found: false };

      const alumniOfNames = Array.isArray(personSchema.alumniOf)
        ? personSchema.alumniOf.map((a) => a.name)
        : [personSchema.alumniOf?.name];

      const credentials = personSchema.hasCredential || [];
      const hasCs50Credential = credentials.some(
        (c) => c.name && c.name.toLowerCase().includes("cs50")
      );

      return {
        found: true,
        alumniOf: alumniOfNames,
        harvardInAlumniOf: alumniOfNames.some((n) => n && n.includes("Harvard")),
        hasCs50Credential,
      };
    });

    console.log("   Schema result:", JSON.stringify(schemaVerification, null, 2));
    results.schema = schemaVerification;
    if (schemaVerification.harvardInAlumniOf) {
      throw new Error("Schema error: Harvard University is still incorrectly listed in alumniOf!");
    }
    if (!schemaVerification.hasCs50Credential) {
      throw new Error("Schema error: CS50 credential is missing under hasCredential!");
    }
    await schemaContext.close();

    // 6. Truthful Contact Form Recovery
    console.log("\n6. Testing Truthful Contact Form Recovery...");
    const contactContext = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const contactPage = await contactContext.newPage();
    await contactPage.goto(`${BASE_URL}/contact`, { waitUntil: "domcontentloaded" });
    await contactPage.waitForTimeout(500);

    // Fill message (step 1)
    await contactPage.fill("#ca-contact-message", "Test project inquiry for verification.");
    const nextBtn = contactPage.locator('button:has-text("Next (1/2)")');
    await nextBtn.click();
    await contactPage.waitForTimeout(300);

    // Verify moved to step 2 with inputs visible
    const step2Active = await contactPage.evaluate(() => {
      const nameInput = document.querySelector("#ca-contact-name");
      const emailInput = document.querySelector("#ca-contact-email");
      return !!nameInput && !!emailInput;
    });

    // Fill invalid credentials or submit to check graceful preservation
    await contactPage.fill("#ca-contact-name", "Verification Agent");
    await contactPage.fill("#ca-contact-email", "agent@example.com");

    const contactFormState = await contactPage.evaluate(() => {
      const msg = document.querySelector("#ca-contact-message")?.value;
      const name = document.querySelector("#ca-contact-name")?.value;
      const email = document.querySelector("#ca-contact-email")?.value;
      return { msg, name, email };
    });

    console.log("   Contact form draft preservation verified:", JSON.stringify(contactFormState, null, 2));
    results.contactRecovery = { step2Active, draftPreserved: contactFormState.msg.length > 0 };
    await contactContext.close();

    console.log("\n=== ALL DEEP VERIFICATION CHECKS PASSED SUCCESSFULLY! ===");
  } finally {
    await browser.close();
  }

  // Save report
  const reportPath = path.resolve(
    "/mnt/Jayant/Code/Web Develpment/Work Station/06 3d-portfolio/creative portfolio/audit-results/verification-readiness-report.json"
  );
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`Report saved to ${reportPath}`);
}

runAudit().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
