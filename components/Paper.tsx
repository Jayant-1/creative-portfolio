"use client";

import Link from "next/link";
import { author, social } from "@/lib/site";
import { useLens, MouseLens, StaggerText, Pop } from "@/components/Motion";
import { ImageWithLoader } from "./ImageWithLoader";

export function UnderlineDoodle({ className = "mt-1 h-3 w-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 4c18-3 40-3 58 0" />
      <path d="M9 9c14-2.5 32-2.5 46 0" />
    </svg>
  );
}

export function Scribble({
  children,
  className = "",
  withDoodle = false,
}: {
  children: React.ReactNode;
  className?: string;
  withDoodle?: boolean;
}) {
  return (
    <div className={`inline-flex flex-col items-center text-[var(--ca-ink)] ${className}`}>
      <span className="ca-hand text-2xl sm:text-3xl text-[var(--ca-ink)]">{children}</span>
      {withDoodle && <UnderlineDoodle className="mt-1 h-3 w-24" />}
    </div>
  );
}

export function Tape({
  className = "",
  angle = 38,
  color = "var(--ca-cyan)",
}: {
  className?: string;
  angle?: number;
  color?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 h-5 w-16 shadow-[0_1px_3px_rgba(17,18,18,0.18)] ${className}`}
      style={{
        backgroundColor: color,
        opacity: 0.88,
        transform: `rotate(${angle}deg)`,
      }}
    />
  );
}

export function Polaroid({
  src,
  alt,
  caption,
  className = "",
  priority = false,
  fetchPriority,
  aspectClassName = "aspect-[4/5]",
}: {
  src: string;
  alt: string;
  caption: string;
  className?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  aspectClassName?: string;
}) {
  return (
    <figure
      className={`ca-spring-hover relative inline-block w-full bg-white p-2 pb-1 shadow-[0_6px_18px_rgba(17,18,18,0.22)] ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute -left-4 -top-2 z-10 h-5 w-16 -rotate-[38deg] bg-[var(--ca-cyan)] opacity-90 shadow-[0_1px_3px_rgba(17,18,18,0.15)]"
      />
      <span
        aria-hidden="true"
        className="absolute -right-4 -top-2 z-10 h-5 w-16 rotate-[38deg] bg-[var(--ca-yellow-soft)] opacity-90 shadow-[0_1px_3px_rgba(17,18,18,0.15)]"
      />
      <div className={`${aspectClassName} w-full overflow-hidden bg-[var(--ca-surface)]`}>
        <ImageWithLoader
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 720px) 70vw, 400px"
          priority={priority}
          fetchPriority={fetchPriority}
          loaderVariant="photo"
          loaderText="Developing..."
          className="hover:scale-[1.04]"
        />
      </div>
      <figcaption className="ca-hand mt-1 text-center text-lg leading-tight text-[var(--ca-ink)]/70">
        {caption}
      </figcaption>
    </figure>
  );
}

export function WavyDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 130"
      fill="none"
      preserveAspectRatio="none"
      className={`h-16 w-full sm:h-24 pointer-events-none -mx-4 w-[calc(100%+2rem)] ${className}`}
      aria-hidden="true"
    >
      <path d="M-10 120C420 10 1030 4 1450 80" stroke="var(--ca-tick)" strokeWidth="1.5" />
    </svg>
  );
}

export function SpinningGear({ className = "h-[0.85em] w-[0.85em]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`ca-spin-slow inline-block align-[-0.08em] ${className}`}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18" fill="var(--ca-green)" stroke="var(--ca-ink)" strokeWidth="2" />
      <circle cx="20" cy="20" r="11" fill="var(--ca-surface)" />
      <circle cx="20" cy="20" r="5" fill="var(--ca-green)" />
      <circle cx="14" cy="9" r="2.4" fill="var(--ca-ink)" />
    </svg>
  );
}

