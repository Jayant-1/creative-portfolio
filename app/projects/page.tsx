import type { Metadata } from "next";
import { ContactStrip, Footer, UnderlineDoodle } from "@/components/Paper";
import { FolderProjectCard } from "@/components/FolderCard";
import { StaggerText } from "@/components/Motion";
import Reveal from "@/components/Reveal";
import { projects, siteUrl, author } from "@/lib/site";
import { getBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my five projects: AstroPixel, Krypton, 3D Portfolio, Malaria Detection System, and NeuralNet. Read my build decisions, see the code, and try the live demos.",
  keywords: [
    "Jayant Potdar Projects",
    "AstroPixel",
    "Krypton Research",
    "NeuralNet",
    "Malaria Detection System",
    "3D Portfolio",
    "Full Stack Case Studies",
    "Software Engineering Portfolio",
  ],
  alternates: {
    canonical: `${siteUrl}/projects`,
  },
  openGraph: {
    title: `Projects | ${author.name}`,
    description:
      "Five full stack and creative development projects with build decisions, code, and live demos.",
    url: `${siteUrl}/projects`,
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "My selected projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects | ${author.name}`,
    description:
      "Five full stack and creative development projects with build decisions, code, and live demos.",
    images: ["/og"],
  },
};

export default function ProjectsPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/projects#collection`,
    name: "My Selected Engineering Projects",
    url: `${siteUrl}/projects`,
    description:
      "Explore the full-stack web products, deep-zoom spatial viewers, and AI platforms I've built.",
    author: {
      "@id": `${siteUrl}/#jayant`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${siteUrl}/projects/${p.slug}`,
        name: p.title,
        description: p.summary,
      })),
    },
  };

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Projects", url: `${siteUrl}/projects` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([collectionJsonLd, breadcrumbJsonLd]).replace(/</g, "\\u003c"),
        }}
      />
      <div className="ca-grid min-h-screen px-4 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-16 lg:px-20">
        <div className="mb-16">
          <div className="flex flex-col items-center text-center">
            <p className="ca-hand text-2xl text-[var(--ca-ink)] sm:text-3xl">
              explore my work!
            </p>
            <UnderlineDoodle className="mt-1 h-3 w-24" />

            <div className="mt-6 block text-center">
              <h1 className="ca-display max-w-[9ch] text-center text-6xl leading-[0.92] tracking-tight text-[var(--ca-ink)] sm:text-8xl lg:text-9xl inline-block">
                <StaggerText text="PROJECTS" stagger={0.05} priority />
              </h1>
            </div>
          </div>
        </div>

        {/* 2-column grid of project folders */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2">
          {projects.map((project, idx) => (
            <Reveal key={project.slug} delay={(idx % 2) * 160 + 60}>
              <FolderProjectCard
                project={project}
                href={`/projects/${project.slug}`}
              />
            </Reveal>
          ))}
        </div>
      </div>

      <ContactStrip />
      <Footer />
    </>
  );
}
