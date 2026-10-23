import fs from "node:fs";
import path from "node:path";

const base = process.argv[2] || process.env.BASE_URL || "http://localhost:3000";
const canonicalOrigin = "https://jayant.codes";
const output = path.resolve(process.env.AUDIT_OUTPUT_DIR || "audit-results");
const results = { target: base, timestamp: new Date().toISOString(), routes: [], failures: [] };
const assert = (ok, message) => { if (!ok) results.failures.push(message); };
const get = (route) => fetch(new URL(route, base), { signal: AbortSignal.timeout(30000) });
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2].replaceAll("&amp;", "&")]));
try {
  const sitemap = await get("/sitemap.xml");
  assert(sitemap.status === 200, "Sitemap must return 200");
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  assert(urls.length === 17 && new Set(urls).size === 17, "Expected 17 unique public canonical routes");
  const titles = new Set();
  const images = new Set();
  for (const url of urls) {
    assert(url.startsWith(canonicalOrigin), `Wrong sitemap origin: ${url}`);
    const route = new URL(url).pathname;
    const res = await get(route);
    const html = await res.text();
    const tags = [...html.matchAll(/<(?:meta|link)\b[^>]*>/g)].map((m) => attrs(m[0]));
    const canonical = tags.find((t) => t.rel === "canonical")?.href;
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const description = tags.find((t) => t.name === "description")?.content;
    assert(res.status === 200, `${route}: HTTP ${res.status}`);
    assert(canonical?.replace(/\/$/, "") === url.replace(/\/$/, ""), `${route}: canonical mismatch`);
    assert(Boolean(title) && !titles.has(title), `${route}: missing or duplicate title`);
    titles.add(title);
    assert(Boolean(description), `${route}: missing description`);
    assert((html.match(/<h1\b/g) || []).length === 1, `${route}: expected one primary heading`);
    assert(!tags.some((t) => t.name === "robots" && t.content?.includes("noindex")), `${route}: canonical page is noindex`);
    const og = tags.find((t) => t.property === "og:image")?.content;
    assert(Boolean(og), `${route}: missing sharing image`);
    if (og) images.add(new URL(og).pathname + new URL(og).search);
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    assert(schemas.length > 0, `${route}: missing JSON-LD`);
    for (const [, json] of schemas) {
      try { JSON.parse(json); } catch { assert(false, `${route}: invalid JSON-LD`); }
      assert(!/"telephone"|8788640172|8010855431/.test(json), `${route}: phone belongs only in resume PDF`);
    }
    results.routes.push({ route, status: res.status, canonical, title, description });
  }
  for (const image of images) {
    const res = await get(image);
    assert(res.ok && res.headers.get("content-type")?.startsWith("image/"), `Sharing image unavailable: ${image}`);
    await res.arrayBuffer();
  }
  for (const route of ["/blog", "/preview/overlapping-text-hero"]) {
    const html = await (await get(route)).text();
    assert(/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html), `${route}: missing noindex`);
  }
  const robots = await (await get("/robots.txt")).text();
  assert(robots.includes(`${canonicalOrigin}/sitemap.xml`), "robots.txt sitemap is incorrect");
  const guide = await get("/llms.txt");
  assert(guide.ok && guide.headers.get("content-type")?.includes("text/plain"), "Reading guide missing or wrong type");
  for (const route of ["/release-check-missing", "/projects/release-check-missing", "/components/release-check-missing"]) {
    assert((await get(route)).status === 404, `${route}: must return a real 404`);
  }
} catch (error) {
  results.failures.push(error.message);
}
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, "http-seo.json"), JSON.stringify(results, null, 2));
console.log(`${results.routes.length} canonical routes checked; ${results.failures.length} failures`);
results.failures.forEach((f) => console.error(f));
process.exitCode = results.failures.length ? 1 : 0;
