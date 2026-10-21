# Google Search Console Verification & Sitemap Submission Guide

> **Current Status: UNVERIFIED (Pending Owner Setup)**  
> Ownership verification requires Jayant Potdar to generate a property token in Google Search Console. The portfolio is pre-configured to accept either DNS or HTML meta verification without code changes.

### Verification Status Matrix

| Component / Metric | Status | Detail / Requirement |
| :--- | :--- | :--- |
| **Codebase Verification Hook** | **VERIFIED (Ready)** | `app/layout.tsx` integrates `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` via Next.js metadata |
| **Dynamic Sitemap Endpoint** | **VERIFIED (Ready)** | `https://jayant.codes/sitemap.xml` generates 17 canonical routes |
| **Robots Directives** | **VERIFIED (Ready)** | `https://jayant.codes/robots.txt` explicitly permits Googlebot and search indexers |
| **GSC Ownership Verification** | **Unverified (Requires Owner Action)** | Requires Jayant Potdar to generate token via DNS TXT or HTML tag |
| **Live Dashboard Metrics** | **Unverified (Requires Owner Dashboard Login)** | Requires authentication into Google Search Console dashboard |
| **Live Indexing & Crawl Stats** | **Unverified (Requires Owner Dashboard Login)** | Requires authentication into Google Search Console dashboard |
| **Live Search Rankings** | **Unverified (Requires Owner Dashboard Login)** | Requires authentication into Google Search Console dashboard |

---

## 1. Verification Options

Google Search Console offers several ownership verification methods. Below are the recommended paths for `https://jayant.codes`:

### Option A: DNS TXT Record (Recommended)
This verifies the entire **Domain Property** (`jayant.codes`), including all subdomains (such as `astropixel.jayant.codes`, `krypton.jayant.codes`, and `3dportfolio.jayant.codes`).

1. Log into [Google Search Console](https://search.google.com/search-console).
2. Choose **Domain** property type and enter `jayant.codes`.
3. Copy the `google-site-verification` TXT record token displayed by Google.
4. Log into your DNS management provider (e.g., Cloudflare, Namecheap, GoDaddy):
   - **Type:** `TXT`
   - **Name / Host:** `@` (or `jayant.codes`)
   - **Value:** `google-site-verification=<your-unique-token>`
   - **TTL:** `Auto` (or `300` / `3600`)
5. Return to Google Search Console and click **Verify**.

---

### Option B: HTML Meta Tag (URL-Prefix Property)
This verifies the URL-prefix property (`https://jayant.codes`). The codebase in `app/layout.tsx` is already wired to inject the meta tag dynamically via environment variables.

1. In Search Console, select **URL prefix** and enter `https://jayant.codes`.
2. Under "Other verification methods", select **HTML tag**.
3. Copy the verification string inside the `content=""` attribute (e.g. `abc123XYZ456...`).
4. Set the environment variable on your hosting platform (Vercel / Render / Docker):
   ```bash
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="your-verification-token"
   ```
5. Trigger a deployment or rebuild. `app/layout.tsx` automatically emits:
   ```html
   <meta name="google-site-verification" content="your-verification-token" />
   ```
6. In Google Search Console, click **Verify**.

---

### Option C: HTML File Upload
If preferred, you can also place the static verification file provided by Google:
1. Download `google<hash>.html` from Google Search Console.
2. Save it directly in the portfolio's `public/` directory (e.g. `public/google<hash>.html`).
3. Commit and deploy. The file will be publicly served at `https://jayant.codes/google<hash>.html`.
4. Click **Verify** in Google Search Console.

---

## 2. Sitemap Submission

The portfolio generates an automated, dynamic sitemap adhering to the Sitemaps XML protocol.

- **Sitemap URL:** `https://jayant.codes/sitemap.xml`
- **Robots.txt:** `https://jayant.codes/robots.txt`

### Dynamic Routes Included:
- **Core Pages:**
  - `https://jayant.codes/`
  - `https://jayant.codes/about`
  - `https://jayant.codes/experience`
  - `https://jayant.codes/components`
  - `https://jayant.codes/projects`
  - `https://jayant.codes/contact`
- **Craft Component Showcase Pages:**
  - `https://jayant.codes/components/overlapping-text-hero`
  - `https://jayant.codes/components/bubble-text`
  - `https://jayant.codes/components/telescope-hero`
  - `https://jayant.codes/components/magnetic-button`
  - `https://jayant.codes/components/radial-gradient-card`
  - `https://jayant.codes/components/binary-grid`
- **Project Deep-Dive Case Studies:**
  - `https://jayant.codes/projects/astropixel`
  - `https://jayant.codes/projects/krypton`
  - `https://jayant.codes/projects/3d-portfolio`
  - `https://jayant.codes/projects/malaria-detection`
  - `https://jayant.codes/projects/neuralnet`

### Steps to Submit:
1. After ownership verification completes, click **Sitemaps** in the left sidebar of Google Search Console.
2. In the "Add a new sitemap" field, enter:
   ```
   sitemap.xml
   ```
3. Click **Submit**.
4. Confirm that the status column displays green **Success** and shows the discovered URL count.

---

## 3. Crawler Directives Verification

`app/robots.ts` explicitly grants crawling permissions to primary indexers and AI search engines:

```ts
rules: [
  { userAgent: "*", allow: "/" },
  { userAgent: "Googlebot", allow: "/" },
  { userAgent: "OAI-SearchBot", allow: "/" },
  { userAgent: "GPTBot", allow: "/" },
],
sitemap: "https://jayant.codes/sitemap.xml"
```

Verify in production using curl or browser:
```bash
curl -I https://jayant.codes/robots.txt
curl -I https://jayant.codes/sitemap.xml
```
