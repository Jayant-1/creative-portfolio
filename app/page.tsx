"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import { motion } from "framer-motion";
import {
  ContactStrip,
  Footer,
  Polaroid,
  SpinningGear,
  SpinningFlower,
  UnderlineDoodle,
  WavyDivider,
} from "@/components/Paper";
import { author, projects, isDarkProjectHero } from "@/lib/site";
import {
  MouseLens,
  CardLens,
  useLens,
  StaggerText,
  DropIn,
  Float,
  Pop,
  HERO_TIMINGS,
  useHeroEntrance,
} from "@/components/Motion";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { trackResumeView } from "@/lib/analytics";

const TORN_CLIPS = [
  "polygon(2% 6%, 12% 0%, 25% 4%, 40% 1%, 55% 5%, 70% 0%, 85% 4%, 98% 1%, 96% 15%, 100% 30%, 97% 45%, 100% 60%, 96% 75%, 99% 90%, 97% 98%, 85% 96%, 70% 100%, 55% 96%, 40% 100%, 25% 95%, 12% 100%, 3% 97%, 1% 85%, 4% 70%, 0% 55%, 3% 40%, 0% 25%, 2% 12%)",
  "polygon(1% 8%, 10% 2%, 22% 6%, 35% 0%, 48% 5%, 62% 1%, 76% 6%, 90% 1%, 99% 6%, 97% 20%, 100% 35%, 98% 50%, 100% 66%, 97% 80%, 99% 94%, 88% 98%, 74% 94%, 60% 99%, 46% 95%, 32% 100%, 18% 96%, 6% 99%, 2% 88%, 5% 74%, 1% 60%, 4% 46%, 0% 32%, 3% 18%)",
  "polygon(3% 3%, 16% 1%, 28% 5%, 44% 0%, 58% 4%, 72% 1%, 84% 5%, 97% 2%, 100% 18%, 96% 32%, 100% 48%, 97% 64%, 100% 80%, 96% 94%, 98% 99%, 84% 95%, 68% 100%, 52% 96%, 38% 100%, 22% 95%, 8% 99%, 1% 92%, 4% 78%, 0% 62%, 3% 48%, 0% 34%, 4% 20%, 1% 8%)",
];

const SKILL_ROWS = [
  [
    {
      name: "Interaction Design",
      color: "var(--ca-yellow)",
      textColor: "text-[var(--ca-ink)]",
      emojiA: "🎨",
      emojiB: "✨",
      labelClip: TORN_CLIPS[0],
      stampClip: TORN_CLIPS[1],
    },
    {
      name: "Prototyping",
      color: "var(--ca-green)",
      textColor: "text-white",
      emojiA: "🧩",
      emojiB: "📐",
      labelClip: TORN_CLIPS[1],
      stampClip: TORN_CLIPS[2],
    },
  ],
  [
    {
      name: "Backend Systems",
      color: "var(--ca-magenta)",
      textColor: "text-white",
      emojiA: "👀",
      emojiB: "⚡",
      labelClip: TORN_CLIPS[2],
      stampClip: TORN_CLIPS[0],
    },
    {
      name: "Motion Design",
      color: "var(--ca-blue)",
      textColor: "text-[var(--ca-ink)]",
      emojiA: "💡",
      emojiB: "🌀",
      labelClip: TORN_CLIPS[0],
      stampClip: TORN_CLIPS[1],
    },
  ],
];

