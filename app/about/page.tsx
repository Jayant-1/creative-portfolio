import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, GraduationCap, MapPin, Briefcase, Award } from "lucide-react";
import { ContactStrip, Footer, Polaroid, Tape } from "@/components/Paper";
import { StaggerText, DropIn } from "@/components/Motion";
import { AboutAsideNav } from "@/components/AboutAsideNav";
import Reveal from "@/components/Reveal";
import { TechnicalSkillsetPicker } from "@/components/TechnicalSkillsetPicker";
import { author, siteUrl, skillsByCategory } from "@/lib/site";
import { getBreadcrumbSchema, getPersonSchema, getProfilePageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About · Full Stack Developer in Pune",
  description:
    "I'm Jayant Potdar, a full stack developer in Pune studying Computer Science at Ratan Tata Maharashtra State Skills University. Learn how I build expressive interfaces and complete web products.",
  keywords: [
    "Jayant Potdar",
    "About Jayant Potdar",
    "Full Stack Developer Pune",
    "MSSU Pune",
    "Software Engineer India",
    "Computer Science Engineering",
    "Web Developer Portfolio",
    "TechSpark Head",
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    type: "profile",
    title: "About Me | Jayant Potdar",
    description:
      "My background, education at MSSU Pune, engineering philosophy, and project experience.",
    url: `${siteUrl}/about`,
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "About me — Jayant Potdar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Me | Jayant Potdar",
    description:
      "My background, education at MSSU Pune, engineering philosophy, and project experience.",
    images: ["/og"],
  },
};

