"use client";
import * as React from "react";
import Link from "next/link";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import { m as motion } from "framer-motion";
import { SpinningGear, SpinningFlower, UnderlineDoodle } from "@/components/Paper";
import { author } from "@/lib/profile";
import { MouseLens, useLens, DropIn, Float, Pop, StaggerText, HERO_TIMINGS, useHeroEntrance } from "@/components/Motion";
import { trackResumeView } from "@/lib/analytics";
export function HomeHero() {
  const heroReady = useHeroEntrance();
  const { containerRef, lensRef, onMove, onMouseEnter, onMouseLeave } = useLens([0, 100]);
  return (<>
      {/* ===================== HERO SECTION ===================== */}
      <section className="ca-grid relative flex min-h-[100vh] min-h-[100svh] min-h-[100dvh] flex-col justify-center overflow-hidden px-4 pb-12 pt-4 sm:pb-16">
        {/* Decorative background flank images on large desktop (placed safely outside text) */}
        <div
          className="pointer-events-none absolute inset-0 hidden xl:block"
          aria-hidden="true"
        >
          <div className="absolute left-[3%] 2xl:left-[8%] top-[50%]">
            <Pop delay={0.2} inView={false} trigger={heroReady}>
              <Float
                amplitude={HERO_TIMINGS.avatarLeft.amplitude}
                rotate={HERO_TIMINGS.avatarLeft.rotate}
                duration={HERO_TIMINGS.avatarLeft.duration}
              >
                <span className="flex h-28 w-28 2xl:h-32 2xl:w-32 -rotate-6 items-center justify-center rounded-full bg-[var(--ca-orange)] p-2 shadow-lg transition-transform duration-300">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <ImageWithLoader
                      src="/images/img-10.jpeg"
                      alt="Me at a scenic mountain outlook"
                      fill
                      sizes="(max-width: 1536px) 224px, 256px"
                      fetchPriority="high"
                      className="object-cover scale-[1.75] object-[50%_25%]"
                      loaderVariant="avatar"
                      loaderText="Loading..."
                    />
                  </div>
                </span>
              </Float>
            </Pop>
          </div>
          <div className="absolute right-[3%] 2xl:right-[8%] top-[54%]">
            <Pop delay={0.25} inView={false} trigger={heroReady}>
              <Float
                amplitude={HERO_TIMINGS.avatarRight.amplitude}
                rotate={HERO_TIMINGS.avatarRight.rotate}
                duration={HERO_TIMINGS.avatarRight.duration}
                delay={HERO_TIMINGS.avatarRight.delay}
              >
                <span className="flex h-28 w-28 2xl:h-32 2xl:w-32 rotate-6 items-center justify-center rounded-full bg-[var(--ca-orange)] p-2 shadow-lg transition-transform duration-300">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <ImageWithLoader
                      src="/images/hero-flank-right.jpg"
                      alt="Me overlooking the Bandra-Worli Sea Link"
                      fill
                      sizes="(max-width: 1536px) 112px, 128px"
                      className="object-cover"
                      loaderVariant="avatar"
                      loaderText="Loading..."
                    />
                  </div>
                </span>
              </Float>
            </Pop>
          </div>
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center pt-1 text-center sm:pt-2">
          {/* Group for name hover effect */}
          <div
            ref={containerRef as React.RefObject<HTMLDivElement>}
            className="group/name relative flex w-full flex-col items-center cursor-default"
            onMouseMove={onMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {/* "my name is" label */}
            <Pop delay={0.02} inView={false} trigger={heroReady}>
              <div className="flex flex-col items-center text-[var(--ca-ink)]">
                <p className="ca-hand text-2xl sm:text-3xl">my name is</p>
                <UnderlineDoodle className="mt-1 h-3 w-20" />
              </div>
            </Pop>

            {/* Mobile stickers above name */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 lg:hidden">
              <DropIn
                delay={HERO_TIMINGS.mobileRole.delay}
                rotate={-4}
                y={-20}
                inView={false}
                trigger={heroReady}
              >
                <span
                  className="ca-mono inline-block -rotate-4 rounded-full border-[3px] border-white px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)] shadow-[0_4px_10px_rgba(25,21,16,0.25)]"
                  style={{ backgroundColor: "var(--ca-purple)" }}
                >
                  Simple over clever
                </span>
              </DropIn>
              <DropIn
                delay={HERO_TIMINGS.mobileLocation.delay}
                rotate={4}
                y={-20}
                inView={false}
                trigger={heroReady}
              >
                <span
                  className="ca-mono inline-block rotate-4 rounded-full border-[3px] border-white px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)] shadow-[0_4px_10px_rgba(25,21,16,0.25)]"
                  style={{ backgroundColor: "var(--ca-yellow-soft)" }}
                >
                  Built for real users
                </span>
              </DropIn>
            </div>

            {/* Huge Pixel Name in Coral Doodle Frame */}
            <div className="relative mt-5">
              <Pop
                from={HERO_TIMINGS.nameBoxScaleFrom}
                delay={HERO_TIMINGS.nameBoxDelay}
                duration={HERO_TIMINGS.nameBoxDuration}
                inView={false}
                trigger={heroReady}
                priority
              >
                <div
                  className="ca-doodle-box relative inline-block border-[3px] px-5 py-1 sm:px-10 sm:py-2"
                  style={{ borderColor: "var(--ca-orange)" }}
                >
                  <span className="ca-display text-[24vw] leading-[0.95] tracking-tight text-[var(--ca-ink)] sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11.5rem] inline-block">
                    <StaggerText
                      text="JAYANT"
                      stagger={HERO_TIMINGS.nameStaggerSpeed}
                      delay={HERO_TIMINGS.nameStaggerDelay}
                      y={HERO_TIMINGS.nameLetterRise}
                      duration={HERO_TIMINGS.nameLetterDuration}
                      inView={false}
                      trigger={heroReady}
                    />
                  </span>
                </div>
              </Pop>

              {/* Desktop positioned stickers & pinned notes around the name */}
              <div className="pointer-events-none absolute -inset-x-8 xl:-inset-x-14 2xl:-inset-x-20 -inset-y-6 hidden lg:block">
                {/* Top left sticker */}
                <div className="pointer-events-auto absolute left-0 top-0 -translate-x-[20%] xl:-translate-x-1/2 -translate-y-1/2 z-40">
                  <DropIn
                    delay={HERO_TIMINGS.stickerMadeThings.delay}
                    rotate={HERO_TIMINGS.stickerMadeThings.rotate}
                    y={HERO_TIMINGS.stickerMadeThings.y}
                    scaleFrom={1.08}
                    stiffness={HERO_TIMINGS.stickerMadeThings.stiffness}
                    damping={HERO_TIMINGS.stickerMadeThings.damping}
                    inView={false}
                    trigger={heroReady}
                  >
                    <motion.div
                      whileHover={{
                        scale: 0.93,
                        rotate: 0,
                        transition: {
                          type: "spring",
                          stiffness: 420,
                          damping: 16,
                        },
                      }}
                      whileTap={{
                        scale: 0.88,
                        transition: {
                          type: "spring",
                          stiffness: 500,
                          damping: 20,
                        },
                      }}
                      className="cursor-pointer select-none"
                    >
                      <span
                        className="ca-mono inline-block rounded-full border-[3px] border-white px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)] shadow-[0_4px_10px_rgba(25,21,16,0.25)] transition-shadow duration-200 hover:shadow-[0_2px_6px_rgba(25,21,16,0.2)]"
                        style={{ backgroundColor: "var(--ca-purple)" }}
                      >
                        Simple over clever
                      </span>
                    </motion.div>
                  </DropIn>
                </div>

                {/* Top right sticker */}
                <div className="pointer-events-auto absolute right-0 top-0 -translate-y-1/2 translate-x-[20%] xl:translate-x-1/2 z-40">
                  <DropIn
                    delay={HERO_TIMINGS.stickerSweatDetails.delay}
                    rotate={HERO_TIMINGS.stickerSweatDetails.rotate}
                    y={HERO_TIMINGS.stickerSweatDetails.y}
                    scaleFrom={1.08}
                    stiffness={HERO_TIMINGS.stickerSweatDetails.stiffness}
                    damping={HERO_TIMINGS.stickerSweatDetails.damping}
                    inView={false}
                    trigger={heroReady}
                  >
                    <motion.div
                      whileHover={{
                        scale: 0.93,
                        rotate: 0,
                        transition: {
                          type: "spring",
                          stiffness: 420,
                          damping: 16,
                        },
                      }}
                      whileTap={{
                        scale: 0.88,
                        transition: {
                          type: "spring",
                          stiffness: 500,
                          damping: 20,
                        },
                      }}
                      className="cursor-pointer select-none"
                    >
                      <span
                        className="ca-mono inline-block rounded-full border-[3px] border-white px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)] shadow-[0_4px_10px_rgba(25,21,16,0.25)] transition-shadow duration-200 hover:shadow-[0_2px_6px_rgba(25,21,16,0.2)]"
                        style={{ backgroundColor: "var(--ca-yellow-soft)" }}
                      >
                        Built for real users
                      </span>
                    </motion.div>
                  </DropIn>
                </div>
              </div>

              {/* Desktop bottom pinned notes anchored directly to orange box corners */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden lg:block">
                {/* Bottom left pinned role note with arrow */}
                <div
                  className="pointer-events-auto absolute bottom-0 left-0 z-40"
                  style={{
                    transform: "translate(calc(-100% - 27px), 104%)",
                  }}
                >
                  <DropIn
                    delay={HERO_TIMINGS.roleNote.delay}
                    rotate={HERO_TIMINGS.roleNote.rotate}
                    rotateFrom={HERO_TIMINGS.roleNote.rotateFrom}
                    y={HERO_TIMINGS.roleNote.y}
                    stiffness={HERO_TIMINGS.roleNote.stiffness}
                    damping={HERO_TIMINGS.roleNote.damping}
                    mass={HERO_TIMINGS.roleNote.mass}
                    inView={false}
                    trigger={heroReady}
                  >
                    <motion.div
                      whileHover={{
                        rotate: [0, -5, 4, -3, 1.5, 0],
                        transition: { duration: 0.55, ease: "easeInOut" },
                      }}
                      className="group/role cursor-default select-none relative inline-block"
                    >
                      <span
                        className="ca-hand inline-block px-4 py-2 text-2xl leading-snug text-[var(--ca-ink)] shadow-[2px_3px_8px_rgba(17,18,18,0.18)]"
                        style={{ backgroundColor: "var(--ca-yellow)" }}
                      >
                        {author.role}
                      </span>
                      <svg
                        viewBox="0 0 40 40"
                        fill="none"
                        stroke="var(--ca-ink)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute -right-7 -top-4 h-8 w-8 -scale-x-100"
                        aria-hidden="true"
                      >
                        <path d="M34 33 C 25 24, 15 21, 9 9" />
                        <path d="M8 21 L 7 7 L 21 11" />
                      </svg>
                    </motion.div>
                  </DropIn>
                </div>

                {/* Bottom right pinned location note with arrow */}
                <div
                  className="pointer-events-auto absolute bottom-0 right-0 z-40"
                  style={{
                    transform: "translate(calc(100% + 23px), 85%)",
                  }}
                >
                  <DropIn
                    delay={HERO_TIMINGS.locationNote.delay}
                    rotate={HERO_TIMINGS.locationNote.rotate}
                    rotateFrom={HERO_TIMINGS.locationNote.rotateFrom}
                    y={HERO_TIMINGS.locationNote.y}
                    stiffness={HERO_TIMINGS.locationNote.stiffness}
                    damping={HERO_TIMINGS.locationNote.damping}
                    mass={HERO_TIMINGS.locationNote.mass}
                    inView={false}
                    trigger={heroReady}
                  >
                    <motion.div
                      whileHover={{
                        rotate: [0, 5, -4, 3, -1.5, 0],
                        transition: { duration: 0.55, ease: "easeInOut" },
                      }}
                      className="group/loc cursor-default select-none relative inline-block"
                    >
                      <svg
                        viewBox="0 0 40 40"
                        fill="none"
                        stroke="var(--ca-ink)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute -left-6 -top-6 h-8 w-8"
                        aria-hidden="true"
                      >
                        <path d="M34 33 C 25 24, 15 21, 9 9" />
                        <path d="M8 21 L 7 7 L 21 11" />
                      </svg>
                      <span
                        className="ca-hand inline-block px-4 py-2 text-2xl leading-snug text-[var(--ca-ink)] shadow-[2px_3px_8px_rgba(17,18,18,0.18)]"
                        style={{ backgroundColor: "var(--ca-mint)" }}
                      >
                        {author.secondaryRole}
                      </span>
                    </motion.div>
                  </DropIn>
                </div>
              </div>
            </div>

            {/* Mobile role & location notes */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 max-w-full lg:hidden">
              <DropIn
                delay={HERO_TIMINGS.mobileRole.delay}
                rotate={HERO_TIMINGS.mobileRole.rotate}
                y={HERO_TIMINGS.mobileRole.y}
                stiffness={HERO_TIMINGS.mobileRole.stiffness}
                damping={HERO_TIMINGS.mobileRole.damping}
                inView={false}
                trigger={heroReady}
              >
                <motion.span
                  whileHover={{
                    rotate: [0, -5, 4, -3, 1.5, 0],
                    transition: { duration: 0.55, ease: "easeInOut" },
                  }}
                  className="ca-hand cursor-default select-none inline-block px-4 py-2 text-xl sm:text-2xl text-[var(--ca-ink)] shadow-[2px_3px_8px_rgba(17,18,18,0.18)]"
                  style={{ backgroundColor: "var(--ca-yellow)" }}
                >
                  {author.role}
                </motion.span>
              </DropIn>
              <DropIn
                delay={HERO_TIMINGS.mobileLocation.delay}
                rotate={HERO_TIMINGS.mobileLocation.rotate}
                y={HERO_TIMINGS.mobileLocation.y}
                stiffness={HERO_TIMINGS.mobileLocation.stiffness}
                damping={HERO_TIMINGS.mobileLocation.damping}
                inView={false}
                trigger={heroReady}
              >
                <motion.span
                  whileHover={{
                    rotate: [0, 5, -4, 3, -1.5, 0],
                    transition: { duration: 0.55, ease: "easeInOut" },
                  }}
                  className="ca-hand cursor-default select-none inline-block rotate-2 px-4 py-2 text-xl sm:text-2xl text-[var(--ca-ink)] shadow-[2px_3px_8px_rgba(17,18,18,0.18)]"
                  style={{ backgroundColor: "var(--ca-mint)" }}
                >
                  {author.secondaryRole}
                </motion.span>
              </DropIn>
            </div>

            {/* Availability Status */}
            <Pop delay={0.16} inView={false} trigger={heroReady}>
              <p className="ca-mono mx-auto mt-6 max-w-2xl text-center text-xs font-bold uppercase leading-relaxed tracking-[0.16em] text-[var(--ca-ink)] sm:max-w-3xl sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--ca-blue)]" />
                  <span>Open to internships &amp; full-time roles</span>
                </span>
                <br />
                <span className="inline-block sm:whitespace-nowrap">
                  Based in Pune · open to hybrid and remote work.
                </span>
              </p>
            </Pop>

            {/* Invert Crosshair Focus Lens (appears on hover) */}
            <MouseLens lensRef={lensRef} />
          </div>

          {/* Primary Crawlable H1 Headline with Spinning SVGs */}
          <h1 className="mt-10 max-w-3xl text-4xl font-semibold leading-[1.15] tracking-tight text-[var(--ca-ink)] sm:mt-14 sm:text-6xl">
            <span>
              I design expressive interfaces <SpinningGear /> and build the systems behind them.{" "}
              <SpinningFlower />
            </span>
          </h1>

          {/* Primary CTA Links */}
          <Pop delay={0.28} inView={false} trigger={heroReady}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                prefetch={false}
                className="group/cta ca-mono ca-btn-spring relative inline-flex min-h-[44px] items-center gap-3 border-2 border-[var(--ca-ink)] bg-[var(--ca-ink)] py-2.5 pl-2.5 pr-6 text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors duration-200 hover:bg-[var(--ca-yellow)] hover:text-[var(--ca-ink)]"
              >
                <span className="flex h-9 w-9 items-center justify-center bg-[var(--ca-blue)] text-[var(--ca-ink)] transition-colors duration-200 group-hover/cta:bg-[var(--ca-magenta)] group-hover/cta:text-[var(--ca-blue)]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </span>
                Contact me
              </Link>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackResumeView("hero_cta")}
                aria-label="View my Resume PDF (opens in new tab)"
                className="group/resume ca-mono ca-btn-spring relative inline-flex min-h-[44px] items-center gap-3 border-2 border-[var(--ca-ink)] bg-white py-2.5 pl-2.5 pr-6 text-sm font-bold uppercase tracking-[0.2em] text-[var(--ca-ink)] transition-colors duration-200 hover:bg-[#16b06a] hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center bg-[var(--ca-yellow)] text-[var(--ca-ink)] transition-colors duration-200 group-hover/resume:bg-[var(--ca-yellow)] group-hover/resume:text-[var(--ca-ink)]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                  </svg>
                </span>
                Resume
              </a>
            </div>
          </Pop>
        </div>
      </section>

  </>);
}