const PROJECT_TAPES: Record<string, { className: string }[]> = {
  // Malaria Detection System (Sky Blue Card) — Mint & Pink & Yellow tapes
  "malaria-detection": [
    {
      className:
        "-left-4 -top-3.5 h-[26px] w-[100px] -rotate-[12deg] bg-[var(--ca-mint)] opacity-90 shadow-[0_1px_4px_rgba(17,18,18,0.16)]",
    },
    {
      className:
        "right-10 -top-3 h-[24px] w-[116px] rotate-[5deg] bg-[var(--ca-pink-soft)] opacity-90 shadow-[0_1px_4px_rgba(17,18,18,0.16)]",
    },
    {
      className:
        "-right-5 -bottom-3.5 h-[24px] w-[108px] -rotate-[16deg] bg-[var(--ca-yellow)] opacity-90 shadow-[0_1px_4px_rgba(17,18,18,0.16)]",
    },
  ],
  // AstroPixel — Cyan & Soft Pink tapes
  astropixel: [
    {
      className:
        "-left-6 -top-3.5 h-[26px] w-[112px] -rotate-[13deg] bg-[var(--ca-cyan)] opacity-90 shadow-[0_1px_4px_rgba(17,18,18,0.16)]",
    },
    {
      className:
        "-right-4 -top-3 h-[24px] w-[96px] rotate-[8deg] bg-[var(--ca-pink-soft)] opacity-90 shadow-[0_1px_4px_rgba(17,18,18,0.16)]",
    },
    {
      className:
        "right-12 -bottom-3 h-[22px] w-[80px] rotate-[3deg] bg-[var(--ca-yellow-soft)] opacity-90 shadow-[0_1px_3px_rgba(17,18,18,0.12)] hidden sm:block",
    },
  ],
  // Krypton — Soft Yellow & Mint tapes
  krypton: [
    {
      className:
        "left-8 -top-3.5 h-[26px] w-[128px] -rotate-[2deg] bg-[var(--ca-yellow-soft)] opacity-90 shadow-[0_1px_4px_rgba(17,18,18,0.16)]",
    },
    {
      className:
        "-right-4 -top-2.5 h-[20px] w-[70px] rotate-[22deg] bg-[var(--ca-mint)] opacity-90 shadow-[0_1px_3px_rgba(17,18,18,0.14)] hidden sm:block",
    },
    {
      className:
        "-right-6 -bottom-3.5 h-[26px] w-[112px] rotate-[15deg] bg-[var(--ca-pink-soft)] opacity-90 shadow-[0_1px_4px_rgba(17,18,18,0.16)]",
    },
  ],
  // NeuralNet — Yellow & Purple tapes
  neuralnet: [
    {
      className:
        "-left-4 -top-4 h-[26px] w-[96px] -rotate-[21deg] bg-[var(--ca-yellow)] opacity-90 shadow-[0_1px_4px_rgba(17,18,18,0.16)]",
    },
    {
      className:
        "-right-6 -top-2.5 h-[24px] w-[112px] rotate-[4deg] bg-[var(--ca-purple)] opacity-90 shadow-[0_1px_4px_rgba(17,18,18,0.16)]",
    },
    {
      className:
        "-left-5 -bottom-3 h-[24px] w-[96px] rotate-[11deg] bg-[var(--ca-cyan)] opacity-90 shadow-[0_1px_3px_rgba(17,18,18,0.14)]",
    },
  ],
  // 3D Cosmic Portfolio — Purple, Cyan & Soft Yellow tapes
  "3d-portfolio": [
    {
      className:
        "-left-5 -top-3.5 h-[26px] w-[116px] -rotate-[14deg] bg-[var(--ca-purple)] opacity-90 shadow-[0_1px_4px_rgba(17,18,18,0.16)]",
    },
    {
      className:
        "right-10 -top-3 h-[24px] w-[100px] rotate-[7deg] bg-[var(--ca-cyan)] opacity-90 shadow-[0_1px_4px_rgba(17,18,18,0.16)]",
    },
    {
      className:
        "-right-4 -bottom-3.5 h-[24px] w-[112px] -rotate-[12deg] bg-[var(--ca-yellow-soft)] opacity-90 shadow-[0_1px_4px_rgba(17,18,18,0.16)]",
    },
  ],
};

