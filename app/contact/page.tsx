import type { Metadata } from "next";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import ContactForm from "@/components/ContactForm";
import { author, email, siteUrl, social } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Jayant Potdar — Full Stack Developer",
  description:
    "Get in touch with Jayant Potdar, Full Stack Developer based in Pune, India. Open to internships, software engineering roles, and high-impact web engineering.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Jayant Potdar | Full Stack Developer",
    description: "Get in touch with Jayant Potdar regarding software engineering roles and collaborations.",
    url: `${siteUrl}/contact`,
  },
};

export default function ContactPage() {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Jayant Potdar",
    url: `${siteUrl}/contact`,
    mainEntity: {
      "@type": "Person",
      "@id": `${siteUrl}/#jayant`,
      name: author.name,
      jobTitle: author.role,
      email: email,
      telephone: "+91 80108 55431",
      url: siteUrl,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        addressCountry: "India",
      },
    },
  };

  return (
    <main className="ca-grid relative flex flex-1 flex-col px-4 py-10 sm:py-4 min-h-[calc(100svh-64px)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Desktop Flanking Polaroids */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block overflow-hidden" aria-hidden="true">
        {/* Left Polaroid */}
        <div
          className="absolute left-[9%] top-[14%] w-60 xl:w-72 transition-transform duration-500 hover:rotate-0"
          style={{ transform: "rotate(-14.4deg)" }}
        >
          <div className="pointer-events-auto block w-full">
            <figure className="relative inline-block bg-white p-2 pb-1 shadow-[0_6px_18px_rgba(17,18,18,0.22)] w-full">
              <span className="absolute -left-4 -top-2 z-10 h-5 w-16 -rotate-[38deg] bg-[var(--ca-cyan)] opacity-90 shadow-[0_1px_3px_rgba(17,18,18,0.15)]" />
              <span className="absolute -right-4 -top-2 z-10 h-5 w-16 rotate-[38deg] bg-[var(--ca-yellow-soft)] opacity-90 shadow-[0_1px_3px_rgba(17,18,18,0.15)]" />
              <div className="aspect-[4/5] w-full overflow-hidden relative">
                <ImageWithLoader
                  src="/images/img-1.png"
                  alt="Jayant Potdar"
                  fill
                  sizes="288px"
                  loaderVariant="photo"
                  loaderText="Developing..."
                  className="object-cover"
                  priority
                  fetchPriority="high"
                />
              </div>
              <figcaption className="ca-hand mt-1 text-center text-lg leading-tight text-[var(--ca-ink)]/70">
                Jayant Potdar
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Right Polaroid */}
        <div
          className="absolute right-[9%] top-[18%] w-60 xl:w-72 transition-transform duration-500 hover:rotate-0"
          style={{ transform: "rotate(16.2deg)" }}
        >
          <div className="pointer-events-auto block w-full">
            <figure className="relative inline-block bg-white p-2 pb-1 shadow-[0_6px_18px_rgba(17,18,18,0.22)] w-full">
              <span className="absolute -left-4 -top-2 z-10 h-5 w-16 -rotate-[38deg] bg-[var(--ca-cyan)] opacity-90 shadow-[0_1px_3px_rgba(17,18,18,0.15)]" />
              <span className="absolute -right-4 -top-2 z-10 h-5 w-16 rotate-[38deg] bg-[var(--ca-yellow-soft)] opacity-90 shadow-[0_1px_3px_rgba(17,18,18,0.15)]" />
              <div className="aspect-[4/5] w-full overflow-hidden relative">
                <ImageWithLoader
                  src="/images/img-8.jpeg"
                  alt="Jayant Potdar at Bandra-Worli Sea Link, Mumbai"
                  fill
                  sizes="288px"
                  loaderVariant="photo"
                  loaderText="Developing..."
                  className="object-cover"
                />
              </div>
              <figcaption className="ca-hand mt-1 text-center text-lg leading-tight text-[var(--ca-ink)]/70">
                Bandra-Worli Sea Link 🌊
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      {/* Main Center Column */}
      <div className="relative mx-auto my-auto flex w-full max-w-2xl flex-col items-center">
        {/* "say hi" scribble */}
        <div className="flex flex-col items-center">
          <p data-pf-block="contact.label" className="ca-hand text-2xl text-[var(--ca-ink)] sm:text-3xl">
            say hi
          </p>
          <svg
            viewBox="0 0 64 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="mt-0.5 h-3 w-20 text-[var(--ca-ink)]"
            aria-hidden="true"
          >
            <path d="M3 4c18-3 40-3 58 0" />
            <path d="M9 9c14-2.5 32-2.5 46 0" />
          </svg>
        </div>

        {/* Pinned Title Banner with Corner Blue Squares */}
        <div data-pf-block="contact.banner" className="mt-3 -rotate-2">
          <div className="relative border-[3px] border-[var(--ca-ink)] bg-white px-6 py-1.5 sm:px-10">
            <span className="absolute -left-2 -top-2 h-4 w-4 bg-[var(--ca-blue)]" />
            <span className="absolute -right-2 -top-2 h-4 w-4 bg-[var(--ca-blue)]" />
            <span className="absolute -bottom-2 -left-2 h-4 w-4 bg-[var(--ca-blue)]" />
            <span className="absolute -bottom-2 -right-2 h-4 w-4 bg-[var(--ca-blue)]" />
            <h1
              className="ca-display text-6xl uppercase leading-none tracking-tight text-[var(--ca-ink)] sm:text-8xl lg:text-9xl"
              style={{ display: "inline-block" }}
            >
              CONTACT
            </h1>
          </div>
        </div>

        {/* Two-step Yellow Note Card */}
        <div className="mt-5 w-full max-w-md">
          <ContactForm />
        </div>

        {/* Hand-drawn arrow + status message */}
        <div className="mt-5 flex items-center gap-3">
          <svg
            viewBox="0 0 48 24"
            fill="none"
            stroke="var(--ca-ink)"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="h-6 w-12"
            aria-hidden="true"
          >
            <path d="M2 6c12 10 26 14 40 12" />
            <path d="M36 14l6 4-7 3" />
          </svg>
          <p data-pf-block="hero.status" className="ca-hand text-2xl text-[var(--ca-ink)] sm:text-3xl">
            Open to new work and good problems
          </p>
        </div>

        {/* Direct Email Link */}
        <p className="mt-2 text-sm font-bold">
          <a
            data-pf-block="contact.email"
            href={`mailto:${email}`}
            className="ca-mono text-[var(--ca-blue)] !lowercase underline-offset-2 hover:underline"
          >
            {email}
          </a>
        </p>

        {/* Social Pill Strip */}
        <div
          data-pf-block="links.social"
          className="mt-4 flex gap-2 rounded-2xl bg-white px-6 py-2.5 shadow-[0_12px_32px_rgba(17,18,18,0.12)] sm:gap-6 sm:px-8 border border-[var(--ca-ink)]/10"
        >
          {/* LinkedIn */}
          <a
            href={social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="ca-mono min-h-[44px] min-w-[56px] flex flex-col items-center justify-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--ca-ink)] transition-colors hover:text-[var(--ca-blue)] active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>

          {/* GitHub */}
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="ca-mono min-h-[44px] min-w-[56px] flex flex-col items-center justify-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--ca-ink)] transition-colors hover:text-[var(--ca-blue)] active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>

          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="ca-mono min-h-[44px] min-w-[56px] flex flex-col items-center justify-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--ca-ink)] transition-colors hover:text-[var(--ca-blue)] active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            Email
          </a>
        </div>
      </div>
    </main>
  );
}
