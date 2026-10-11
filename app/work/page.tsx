import type { Metadata } from "next";
import Link from "next/link";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import { ArrowUpRight, ExternalLink, CheckCircle2, Star, GitFork, Eye } from "lucide-react";
import { ContactStrip, Footer, Scribble, Tape } from "@/components/Paper";
import Reveal from "@/components/Reveal";
import { StaggerText } from "@/components/Motion";
import { projects, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Selected Engineering Projects",
  description:
    "Explore full-stack web products built by Jayant Potdar in Pune, including AstroPixel (gigapixel geospatial imagery), Krypton (AI literature assistant), NeuralNet (visual deep learning studio), and Nova-Learn.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Engineering Projects & Architecture | Jayant Potdar",
    description:
      "Full-stack engineering projects, architecture decisions, and measured outcomes by Jayant Potdar, Full Stack Developer in Pune.",
    url: `${siteUrl}/work`,
  },
};

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function WorkPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Selected Engineering Projects by Jayant Potdar",
    url: `${siteUrl}/work`,
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Work",
        item: `${siteUrl}/work`,
      },
    ],
  };

  return (
    <div className="ca-grid min-h-screen pt-12 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <header className="mb-14 sm:mb-20 text-center">
          <Scribble withDoodle>production builds &amp; architectures</Scribble>

          <span className="mt-4 block text-center">
            <h1 className="ca-display text-5xl min-[390px]:text-6xl sm:text-8xl md:text-9xl uppercase leading-none tracking-tight text-[var(--ca-ink)] inline-block">
              <StaggerText text="SELECTED WORK" stagger={0.045} />
            </h1>
          </span>

          <Reveal delay={120}>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[var(--ca-ink)]/85 sm:text-xl font-normal">
              Every project here represents real code, active repositories, and architectural ownership.
              From independent deep-zoom geospatial systems to student-led AI research tools, I focus on
              reliable backends, low client footprints, and thoughtful user interfaces.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="ca-mono rounded-full border border-[var(--ca-ink)]/30 bg-[var(--ca-yellow-soft)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs">
                ● All Projects Live or Open Source
              </span>
              <span className="ca-mono rounded-full border border-[var(--ca-ink)]/30 bg-[var(--ca-mint)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs">
                ● Verified Tech Stacks
              </span>
              <span className="ca-mono rounded-full border border-[var(--ca-ink)]/30 bg-[var(--ca-cyan)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs">
                ● Pune, Maharashtra
              </span>
            </div>
          </Reveal>
        </header>

        {/* Project Cards Stack */}
        <div className="space-y-16 sm:space-y-24">
          {projects.map((project, idx) => {
            const isReversed = idx % 2 === 1;

            return (
              <Reveal key={project.slug} delay={idx * 120} className="w-full">
                <article
                  id={project.slug}
                  className="ca-doodle-box relative border-3 border-[var(--ca-ink)] bg-white p-6 sm:p-10 shadow-[6px_8px_0_var(--ca-ink)] transition-transform duration-300 hover:-translate-y-1"
                >
                <Tape
                  className={idx % 2 === 0 ? "-left-1.5 sm:-left-3 -top-3" : "-right-1.5 sm:-right-3 -top-3"}
                  angle={idx % 2 === 0 ? -12 : 12}
                  color={idx % 2 === 0 ? "var(--ca-yellow-soft)" : "var(--ca-cyan)"}
                />

                <div className={`grid grid-cols-1 items-start gap-8 lg:gap-12 ${
                  isReversed ? "lg:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-[0.9fr_1.1fr]"
                }`}>
                  {/* Metadata and Narrative */}
                  <div className={isReversed ? "lg:order-2" : "lg:order-1"}>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="ca-mono inline-block rounded-full bg-[var(--ca-ink)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                        {project.number}
                      </span>
                      <span
                        className="ca-mono inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]"
                        style={{
                          backgroundColor:
                            project.ownership === "Solo Full Stack Project" ||
                            project.ownership === "Solo Developer"
                              ? "var(--ca-cyan)"
                              : "var(--ca-yellow-soft)",
                        }}
                      >
                        {project.ownership}
                      </span>
                      <span className="ca-mono text-xs font-semibold text-[var(--ca-ink)]/60">
                        {project.date}
                      </span>
                    </div>

                    <h2 className="mt-4 text-3xl font-extrabold uppercase tracking-tight text-[var(--ca-ink)] sm:text-4xl">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="transition-colors hover:text-[var(--ca-blue)]"
                      >
                        {project.title}
                      </Link>
                    </h2>

                    <p className="mt-2 text-base font-semibold text-[var(--ca-blue)]">
                      {project.tagline}
                    </p>

                    {/* GitHub & Impact Metrics */}
                    {project.metrics && (
                      <div className="mt-3.5 flex flex-wrap items-center gap-2">
                        <span className="ca-mono inline-flex items-center gap-1.5 rounded-sm border border-[var(--ca-ink)]/20 bg-[var(--ca-chrome)] px-2.5 py-1 text-xs font-bold text-[var(--ca-ink)] shadow-2xs">
                          <Star size={13} className="text-amber-500 fill-amber-500" />
                          {project.metrics.stars} Stars
                        </span>
                        <span className="ca-mono inline-flex items-center gap-1.5 rounded-sm border border-[var(--ca-ink)]/20 bg-[var(--ca-chrome)] px-2.5 py-1 text-xs font-bold text-[var(--ca-ink)] shadow-2xs">
                          <GitFork size={13} className="text-[var(--ca-blue)]" />
                          {project.metrics.forks} Forks
                        </span>
                        <span className="ca-mono inline-flex items-center gap-1.5 rounded-sm border border-[var(--ca-ink)]/20 bg-[var(--ca-chrome)] px-2.5 py-1 text-xs font-bold text-[var(--ca-ink)] shadow-2xs">
                          <Eye size={13} className="text-emerald-600" />
                          {project.metrics.views} Views
                        </span>
                      </div>
                    )}

                    <p className="mt-4 text-base leading-relaxed text-[var(--ca-ink)]/80 sm:text-lg">
                      {project.summary}
                    </p>

                    {/* Core Capabilities & Features */}
                    {project.features && project.features.length > 0 && (
                      <div className="mt-6 rounded-md border border-[var(--ca-ink)]/15 bg-[var(--ca-chrome)]/40 p-4">
                        <strong className="ca-mono block text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] mb-2.5">
                          Core Features &amp; Capabilities:
                        </strong>
                        <ul className="grid grid-cols-1 gap-2 text-sm text-[var(--ca-ink)]/85">
                          {project.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2.5">
                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--ca-blue)] text-[10px] font-bold text-white">
                                ✓
                              </span>
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Role & Personal Contribution summary */}
                    <div className="mt-6 rounded-md border border-[var(--ca-ink)]/15 bg-[var(--ca-chrome)]/60 p-4">
                      <strong className="ca-mono block text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]">
                        Architectural Ownership &amp; Role:
                      </strong>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--ca-ink)]/85">
                        {project.personalContribution}
                      </p>
                    </div>

                    {/* Key Technical Highlights */}
                    <div className="mt-6">
                      <strong className="ca-mono block text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] mb-2">
                        Key Technical Decisions:
                      </strong>
                      <ul className="space-y-1.5 text-sm text-[var(--ca-ink)]/85">
                        {project.technicalHighlights.slice(0, 3).map((item, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--ca-blue)]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech, tIdx) => {
                        const pillColors = [
                          "var(--ca-yellow-soft)",
                          "var(--ca-mint)",
                          "var(--ca-cyan)",
                          "var(--ca-pink-soft)",
                          "var(--ca-purple)",
                        ];
                        const pillBg = pillColors[tIdx % pillColors.length];
                        return (
                          <span
                            key={tech}
                            className="ca-mono rounded border border-[var(--ca-ink)]/20 px-2.5 py-1 text-xs font-bold text-[var(--ca-ink)] shadow-2xs"
                            style={{ backgroundColor: pillBg }}
                          >
                            {tech}
                          </span>
                        );
                      })}
                    </div>

                    {/* Action Links with 44px Minimum Touch Targets */}
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="ca-mono min-h-[44px] inline-flex items-center gap-2 border-2 border-[var(--ca-ink)] bg-[var(--ca-yellow)] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[var(--ca-ink)] shadow-[3px_3px_0_var(--ca-ink)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--ca-yellow-soft)] active:translate-y-0"
                      >
                        View Project
                        <ArrowUpRight size={16} />
                      </Link>

                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ca-mono min-h-[44px] inline-flex items-center gap-2 border-2 border-[var(--ca-ink)] bg-[var(--ca-blue)] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-[3px_3px_0_var(--ca-ink)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--ca-ink)] active:translate-y-0"
                        >
                          Live Demo
                          <ExternalLink size={14} />
                        </a>
                      )}

                      <a
                        href={project.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ca-mono min-h-[44px] inline-flex items-center gap-2 border border-[var(--ca-ink)]/40 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[var(--ca-ink)] transition-colors hover:border-[var(--ca-ink)] hover:bg-[var(--ca-chrome)] active:bg-[var(--ca-chrome)]"
                      >
                        <GithubIcon className="h-4 w-4" />
                        Source Code
                      </a>
                    </div>
                  </div>

                  {/* Image Preview & Measured Outcomes */}
                  <div className={isReversed ? "lg:order-1" : "lg:order-2"}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group block relative overflow-hidden border-3 border-[var(--ca-ink)] bg-white shadow-md transition-transform duration-300 group-hover:scale-[1.01]"
                    >
                      <div className="relative aspect-[16/10] w-full">
                        <ImageWithLoader
                          src={project.homeHero || project.hero}
                          alt={`${project.title} interface preview`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 550px"
                          loaderVariant="project"
                          loaderText="Loading Preview..."
                          priority={idx === 0}
                          fetchPriority={idx === 0 ? "high" : undefined}
                        />
                      </div>
                    </Link>

                    {/* Measured Outcome Cards */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      {project.outcomes.map((metric, mIdx) => (
                        <div
                          key={mIdx}
                          className="border border-[var(--ca-ink)]/20 bg-white p-2.5 sm:p-3 text-center shadow-xs"
                        >
                          <strong className="block text-xl sm:text-2xl font-black text-[var(--ca-ink)]">
                            {metric.value}
                          </strong>
                          <span className="ca-mono mt-1 block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]/75">
                            {metric.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
              </Reveal>
            );
          })}
        </div>


        {/* Technical Architecture Summary Box */}
        <Reveal delay={150}>
          <section className="mt-20 sm:mt-28 border-3 border-[var(--ca-ink)] bg-white p-8 sm:p-12 shadow-[6px_8px_0_var(--ca-ink)]">
            <div className="flex flex-col items-center text-center">
              <span className="ca-mono inline-block rounded-full bg-[var(--ca-ink)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                Engineering Mindset
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-[var(--ca-ink)] sm:text-4xl">
                How I Approach Web &amp; Product Engineering
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--ca-ink)]/80 sm:text-lg">
                Whether building alone or leading a team of fellow student developers, I focus on three core principles:
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-lg border-2 border-[var(--ca-ink)] bg-[var(--ca-yellow-soft)] p-6">
                <span className="ca-mono text-2xl font-black text-[var(--ca-ink)]">01</span>
                <h3 className="mt-2 text-lg font-bold text-[var(--ca-ink)]">Backend Rigor First</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ca-ink)]/80">
                  A snappy UI can&apos;t disguise an unstable database query or slow network pipeline.
                  I optimize data models, tile pyramids, and API schemas before polishing CSS.
                </p>
              </div>

              <div className="rounded-lg border-2 border-[var(--ca-ink)] bg-[var(--ca-cyan)] p-6">
                <span className="ca-mono text-2xl font-black text-[var(--ca-ink)]">02</span>
                <h3 className="mt-2 text-lg font-bold text-[var(--ca-ink)]">Tactile Interaction Design</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ca-ink)]/80">
                  Interfaces should feel responsive, expressive, and predictable. I care deeply about
                  smooth 60fps renders, intuitive gestures, and purposeful micro-feedback.
                </p>
              </div>

              <div className="rounded-lg border-2 border-[var(--ca-ink)] bg-[var(--ca-mint)] p-6">
                <span className="ca-mono text-2xl font-black text-[var(--ca-ink)]">03</span>
                <h3 className="mt-2 text-lg font-bold text-[var(--ca-ink)]">Measurable Real-World Utility</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ca-ink)]/80">
                  I avoid boilerplate demo apps. Every project addresses a genuine friction point—from
                  handling gigapixel satellite rasters to demystifying neural network graph assembly.
                </p>
              </div>
            </div>
          </section>
        </Reveal>
      </div>

      <ContactStrip />
      <Footer />
    </div>
  );
}