function ProjectCardImage({
  src,
  alt,
  href,
  darkCard = false,
}: {
  src: string;
  alt: string;
  href: string;
  darkCard?: boolean;
}) {
  const router = useRouter();
  const { containerRef, lensRef, onMove, onMouseEnter, onMouseLeave } = useLens(
    [0, 100],
  );

  const handlePrefetch = React.useCallback(() => {
    try {
      router.prefetch(href);
    } catch {}
  }, [href, router]);

  return (
    <Link
      href={href}
      ref={containerRef as React.RefObject<HTMLAnchorElement>}
      aria-label={`View ${alt} project`}
      className="group/card relative block overflow-hidden border-4 bg-[var(--ca-surface)] aspect-[16/9] w-full cursor-pointer shadow-[0_10px_28px_rgba(17,18,18,0.22)] transition-transform duration-300 hover:-translate-y-1"
      style={{ borderColor: "#ffffff" }}
      onMouseMove={onMove}
      onMouseEnter={(e) => {
        onMouseEnter(e);
        handlePrefetch();
      }}
      onMouseLeave={onMouseLeave}
      onFocus={handlePrefetch}
      onTouchStart={handlePrefetch}
    >
      <div className="relative overflow-hidden h-full w-full transition-transform duration-500 ease-out group-hover/card:scale-[1.03]">
        <ImageWithLoader
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 50vw, 800px"
          loaderVariant="project"
          loaderText="Loading Preview..."
        />
      </div>
      <CardLens lensRef={lensRef} darkCard={darkCard} />
    </Link>
  );
}