export function SpinningFlower({ className = "h-[0.85em] w-[0.85em]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`ca-spin-slow inline-block align-[-0.08em] ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse
          key={i}
          cx="20"
          cy="8"
          rx="4.6"
          ry="8"
          fill="var(--ca-magenta)"
          transform={`rotate(${45 * i} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="4" fill="var(--ca-ink)" />
    </svg>
  );
}

export function ContactStrip() {
  const { containerRef, lensRef, onMove, onMouseEnter, onMouseLeave } = useLens([3, 97]);

  return (
    <section id="contact" className="ca-grid relative scroll-mt-24 overflow-hidden" aria-labelledby="talk-title">
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        onMouseMove={onMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="group/talk relative mx-auto flex max-w-3xl cursor-default flex-col items-center gap-5 px-4 pb-4 pt-16 text-center sm:gap-6 sm:pt-20"
      >
        {/* Animated Smiley Face Doodle */}
        <Pop from={0.85}>
          <div className="ca-spring-hover cursor-pointer">
            <svg viewBox="0 0 200 200" className="h-52 w-52 overflow-visible sm:h-64 sm:w-64" aria-hidden="true">
              <circle cx="100" cy="100" r="88" fill="var(--ca-yellow)" stroke="var(--ca-ink)" strokeWidth="3" />
              <circle cx="56" cy="120" r="12" fill="var(--ca-magenta)" opacity="0.45" />
              <circle cx="144" cy="120" r="12" fill="var(--ca-magenta)" opacity="0.45" />
              <g className="ca-blink">
                <rect x="65" y="68" width="16" height="42" rx="8" fill="var(--ca-ink)" />
                <rect x="119" y="68" width="16" height="42" rx="8" fill="var(--ca-ink)" />
              </g>
              <path d="M62 130 Q100 172 138 130" fill="none" stroke="var(--ca-ink)" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
        </Pop>

        <h2 id="talk-title" className="ca-display text-5xl min-[390px]:text-6xl sm:text-8xl md:text-9xl uppercase leading-[0.9] tracking-tight text-[var(--ca-ink)]">
          <StaggerText text="LET'S TALK" stagger={0.05} delay={0.1} />
        </h2>

        <p className="ca-hand mx-auto max-w-xl text-2xl leading-snug text-[var(--ca-ink)]/80 sm:text-3xl">
          Got a project, a hard engineering problem, or just want to say hi? Send it over. I read every message.
        </p>

        {/* Dynamic Invert Mouse Lens */}
        <MouseLens
          lensRef={lensRef}
          groupHoverClass="group-hover/talk:scale-100 group-hover/talk:opacity-100"
        />
      </div>

      <div className="px-4 pb-20 pt-10 sm:px-8 lg:px-20">
        <div className="relative mx-auto max-w-4xl">
          {/* Pinned Cyan Note */}
          <div className="relative z-20 mb-6 flex justify-center lg:absolute lg:-left-8 xl:-left-16 2xl:-left-24 lg:-top-14 lg:mb-0 lg:block lg:w-80">
            <div className="ca-spring-hover relative w-full max-w-sm -rotate-2 bg-[var(--ca-cyan)] p-5 pt-6 shadow-[2px_6px_18px_rgba(17,18,18,0.22)]">
              <span
                aria-hidden="true"
                className="absolute -left-4 -top-2 z-10 h-5 w-16 -rotate-[38deg] bg-[var(--ca-yellow)] opacity-90 shadow-[0_1px_3px_rgba(17,18,18,0.15)]"
              />
              <span
                aria-hidden="true"
                className="absolute -right-4 -top-2 z-10 h-5 w-16 rotate-[38deg] bg-[var(--ca-pink-soft)] opacity-90 shadow-[0_1px_3px_rgba(17,18,18,0.15)]"
              />
              <div className="flex items-start gap-3">
                <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <div className="relative overflow-hidden h-full w-full">
                    <ImageWithLoader
                      src="/images/img-1.png"
                      alt={author.name}
                      fill
                      sizes="40px"
                      loaderVariant="minimal"
                      className="object-cover"
                    />
                  </div>
                </span>
                <div>
                  <p className="font-semibold text-[var(--ca-ink)]">{author.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ca-ink)]/75">
                    {author.openToWork}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[var(--ca-blue)] px-2.5 py-1 text-xs font-bold text-[var(--ca-ink)]">
                    <svg viewBox="0 0 24 24" fill="var(--ca-yellow)" stroke="var(--ca-ink)" strokeWidth="1.5" className="h-3.5 w-3.5" aria-hidden="true">
                      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
                    </svg>
                    1
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Big Yellow Clickable Banner Card */}
          <Link
            href="/contact"
            aria-label="Go to contact page"
            className="group block"
          >
            <span
              aria-hidden="true"
              className="absolute -left-2 sm:-left-5 -top-3 z-10 h-6 w-24 sm:w-28 -rotate-[8deg] bg-[var(--ca-cyan)] opacity-90 shadow-[0_1px_3px_rgba(17,18,18,0.15)]"
            />
            <span
              aria-hidden="true"
              className="absolute -right-2 sm:-right-5 -top-3 z-10 h-6 w-24 sm:w-28 rotate-[8deg] bg-[var(--ca-pink-soft)] opacity-90 shadow-[0_1px_3px_rgba(17,18,18,0.15)]"
            />
            <div className="ca-doodle-box relative flex flex-col items-center gap-2 border-[3px] border-[var(--ca-ink)] bg-[var(--ca-yellow)] px-6 py-16 text-center shadow-[8px_12px_0_var(--ca-ink)] sm:gap-3 sm:py-24">
              <p className="ca-hand text-3xl text-[var(--ca-ink)] sm:text-4xl">
                let&apos;s make something together
              </p>
              <span className="ca-display text-7xl uppercase leading-none tracking-tight text-[var(--ca-ink)] sm:text-[9rem]">
                CONTACT
              </span>
              <span className="ca-mono mt-3 inline-flex items-center gap-2 border-b-2 border-[var(--ca-ink)] pb-1 text-sm font-bold uppercase tracking-[0.2em] text-[var(--ca-ink)] transition-transform duration-200 group-hover:translate-x-1">
                drop a line
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-4 w-4" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="ca-grid relative overflow-hidden">
      <WavyDivider />
      <div className="px-4 pb-10 pt-6 sm:px-8 lg:px-20">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="ca-display text-6xl uppercase leading-none tracking-tight text-[var(--ca-ink)] sm:text-8xl">
              {author.name}
            </p>
            <p className="ca-mono mt-4 inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.2em] text-[var(--ca-ink)]">
              <span className="h-3 w-3 rounded-full bg-[var(--ca-blue)]" />
              {author.role}
            </p>
          </div>

          <div className="flex flex-col items-start gap-5 md:items-end">
            <nav className="flex flex-wrap items-center gap-1.5" aria-label="Footer navigation">
              {[
                { href: "/about", label: "About", rotate: "-rotate-2" },
                { href: "/work", label: "Work", rotate: "rotate-1" },
                { href: "/experience", label: "Experience", rotate: "-rotate-1" },
                { href: "/blog", label: "Blog", rotate: "rotate-2" },
                { href: "/contact", label: "Contact", rotate: "-rotate-2" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative min-h-[44px] inline-flex items-center px-3.5 py-2.5 text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)] transition-transform duration-200 hover:-translate-y-0.5 select-none"
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 ${item.rotate} opacity-0 scale-95 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-100`}
                  >
                    <span
                      className="ca-tape-strip ca-torn-tape absolute inset-0"
                      style={{ backgroundColor: "var(--ca-cyan)" }}
                    />
                  </span>
                  <span className="ca-mono relative z-10">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex gap-3" aria-label="Social links">
              {/* LinkedIn: #376c96 circle with white square and #376c96 'in' */}
              <a
                href={social.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-white shadow-[1.5px_1.5px_0_rgba(25,21,16,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: "#376c96" }}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="3.5" fill="white" />
                  <path
                    d="M7.4 6.2a1.35 1.35 0 1 1-2.7 0 1.35 1.35 0 0 1 2.7 0ZM4.8 9.2h2.5V17H4.8V9.2Zm4 0h2.4v1.15h.03c.34-.63 1.15-1.3 2.5-1.3 2.65 0 3.15 1.75 3.15 4V17h-2.5v-3.7c0-.88-.02-2.02-1.23-2.02-1.24 0-1.43.96-1.43 1.95V17H8.8V9.2Z"
                    fill="#376c96"
                  />
                </svg>
              </a>

              {/* GitHub: Black circle with solid white Octocat mark */}
              <a
                href={social.github}
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-white shadow-[1.5px_1.5px_0_rgba(25,21,16,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: "#000000" }}
              >
                <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                </svg>
              </a>

              {/* Mail: Green circle with solid white envelope and green V-fold */}
              <a
                href={social.email}
                aria-label="Email Jayant"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-white shadow-[1.5px_1.5px_0_rgba(25,21,16,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: "var(--ca-green)" }}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" fill="white" />
                  <path
                    d="M4.5 7.5L12 13L19.5 7.5"
                    fill="none"
                    stroke="var(--ca-green)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 text-sm text-[var(--ca-ink)]/70 sm:flex-row">
          <span>© 2026 {author.name}</span>
        </div>
      </div>
    </footer>
  );
}
