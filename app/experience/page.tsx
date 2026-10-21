import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ChevronRight } from "lucide-react";
import { ContactStrip, Footer, Polaroid, Scribble, Tape } from "@/components/Paper";
import { StaggerText } from "@/components/Motion";
import Reveal from "@/components/Reveal";
import { CertificateSection } from "@/components/CertificateSection";
import { achievements, experienceItems, siteUrl } from "@/lib/site";
import { getBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Experience & Leadership",
  description:
    "I lead web development at TechSpark, mentor student developers, and have organized technical events at Ratan Tata Maharashtra State Skills University in Pune.",
  keywords: [
    "Jayant Potdar Experience",
    "TechSpark MSSU",
    "Head of Web Development",
    "Engineering Leadership",
    "Hackathon Winner Pune",
    "Developer Mentorship",
    "MSSU Technical Club",
    "Technical Event Organizer",
  ],
  alternates: {
    canonical: `${siteUrl}/experience`,
  },
  openGraph: {
    title: "Experience & Leadership | Jayant Potdar",
    description:
      "My engineering leadership at TechSpark, hackathon event organization, and competition awards in Pune.",
    url: `${siteUrl}/experience`,
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Experience & Leadership — Jayant Potdar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience & Leadership | Jayant Potdar",
    description:
      "My engineering leadership at TechSpark, hackathon event organization, and competition awards in Pune.",
    images: ["/og"],
  },
};