export default function HomePage() {
  const heroReady = useHeroEntrance();
  const { containerRef, lensRef, onMove, onMouseEnter, onMouseLeave } = useLens(
    [0, 100],
  );
  return (
    <>
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
                      sizes="(max-width: 1536px) 112px, 128px"
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

      {/* ===================== ABOUT SECTION ===================== */}
      <section
        id="about"
        className="ca-grid relative scroll-mt-24 px-4 pb-20 sm:pb-28"
        aria-labelledby="about-label"
      >
        <WavyDivider />

        <p
          id="about-label"
          className="ca-hand pl-[8%] text-2xl text-[var(--ca-ink)] sm:text-3xl"
        >
          about me!
        </p>

        {/* Desktop floating polaroids flanking */}
        <div
          className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
          aria-hidden="true"
        >
          <div className="absolute left-[3%] top-[34%] w-56 xl:left-[5%] xl:w-64">
            <DropIn
              y={-28}
              rotate={-7}
              delay={0.12}
              stiffness={200}
              damping={18}
              className="pointer-events-auto block w-full"
            >
              <Polaroid
                src="/images/img-2.jpeg"
                alt="3× Trophy Winner"
                caption="3× Trophy Winner"
                aspectClassName="aspect-[3/4]"
                className="w-full transition-transform duration-300 hover:rotate-0 hover:scale-105"
              />
            </DropIn>
          </div>
          <div className="absolute right-[2%] top-[14%] w-[308px] xl:right-[3%] xl:w-[328px] 2xl:right-[4%] 2xl:w-[348px]">
            <DropIn
              y={-28}
              rotate={6}
              delay={0.22}
              stiffness={200}
              damping={18}
              className="pointer-events-auto block w-full"
            >
              <Polaroid
                src="/images/img-4.jpeg"
                alt="AstroPixel Ideation 3.0 award"
                caption="AstroPixel • Ideation 3.0"
                aspectClassName="aspect-[4/3]"
                className="w-full transition-transform duration-300 hover:rotate-0 hover:scale-105"
              />
            </DropIn>
          </div>
        </div>

        {/* Centered content */}
        <div className="relative z-10 mx-auto mt-10 max-w-5xl sm:mt-16">
          <div className="flex flex-col items-center text-center">
            <div
              className="ca-doodle-box relative inline-block border-2 px-5 py-2"
              style={{ borderColor: "var(--ca-ink)" }}
            >
              <span className="text-3xl font-medium text-[var(--ca-ink)] sm:text-4xl">
                what&apos;s up
              </span>
            </div>

            <div className="mt-10">
              <p className="ca-hand mx-auto max-w-3xl text-3xl font-medium leading-[1.2] text-[var(--ca-ink)] sm:text-4xl lg:text-5xl">
                I like taking complex ideas apart, learning how every piece
                works, and building them back into useful products. My
                favorite work combines a distinctive interface with the
                engineering needed to ship it.
              </p>
            </div>

            {/* Mobile centered polaroids side-by-side */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-5 sm:gap-8 lg:hidden">
              <DropIn y={-24} rotate={-3} delay={0.1} className="w-36 sm:w-44">
                <Polaroid
                  src="/images/img-2.jpeg"
                  alt="3× Trophy Winner"
                  caption="3× Trophies"
                  aspectClassName="aspect-[3/4]"
                  sizes="(max-width: 640px) 176px, 240px"
                />
              </DropIn>
              <DropIn y={-24} rotate={3} delay={0.2} className="w-48 sm:w-60">
                <Polaroid
                  src="/images/img-4.jpeg"
                  alt="AstroPixel Ideation 3.0 award"
                  caption="Ideation 3.0"
                  aspectClassName="aspect-[4/3]"
                  sizes="(max-width: 640px) 240px, 320px"
                />
              </DropIn>
            </div>

            {/* 4 Torn Skill Badges Arranged in 2 Rows with Emoji Stamps */}
            <div className="mt-12 flex flex-col items-center gap-4 sm:mt-14 sm:gap-5">
              {SKILL_ROWS.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
                >
                  {row.map((badge, badgeIdx) => {
                    const globalIdx = rowIdx * 2 + badgeIdx;
                    return (
                      <Pop key={badge.name} delay={globalIdx * 0.07}>
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex h-14 items-center px-6 text-2xl font-semibold tracking-tight whitespace-nowrap select-none sm:h-[4.5rem] sm:px-8 sm:text-3xl ${badge.textColor}`}
                            style={{
                              backgroundColor: badge.color,
                              WebkitClipPath: badge.labelClip,
                              clipPath: badge.labelClip,
                            }}
                          >
                            {badge.name}
                          </span>
                          <span
                            aria-hidden="true"
                            className="relative inline-block h-14 w-14 shrink-0 select-none sm:h-[4.5rem] sm:w-[4.5rem]"
                            style={{
                              backgroundColor: badge.color,
                              WebkitClipPath: badge.stampClip,
                              clipPath: badge.stampClip,
                            }}
                          >
                            <span className="ca-emoji-a absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl">
                              {badge.emojiA}
                            </span>
                            <span className="ca-emoji-b absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl">
                              {badge.emojiB}
                            </span>
                          </span>
                        </div>
                      </Pop>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURED WORKS STACK ===================== */}
      <section
        id="work"
        className="ca-grid scroll-mt-24 pb-12 sm:pb-16 pt-10 sm:pt-16"
        aria-labelledby="featured-works-title"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-16 text-center sm:pb-24">
          <div className="flex flex-col items-center">
            <p className="ca-hand text-2xl text-[var(--ca-ink)] sm:text-3xl">
              real problems. things I built to solve them.
            </p>
            <UnderlineDoodle className="mt-1 h-3 w-24" />
          </div>

          <div className="mt-6 block text-center">
            <h2
              id="featured-works-title"
              className="ca-display max-w-[10ch] text-center text-6xl leading-[0.92] tracking-tight text-[var(--ca-ink)] sm:text-8xl lg:text-9xl inline-block"
            >
              <StaggerText text="FEATURED PROJECTS" stagger={0.05} />
            </h2>
          </div>
        </div>

        {/* Stacking Sticky Folder Cards */}
        <div className="relative px-3 sm:px-8 lg:px-20 pb-10 sm:pb-14 lg:pb-16 flex flex-col gap-16 lg:gap-[12vh]">
          {projects.map((project, idx) => {
            const tabMargins = [
              "0",
              "clamp(20px, calc(15.5% - 25px), calc(100% - 340px))",
              "clamp(40px, calc(31% - 25px), calc(100% - 340px))",
              "clamp(60px, calc(46.5% - 25px), calc(100% - 340px))",
              "clamp(80px, calc(62% - 25px), calc(100% - 340px))",
              "clamp(100px, calc(77.5% - 25px), calc(100% - 340px))",
            ];
            const isFirst = idx === 0;

            return (
              <article
                key={project.slug}
                className="ca-sticky-card sticky top-20 sm:top-24 lg:top-28"
                style={{ zIndex: idx + 10 }}
              >
                {/* Protruding Folder Tab */}
                <div
                  className="flex"
                  style={{ marginLeft: tabMargins[idx] || "0" }}
                >
                  <span
                    className={`ca-mono inline-flex items-center gap-1.5 whitespace-nowrap py-2.5 pr-8 text-[11px] font-bold uppercase tracking-[0.16em] sm:gap-3 sm:py-5 sm:pr-20 sm:text-sm lg:text-base ${
                      isFirst
                        ? "pl-4 folder-tab-shape sm:pl-8"
                        : "pl-6 folder-tab-mid-shape sm:pl-18 lg:pl-20"
                    }`}
                    style={{
                      backgroundColor: project.color,
                      color: project.ink,
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-3 w-3 sm:h-4 sm:w-4"
                      aria-hidden="true"
                    >
                      <path d="M12 2c1 5 4 8 9 9-5 1-8 4-9 9-1-5-4-8-9-9 5-1 8-4 9-9Z" />
                    </svg>
                    Project {project.number}
                  </span>
                </div>

                {/* Folder Body */}
                <div
                  className="grid grid-cols-1 gap-6 p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:p-14 min-h-[540px] sm:min-h-[620px] lg:min-h-[calc(100vh-14rem)]"
                  style={{
                    backgroundColor: project.color,
                    color: project.ink,
                  }}
                >
                  {/* Left Column: Details & Actions */}
                  <div className="flex flex-col">
                    <span
                      className="ca-mono inline-flex items-center gap-3 text-xs sm:gap-3 sm:text-sm font-bold uppercase tracking-[0.2em]"
                      style={{ color: project.ink }}
                    >
                      <span
                        className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full"
                        style={{ backgroundColor: project.ink }}
                      />
                      {`${project.title} · ${project.date}`}
                    </span>

                    <h3
                      className="mt-3 sm:mt-6 text-3xl min-[380px]:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight"
                      style={{ color: project.ink }}
                    >
                      <Link
                        href={`/projects/${project.slug}`}
                        className="transition-opacity hover:opacity-85"
                      >
                        {project.headline}
                      </Link>
                    </h3>

                    <p
                      className="mt-3 sm:mt-5 max-w-lg text-sm sm:text-base lg:text-lg leading-relaxed opacity-90 line-clamp-3 sm:line-clamp-none"
                      style={{ color: project.ink }}
                    >
                      {project.problem}
                    </p>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="ca-mono mt-4 sm:mt-8 inline-flex min-h-[44px] items-center gap-2.5 self-start border-b-2 pb-1 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-transform duration-150 hover:translate-x-1"
                      style={{
                        borderColor: project.ink,
                        color: project.ink,
                      }}
                    >
                      Read my case study
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                        aria-hidden="true"
                      >
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </Link>

                    {/* Category Notched Tags (Colored) */}
                    <div className="mt-6 sm:mt-8 lg:mt-auto flex flex-wrap gap-2 sm:gap-2.5 pt-4 sm:pt-6 lg:pt-8">
                      {project.category.map((cat, cIdx) => {
                        const palette = [
                          "var(--ca-yellow)",
                          "var(--ca-mint)",
                          "var(--ca-cyan)",
                          "var(--ca-pink-soft)",
                          "var(--ca-yellow-soft)",
                          "var(--ca-purple)",
                        ];
                        const available = palette.filter(
                          (c) => c !== project.color,
                        );
                        const tagBg = available[cIdx % available.length];

                        return (
                          <span
                            key={cat}
                            className="ca-mono px-3 py-1.5 text-xs sm:px-4 sm:pb-2 sm:pt-2.5 sm:text-base font-bold uppercase tracking-wide ca-notched-tag text-[var(--ca-ink)] border border-[var(--ca-ink)]/20 shadow-xs"
                            style={{ backgroundColor: tagBg }}
                          >
                            {cat}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Framed Image with Tapes */}
                  <div className="flex items-center justify-center lg:self-center w-full">
                    <div className="relative w-full max-w-[820px]">
                      {(PROJECT_TAPES[project.slug] || PROJECT_TAPES.astropixel).map(
                        (tape, tIdx) => (
                          <span
                            key={tIdx}
                            aria-hidden="true"
                            className={`pointer-events-none absolute z-10 ${tape.className}`}
                          />
                        ),
                      )}
                      <ProjectCardImage
                        src={project.homeHero || project.hero}
                        alt={project.title}
                        href={`/projects/${project.slug}`}
                        darkCard={isDarkProjectHero(project.slug)}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ===================== TESTIMONIALS SECTION ===================== */}
      <TestimonialsSection />

      {/* ===================== CONTACT STRIP ===================== */}
      <ContactStrip />

      {/* ===================== FOOTER ===================== */}
      <Footer />
    </>
  );
}
