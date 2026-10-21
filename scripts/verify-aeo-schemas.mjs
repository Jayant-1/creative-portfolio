import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUTPUT_DIR = path.resolve(__dirname, "../audit-results");
const REPORT_PATH = path.join(OUTPUT_DIR, "aeo-schema-verification-report.json");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const auditResults = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  passed: true,
  summary: {
    routesAudited: 0,
    schemasAudited: 0,
    assertionsPassed: 0,
    assertionsFailed: 0,
  },
  failures: [],
  routes: {},
};

function recordAssert(condition, message, route) {
  if (condition) {
    auditResults.summary.assertionsPassed++;
    console.log(`   [PASS] ${message}`);
  } else {
    auditResults.summary.assertionsFailed++;
    auditResults.passed = false;
    const failureMsg = `[FAIL] ${route}: ${message}`;
    auditResults.failures.push(failureMsg);
    console.error(`   ${failureMsg}`);
  }
}

// 1. Fetch raw SSR HTML to verify what search bots (Googlebot, Bingbot, etc.) parse
async function getSSRSchemas(route) {
  const res = await fetch(`${BASE_URL}${route}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${route}: HTTP ${res.status}`);
  }
  const html = await res.text();
  const scriptRegex = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  const schemas = [];
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) {
        schemas.push(...parsed);
      } else {
        schemas.push(parsed);
      }
    } catch (e) {
      schemas.push({ error: e.message, raw: match[1] });
    }
  }
  return schemas;
}