export default function ExperiencePage() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Experience", url: `${siteUrl}/experience` },
  ]);

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Experience & Leadership — Jayant Potdar",
    url: `${siteUrl}/experience`,
    description:
      "My engineering leadership at TechSpark, university technical event organization, hackathon achievements, and software development experience in Pune.",
    author: {
      "@id": `${siteUrl}/#jayant`,
    },
  };

  return (
    <div className="ca-grid min-h-screen pt-12 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, webPageJsonLd]).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs ca-mono font-semibold text-[var(--ca-ink)]/70">
          <Link href="/" className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-2 hover:text-[var(--ca-blue)]">Home</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--ca-ink)] font-bold">Experience &amp; Leadership</span>
        </nav>

        {/* Page Header */}
        <header className="mb-14 sm:mb-20 text-center">
          <Scribble withDoodle>community leadership &amp; competitive honors</Scribble>

          <h1 className="ca-display mt-4 text-5xl min-[390px]:text-6xl sm:text-8xl md:text-9xl uppercase leading-none tracking-tight text-[var(--ca-ink)]">
            <StaggerText text="EXPERIENCE" stagger={0.045} priority />
          </h1>

          <Reveal delay={120} priority>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[var(--ca-ink)]/85 sm:text-xl font-normal">
              I lead web development at TechSpark, help students build and ship projects, and organize hands-on technical events alongside my own software work.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="ca-mono inline-flex items-center gap-2 rounded-full border border-[var(--ca-ink)]/20 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ca-blue)]" />
                TechSpark Technical Club
              </span>
              <span className="ca-mono inline-flex items-center gap-2 rounded-full border border-[var(--ca-ink)]/20 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ca-yellow)]" />
                100+ Hackathon Participants Directed
              </span>
              <span className="ca-mono inline-flex items-center gap-2 rounded-full border border-[var(--ca-ink)]/20 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ca-mint)]" />
                Pune, India
              </span>
            </div>
          </Reveal>
        </header>

        {/* Leadership Roles Section */}
        <section className="mb-20 sm:mb-28" aria-labelledby="roles-heading">
          <Reveal delay={60}>
            <div className="flex items-center gap-3 mb-8">
              <h2 id="roles-heading" className="ca-mono ca-torn-label inline-block px-5 py-2 text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)]" style={{ backgroundColor: "var(--ca-yellow)" }}>
                Leadership Roles
              </h2>
              <div className="h-0.5 flex-1 bg-[var(--ca-ink)]/15" />
            </div>
          </Reveal>

          <div className="space-y-8">
            {experienceItems.map((item, idx) => (
              <Reveal key={idx} delay={idx * 120}>
                <article
                  className="ca-doodle-box relative border-3 border-[var(--ca-ink)] bg-white p-6 sm:p-8 shadow-[4px_6px_0_var(--ca-ink)]"
                >
                  <Tape
                    className={idx % 2 === 0 ? "-left-2 -top-2" : "-right-2 -top-2"}
                    angle={idx % 2 === 0 ? -8 : 8}
                    color={idx % 2 === 0 ? "var(--ca-yellow-soft)" : "var(--ca-cyan)"}
                  />

                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <span className="ca-mono inline-block rounded border border-[var(--ca-ink)]/20 bg-[var(--ca-cyan)] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs">
                        {item.type}
                      </span>
                      <h3 className="mt-2 text-2xl font-bold text-[var(--ca-ink)] sm:text-3xl">
                        {item.role}
                      </h3>
                      <p className="mt-1 text-base font-semibold text-[var(--ca-ink)]/75">
                        {item.organization}
                      </p>
                    </div>
                    <span className="ca-mono w-fit rounded-full border border-[var(--ca-ink)] bg-[var(--ca-yellow-soft)] px-3.5 py-1 text-xs font-bold text-[var(--ca-ink)] shrink-0">
                      {item.period}
                    </span>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-base leading-relaxed text-[var(--ca-ink)]/85">
                    {item.highlights.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--ca-blue)]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Honors & Hackathon Awards */}
        <section className="mb-20 sm:mb-28" aria-labelledby="awards-heading">
          <Reveal delay={60}>
            <div className="flex items-center gap-3 mb-8">
              <h2 id="awards-heading" className="ca-mono ca-torn-label inline-block px-5 py-2 text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)]" style={{ backgroundColor: "var(--ca-magenta)" }}>
                Honors &amp; Competitions
              </h2>
              <div className="h-0.5 flex-1 bg-[var(--ca-ink)]/15" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((item, idx) => {
              const bgColors = ["var(--ca-yellow-soft)", "var(--ca-cyan)", "var(--ca-mint)", "var(--ca-pink-soft)"];
              const bg = bgColors[idx % bgColors.length];

              return (
                <Reveal key={idx} delay={idx * 80}>
                  <div
                    className="ca-stamp-note relative flex flex-col justify-between p-6 shadow-md border border-[var(--ca-ink)]/15 transition-transform duration-200 hover:-translate-y-1 h-full"
                    style={{ backgroundColor: bg }}
                  >
                    <Tape className="-top-2 left-6" angle={idx % 2 === 0 ? -12 : 12} color={idx % 2 === 0 ? "var(--ca-yellow-soft)" : "var(--ca-cyan)"} />

                    <div>
                      <span className="ca-mono text-xs font-bold uppercase tracking-widest text-[var(--ca-ink)]/70">
                        {item.year}
                      </span>
                      <h3 className="mt-2 text-lg font-black text-[var(--ca-ink)] leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs font-semibold text-[var(--ca-ink)]/75">
                        {item.issuer}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Visual Photographic Verification of Physical Trophies */}
          <Reveal delay={120}>
            <div className="mt-8 rounded-sm border-2 border-dashed border-[var(--ca-ink)]/20 bg-white p-6 sm:p-8 shadow-[4px_4px_0_rgba(25,21,16,0.06)]">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <div className="w-full md:w-80 lg:w-96 shrink-0">
                  <Polaroid
                    src="/images/img-5.jpeg"
                    alt="My physical trophies and signed certificates from MSSU"
                    caption="Foundation Day Week Trophies & Certificates"
                    aspectClassName="aspect-[4/3]"
                    className="w-full shadow-md"
                  />
                </div>
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <span className="ca-mono inline-block rounded bg-[var(--ca-mint)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]">
                    Physical Evidence
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--ca-ink)]">
                    Tangible University Awards &amp; Official Merit Certificates
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-[var(--ca-ink)]/80">
                    Photographed trophies from Maharashtra State Skills University (MSSU) Foundation Day Week 2025: 1st Prize in Project Expo, 2nd Prize in UX Game Forage, and official Certificates of Appreciation signed by university administration.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Industry Certifications */}
        <section className="mb-20 sm:mb-28" aria-labelledby="certifications-heading">
          <Reveal delay={60}>
            <div className="flex items-center gap-3 mb-8">
              <h2 id="certifications-heading" className="ca-mono ca-torn-label inline-block px-5 py-2 text-sm font-bold uppercase tracking-widest text-white" style={{ backgroundColor: "var(--ca-blue)" }}>
                Industry Certifications
              </h2>
              <div className="h-0.5 flex-1 bg-[var(--ca-ink)]/15" />
            </div>
          </Reveal>

          <CertificateSection className="mt-6" />
        </section>

        {/* Recruiter Navigation Bar */}
        <Reveal delay={120}>
          <div className="mb-20 rounded-lg border-2 border-[var(--ca-ink)] bg-white p-8 text-center shadow-[4px_4px_0_var(--ca-ink)]">
            <h2 className="text-2xl font-bold uppercase text-[var(--ca-ink)]">
              Explore My Engineering Work
            </h2>
            <p className="mt-2 text-sm text-[var(--ca-ink)]/80">
              Review code repositories, architecture projects, or reach out directly.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/projects"
                className="group ca-mono min-h-[44px] inline-flex items-center justify-center gap-2 border-2 border-[var(--ca-ink)] bg-[var(--ca-yellow)] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[var(--ca-ink)] shadow-[3px_3px_0_var(--ca-ink)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--ca-ink)] active:translate-y-0 active:shadow-[1px_1px_0_var(--ca-ink)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
              >
                <span>View Projects</span>
                <ArrowUpRight size={16} className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/blog"
                className="group ca-mono min-h-[44px] inline-flex items-center justify-center gap-2 border-2 border-[var(--ca-ink)] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[var(--ca-ink)] shadow-[3px_3px_0_var(--ca-ink)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--ca-ink)] hover:bg-[var(--ca-chrome)] active:translate-y-0 active:shadow-[1px_1px_0_var(--ca-ink)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
              >
                <span>Engineering Blog</span>
                <ArrowUpRight size={16} className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/contact"
                className="group ca-mono min-h-[44px] inline-flex items-center justify-center gap-2 border-2 border-[var(--ca-ink)] bg-[var(--ca-blue)] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-[3px_3px_0_var(--ca-ink)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--ca-ink)] hover:bg-[var(--ca-ink)] active:translate-y-0 active:shadow-[1px_1px_0_var(--ca-ink)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
              >
                <span>Get in Touch</span>
                <ArrowUpRight size={16} className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      <ContactStrip />
      <Footer />
    </div>
  );
}
