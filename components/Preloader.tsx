"use client";

import React, { useEffect, useState, useCallback } from "react";
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

  const completePreloader = useCallback(() => {
    setIsExiting(true);
    preloaderCompleted = true;
    if (typeof window !== "undefined") {
      window.__ca_preloader_active = false;
      window.__ca_preloader_done = true;
      window.dispatchEvent(new CustomEvent("ca-preloader-done"));
    }
    setTimeout(() => {
      setIsDone(true);
    }, 420);
  }, []);

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
      window.__ca_preloader_done = false;
    }

    // Phase 1 ("Compiling pixels..."):
    // 19 chars * 36ms = 684ms typewriter duration (starts at 100ms, completes at ~784ms).
    // Transition into Phase 2 at 860ms.
    const t1 = setTimeout(() => {
      setStep(2);
    }, 860);

    // Phase 2 ("Ready to explore!"):
    // Starts at 860ms. 17 chars * 36ms typewriter completes at ~1480ms.
    // Held completed until 1850ms for comfortable reading.
    // Dispatches ca-preloader-done so Hero section begins its cascade as the curtain dissolves.
    const t2 = setTimeout(() => {
      setIsExiting(true);
      if (typeof window !== "undefined") {
        window.__ca_preloader_active = false;
        window.__ca_preloader_done = true;
        window.dispatchEvent(new CustomEvent("ca-preloader-done"));
      }
    }, 1850);

    // Final curtain unmount after silky smooth fade-out (1850ms + 380ms)
    const t3 = setTimeout(() => {
      preloaderCompleted = true;
      setIsDone(true);
    }, 2230);

    // Allow user to click anywhere or press Escape / Space / Enter to skip preloader
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        completePreloader();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExcluded, completePreloader]);

  if (isExcluded || isDone) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`ca-grid fixed inset-0 z-[100] grid place-items-center bg-[var(--ca-surface)] ${
        isExiting ? "pointer-events-none" : "pointer-events-auto cursor-pointer"
      }`}
      aria-hidden="true"
      onClick={completePreloader}
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
                      animationDelay: `${(0.1 + i * 0.036).toFixed(3)}s`,
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
                      animationDelay: `${(0.04 + i * 0.036).toFixed(3)}s`,
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
