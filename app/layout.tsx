import type { Metadata, Viewport } from "next";
import AppShell from "@/components/AppShell";
import { InkTransitionProvider } from "@/components/transitions/InkTransitionProvider";
import { author, siteUrl } from "@/lib/site";
import { getPersonSchema, getProfilePageSchema, getWebSiteSchema } from "@/lib/schema";
import "./globals.css";

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
    <html lang="en-IN" className="overflow-x-clip">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link
          rel="preload"
          href="/fonts/handjet.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/dm-mono.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
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
          `}</style>
        </noscript>

        <InkTransitionProvider>
          <AppShell>{children}</AppShell>
        </InkTransitionProvider>
      </body>
    </html>
  );
}
