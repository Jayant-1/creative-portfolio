import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import AppShell from "@/components/AppShell";
import { Analytics } from "@/components/Analytics";
import { MotionProvider } from "@/components/MotionProvider";
import { InkTransitionProvider } from "@/components/transitions/InkTransitionProvider";
import { author, siteUrl } from "@/lib/site";
import { getPersonSchema, getProfilePageSchema, getWebSiteSchema } from "@/lib/schema";
import "./globals.css";

// Use the existing font files with framework-managed early preloads and hashed URLs.
const inter = localFont({ src: "../public/fonts/inter.woff2", weight: "100 900", display: "swap", variable: "--font-local-inter" });
const handjet = localFont({ src: "../public/fonts/handjet-display.woff2", weight: "700", display: "swap", variable: "--font-local-display", adjustFontFallback: false, declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+2000-2BFF" }] });
const mono = localFont({ src: "../public/fonts/dm-mono.woff2", weight: "400 500", display: "swap", variable: "--font-local-mono", adjustFontFallback: false });
const hand = localFont({ src: "../public/fonts/handwritten.woff2", weight: "400", display: "swap", variable: "--font-local-hand", adjustFontFallback: false });

export const viewport: Viewport = {
  themeColor: "#fdfdfb",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

const metaDescription =
  "I'm Jayant Potdar, a full stack developer in Pune. I build expressive React interfaces and production-ready web apps. Explore my projects and get in touch.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jayant Potdar | Full Stack Developer in Pune",
    template: "%s | Jayant Potdar",
  },
  description: metaDescription,
  applicationName: "Jayant Potdar Portfolio",
  authors: [{ name: author.name, url: siteUrl }],
  creator: author.name,
  alternates: {
    canonical: siteUrl,
  },
  keywords: [
    "Jayant Potdar",
    "Jayant Sunil Potdar",
    "Full Stack Developer Pune",
    "Software Engineer Pune",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "FastAPI",
    "Python Developer",
    "UI UX Engineer",
    "Creative Developer",
    "Interactive Portfolio",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Jayant Potdar",
    title: "Jayant Potdar | Full Stack Developer in Pune",
    description: metaDescription,
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Jayant Potdar, full stack developer in Pune",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jayant Potdar | Full Stack Developer in Pune",
    description: metaDescription,
    images: ["/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

const jsonLd = [
  getPersonSchema(),
  getWebSiteSchema(),
  getProfilePageSchema(),
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`overflow-x-clip ${inter.variable} ${handjet.variable} ${mono.variable} ${hand.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="ca-grid relative min-h-screen text-[var(--ca-ink)] antialiased overflow-x-clip">
        {/* Tactile noise grain overlay */}
        <div aria-hidden="true" className="ca-grain pointer-events-none fixed inset-0 z-[1] mix-blend-multiply" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />

        <noscript>
          <style>{`
            .reveal-entry,
            [data-framer-motion],
            [style*="opacity: 0"],
            [style*="opacity:0"] {
              opacity: 1 !important;
              transform: none !important;
              visibility: visible !important;
            }
            .ca-image-real {
              opacity: 1 !important;
              filter: none !important;
              transform: none !important;
            }
            .ca-image-lqip {
              display: none !important;
            }
          `}</style>
        </noscript>

        <MotionProvider>
          <InkTransitionProvider>
            <AppShell>{children}</AppShell>
          </InkTransitionProvider>
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
