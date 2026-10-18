"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import { Tape } from "@/components/Paper";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

interface ProjectShowcaseStageProps {
  title: string;
  slug?: string;
  hero: string;
  images: string[];
  demo?: string;
  source: string;
  color?: string;
}

export function ProjectShowcaseStage({
  title,
  hero,
  images,
}: ProjectShowcaseStageProps) {
  // Combine hero and gallery images into a unique ordered list
  const allScreens = Array.from(new Set([hero, ...images])).filter(Boolean);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeScreen = allScreens[activeIdx] || hero;

  const nextScreen = useCallback(() => {
    setActiveIdx((prev) => (prev < allScreens.length - 1 ? prev + 1 : 0));
  }, [allScreens.length]);

  const prevScreen = useCallback(() => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : allScreens.length - 1));
  }, [allScreens.length]);

  // Keyboard navigation for power-users & recruiters
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowRight") {
        nextScreen();
      } else if (e.key === "ArrowLeft") {
        prevScreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextScreen, prevScreen]);

  // Lock body scroll when lightbox is active
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  const tapeColors = [
    "var(--ca-yellow-soft)",
    "var(--ca-cyan)",
    "var(--ca-mint)",
    "var(--ca-pink-soft)",
    "var(--ca-yellow)",
  ];

  return (
    <>
      <div className="relative mb-14 sm:mb-20">
        {/* Decorative Washi Tapes */}
        <Tape
          className="-left-3.5 -top-3 z-20 h-5.5 w-20 shadow-[0_2px_4px_rgba(17,18,18,0.18)]"
          angle={-14}
          color={tapeColors[activeIdx % tapeColors.length]}
        />
        <Tape
          className="-right-3.5 -top-3 z-20 h-5.5 w-20 shadow-[0_2px_4px_rgba(17,18,18,0.18)]"
          angle={14}
          color={tapeColors[(activeIdx + 1) % tapeColors.length]}
        />

        {/* Main Showcase Stage Box */}
        <div className="overflow-hidden rounded-xl border-3 border-[var(--ca-ink)] bg-white shadow-[6px_8px_0_var(--ca-ink)]">
          {/* Primary Screen Viewport - locked 16:10 aspect ratio to eliminate layout shift */}
          <figure
            className="group relative w-full overflow-hidden bg-black/95 flex items-center justify-center aspect-[16/10]"
            style={{ aspectRatio: "16 / 10" }}
          >
            {/* Clickable Image Viewport button to trigger Lightbox (non-nested sibling to rails) */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              aria-label={`Inspect ${title} screenshot ${activeIdx + 1} in full resolution`}
              className="relative h-full w-full cursor-zoom-in text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ca-orange)]"
            >
              <ImageWithLoader
                key={activeScreen}
                src={activeScreen}
                alt={`${title} interactive showcase screen ${activeIdx + 1}`}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 96vw, 1000px"
                quality={85}
                loaderVariant="project"
                loaderText={`Loading Screen ${String(activeIdx + 1).padStart(2, "0")}...`}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]"
              />
            </button>

            {/* Direct Inspect Button in bottom-right corner (sibling, not nested) */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              aria-label={`Inspect screen ${activeIdx + 1} in full resolution`}
              className="absolute bottom-3 right-3 z-20 inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/25 bg-black/75 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-xs transition hover:bg-black hover:scale-105 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] cursor-pointer"
            >
              <Maximize2 size={13} className="text-[var(--ca-yellow)]" />
              <span className="ca-mono text-[10px] tracking-wider uppercase">Inspect</span>
            </button>

            {/* Tactile Capsule Navigation on Full-Height Edge Rails (siblings to image button, NOT nested) */}
            {allScreens.length > 1 && (
              <>
                {/* Left full-height rail */}
                <button
                  type="button"
                  onClick={prevScreen}
                  className="group/prev absolute left-0 inset-y-0 z-20 flex min-h-[44px] min-w-[44px] w-12 sm:w-16 md:w-20 items-center justify-center bg-black/0 hover:bg-black/15 transition-colors duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ca-orange)]"
                  aria-label="Previous screenshot (Left Arrow)"
                  title="Previous screenshot (←)"
                >
                  <div className="flex h-14 sm:h-16 w-8.5 sm:w-9 items-center justify-center rounded-full border-2 border-[var(--ca-ink)] bg-white/95 text-[var(--ca-ink)] shadow-[2px_3px_0_var(--ca-ink)] transition-all duration-200 group-hover/prev:-translate-x-0.5 group-hover/prev:scale-105 group-hover/prev:bg-[var(--ca-yellow)] active:scale-95">
                    <ChevronLeft size={22} className="stroke-[2.5]" />
                  </div>
                </button>

                {/* Right full-height rail */}
                <button
                  type="button"
                  onClick={nextScreen}
                  className="group/next absolute right-0 inset-y-0 z-20 flex min-h-[44px] min-w-[44px] w-12 sm:w-16 md:w-20 items-center justify-center bg-black/0 hover:bg-black/15 transition-colors duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ca-orange)]"
                  aria-label="Next screenshot (Right Arrow)"
                  title="Next screenshot (→)"
                >
                  <div className="flex h-14 sm:h-16 w-8.5 sm:w-9 items-center justify-center rounded-full border-2 border-[var(--ca-ink)] bg-white/95 text-[var(--ca-ink)] shadow-[2px_3px_0_var(--ca-ink)] transition-all duration-200 group-hover/next:translate-x-0.5 group-hover/next:scale-105 group-hover/next:bg-[var(--ca-yellow)] active:scale-95">
                    <ChevronRight size={22} className="stroke-[2.5]" />
                  </div>
                </button>
              </>
            )}
          </figure>

          {/* Numbered Filmstrip Thumbnail Switcher */}
          {allScreens.length > 1 && (
            <div className="border-t-2 border-[var(--ca-ink)]/15 bg-[var(--ca-surface)]/90 p-3 sm:p-4">
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
                <span className="ca-mono hidden text-[10px] font-bold uppercase tracking-wider text-[var(--ca-ink)]/60 min-[420px]:inline-block">
                  Screens:
                </span>
                {allScreens.map((screen, sIdx) => {
                  const isSelected = sIdx === activeIdx;
                  return (
                    <button
                      key={screen}
                      type="button"
                      onClick={() => setActiveIdx(sIdx)}
                      className={`group relative shrink-0 overflow-hidden rounded-md border-2 min-h-[44px] transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                        isSelected
                          ? "border-[var(--ca-ink)] shadow-[2px_3px_0_var(--ca-ink)] scale-102 ring-2 ring-[var(--ca-yellow)]"
                          : "border-[var(--ca-ink)]/20 opacity-70 hover:opacity-100 hover:border-[var(--ca-ink)]/60"
                      }`}
                      style={{ width: "96px", height: "60px" }}
                      aria-label={`Switch to screenshot ${sIdx + 1}`}
                    >
                      <ImageWithLoader
                        src={screen}
                        alt={`${title} thumbnail ${sIdx + 1}`}
                        fill
                        sizes="96px"
                        quality={80}
                        loaderVariant="minimal"
                        showLoaderText={false}
                        className="object-cover"
                      />
                      <span className="ca-mono absolute bottom-0.5 right-1 rounded-xs bg-[var(--ca-ink)]/85 px-1 text-[9px] font-bold text-white">
                        #{sIdx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-Resolution Recruiter Lightbox Modal portaled to body to avoid stacking context traps */}
      {mounted &&
        isLightboxOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-black/90 p-3 sm:p-6 backdrop-blur-md cursor-zoom-out"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} screenshot lightbox`}
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Floating Top-Right Close Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute right-4 top-4 z-40 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-xl transition-all hover:bg-white hover:text-black hover:scale-105 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] cursor-pointer"
              aria-label="Close full-screen preview (Esc)"
              title="Close (Esc)"
            >
              <X size={22} className="stroke-[2.5]" />
            </button>

            {/* Large Screen Container - displays complete uncropped image naturally without aspect clipping */}
            <div className="relative flex h-[88vh] sm:h-[92vh] w-full max-w-7xl items-center justify-center p-2">
              <div
                className="relative h-full w-full flex items-center justify-center cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <ImageWithLoader
                  src={activeScreen}
                  alt={`${title} full-resolution screen ${activeIdx + 1}`}
                  fill
                  priority
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 1440px"
                  loaderVariant="project"
                  loaderText="Loading high-res capture..."
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              {/* Left/Right overlay arrows (stop propagation so clicking them navigates without closing) */}
              {allScreens.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevScreen();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-white/25 bg-black/60 p-2 text-white shadow-lg transition-transform hover:scale-110 hover:bg-black/85 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] cursor-pointer"
                    aria-label="Previous screenshot (Left arrow)"
                  >
                    <ChevronLeft size={26} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextScreen();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-white/25 bg-black/60 p-2 text-white shadow-lg transition-transform hover:scale-110 hover:bg-black/85 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] cursor-pointer"
                    aria-label="Next screenshot (Right arrow)"
                  >
                    <ChevronRight size={26} />
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
