import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import Preloader from "@/components/Preloader";
import { InkTransitionProvider } from "@/components/transitions/InkTransitionProvider";
import { author, email, siteUrl, social } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#fdfdfb",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

const metaDescription =
  "Jayant Potdar is a full stack developer in Pune building expressive React interfaces and production-ready web apps. Explore his projects and get in touch.";

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
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#jayant`,
    name: author.name,
    legalName: author.legalName,
    alternateName: ["Jayant Sunil Potdar", "Jayant Potdar"],
    url: siteUrl,
    image: `${siteUrl}/images/img-1.png`,
    jobTitle: author.role,
    email,
    description: author.summary,
    homeLocation: {
      "@type": "Place",
      name: author.location,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    affiliation: {
      "@type": "EducationalOrganization",
      name: author.college,
    },
    sameAs: [social.github, social.linkedin],
    knowsAbout: [
      "Full Stack Development",
      "React",
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "Spring Boot",
      "PostgreSQL",
      "PostGIS",
      "Docker",
      "REST APIs",
      "Machine Learning Engineering",
      "TensorFlow",
      "Geospatial Data & GDAL",
      "Deep Zoom Imagery",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Jayant Potdar",
    alternateName: "Jayant Potdar Portfolio",
    url: siteUrl,
    description: metaDescription,
    inLanguage: "en-IN",
    publisher: {
      "@id": `${siteUrl}/#jayant`,
    },
  },
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

        <InkTransitionProvider>
          <Preloader />
          <Header />
          <main id="main" className="relative z-10">
            {children}
          </main>
        </InkTransitionProvider>
      </body>
    </html>
  );
}
