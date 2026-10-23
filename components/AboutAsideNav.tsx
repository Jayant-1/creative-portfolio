"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { m as motion, useReducedMotion } from "framer-motion";
import { usePageAnimationReady } from "@/components/Motion";

interface SectionDef {
  id: string;
  label: string;
  color: string;
  ink: string;
  dotBg: string;
}

const SECTIONS: SectionDef[] = [
  {
    id: "bio",
    label: "Main Bio",
    color: "var(--ca-yellow)",
    ink: "var(--ca-ink)",
    dotBg: "var(--ca-ink)",
  },
  {
    id: "facts",
    label: "Quick Facts",
    color: "var(--ca-cyan)",
    ink: "var(--ca-ink)",
    dotBg: "var(--ca-ink)",
  },
  {
    id: "story",
    label: "Story",
    color: "var(--ca-magenta)",
    ink: "var(--ca-ink)",
    dotBg: "var(--ca-ink)",
  },
  {
    id: "leadership",
    label: "Leadership",
    color: "var(--ca-blue)",
    ink: "#ffffff",
    dotBg: "#ffffff",
  },
];

const STICKY_TOP = 112; // 7rem (top-28 below header)
const BADGE_HEIGHT = 34; // Refined sleek height for authentic stationery index tab
const GAP = 8;
const BADGE_STEP = BADGE_HEIGHT + GAP; // 42px (previously 52px)

interface CachedMetrics {
  asideTopDoc: number;
  asideLeft: number;
  sections: { id: string; topDoc: number; bottomDoc: number }[];
}

export function AboutAsideNav() {
  const pageReady = usePageAnimationReady();
  const shouldReduceMotion = useReducedMotion();
  const asideRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metricsRef = useRef<CachedMetrics | null>(null);
  const [activeId, setActiveId] = useState<string>("bio");
  const activeIdRef = useRef<string>("bio");

  // Measure document coordinates only when layout changes (mount, resize, content load)
  // NEVER during scroll — zero layout thrashing!
  const measure = useCallback(() => {
    if (!asideRef.current) return;
    const asideRect = asideRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const asideTopDoc = asideRect.top + scrollY;
    const asideLeft = asideRect.left;

    const sections = SECTIONS.map((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) return { id: sec.id, topDoc: 0, bottomDoc: 0 };
      const rect = el.getBoundingClientRect();
      return {
        id: sec.id,
        topDoc: rect.top + scrollY,
        bottomDoc: rect.bottom + scrollY,
      };
    });

    metricsRef.current = { asideTopDoc, asideLeft, sections };
  }, []);

  // Update badge positions on scroll using pre-cached boundaries
  const update = useCallback(() => {
    const m = metricsRef.current;
    if (!m) return;

    const scrollY = window.scrollY;

    // Detect active section based on current viewport reading focus
    const focusY = scrollY + STICKY_TOP + 80;
    let currentActive = SECTIONS[0].id;
    for (let i = m.sections.length - 1; i >= 0; i--) {
      const s = m.sections[i];
      if (s.topDoc > 0 && focusY >= s.topDoc - 60) {
        currentActive = s.id;
        break;
      }
    }
    if (currentActive !== activeIdRef.current) {
      activeIdRef.current = currentActive;
      setActiveId(currentActive);
    }

    for (let i = 0; i < SECTIONS.length; i++) {
      const badgeEl = badgeRefs.current[i];
      if (!badgeEl) continue;

      const sec = m.sections[i];
      const badgeStickyTop = STICKY_TOP + i * BADGE_STEP;
      const viewportBadgeDocY = scrollY + badgeStickyTop;

      // Initial resting position in aside
      const restingDocY = m.asideTopDoc + i * BADGE_STEP;

      // Lock threshold at the bottom of section i
      const hasValidSection = sec && sec.bottomDoc > 0;
      const lockDocY = hasValidSection
        ? sec.bottomDoc - BADGE_HEIGHT
        : Infinity;

      if (viewportBadgeDocY < restingDocY) {
        // 1. Above sticky threshold: parked at natural resting position in aside
        badgeEl.style.position = "absolute";
        badgeEl.style.top = `${i * BADGE_STEP}px`;
        badgeEl.style.left = "0px";
        badgeEl.style.transition = "none";
      } else if (hasValidSection && viewportBadgeDocY >= lockDocY) {
        // 2. Section finished: locked to bottom of section, scrolls away naturally with it
        const localLockY = Math.max(0, lockDocY - m.asideTopDoc);
        badgeEl.style.position = "absolute";
        badgeEl.style.top = `${localLockY}px`;
        badgeEl.style.left = "0px";
        badgeEl.style.transition = "none";
      } else {
        // 3. Sticking in viewport at its dedicated slot
        // transition: none guarantees no flying animation from bottom of screen when scrolling up!
        badgeEl.style.position = "fixed";
        badgeEl.style.top = `${badgeStickyTop}px`;
        badgeEl.style.left = `${m.asideLeft}px`;
        badgeEl.style.transition = "none";
      }
    }
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        update();
        rafId = null;
      });
    };

    const handleResize = () => {
      measure();
      update();
    };

    measure();
    update();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, {
      passive: true,
    });

    // Re-check after images/fonts settle
    const t1 = setTimeout(handleResize, 100);
    const t2 = setTimeout(handleResize, 400);
    const t3 = setTimeout(handleResize, 1000);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        handleResize();
      });
      if (asideRef.current) observer.observe(asideRef.current);
      SECTIONS.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el && observer) observer.observe(el);
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (observer) observer.disconnect();
    };
  }, [measure, update]);

  return (
    <div ref={asideRef} className="relative h-full w-full">
      {SECTIONS.map((sec, idx) => (
        <div
          key={sec.id}
          ref={(el) => {
            badgeRefs.current[idx] = el;
          }}
          style={{
            position: "absolute",
            top: `${idx * BADGE_STEP}px`,
            left: 0,
          }}
          className="z-20 will-change-[top]"
        >
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 1, x: 0, rotate: 0 }
                : { opacity: 0, x: -44, rotate: -3 }
            }
            animate={
              shouldReduceMotion || pageReady
                ? { opacity: 1, x: 0, rotate: 0 }
                : { opacity: 0, x: -44, rotate: -3 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                    mass: 0.8,
                    delay: 0.12 + idx * 0.08,
                    opacity: {
                      duration: 0.22,
                      delay: 0.12 + idx * 0.08,
                      ease: "easeOut",
                    },
                  }
            }
            style={{
              willChange: "transform, opacity",
              transformOrigin: "left center",
            }}
          >
            {(() => {
              const isActive = sec.id === activeId;
              return (
                <a
                  href={`#${sec.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(sec.id);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                      activeIdRef.current = sec.id;
                      setActiveId(sec.id);
                    }
                  }}
                  aria-current={isActive ? "location" : undefined}
                  style={{
                    backgroundColor: sec.color,
                    color: sec.ink,
                  }}
                  className={`ca-mono inline-flex h-[34px] min-h-[34px] items-center gap-2 rounded-r-lg border-2 border-[var(--ca-ink)] px-3 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] focus-visible:ring-offset-2 ${
                    isActive
                      ? "translate-x-2 shadow-[4px_4px_0_var(--ca-ink)]"
                      : "shadow-[2.5px_2.5px_0_var(--ca-ink)] hover:translate-x-1.5 focus:translate-x-1.5"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0 transition-colors duration-200"
                    style={{
                      backgroundColor: isActive ? "#ffffff" : sec.dotBg,
                    }}
                  />
                  <span>{sec.label}</span>
                </a>
              );
            })()}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
