"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useInkTransition } from "@/components/transitions/InkTransitionProvider";

declare global {
  interface Window {
    __ca_preloader_active?: boolean;
    __ca_preloader_done?: boolean;
  }
}

// A fresh load at / shows the curtain once. Client navigation never replays it.
let preloaderCompleted = false;

const MINIMUM_DISPLAY_MS = 1450;
const MAXIMUM_DISPLAY_MS = 2200;
const FADE_MS = 380;
const BUBBLE_STYLE =
  "relative rounded-2xl rounded-tl-none border-2 border-[var(--ca-ink)] bg-[var(--ca-yellow)] px-6 py-4 text-2xl font-bold leading-none text-[var(--ca-ink)] sm:text-4xl shadow-[4px_4px_0_var(--ca-ink)] select-none inline-flex items-center justify-center min-w-[280px] sm:min-w-[400px] min-h-[68px] sm:min-h-[82px] whitespace-nowrap";
const PHRASES = [Array.from("Compiling pixels..."), Array.from("Ready to explore!")];

function waitForVisibleHeroImages() {
  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>("main section:first-child img.ca-image-real"),
  ).filter((image) => image.getClientRects().length > 0);

  return Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          const settle = () => {
            if (image.naturalWidth > 0 && image.decode) {
              image.decode().catch(() => {}).finally(resolve);
            } else {
              resolve();
            }
          };

          // A lazy image behind an overlay can otherwise wait until the overlay exits.
          image.loading = "eager";
          if (image.complete) {
            settle();
          } else {
            image.addEventListener("load", settle, { once: true });
            image.addEventListener("error", settle, { once: true });
          }
        }),
    ),
  );
}

function announceReady() {
  window.__ca_preloader_active = false;
  window.__ca_preloader_done = true;
  window.dispatchEvent(new CustomEvent("ca-preloader-done"));
}

export default function Preloader() {
  const pathname = usePathname();
  const { prewarmShader } = useInkTransition();
  const excluded = preloaderCompleted || pathname !== "/";
  const [step, setStep] = useState<0 | 1>(0);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(excluded);
  const exitingRef = useRef(false);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    announceReady();
    setExiting(true);
    fadeTimerRef.current = setTimeout(() => {
      preloaderCompleted = true;
      setDone(true);
    }, FADE_MS);
  }, []);

  useEffect(() => {
    if (excluded) {
      preloaderCompleted = true;
      announceReady();
      setDone(true);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      preloaderCompleted = true;
      announceReady();
      setDone(true);
      return;
    }

    window.__ca_preloader_active = true;
    window.__ca_preloader_done = false;
    const phraseTimer = setTimeout(() => setStep(1), 720);
    const minimum = new Promise<void>((resolve) => setTimeout(resolve, MINIMUM_DISPLAY_MS));
    const deadline = new Promise<void>((resolve) => setTimeout(resolve, MAXIMUM_DISPLAY_MS));
    let cancelled = false;

    // Paint the curtain first, then prepare the visible photographs and shader.
    const frame = requestAnimationFrame(() => {
      prewarmShader(); // Unsupported WebGL has a built-in transition fallback.
      const assets = Promise.all([waitForVisibleHeroImages(), document.fonts.ready]);
      Promise.race([Promise.all([minimum, assets]), deadline]).then(() => {
        if (!cancelled) finish();
      });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (["Escape", "Enter", " "].includes(event.key)) finish();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(phraseTimer);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [excluded, finish, prewarmShader]);

  if (excluded || done) return null;

  return (
    <div
      className={`ca-preloader ca-grid fixed inset-0 z-[100] grid place-items-center bg-[var(--ca-surface)] ${
        exiting ? "pointer-events-none" : "cursor-pointer"
      }`}
      style={{ opacity: exiting ? 0 : 1, transition: `opacity ${FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` }}
      role="status"
      aria-label={step === 0 ? "Compiling pixels" : "Ready to explore"}
      onClick={finish}
    >
      <div
        className={`${BUBBLE_STYLE} ca-preloader-bubble`}
        style={{ transform: exiting ? "translateY(-10px) scale(0.94)" : "none", transition: `transform ${FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` }}
        aria-hidden="true"
      >
          <span
            key={step}
            className="inline-flex items-center"
          >
            {PHRASES[step].map((character, index) => (
              <span
                key={`${step}-${index}`}
                className="ca-char-pop"
                style={{ animationDelay: `${(0.04 + index * 0.036).toFixed(3)}s` }}
              >
                {character === " " ? "\u00a0" : character}
              </span>
            ))}
          </span>
      </div>
    </div>
  );
}