export default function AboutPage() {
  const profileJsonLd = {
    ...getProfilePageSchema({
      url: `${siteUrl}/about`,
      name: "About Me | Jayant Potdar",
      description: author.summary,
    }),
    mainEntity: getPersonSchema(),
  };

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "About", url: `${siteUrl}/about` },
  ]);

  return (
    <div className="ca-grid min-h-screen pt-12 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs ca-mono font-semibold text-[var(--ca-ink)]/70">
          <Link href="/" className="hover:text-[var(--ca-blue)]">Home</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--ca-ink)] font-bold">About</span>
        </nav>

        {/* Header row: aligned with the content column */}
        <div className="grid grid-cols-1 lg:grid-cols-[170px_1fr] lg:gap-14 mb-8 sm:mb-12">
          <div className="hidden lg:block" aria-hidden="true" />
          <div>
            <h1 className="ca-display text-6xl sm:text-8xl md:text-9xl uppercase leading-none tracking-tight text-[var(--ca-ink)] mb-4">
              <StaggerText text="ABOUT" stagger={0.06} />
            </h1>

            {/* Mobile quick-jump navigation (sleek 34px badges matching desktop tabs) */}
            <nav className="flex flex-wrap gap-2 lg:hidden pt-2" aria-label="About section quick links">
              <a
                href="#bio"
                className="ca-mono inline-flex h-[34px] min-h-[34px] items-center gap-1.5 rounded-lg border-2 border-[var(--ca-ink)] px-3 text-[11px] font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-[2px_2px_0_var(--ca-ink)] active:scale-95 transition-all hover:translate-x-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] focus-visible:ring-offset-2"
                style={{ backgroundColor: "var(--ca-yellow)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ca-ink)]" />
                Main Bio
              </a>
              <a
                href="#facts"
                className="ca-mono inline-flex h-[34px] min-h-[34px] items-center gap-1.5 rounded-lg border-2 border-[var(--ca-ink)] px-3 text-[11px] font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-[2px_2px_0_var(--ca-ink)] active:scale-95 transition-all hover:translate-x-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] focus-visible:ring-offset-2"
                style={{ backgroundColor: "var(--ca-cyan)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ca-ink)]" />
                Quick Facts
              </a>
              <a
                href="#story"
                className="ca-mono inline-flex h-[34px] min-h-[34px] items-center gap-1.5 rounded-lg border-2 border-[var(--ca-ink)] px-3 text-[11px] font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-[2px_2px_0_var(--ca-ink)] active:scale-95 transition-all hover:translate-x-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] focus-visible:ring-offset-2"
                style={{ backgroundColor: "var(--ca-magenta)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ca-ink)]" />
                Story
              </a>
              <a
                href="#leadership"
                className="ca-mono inline-flex h-[34px] min-h-[34px] items-center gap-1.5 rounded-lg border-2 border-[var(--ca-ink)] px-3 text-[11px] font-bold uppercase tracking-wider text-white shadow-[2px_2px_0_var(--ca-ink)] active:scale-95 transition-all hover:translate-x-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] focus-visible:ring-offset-2"
                style={{ backgroundColor: "var(--ca-blue)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Leadership
              </a>
            </nav>
          </div>
        </div>

        {/* Unified Layout with Continuous Left Aside & Progressive Peel Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-[170px_1fr] lg:gap-14 mb-8 sm:mb-12">
          {/* Continuous Left Aside for Desktop */}
          <aside className="hidden lg:block relative self-stretch" aria-label="About section quick links">
            <AboutAsideNav />
          </aside>

          {/* All 4 Sections Stacked */}
          <div className="min-w-0 flex flex-col gap-20 sm:gap-28">
            {/* Section 1: Main Bio */}
            <section id="bio" className="scroll-mt-28 min-w-0" aria-labelledby="bio-heading">
            <Reveal delay={80}>
              <span
                className="ca-mono ca-torn-label inline-block px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)]"
                style={{ backgroundColor: "var(--ca-yellow)" }}
              >
                Engineering Profile
              </span>

              <div className="ca-doodle-box relative mt-6 border-3 border-[var(--ca-yellow)] bg-white p-6 sm:p-10 lg:p-12 shadow-[4px_6px_0_rgba(25,21,16,0.06)]">
                {/* Polaroid pinned at top right */}
                <div className="mb-8 flex justify-center sm:mb-6 sm:float-right sm:ml-8 sm:w-64">
                  <DropIn y={-28} rotate={3} delay={0.15}>
                    <Polaroid
                      src="/images/img-3.jpeg"
                      alt="Jayant Potdar - Full Stack Developer in Pune"
                      caption="Me in the Western Ghats"
                      aspectClassName="aspect-[3/4]"
                      className="w-56 sm:w-64"
                      priority
                      fetchPriority="high"
                    />
                  </DropIn>
                </div>

                <h2 id="bio-heading" className="ca-hand text-3xl font-medium leading-[1.25] text-[var(--ca-ink)] sm:text-4xl lg:text-5xl">
                  I&apos;m Jayant Potdar — a creative full stack developer in Pune. I design interfaces with character and build the systems that make them work.
                </h2>

                <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--ca-ink)]/85 sm:text-lg">
                  <p>
                    I study Computer Science &amp; Engineering at <strong>Ratan Tata Maharashtra State Skills University (MSSU), Pune</strong> (Class of 2024–2028, current CGPA 8.0). I like solving the whole problem: how a product looks, how it behaves, and how its data moves behind the scenes.
                  </p>
                  <p>
                    I built <strong>AstroPixel</strong> independently, learning through repeated experiments with image processing, tile delivery, and browser rendering. I led student teams on <strong>Krypton</strong>, <strong>Malaria Detection System</strong>, and <strong>NeuralNet</strong>. Each project pushed me to understand another complex system well enough to make it usable.
                  </p>
                  <p>
                    Outside of code, I serve as <strong>Head of Web Development</strong> at MSSU&apos;s TechSpark technical club, where I mentor junior students in modern web engineering, run workshops, and organized the flagship Pixel Perfection Hackathon with 100+ participants.
                  </p>
                </div>

                {/* Yellow pinned notes */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <div
                    className="ca-tape relative -rotate-1 rounded-sm p-4 text-sm leading-relaxed text-[var(--ca-ink)] shadow-md sm:w-1/2"
                    style={{ backgroundColor: "var(--ca-yellow-soft)" }}
                  >
                    <p className="font-semibold flex items-center gap-1.5">
                      <GraduationCap size={16} className="shrink-0 text-[var(--ca-ink)]" />
                      <span><strong>Education:</strong> B.Tech in CSE at {author.college} (2024–2028, CGPA 8.0).</span>
                    </p>
                  </div>
                  <div
                    className="ca-tape relative rotate-1 rounded-sm p-4 text-sm leading-relaxed text-[var(--ca-ink)] shadow-md sm:w-1/2"
                    style={{ backgroundColor: "var(--ca-mint)" }}
                  >
                    <p className="font-semibold flex items-center gap-1.5">
                      <Briefcase size={16} className="shrink-0 text-[var(--ca-ink)]" />
                      <span><strong>Status:</strong> Open to full stack internships and full-time roles in Pune, with hybrid or remote options.</span>
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* Section 2: Entity Quick Facts */}
          <section id="facts" className="scroll-mt-28 min-w-0" aria-labelledby="facts-heading">
            <Reveal delay={120}>
              <span
                className="ca-mono ca-torn-label inline-block px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)]"
                style={{ backgroundColor: "var(--ca-cyan)" }}
              >
                Quick Facts
              </span>

              <div className="relative mt-6 border-3 border-[var(--ca-ink)] bg-white p-6 sm:p-10 shadow-[6px_8px_0_var(--ca-ink)]">
                <Tape className="-top-3 right-8" angle={8} color="var(--ca-yellow-soft)" />

                <h2 id="facts-heading" className="text-2xl sm:text-3xl font-extrabold uppercase text-[var(--ca-ink)]">
                  At a glance
                </h2>
                <p className="mt-2 text-sm text-[var(--ca-ink)]/75">
                  Direct answers to common questions about my background, skills, and availability.
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-[var(--ca-ink)]/15 bg-[var(--ca-chrome)]/60 p-5 rounded">
                    <div className="flex items-center gap-2 text-[var(--ca-blue)] font-bold text-sm ca-mono uppercase">
                      <MapPin size={16} /> Location &amp; Base
                    </div>
                    <p className="mt-2 text-sm sm:text-base text-[var(--ca-ink)] font-medium">
                      Based in <strong>Pune, Maharashtra, India</strong>. Open to roles in Pune, as well as hybrid or remote work.
                    </p>
                  </div>

                  <div className="border border-[var(--ca-ink)]/15 bg-[var(--ca-chrome)]/60 p-5 rounded">
                    <div className="flex items-center gap-2 text-[var(--ca-blue)] font-bold text-sm ca-mono uppercase">
                      <GraduationCap size={16} /> University &amp; CGPA
                    </div>
                    <p className="mt-2 text-sm sm:text-base text-[var(--ca-ink)] font-medium">
                      <strong>Ratan Tata Maharashtra State Skills University (MSSU), Pune</strong>. Pursuing B.Tech in Computer Science &amp; Engineering (2024–2028) with a current CGPA of <strong>8.0 / 10.0</strong>.
                    </p>
                  </div>

                  <div className="border border-[var(--ca-ink)]/15 bg-[var(--ca-chrome)]/60 p-5 rounded">
                    <div className="flex items-center gap-2 text-[var(--ca-blue)] font-bold text-sm ca-mono uppercase">
                      <Briefcase size={16} /> What Do I Build?
                    </div>
                    <p className="mt-2 text-sm sm:text-base text-[var(--ca-ink)] font-medium">
                      Expressive web interfaces and complete applications using <strong>React, Next.js, and TypeScript</strong> alongside <strong>Python, FastAPI, databases, and AI tools</strong>.
                    </p>
                  </div>

                  <div className="border border-[var(--ca-ink)]/15 bg-[var(--ca-cyan)]/40 p-5 rounded">
                    <div className="flex items-center gap-2 text-[var(--ca-blue)] font-bold text-sm ca-mono uppercase">
                      <Award size={16} /> Awards &amp; Certificates
                    </div>
                    <p className="mt-2 text-sm sm:text-base text-[var(--ca-ink)] font-medium">
                      1st Place Web Design Competition, 2nd Place Project Expo 2025, 3rd Place University Ideation 3.0 (AstroPixel), and Oracle Cloud Infrastructure Generative AI Certified Professional.
                    </p>
                  </div>
                </div>

                {/* Physical Verification Showcase */}
                <div className="mt-8 rounded border-2 border-dashed border-[var(--ca-ink)]/20 bg-[var(--ca-chrome)]/40 p-5 sm:p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-72 lg:w-80 shrink-0">
                      <Polaroid
                        src="/images/img-5.jpeg"
                        alt="My physical trophies and signed certificates from MSSU"
                        caption="Physical Honors & Signed Certificates"
                        aspectClassName="aspect-[4/3]"
                        className="w-full shadow-md"
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <h3 className="text-lg font-bold text-[var(--ca-ink)] sm:text-xl">
                        Physical Trophies &amp; Official University Certifications
                      </h3>
                      <p className="text-sm leading-relaxed text-[var(--ca-ink)]/80">
                        First Prize at Foundation Day Week &amp; Project Expo, Second Prize in UX Game Forage, and signed Certificates of Appreciation directly from Ratan Tata Maharashtra State Skills University (MSSU), Pune.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Categorized Technical Skills (Interactive 3-Option Comparison) */}
                <TechnicalSkillsetPicker skillsByCategory={skillsByCategory} />
              </div>
            </Reveal>
          </section>

          {/* Section 3: Story */}
          <section id="story" className="scroll-mt-28 min-w-0" aria-labelledby="story-heading">
            <Reveal delay={100}>
              <h2
                id="story-heading"
                className="ca-mono ca-torn-label inline-block px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)]"
                style={{ backgroundColor: "var(--ca-magenta)" }}
              >
                Engineering Philosophy
              </h2>
            </Reveal>

            <div className="mt-8 space-y-12">
              {/* Story Card 1 */}
              <Reveal delay={120}>
                <div className="relative pt-4 sm:pt-6">
                  <div
                    className="relative rounded-sm p-6 sm:p-10 shadow-[2px_5px_15px_rgba(25,21,16,0.12)] -rotate-1 transition-transform duration-200 hover:rotate-0"
                    style={{ backgroundColor: "var(--ca-cyan)" }}
                  >
                    <Tape className="-top-3 left-10" angle={-15} color="var(--ca-yellow-soft)" />
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                      <span className="ca-display text-4xl text-[var(--ca-ink)] sm:text-5xl shrink-0">01</span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold tracking-tight text-[var(--ca-ink)] sm:text-3xl">
                          Build the full loop
                        </h3>
                        <p className="mt-2 text-base leading-relaxed text-[var(--ca-ink)]/90 sm:text-lg">
                          I enjoy following a feature through the entire system, from a gesture in React to an API, a database, and back to the screen. AstroPixel made that habit essential: tile generation, storage, requests, and rendering all had to work together.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Story Card 2 */}
              <Reveal delay={200}>
                <div className="relative pt-4 sm:pt-6">
                  <div
                    className="relative rounded-sm p-6 sm:p-10 shadow-[2px_5px_15px_rgba(25,21,16,0.12)] rotate-1 transition-transform duration-200 hover:rotate-0"
                    style={{ backgroundColor: "var(--ca-yellow-soft)" }}
                  >
                    <Tape className="-top-3 right-10" angle={12} color="var(--ca-pink-soft)" />
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                      <span className="ca-display text-4xl text-[var(--ca-ink)] sm:text-5xl shrink-0">02</span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold tracking-tight text-[var(--ca-ink)] sm:text-3xl">
                          Sweat the micro-feel
                        </h3>
                        <p className="mt-2 text-base leading-relaxed text-[var(--ca-ink)]/90 sm:text-lg">
                          A functional feature is just the start. Clear loading indicators, error handling that actually helps, and tactile transitions transform software into something people can trust on a bad day.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Story Card 3 */}
              <Reveal delay={280}>
                <div className="relative pt-4 sm:pt-6">
                  <div
                    className="relative rounded-sm p-6 sm:p-10 shadow-[2px_5px_15px_rgba(25,21,16,0.12)] -rotate-1 transition-transform duration-200 hover:rotate-0"
                    style={{ backgroundColor: "var(--ca-mint)" }}
                  >
                    <Tape className="-top-3 left-14" angle={-8} color="var(--ca-cyan)" />
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                      <span className="ca-display text-4xl text-[var(--ca-ink)] sm:text-5xl shrink-0">03</span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold tracking-tight text-[var(--ca-ink)] sm:text-3xl">
                          Ground AI in deterministic math
                        </h3>
                        <p className="mt-2 text-base leading-relaxed text-[var(--ca-ink)]/90 sm:text-lg">
                          I like systems that can be inspected and explained. In Krypton, a weighted ranking step makes paper selection visible; in NeuralNet, graph validation and code generation expose how an architecture becomes Keras code.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Section 4: Leadership & Campus Impact */}
          <section id="leadership" className="scroll-mt-28 min-w-0" aria-labelledby="leadership-heading">
            <Reveal delay={120}>
              <span
                className="ca-mono ca-torn-label inline-block px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-white"
                style={{ backgroundColor: "var(--ca-blue)" }}
              >
                Leadership &amp; Campus Impact
              </span>

              <div className="relative mt-8 rounded-sm border-2 border-[var(--ca-ink)]/15 bg-white p-6 sm:p-10 lg:p-12 shadow-[4px_6px_0_rgba(25,21,16,0.06)]">
                <div className="space-y-8 divide-y divide-[var(--ca-ink)]/10">
                  <div className="pt-2">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 bg-[var(--ca-blue)] shrink-0" aria-hidden="true" />
                        <h2 id="leadership-heading" className="text-xl font-bold text-[var(--ca-ink)] sm:text-2xl">
                          Head of Web Development
                        </h2>
                      </div>
                      <span className="ca-mono inline-block w-fit rounded-full border border-[var(--ca-ink)]/20 bg-[var(--ca-cyan)] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs">
                        2025 to Present
                      </span>
                    </div>
                    <p className="mt-1 pl-6 text-sm font-medium text-[var(--ca-ink)]/70">
                      TechSpark Technical Club, MSSU Pune
                    </p>
                    <p className="mt-2 pl-6 text-base text-[var(--ca-ink)]/85">
                      Directing university web initiatives, managing code repositories, conducting technical workshops, and mentoring junior student developers in modern web engineering and Git workflows.
                    </p>
                  </div>

                  <div className="pt-8">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 bg-[var(--ca-blue)] shrink-0" aria-hidden="true" />
                        <h3 className="text-xl font-bold text-[var(--ca-ink)] sm:text-2xl">
                          Event Head — Pixel Perfection Hackathon
                        </h3>
                      </div>
                      <span className="ca-mono inline-block w-fit rounded-full border border-[var(--ca-ink)]/20 bg-[var(--ca-yellow-soft)] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs">
                        2024
                      </span>
                    </div>
                    <p className="mt-1 pl-6 text-sm font-medium text-[var(--ca-ink)]/70">
                      TechSpark Technical Club, MSSU Pune
                    </p>
                    <p className="mt-2 pl-6 text-base text-[var(--ca-ink)]/85">
                      Organized and executed the flagship frontend &amp; UI hackathon with <strong>100+ active student participants</strong>, designed problem statements, and led live evaluation.
                    </p>
                  </div>
                </div>

                <div className="mt-10 pt-6 pb-3 sm:pb-4 border-t border-[var(--ca-ink)]/10 flex flex-wrap gap-6 items-center">
                  <Link
                    href="/projects"
                    className="group ca-mono min-h-[44px] inline-flex items-center gap-2 border-b-2 border-[var(--ca-ink)] py-2 text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)] transition-colors hover:text-[var(--ca-blue)]"
                  >
                    Explore my projects
                    <ArrowUpRight size={18} className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>

                  <Link
                    href="/experience"
                    className="group ca-mono min-h-[44px] inline-flex items-center gap-2 border-b-2 border-[var(--ca-blue)] py-2 text-sm font-bold uppercase tracking-widest text-[var(--ca-blue)] transition-colors hover:text-[var(--ca-ink)]"
                  >
                    View detailed experience record
                    <ArrowUpRight size={18} className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </section>
          </div>
        </div>
      </div>

      <ContactStrip />
      <Footer />
    </div>
  );
}
