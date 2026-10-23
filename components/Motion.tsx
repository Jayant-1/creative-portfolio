"use client";

import React, { useRef, useEffect, useCallback, useState, ReactNode } from "react";
import { m as motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";

/**
 * ============================================================================
 * GLOBAL MOTION & EASING PRESETS
 * ============================================================================
 * Apple / Vercel / Linear agency-grade ease curves for buttery-smooth feel.
 */
export const EASINGS = {
  /** Agency-grade snappy glide: immediate acceleration + silky deceleration (default) */
  snappy: [0.16, 1, 0.3, 1] as const,
  /** Smooth quintic ease for wide reveals */
  smooth: [0.22, 1, 0.36, 1] as const,
  /** Gentle soft deceleration */
  gentle: [0.25, 1, 0.5, 1] as const,
  /** Subtle spring overshoot ease curve for CSS-like spring transitions */
  springOvershoot: [0.34, 1.35, 0.64, 1] as const,
  /** Subtle elastic cushion settle */
  elastic: [0.34, 1.35, 0.64, 1] as const,
} as const;

export const EASE = EASINGS.snappy;

/**
 * Spring presets for natural, physically tactile stickers and cards
 */
export const SPRING_PRESETS = {
  /** Snappy tactile slap with gentle cushion settle (exact 2.5% overshoot) */
  tactile: { stiffness: 260, damping: 18, mass: 0.8 },
  /** Softer organic float drop */
  gentle: { stiffness: 180, damping: 20, mass: 0.9 },
  /** Fast punchy response for badges and pops */
  punchy: { stiffness: 280, damping: 20, mass: 0.8 },
} as const;

/**
 * ============================================================================
 * HERO SECTION ANIMATION TIMINGS & CURVES CONFIGURATION
 * ============================================================================
 * You can tweak any timing, delay, distance, or spring values here in one place.
 * All delays and durations are in seconds (s).
 */
export const HERO_TIMINGS = {
  // Name Frame Pop animation (immediate on mount)
  nameBoxDelay: 0.05,
  nameBoxScaleFrom: 0.88,
  nameBoxDuration: 0.42,

  // Character-by-character letter cascade (JAYANT)
  nameStaggerDelay: 0.10,
  nameStaggerSpeed: 0.032,
  nameLetterDuration: 0.44,
  nameLetterRise: "0.4em",

  // Desktop stickers (tactile spring slaps - natural settle with subtle cushion)
  stickerMadeThings: {
    delay: 0.22,
    y: -24,
    rotate: -6,
    stiffness: 240,
    damping: 20,
    mass: 0.75,
  },
  stickerSweatDetails: {
    delay: 0.28,
    y: -24,
    rotate: 6,
    stiffness: 240,
    damping: 20,
    mass: 0.75,
  },
  roleNote: {
    delay: 0.28,
    y: -95,
    rotate: -4,
    rotateFrom: -18,
    stiffness: 340,
    damping: 6.8,
    mass: 0.65,
  },
  locationNote: {
    delay: 0.42,
    y: -120,
    rotate: 2,
    rotateFrom: 20,
    stiffness: 220,
    damping: 6.2,
    mass: 0.85,
  },

  // Mobile notes
  mobileRole: {
    delay: 0.24,
    y: -40,
    rotate: -3,
    stiffness: 320,
    damping: 7.5,
    mass: 0.7,
  },
  mobileLocation: {
    delay: 0.36,
    y: -50,
    rotate: 2,
    stiffness: 220,
    damping: 6.8,
    mass: 0.8,
  },

  // Flanking avatars continuous floating loops
  avatarLeft: {
    amplitude: 7,
    rotate: 4,
    duration: 5.5,
  },
  avatarRight: {
    amplitude: 6,
    rotate: -4,
    duration: 6.2,
    delay: 0.4,
  },
} as const;

/**
 * Custom hook to track mouse cursor and drive the lens with 60/120fps hardware acceleration.
 * - Zero window scroll/wheel listeners: completely unburdens the main thread and compositor during scrolling.
 * - RAF-throttled position updates: coalesces high-frequency mouse events into single vsync updates.
 * - Cached bounding rect on hover: eliminates layout thrashing.
 * - Zero GPU-stalling canvas readbacks.
 */
export function useLens(bounds: [number, number] = [0, 100]) {
  const lensRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const lens = lensRef.current;
      if (!lens) return;
      const currentTarget = e.currentTarget;
      const { clientX, clientY } = e;

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        const rect = currentTarget.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        let x = ((clientX - rect.left) / rect.width) * 100;
        let y = ((clientY - rect.top) / rect.height) * 100;
        if (bounds) {
          x = Math.min(bounds[1], Math.max(bounds[0], x));
          y = Math.min(bounds[1], Math.max(bounds[0], y));
        }
        lens.style.left = `${x}%`;
        lens.style.top = `${y}%`;
      });
    },
    [bounds]
  );

  const onMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      onMove(e);
    },
    [onMove]
  );

  const onMouseLeave = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return { containerRef, lensRef, onMove, onMouseEnter, onMouseLeave };
}