async function runVerification() {
  console.log("=======================================================");
  console.log("Phase 6: AEO & Structured Content Verification Suite");
  console.log(`Target: ${BASE_URL}`);
  console.log("=======================================================");

  const projectSlugs = [
    "astropixel",
    "krypton",
    "malaria-detection",
    "neuralnet",
    "3d-portfolio",
  ];

  const componentSlugs = [
    "bubble-text",
    "magnetic-button",
    "radial-gradient-card",
    "telescope-hero",
    "overlapping-text-hero",
    "binary-grid",
  ];

  const allRoutes = [
    "/",
    "/about",
    "/projects",
    ...projectSlugs.map((s) => `/projects/${s}`),
    "/components",
    ...componentSlugs.map((s) => `/components/${s}`),
    "/experience",
    "/contact",
    "/blog",
  ];

  // SECTION 1: SSR Crawler-View Validation for All 18 Routes
  console.log("\n--- SECTION 1: Search Crawler SSR JSON-LD Validation ---");

  for (const route of allRoutes) {
    console.log(`\nAuditing SSR Schemas: ${route}`);
    auditResults.summary.routesAudited++;
    const schemas = await getSSRSchemas(route);

    auditResults.routes[route] = {
      schemaCount: schemas.length,
      types: schemas.map((s) => s["@type"] || (s.error ? "PARSE_ERROR" : "UNKNOWN")),
      ids: schemas.map((s) => s["@id"]).filter(Boolean),
    };

    recordAssert(schemas.length > 0, `Route returns JSON-LD schema blocks (found ${schemas.length})`, route);
    const parseErrors = schemas.filter((s) => s.error);
    recordAssert(parseErrors.length === 0, `No JSON-LD parsing errors`, route);

    for (const s of schemas) {
      if (s.error) continue;
      auditResults.summary.schemasAudited++;

      // Valid @context
      recordAssert(
        s["@context"] === "https://schema.org" || !s["@context"],
        `Schema (${s["@type"]}) has valid @context https://schema.org`,
        route
      );

      // Check date cleanliness: no arbitrary "-01-01" or synthetic timestamps
      const jsonStr = JSON.stringify(s);
      const hasArbitraryJan1 = jsonStr.includes("-01-01T00:00:00") || jsonStr.includes('"2024-01-01"');
      recordAssert(!hasArbitraryJan1, `Zero arbitrary "-01-01" synthetic dates in ${s["@type"]} schema`, route);
    }
  }

  // SECTION 2: Deep Schema Verifications by Entity Type
  console.log("\n--- SECTION 2: Deep Entity Verification ---");

  // 1. Person Schema
  console.log("\n1. Verifying Person Schema (Canonical Entity)...");
  const homeSchemas = await getSSRSchemas("/");
  const person = homeSchemas.find((s) => s["@type"] === "Person");
  recordAssert(!!person, "Person schema exists in RootLayout", "/");

  if (person) {
    recordAssert(person.name === "Jayant Potdar", 'name is "Jayant Potdar"', "/");
    recordAssert(person.legalName === "Jayant Sunil Potdar", 'legalName is "Jayant Sunil Potdar"', "/");
    recordAssert(person.jobTitle === "Full Stack Developer", 'jobTitle is "Full Stack Developer"', "/");
    recordAssert(person.url === "https://jayant.codes", 'url is "https://jayant.codes"', "/");
    recordAssert(person["@id"] === "https://jayant.codes/#jayant", '@id is "https://jayant.codes/#jayant"', "/");
    recordAssert(person.email === "mailto:jayantpotdar2006@gmail.com", "email is valid mailto", "/");

    // Negative & Positive checks on alumniOf
    const alumniOfList = Array.isArray(person.alumniOf) ? person.alumniOf : [person.alumniOf];
    const alumniNames = alumniOfList.map((a) => a?.name || "");
    const harvardInAlumni = alumniNames.some((n) => n.toLowerCase().includes("harvard"));
    recordAssert(!harvardInAlumni, "CRITICAL: Harvard University is strictly absent from alumniOf", "/");
    const mssuInAlumni = alumniNames.some((n) => n.includes("Maharashtra State Skills University"));
    recordAssert(mssuInAlumni, "alumniOf correctly references enrolled institution (MSSU Pune)", "/");

    // Positive checks on hasCredential
    const credentials = person.hasCredential || [];
    recordAssert(credentials.length >= 6, `hasCredential contains all earned credentials (found ${credentials.length})`, "/");

    const cs50Creds = credentials.filter((c) => c.name?.toLowerCase().includes("cs50"));
    recordAssert(cs50Creds.length === 2, `Both CS50 credentials correctly listed under hasCredential (found ${cs50Creds.length})`, "/");
    for (const c of cs50Creds) {
      recordAssert(
        c.recognizedBy?.name === "Harvard University",
        `CS50 (${c.name}) recognizedBy is "Harvard University"`,
        "/"
      );
      recordAssert(
        c.credentialCategory === "certificate",
        `CS50 credentialCategory is "certificate"`,
        "/"
      );
      recordAssert(
        c.url && c.url.startsWith("https://cs50.harvard.edu/certificates/"),
        `CS50 URL is verifiable certificate link: ${c.url}`,
        "/"
      );
    }

    // IBM credential
    const ibmCred = credentials.find((c) => c.name?.includes("IBM Full Stack"));
    recordAssert(!!ibmCred && ibmCred.recognizedBy?.name === "Coursera", "IBM Full Stack recognizedBy Coursera under hasCredential", "/");
    recordAssert(ibmCred?.url?.startsWith("https://coursera.org/verify/"), "IBM credential URL is verifiable Coursera link", "/");

    // Pearson Certiport
    const certiportCreds = credentials.filter((c) => c.recognizedBy?.name === "Certiport");
    recordAssert(certiportCreds.length === 2, "Both Certiport Pearson VUE credentials listed under hasCredential", "/");
    for (const c of certiportCreds) {
      recordAssert(c.url?.includes("credly.com/badges/"), `Certiport (${c.name}) verifiable via Credly`, "/");
    }

    // freeCodeCamp
    const fccCred = credentials.find((c) => c.recognizedBy?.name === "freeCodeCamp");
    recordAssert(!!fccCred, "freeCodeCamp Responsive Web Design listed under hasCredential", "/");
    recordAssert(fccCred?.url?.includes("freecodecamp.org/certification/"), "freeCodeCamp credential URL is verifiable", "/");

    // sameAs profiles
    const sameAs = person.sameAs || [];
    recordAssert(sameAs.includes("https://github.com/Jayant-1"), "sameAs includes GitHub profile", "/");
    recordAssert(sameAs.some((u) => u.includes("linkedin.com/in/jayant-potdar")), "sameAs includes LinkedIn profile", "/");

    // knowsAbout skills parity
    const knowsAbout = person.knowsAbout || [];
    recordAssert(knowsAbout.includes("React") && knowsAbout.includes("FastAPI") && knowsAbout.includes("PostgreSQL"), "knowsAbout includes core stack technologies", "/");
  }

  // 2. WebSite Schema
  console.log("\n2. Verifying WebSite Schema...");
  const website = homeSchemas.find((s) => s["@type"] === "WebSite");
  recordAssert(!!website, "WebSite schema exists in RootLayout", "/");
  if (website) {
    recordAssert(website["@id"] === "https://jayant.codes/#website", "WebSite @id is canonical", "/");
    recordAssert(website.publisher?.["@id"] === "https://jayant.codes/#jayant", "WebSite publisher cross-references Person @id", "/");
    recordAssert(website.inLanguage === "en-IN", "inLanguage is en-IN", "/");
  }

  // 3. ProfilePage Schema
  console.log("\n3. Verifying ProfilePage Schema...");
  const profilePage = homeSchemas.find((s) => s["@type"] === "ProfilePage");
  recordAssert(!!profilePage, "ProfilePage schema exists in RootLayout", "/");
  if (profilePage) {
    recordAssert(profilePage.mainEntity?.["@id"] === "https://jayant.codes/#jayant", "ProfilePage mainEntity cross-references Person @id", "/");
    recordAssert(profilePage.isPartOf?.["@id"] === "https://jayant.codes/#website", "ProfilePage isPartOf cross-references WebSite @id", "/");
  }

  // 4. SoftwareApplication Showcase Schemas
  console.log("\n4. Verifying SoftwareApplication Showcase Schemas...");
  for (const slug of componentSlugs) {
    const route = `/components/${slug}`;
    const cSchemas = await getSSRSchemas(route);
    const software = cSchemas.find((s) => s["@type"] === "SoftwareApplication");
    const breadcrumb = cSchemas.find((s) => s["@type"] === "BreadcrumbList");

    recordAssert(!!software, `SoftwareApplication schema exists on ${route}`, route);
    recordAssert(!!breadcrumb, `BreadcrumbList schema exists on ${route}`, route);

    if (software) {
      recordAssert(software["@id"] === `https://jayant.codes/components/${slug}#software`, "Software @id is canonical", route);
      recordAssert(software.applicationCategory === "DesignApplication", 'applicationCategory is "DesignApplication"', route);
      recordAssert(software.operatingSystem === "Web Browser", 'operatingSystem is "Web Browser"', route);
      recordAssert(software.offers?.price === "0", "offers price is free (0 USD)", route);
      recordAssert(software.author?.["@id"] === "https://jayant.codes/#jayant", "author cross-references Person @id", route);
      recordAssert(!software.datePublished, "No arbitrary datePublished in software schema", route);
    }
  }

  // 5. TechArticle Case Study Schemas
  console.log("\n5. Verifying TechArticle Case Study Schemas...");
  for (const slug of projectSlugs) {
    const route = `/projects/${slug}`;
    const pSchemas = await getSSRSchemas(route);
    const caseStudy = pSchemas.find((s) => s["@type"] === "TechArticle");
    const breadcrumb = pSchemas.find((s) => s["@type"] === "BreadcrumbList");

    recordAssert(!!caseStudy, `TechArticle case study schema exists on ${route}`, route);
    recordAssert(!!breadcrumb, `BreadcrumbList schema exists on ${route}`, route);

    if (caseStudy) {
      recordAssert(caseStudy["@id"] === `https://jayant.codes/projects/${slug}#case-study`, "Case study @id is canonical", route);
      recordAssert(caseStudy.url === `https://jayant.codes/projects/${slug}`, "url matches canonical path", route);
      recordAssert(caseStudy.author?.["@id"] === "https://jayant.codes/#jayant", "author cross-references Person @id", route);
      recordAssert(caseStudy.about?.["@type"] === "SoftwareApplication", "about property models underlying SoftwareApplication", route);
      recordAssert(!caseStudy.datePublished, "No synthetic datePublished in project case study schema", route);
      recordAssert(!caseStudy.dateModified, "No synthetic dateModified in project case study schema", route);
    }
  }

  // SECTION 3: Headless Browser DOM Rendering & Hydration Check
  console.log("\n--- SECTION 3: Headless Browser Hydration Verification ---");
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const context = await browser.newContext();
    const testRoutes = ["/", "/projects/astropixel", "/components/bubble-text", "/experience", "/contact"];

    for (const r of testRoutes) {
      const page = await context.newPage();
      await page.goto(`${BASE_URL}${r}`, { waitUntil: "domcontentloaded" });
      const domScriptCount = await page.$$eval('script[type="application/ld+json"]', (els) => els.length);
      recordAssert(domScriptCount >= 1, `Headless browser retains valid JSON-LD scripts in DOM on ${r} (found ${domScriptCount})`, r);
      await page.close();
    }
    await context.close();
  } finally {
    await browser.close();
  }

  // SECTION 4: Write Audit Results
  fs.writeFileSync(REPORT_PATH, JSON.stringify(auditResults, null, 2), "utf8");

  console.log("\n=======================================================");
  console.log("AEO & STRUCTURED CONTENT VERIFICATION COMPLETE");
  console.log(`Routes Audited: ${auditResults.summary.routesAudited}`);
  console.log(`Schemas Audited: ${auditResults.summary.schemasAudited}`);
  console.log(`Assertions Passed: ${auditResults.summary.assertionsPassed}`);
  console.log(`Assertions Failed: ${auditResults.summary.assertionsFailed}`);
  console.log(`Overall Result: ${auditResults.passed ? "PASS" : "FAIL"}`);
  console.log(`Report Written To: ${REPORT_PATH}`);
  console.log("=======================================================");

  if (!auditResults.passed) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error("Fatal error during schema verification:", err);
  process.exit(1);
});
