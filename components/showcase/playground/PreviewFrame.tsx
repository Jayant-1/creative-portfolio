"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Eye,
  Code as CodeIcon,
} from "lucide-react";
import { LogicalViewport } from "@/lib/component-manifests";

interface PreviewFrameProps {
  slug: string;
  referenceViewport: {
    desktop: LogicalViewport;
    tablet: LogicalViewport;
    mobile: LogicalViewport;
  };
  activeTab: "preview" | "code";
  onTabChange: (tab: "preview" | "code") => void;
  onReplay: () => void;
  scrollProgress?: number;
  onScrollChange?: (progress: number) => void;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  isScrollLinked?: boolean;
  children?: React.ReactNode;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  slug,
  referenceViewport,
  activeTab,
  onTabChange,
  onReplay,
  iframeRef,
  children,
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(1000);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const stageMeasureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Measure stage container width with ResizeObserver
  useEffect(() => {
    const el = stageMeasureRef.current;
    if (!el) return;

    const updateDimensions = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 0) {
        setContainerWidth(width);
      }
    };

    updateDimensions();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [activeTab]);

  // Fullscreen body scroll lock and escape listener
  useEffect(() => {
    if (!isFullscreen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  // Logical viewport for desktop
  const logical = referenceViewport.desktop;

  // Calculate uniform scale
  let scale = 1;
  if (isFullscreen) {
    const availableW = typeof window !== "undefined" ? window.innerWidth - 48 : 1200;
    const availableH = typeof window !== "undefined" ? window.innerHeight - 120 : 700;
    scale = Math.min(availableW / logical.width, availableH / logical.height, 1);
  } else {
    const rawScale = containerWidth < logical.width ? containerWidth / logical.width : 1;
    // Scale down slightly (0.92x desktop) so the preview card has elegant framing and breathing room
    const paddingMultiplier = 0.92;
    scale = Math.round(rawScale * paddingMultiplier * 1000) / 1000;
  }

  const displayedWidth = logical.width * scale;
  const displayedHeight = logical.height * scale;

  // Iframe stage content
  const stageContent = (
    <div className="flex flex-col items-center w-full select-none">
      {/* Outer reserved box matching scaled dimensions */}
      <div
        style={{
          width: `${displayedWidth}px`,
          height: `${displayedHeight}px`,
        }}
        className="relative overflow-hidden rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#0c0d10] shadow-sm transition-all"
      >
        {!isIframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0c0d10] z-10">
            <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
              <span className="h-2 w-2 rounded-full bg-[var(--ca-orange)] animate-ping" />
              <span>Loading preview...</span>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={`/preview/${slug}`}
          title={`${slug} interactive component preview`}
          onLoad={() => setIsIframeLoaded(true)}
          style={{
            width: `${logical.width}px`,
            height: `${logical.height}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            border: "none",
          }}
          className="absolute top-0 left-0 bg-transparent"
        />
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Top Action Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl border border-[var(--ca-ink)]/10 dark:border-white/10 bg-white/70 dark:bg-[#14161a]/70 backdrop-blur-sm">
        {/* Preview / Code Segmented Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--ca-ink)]/5 dark:bg-white/5 border border-[var(--ca-ink)]/10 dark:border-white/10">
          <button
            type="button"
            onClick={() => onTabChange("preview")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all ${
              activeTab === "preview"
                ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs font-bold border border-[var(--ca-ink)]/10 dark:border-white/10"
                : "text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)]"
            }`}
          >
            <Eye size={12} />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("code")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all ${
              activeTab === "code"
                ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs font-bold border border-[var(--ca-ink)]/10 dark:border-white/10"
                : "text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)]"
            }`}
          >
            <CodeIcon size={12} />
            <span>Code</span>
          </button>
        </div>

        {/* Stage Actions - only shown in Preview mode */}
        {activeTab === "preview" && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Replay */}
            <button
              type="button"
              onClick={onReplay}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 text-[var(--ca-ink)] dark:text-white hover:bg-[var(--ca-ink)]/5 transition-all"
              title="Replay entrance animations"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Replay</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-lg text-xs font-mono border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 text-[var(--ca-ink)] dark:text-white hover:bg-[var(--ca-ink)]/5 transition-all"
              title="Fullscreen preview (Press Escape to exit)"
              aria-label="Enter Fullscreen"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Main Measurement & Stage Container */}
      <div
        ref={stageMeasureRef}
        id="sandbox-stage"
        style={{ display: activeTab === "preview" ? "flex" : "none" }}
        className="w-full flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf8f4] dark:bg-[#121316] overflow-hidden"
      >
        {stageContent}
      </div>

      {/* Code Tab View */}
      {activeTab === "code" && (
        <div className="w-full">
          {children}
        </div>
      )}

      {/* Fullscreen Portal attached to document.body */}
      {isFullscreen && isMounted && createPortal(
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0c]/95 backdrop-blur-md p-4 sm:p-6 overflow-hidden">
          {/* Floating Exit Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between pb-3 mb-2 border-b border-white/10 text-white">
            <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
              <span className="text-white font-bold">{slug}</span>
              <span>/</span>
              <span>Desktop ({logical.width}x{logical.height})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onReplay}
                className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-mono bg-white/10 hover:bg-white/15 text-white transition-all"
              >
                <RotateCcw size={12} />
                <span>Replay</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-white/20 hover:bg-white/30 text-white font-bold transition-all"
                aria-label="Exit Fullscreen"
              >
                <Minimize2 size={13} />
                <span>Exit (Esc)</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Stage */}
          <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
            {stageContent}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