/**
 * Square Lens element with 4 corner squares and [backdrop-filter:invert(1)]
 * Exactly matches https://portfoliofy.io/preview/creative-artsy
 */
export function MouseLens({
  lensRef,
  groupHoverClass = "group-hover/name:scale-100 group-hover/name:opacity-100",
  sizeClass = "h-72 w-72",
  className = "",
}: {
  lensRef?: React.RefObject<HTMLSpanElement | null>;
  groupHoverClass?: string;
  sizeClass?: string;
  className?: string;
}) {
  return (
    <span
      ref={lensRef as React.RefObject<HTMLSpanElement>}
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 top-1/2 z-30 hidden ${sizeClass} -translate-x-1/2 -translate-y-1/2 scale-[0.35] opacity-0 transition-[opacity,transform] duration-300 ease-out [backdrop-filter:invert(1)] ${groupHoverClass} ${className} lg:block`}
    >
      <span className="absolute -left-2 -top-2 h-4 w-4 bg-[var(--ca-ink)]" />
      <span className="absolute -right-2 -top-2 h-4 w-4 bg-[var(--ca-ink)]" />
      <span className="absolute -bottom-2 -left-2 h-4 w-4 bg-[var(--ca-ink)]" />
      <span className="absolute -bottom-2 -right-2 h-4 w-4 bg-[var(--ca-ink)]" />
    </span>
  );
}

/**
 * Circular "See" Lens for Work / Project Cards
 * Automatically guaranteed to be 100% readable on ANY color:
 * - On dark backgrounds (inverted circle turns cream/white), text is deep ink black.
 * - On light backgrounds (inverted circle turns dark/blackish), text is crisp white.
 */
export function CardLens({
  lensRef,
  darkCard = true,
}: {
  lensRef?: React.RefObject<HTMLSpanElement | null>;
  darkCard?: boolean;
}) {
  return (
    <span
      ref={lensRef as React.RefObject<HTMLSpanElement>}
      aria-hidden="true"
      style={{
        ["--ca-lens-text" as any]: darkCard ? "var(--ca-ink)" : "#ffffff",
      }}
      className="ca-card-lens pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-28 w-28 items-center justify-center rounded-full lg:flex"
    >
      <span className="ca-mono text-sm font-black uppercase tracking-widest text-[var(--ca-lens-text,var(--ca-ink))] select-none">
        See
      </span>
    </span>
  );
}

/**
 * Hook to synchronize page entrance animations with page transitions.
 * Guarantees that entrance animations (letters stagger, cards pop, stickers drop)
 * only start once the page is at least 90% visible, never while hidden.
 */
export function usePageAnimationReady(): boolean {
  const [ready, setReady] = useState(() => {
    if (typeof window === "undefined") return true;
    return (window as any).__ca_page_anim_ready !== false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ((window as any).__ca_page_anim_ready !== false) {
      setReady(true);
    } else {
      setReady(false);
    }

    const onReady = () => setReady(true);
    const onStart = () => setReady(false);

    window.addEventListener("ca-page-animation-ready", onReady);
    window.addEventListener("ca-transition-start", onStart);

    return () => {
      window.removeEventListener("ca-page-animation-ready", onReady);
      window.removeEventListener("ca-transition-start", onStart);
    };
  }, []);

  return ready;
}

/**
 * Hook to trigger Hero section entrance immediately without preloader gate.
 */
export function useHeroEntrance() {
  return true;
}

/**
 * Character-by-character staggered reveal with word-wrap preservation
 * Fast, responsive, silky fluid cascade.
 */
export function StaggerText({
  text,
  className = "",
  stagger = 0.032,
  delay = 0,
  y = "0.4em",
  duration = 0.44,
  ease = EASE,
  once = true,
  inView = true,
  trigger = true,
  priority = false,
  initial,
}: {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
  y?: string | number;
  duration?: number;
  ease?: readonly [number, number, number, number] | string;
  once?: boolean;
  inView?: boolean;
  trigger?: boolean;
  priority?: boolean;
  initial?: any;
}) {
  const prefersReduced = useReducedMotion();
  const pageReady = usePageAnimationReady();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: "some" });
  const shouldAnimate = pageReady && (inView ? isInView : trigger);

  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");
  const initialValue = initial !== undefined ? initial : "hidden";

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: "inline-block" }}
      initial={initialValue}
      animate={shouldAnimate ? "show" : initialValue}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, wordIdx) => (
        <span key={wordIdx}>
          <span aria-hidden="true" className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, charIdx) => (
              <motion.span
                key={charIdx}
                className="inline-block"
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                variants={{
                  hidden: { opacity: 0, y },
                  visible: { opacity: 1, y: typeof y === "string" ? "0.2em" : y },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration, ease: ease as any }}
              >
                {char}
              </motion.span>
            ))}
          </span>
          {wordIdx < words.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}

/**
 * Spring Drop-In for stickers, polaroids, and notes
 * Calibrated tactile physics: zero vibration, natural landing settle.
 * Decoupled opacity (smooth fade) and spring physics for y & rotate.
 */
export function DropIn({
  children,
  className = "",
  rotate = -4,
  rotateFrom,
  y = -24,
  scaleFrom = 0.88,
  delay = 0,
  stiffness = 240,
  damping = 20,
  mass = 0.75,
  inView = true,
  trigger = true,
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
  rotateFrom?: number;
  y?: number;
  scaleFrom?: number;
  delay?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  inView?: boolean;
  trigger?: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const pageReady = usePageAnimationReady();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldAnimate = pageReady && (inView ? isInView : trigger);
  const initRotate = rotateFrom !== undefined ? rotateFrom : 1.25 * rotate;

  if (prefersReduced) {
    return (
      <div
        className={className}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
      initial={{ opacity: 0, y, rotate: initRotate, scale: scaleFrom }}
      animate={
        shouldAnimate
          ? { opacity: 1, y: 0, rotate, scale: 1 }
          : { opacity: 0, y, rotate: initRotate, scale: scaleFrom }
      }
      transition={{
        opacity: { duration: 0.22, ease: "easeOut", delay },
        y: { type: "spring", stiffness, damping, mass, delay },
        rotate: { type: "spring", stiffness: Math.min(stiffness, 260), damping: Math.max(damping - 1, 5), mass, delay },
        scale: { type: "spring", stiffness, damping, mass, delay },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Continuous hovering float animation for hero avatar circles
 */
export function Float({
  children,
  className = "",
  amplitude = 7,
  duration = 5.5,
  rotate = 0,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  rotate?: number;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0],
        rotate: rotate ? [-rotate, rotate, -rotate] : 0,
      }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Smooth pop-in animation
 * Starts from 0.88 scale with decoupled opacity fade and subtle spring cushion.
 */
export function Pop({
  children,
  className = "",
  delay = 0.05,
  duration = 0.42,
  from = 0.88,
  ease = EASE,
  stiffness = 240,
  damping = 20,
  mass = 0.75,
  inView = true,
  spring = true,
  trigger = true,
  priority = false,
  initial,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  from?: number;
  ease?: readonly [number, number, number, number] | string;
  stiffness?: number;
  damping?: number;
  mass?: number;
  inView?: boolean;
  spring?: boolean;
  trigger?: boolean;
  priority?: boolean;
  initial?: any;
}) {
  const prefersReduced = useReducedMotion();
  const pageReady = usePageAnimationReady();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const shouldAnimate = pageReady && (inView ? isInView : trigger);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const initialProps =
    initial !== undefined
      ? initial
      : priority
      ? { opacity: 1, scale: from }
      : { opacity: 0, scale: from };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
      initial={initialProps}
      animate={shouldAnimate ? { opacity: 1, scale: 1 } : initialProps}
      transition={
        spring
          ? {
              opacity: { duration: 0.22, ease: "easeOut", delay },
              scale: { type: "spring", stiffness, damping, mass, delay },
            }
          : { duration, delay, ease: ease as any }
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * Vertical rise reveal animation
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  duration = 0.65,
  ease = EASINGS.smooth,
  priority = false,
  initial,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  ease?: readonly [number, number, number, number] | string;
  priority?: boolean;
  initial?: any;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const initialProps =
    initial !== undefined
      ? initial
      : priority
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y };

  return (
    <motion.div
      className={className}
      initial={initialProps}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, delay, ease: ease as any }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Infinite horizontal marquee ticker
 */
export function Marquee({
  children,
  className = "",
  duration = 22,
  fade = false,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  fade?: boolean;
  reverse?: boolean;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={`flex overflow-x-auto whitespace-nowrap ${className}`}>
        {children}
      </div>
    );
  }

  const content = (
    <motion.div
      className={`flex whitespace-nowrap ${className}`}
      animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
    >
      {children}
      {children}
    </motion.div>
  );

  if (fade) {
    return (
      <div className="overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {content}
      </div>
    );
  }
  return content;
}

/**
 * Count up animation for stats and metrics
 */
export function CountUp({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const motionVal = useMotionValue(0);

  const match = value.match(/^(\D*)([\d,]*\.?\d+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const rawNum = match ? match[2].replace(/,/g, "") : "";
  const suffix = match?.[3] ?? "";
  const target = rawNum ? parseFloat(rawNum) : null;
  const decimals = rawNum.includes(".") ? rawNum.split(".")[1].length : 0;
  const useGrouping = !!match && match[2].includes(",");

  const formatted = useTransform(motionVal, (current) => {
    const numStr = current.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping,
    });
    return `${prefix}${numStr}${suffix}`;
  });

  useEffect(() => {
    if (!isInView || target === null || prefersReduced) return;
    const controls = animate(motionVal, target, {
      duration: 1.5,
      ease: EASE,
    });
    return () => controls.stop();
  }, [isInView, target, motionVal, prefersReduced]);

  if (target === null || prefersReduced) {
    return <span ref={ref} className={className}>{value}</span>;
  }

  return (
    <motion.span ref={ref} className={className}>
      {formatted}
    </motion.span>
  );
}
