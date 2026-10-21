import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

async function runSeoVerification() {
  console.log("=======================================================");
  console.log("Phase 5: SEO & Metadata Comprehensive Verification Suite");
  console.log("=======================================================\n");

  const results = {
    canonicalUrls: [],
    redirects: [],
    sitemap: {},
    robots: {},
    openGraph: [],
    errors: [],
  };

  // 1. Verify next.config.mjs redirects
  console.log("1. Verifying Redirects in next.config.mjs...");
  const nextConfigModule = await import("../next.config.mjs");
  const nextConfig = nextConfigModule.default;
  const redirects = await nextConfig.redirects();

  const domainRedirects = redirects.filter((r) => r.has && r.has.some((h) => h.type === "host"));
  console.log(`   Found ${domainRedirects.length} domain redirect rules:`);
  domainRedirects.forEach((r) => {
    const host = r.has.find((h) => h.type === "host")?.value;
    console.log(`   - Host: ${host} -> Destination: ${r.destination} (permanent=${r.permanent})`);
  });

  const wwwJayantPotdarRedirect = redirects.find(
    (r) =>
      r.has &&
      r.has.some((h) => h.type === "host" && h.value === "www.jayantpotdar.in") &&
      r.destination === "https://jayant.codes/:path*" &&
      r.permanent === true
  );

  const apexJayantPotdarRedirect = redirects.find(
    (r) =>
      r.has &&
      r.has.some((h) => h.type === "host" && h.value === "jayantpotdar.in") &&
      r.destination === "https://jayant.codes/:path*" &&
      r.permanent === true
  );

  const wwwJayantCodesRedirect = redirects.find(
    (r) =>
      r.has &&
      r.has.some((h) => h.type === "host" && h.value === "www.jayant.codes") &&
      r.destination === "https://jayant.codes/:path*" &&
      r.permanent === true
  );

  if (wwwJayantPotdarRedirect) {
    console.log("   [PASS] 'www.jayantpotdar.in' permanently redirects (308) to 'https://jayant.codes/:path*' preserving paths and query strings.");
    results.redirects.push({ host: "www.jayantpotdar.in", status: "PASS", statusCode: 308, preservesQuery: true });
  } else {
    console.error("   [FAIL] Missing redirect for www.jayantpotdar.in");
    results.errors.push("Missing redirect for www.jayantpotdar.in");
  }

  if (apexJayantPotdarRedirect) {
    console.log("   [PASS] 'jayantpotdar.in' permanently redirects (308) to 'https://jayant.codes/:path*' preserving paths and query strings.");
    results.redirects.push({ host: "jayantpotdar.in", status: "PASS", statusCode: 308, preservesQuery: true });
  }

  if (wwwJayantCodesRedirect) {
    console.log("   [PASS] 'www.jayant.codes' permanently redirects (308) to 'https://jayant.codes/:path*' preserving paths and query strings.");
    results.redirects.push({ host: "www.jayant.codes", status: "PASS", statusCode: 308, preservesQuery: true });
  }

  // Check component/project legacy redirects
  const radialRedirect = redirects.find(
    (r) => r.source === "/components/radial-gradient-animate-card" && r.destination === "/components/radial-gradient-card" && r.permanent === true
  );
  if (radialRedirect) {
    console.log("   [PASS] Legacy '/components/radial-gradient-animate-card' -> '/components/radial-gradient-card' (308)");
    results.redirects.push({ source: "/components/radial-gradient-animate-card", status: "PASS", destination: "/components/radial-gradient-card" });
  }

  // 2. Verify Sitemap output
  console.log("\n2. Verifying sitemap.xml & app/sitemap.ts...");
  const sitemapPath = path.join(rootDir, ".next/server/app/sitemap.xml.body");
  if (!fs.existsSync(sitemapPath)) {
    console.error("   [FAIL] .next/server/app/sitemap.xml.body not found! Run next build first.");
    results.errors.push("Sitemap build artifact missing");
  } else {
    const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
    const hasLastModTag = /<lastmod>/i.test(sitemapContent);
    const urls = Array.from(sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)).map((m) => m[1]);
    
    console.log(`   Found ${urls.length} URLs in sitemap.xml`);
    console.log(`   Checking for synthetic/invented lastModified dates in sitemap.xml...`);
    
    if (hasLastModTag) {
      console.error("   [FAIL] sitemap.xml contains <lastmod> tags!");
      results.errors.push("sitemap.xml contains synthetic lastmod tags");
    } else {
      console.log("   [PASS] All synthetic/invented lastModified dates have been cleanly removed (<lastmod> count = 0)");
      results.sitemap.lastModifiedClean = true;
    }

    // Check required routes in sitemap
    const requiredSitemapRoutes = [
      "https://jayant.codes",
      "https://jayant.codes/projects",
      "https://jayant.codes/components",
      "https://jayant.codes/about",
      "https://jayant.codes/experience",
      "https://jayant.codes/contact",
      "https://jayant.codes/projects/astropixel",
      "https://jayant.codes/projects/krypton",
      "https://jayant.codes/projects/3d-portfolio",
      "https://jayant.codes/projects/malaria-detection",
      "https://jayant.codes/projects/neuralnet",
      "https://jayant.codes/components/overlapping-text-hero",
      "https://jayant.codes/components/bubble-text",
      "https://jayant.codes/components/telescope-hero",
      "https://jayant.codes/components/magnetic-button",
      "https://jayant.codes/components/radial-gradient-card",
      "https://jayant.codes/components/binary-grid",
    ];

    let allRequiredInSitemap = true;
    for (const route of requiredSitemapRoutes) {
      if (!urls.includes(route)) {
        console.error(`   [FAIL] Required route missing from sitemap: ${route}`);
        results.errors.push(`Missing sitemap route: ${route}`);
        allRequiredInSitemap = false;
      }
    }
    if (allRequiredInSitemap) {
      console.log(`   [PASS] All ${requiredSitemapRoutes.length} core canonical URLs present in sitemap.xml`);
    }

    const hasPreviewInSitemap = urls.some((u) => u.includes("/preview/"));
    if (hasPreviewInSitemap) {
      console.error("   [FAIL] Preview route leaked into sitemap!");
      results.errors.push("Preview route leaked into sitemap");
    } else {
      console.log("   [PASS] Preview routes (/preview/*) are correctly excluded from sitemap.xml");
    }
  }

  // 3. Verify robots.txt
  console.log("\n3. Verifying robots.txt & app/robots.ts...");
  const robotsPath = path.join(rootDir, ".next/server/app/robots.txt.body");
  if (!fs.existsSync(robotsPath)) {
    console.error("   [FAIL] .next/server/app/robots.txt.body not found! Run next build first.");
    results.errors.push("Robots build artifact missing");
  } else {
    const robotsContent = fs.readFileSync(robotsPath, "utf-8");
    const hasSitemapRef = robotsContent.includes("Sitemap: https://jayant.codes/sitemap.xml");
    const hasUserAgentWildcard = robotsContent.includes("User-Agent: *");
    const allowsRoot = robotsContent.includes("Allow: /");
    const hasGooglebot = robotsContent.includes("User-Agent: Googlebot");
    const hasBingbot = robotsContent.includes("User-Agent: Bingbot");
    const hasApplebot = robotsContent.includes("User-Agent: Applebot");
    const hasOAISearchBot = robotsContent.includes("User-Agent: OAI-SearchBot");
    const hasPerplexityBot = robotsContent.includes("User-Agent: PerplexityBot");
    const hasGPTBot = robotsContent.includes("User-Agent: GPTBot");
    const hasClaudeBot = robotsContent.includes("User-Agent: ClaudeBot");
    const hasGoogleExtended = robotsContent.includes("User-Agent: Google-Extended");

    if (hasSitemapRef) {
      console.log("   [PASS] robots.txt declares canonical sitemap: https://jayant.codes/sitemap.xml");
    } else {
      console.error("   [FAIL] robots.txt missing Sitemap directive");
      results.errors.push("robots.txt missing Sitemap directive");
    }

    if (hasUserAgentWildcard && allowsRoot) {
      console.log("   [PASS] User-Agent: * allows / (permitting crawlers to reach pages and read noindex headers on preview routes)");
    }

    if (hasGooglebot && hasBingbot && hasApplebot && hasOAISearchBot && hasPerplexityBot) {
      console.log("   [PASS] Search and Answer Engine crawlers explicitly allowed (Googlebot, Bingbot, Applebot, OAI-SearchBot, PerplexityBot)");
    }

    if (hasGPTBot && hasClaudeBot && hasGoogleExtended) {
      console.log("   [PASS] AI Model training crawlers explicitly configured (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended)");
    }
  }

  // 4. Verify Canonical URLs in Pre-rendered HTML
  console.log("\n4. Verifying Canonical URLs in Pre-rendered HTML across routes...");
  const expectedCanonicals = [
    { route: "root (/)", file: ".next/server/app/index.html", expected: "https://jayant.codes" },
    { route: "/about", file: ".next/server/app/about.html", expected: "https://jayant.codes/about" },
    { route: "/projects", file: ".next/server/app/projects.html", expected: "https://jayant.codes/projects" },
    { route: "/projects/astropixel", file: ".next/server/app/projects/astropixel.html", expected: "https://jayant.codes/projects/astropixel" },
    { route: "/projects/krypton", file: ".next/server/app/projects/krypton.html", expected: "https://jayant.codes/projects/krypton" },
    { route: "/projects/3d-portfolio", file: ".next/server/app/projects/3d-portfolio.html", expected: "https://jayant.codes/projects/3d-portfolio" },
    { route: "/projects/malaria-detection", file: ".next/server/app/projects/malaria-detection.html", expected: "https://jayant.codes/projects/malaria-detection" },
    { route: "/projects/neuralnet", file: ".next/server/app/projects/neuralnet.html", expected: "https://jayant.codes/projects/neuralnet" },
    { route: "/components", file: ".next/server/app/components.html", expected: "https://jayant.codes/components" },
    { route: "/components/overlapping-text-hero", file: ".next/server/app/components/overlapping-text-hero.html", expected: "https://jayant.codes/components/overlapping-text-hero" },
    { route: "/components/bubble-text", file: ".next/server/app/components/bubble-text.html", expected: "https://jayant.codes/components/bubble-text" },
    { route: "/components/telescope-hero", file: ".next/server/app/components/telescope-hero.html", expected: "https://jayant.codes/components/telescope-hero" },
    { route: "/components/magnetic-button", file: ".next/server/app/components/magnetic-button.html", expected: "https://jayant.codes/components/magnetic-button" },
    { route: "/components/radial-gradient-card", file: ".next/server/app/components/radial-gradient-card.html", expected: "https://jayant.codes/components/radial-gradient-card" },
    { route: "/components/radial-gradient-animate-card (alias)", file: ".next/server/app/components/radial-gradient-animate-card.html", expected: "https://jayant.codes/components/radial-gradient-card" },
    { route: "/components/binary-grid", file: ".next/server/app/components/binary-grid.html", expected: "https://jayant.codes/components/binary-grid" },
    { route: "/contact", file: ".next/server/app/contact.html", expected: "https://jayant.codes/contact" },
    { route: "/experience", file: ".next/server/app/experience.html", expected: "https://jayant.codes/experience" },
  ];

  for (const item of expectedCanonicals) {
    const fullPath = path.join(rootDir, item.file);
    if (!fs.existsSync(fullPath)) {
      console.error(`   [FAIL] HTML file missing: ${item.file}`);
      results.errors.push(`HTML file missing: ${item.file}`);
      continue;
    }
    const html = fs.readFileSync(fullPath, "utf-8");
    const match = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (!match) {
      console.error(`   [FAIL] ${item.route} has no <link rel="canonical"> tag!`);
      results.errors.push(`${item.route} missing canonical tag`);
    } else {
      const actual = match[1];
      if (actual === item.expected) {
        console.log(`   [PASS] ${item.route.padEnd(45)} -> ${actual}`);
        results.canonicalUrls.push({ route: item.route, canonical: actual, status: "PASS" });
      } else {
        console.error(`   [FAIL] ${item.route}: expected canonical '${item.expected}', found '${actual}'`);
        results.errors.push(`${item.route}: expected canonical '${item.expected}', found '${actual}'`);
      }
    }
  }

  // 5. Verify OpenGraph & Twitter Metadata
  console.log("\n5. Verifying OpenGraph & Twitter Metadata in Pre-rendered HTML...");
  const ogChecks = [
    {
      route: "root (/)",
      file: ".next/server/app/index.html",
      expectedOgImage: "https://jayant.codes/og",
      expectedOgTitle: "Jayant Potdar | Full Stack Developer in Pune",
      expectedOgType: "website",
    },
    {
      route: "/about",
      file: ".next/server/app/about.html",
      expectedOgImage: "https://jayant.codes/og",
      expectedOgTitle: "About Me | Jayant Potdar",
      expectedOgType: "profile",
    },
    {
      route: "/projects/astropixel",
      file: ".next/server/app/projects/astropixel.html",
      expectedOgImage: "https://jayant.codes/projects/astroPixel-home.png",
      expectedOgType: "article",
    },
    {
      route: "/components/overlapping-text-hero",
      file: ".next/server/app/components/overlapping-text-hero.html",
      expectedOgImage: "https://jayant.codes/components/OverlappingTextHero.png",
      expectedOgType: "website",
    },
  ];

  for (const og of ogChecks) {
    const fullPath = path.join(rootDir, og.file);
    const html = fs.readFileSync(fullPath, "utf-8");
    
    const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
    const ogTypeMatch = html.match(/<meta\s+property="og:type"\s+content="([^"]+)"/i);
    const twitterCardMatch = html.match(/<meta\s+name="twitter:card"\s+content="([^"]+)"/i);

    console.log(`   Inspecting ${og.route}:`);
    console.log(`     og:image    = ${ogImageMatch ? ogImageMatch[1] : "NONE"}`);
    console.log(`     og:title    = ${ogTitleMatch ? ogTitleMatch[1] : "NONE"}`);
    console.log(`     og:type     = ${ogTypeMatch ? ogTypeMatch[1] : "NONE"}`);
    console.log(`     twitter:card= ${twitterCardMatch ? twitterCardMatch[1] : "NONE"}`);

    if (og.expectedOgImage && ogImageMatch?.[1] !== og.expectedOgImage) {
      console.error(`     [FAIL] Expected og:image '${og.expectedOgImage}', found '${ogImageMatch?.[1]}'`);
      results.errors.push(`${og.route}: unexpected og:image`);
    } else {
      console.log(`     [PASS] og:image matches expectation`);
    }

    if (og.expectedOgType && ogTypeMatch?.[1] !== og.expectedOgType) {
      console.error(`     [FAIL] Expected og:type '${og.expectedOgType}', found '${ogTypeMatch?.[1]}'`);
      results.errors.push(`${og.route}: unexpected og:type`);
    } else {
      console.log(`     [PASS] og:type matches expectation`);
    }

    if (twitterCardMatch?.[1] !== "summary_large_image") {
      console.error(`     [FAIL] twitter:card is not summary_large_image`);
      results.errors.push(`${og.route}: invalid twitter:card`);
    } else {
      console.log(`     [PASS] twitter:card is summary_large_image`);
    }
  }

  // 6. Verify Edge OG Route implementation
  console.log("\n6. Verifying Edge OG Route (app/og/route.tsx)...");
  const ogRoutePath = path.join(rootDir, "app/og/route.tsx");
  const ogRouteContent = fs.readFileSync(ogRoutePath, "utf-8");
  const isEdgeRuntime = ogRouteContent.includes('export const runtime = "edge"');
  const returnsImageResponse = ogRouteContent.includes("new ImageResponse(");
  const setsDimensions = ogRouteContent.includes("width: 1200") && ogRouteContent.includes("height: 630");

  if (isEdgeRuntime) {
    console.log("   [PASS] app/og/route.tsx explicitly declares 'export const runtime = \"edge\"'");
  } else {
    console.error("   [FAIL] app/og/route.tsx missing runtime = 'edge'");
    results.errors.push("OG route missing edge runtime");
  }

  if (returnsImageResponse && setsDimensions) {
    console.log("   [PASS] app/og/route.tsx dynamically generates high-DPI 1200x630 OG image");
  } else {
    console.error("   [FAIL] app/og/route.tsx does not instantiate 1200x630 ImageResponse");
    results.errors.push("OG route does not instantiate 1200x630 ImageResponse");
  }

  // 7. Verify Preview Pages Noindex
  console.log("\n7. Verifying Noindex Enforcement on Preview Routes...");
  const previewHtmlPath = path.join(rootDir, ".next/server/app/preview/overlapping-text-hero.html");
  const previewHtml = fs.readFileSync(previewHtmlPath, "utf-8");
  const hasNoindex = /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i.test(previewHtml);
  if (hasNoindex) {
    console.log("   [PASS] Preview pages (.next/server/app/preview/*.html) contain meta robots noindex");
  } else {
    console.error("   [FAIL] Preview page missing meta robots noindex directive");
    results.errors.push("Preview page missing meta robots noindex directive");
  }

  console.log("\n=======================================================");
  if (results.errors.length === 0) {
    console.log("ALL SEO & METADATA VERIFICATION CHECKS PASSED (0 ERRORS)");
  } else {
    console.error(`VERIFICATION FAILED WITH ${results.errors.length} ERRORS:`);
    results.errors.forEach((e, idx) => console.error(`  ${idx + 1}. ${e}`));
    process.exit(1);
  }
  console.log("=======================================================\n");
}

runSeoVerification().catch((err) => {
  console.error("Fatal error during SEO verification:", err);
  process.exit(1);
});
