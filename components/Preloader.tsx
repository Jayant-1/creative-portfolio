"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    __ca_preloader_active?: boolean;
    __ca_preloader_done?: boolean;
  }
}

// Module-level flag: tracks if preloader has completed its full lifecycle
// or was bypassed in this browser session. Persists across client-side route transitions,
// and resets cleanly on full page reloads / fresh tabs.
let preloaderCompleted = false;

const BUBBLE_STYLE =
  "relative rounded-2xl rounded-tl-none border-2 border-[var(--ca-ink)] bg-[var(--ca-yellow)] px-6 py-4 text-2xl font-bold leading-none text-[var(--ca-ink)] sm:text-4xl shadow-[4px_4px_0_var(--ca-ink)] select-none inline-flex items-center justify-center min-w-[280px] sm:min-w-[400px] min-h-[68px] sm:min-h-[82px] whitespace-nowrap";

const PHRASE_1 = Array.from("Compiling pixels...");
const PHRASE_2 = Array.from("Ready to explore!");

export default function Preloader() {
  const pathname = usePathname();

  // The Preloader must ONLY display on the initial site load at the root ("/")
  // It must never display on subpages or on subsequent client navigations
  const isExcluded =
    preloaderCompleted ||
    Boolean(pathname && pathname !== "/");

  const [step, setStep] = useState<1 | 2>(1);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(isExcluded);

  useEffect(() => {
    // If opening a project or non-root route, or already executed, immediately mark done & dispatch
    if (isExcluded) {
      preloaderCompleted = true;
      if (typeof window !== "undefined") {
        window.__ca_preloader_active = false;
        window.__ca_preloader_done = true;
        window.dispatchEvent(new CustomEvent("ca-preloader-done"));
      }
      setIsDone(true);
      return;
    }

    // Respect user's reduced-motion preference
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) {
        preloaderCompleted = true;
        window.__ca_preloader_active = false;
        window.__ca_preloader_done = true;
        window.dispatchEvent(new CustomEvent("ca-preloader-done"));
        setIsDone(true);
        return;
      }
      window.__ca_preloader_active = true;
    }

    // Phase 1 ("Compiling pixels..."):
    // 19 chars * 48ms = 912ms typewriter duration (starts at 140ms, completes at ~1250ms).
    // Transition into Phase 2 at 1400ms.
    const t1 = setTimeout(() => {
      setStep(2);
    }, 1400);

    // Phase 2 ("Ready to explore!"):
    // Starts seamlessly at 1400ms. 17 chars * 48ms typewriter completes at ~2400ms.
    // Held fully completed until 3100ms for comfortable reading.
    // Dispatches ca-preloader-done so Hero section begins its cascade as the curtain dissolves.
    const t2 = setTimeout(() => {
      setIsExiting(true);
      if (typeof window !== "undefined") {
        window.__ca_preloader_active = false;
        window.__ca_preloader_done = true;
        window.dispatchEvent(new CustomEvent("ca-preloader-done"));
      }
    }, 3100);

    // Final curtain unmount after silky smooth fade-out (3100ms + 420ms)
    const t3 = setTimeout(() => {
      preloaderCompleted = true;
      setIsDone(true);
    }, 3520);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isExcluded]);

  if (isExcluded || isDone) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="ca-grid pointer-events-none fixed inset-0 z-[100] grid place-items-center bg-[var(--ca-surface)]"
      aria-hidden="true"
    >
      <motion.div
        layout
        initial={{ scale: 0.82, opacity: 0, y: 14 }}
        animate={
          isExiting
            ? { scale: 0.94, opacity: 0, y: -10 }
            : { scale: 1, opacity: 1, y: 0 }
        }
        transition={{
          layout: { type: "spring", stiffness: 420, damping: 26 },
          type: "spring",
          stiffness: 420,
          damping: 24,
        }}
        className={BUBBLE_STYLE}
      >
        <div className="relative inline-flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            {step === 1 ? (
              <motion.span
                key="phrase-1"
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.96,
                  transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
                }}
                className="inline-flex items-center"
              >
                {PHRASE_1.map((char, i) => (
                  <span
                    key={`p1-${i}`}
                    className="ca-char-pop"
                    style={{
                      animationDelay: `${(0.14 + i * 0.048).toFixed(3)}s`,
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </motion.span>
            ) : (
              <motion.span
                key="phrase-2"
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center"
              >
                {PHRASE_2.map((char, i) => (
                  <span
                    key={`p2-${i}`}
                    className="ca-char-pop"
                    style={{
                      animationDelay: `${(0.05 + i * 0.048).toFixed(3)}s`,
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
