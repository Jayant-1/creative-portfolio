import type { Metadata } from "next";
import { ContactStrip, Footer, UnderlineDoodle } from "@/components/Paper";
import { FolderProjectCard } from "@/components/FolderCard";
import { StaggerText } from "@/components/Motion";
import Reveal from "@/components/Reveal";
import { projects, siteUrl, author } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    `Explore five projects by ${author.name}: AstroPixel, Krypton, 3D Portfolio, Malaria Detection System, and NeuralNet. Read the build decisions, code, and live demos.`,
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: `Projects | ${author.name}`,
    description:
      "Five full stack and creative development projects with build decisions, code, and live demos.",
    url: `${siteUrl}/projects`,
  },
};

export default function ProjectsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Selected Engineering Projects by Jayant Potdar",
    url: `${siteUrl}/projects`,
    description:
      "A curated catalog of full-stack web products, deep-zoom spatial viewers, and AI platforms engineered by Jayant Potdar.",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
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
                <StaggerText text="PROJECTS" stagger={0.05} />
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
