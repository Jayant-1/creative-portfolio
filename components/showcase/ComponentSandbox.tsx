"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  RotateCcw,
  Copy,
  Check,
  Eye,
  Code as CodeIcon,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { CraftComponent } from "@/lib/components-data";
import { ScrubberTrack } from "./ScrubberTrack";
import { highlightLine } from "./CodeViewer";

interface ComponentSandboxProps {
  component: CraftComponent;
}

type StageTab = "preview" | "code";
type CodeSubTab = "component" | "usage";
type ViewportPreset = "desktop" | "tablet" | "mobile";

export const ComponentSandbox: React.FC<ComponentSandboxProps> = ({
  component,
}) => {
  const [stageTab, setStageTab] = useState<StageTab>("preview");
  const [codeSubTab, setCodeSubTab] = useState<CodeSubTab>("component");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportMode, setViewportMode] = useState<ViewportPreset>("desktop");
  const [scrollProgress, setScrollProgress] = useState(0);

  const stageContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 800,
    height: 650,
  });

  const normalizedSlug =
    component.slug === "radial-gradient-animate-card"
      ? "radial-gradient-card"
      : component.slug;

  const isScrollHero =
    normalizedSlug === "overlapping-text-hero" ||
    normalizedSlug === "telescope-hero";

  // Default customizer values per component
  const getInitialCustomizer = useCallback((): Record<string, any> => {
    switch (normalizedSlug) {
      case "overlapping-text-hero":
        return {
          title: "SPIDER-MAN",
          titleStyle: "",
          subTitle1: "FRIENDLY NEIGHBORHOOD",
          subTitle1Color: "#2563eb",
          subTitle2: "WEB-SLINGER",
          subTitle2Color: "#dc2626",
          imgPath: "/sipderman.png",
          textColor: "#dc2626",
          bgColor: "#e2e4e9",
        };
      case "telescope-hero":
        return {
          quote: "Life is either a daring adventure or nothing at all",
          bgImage: "/mountains-wallpaper.jpg",
        };
      case "binary-grid":
        return {
          circleSize: 60,
          stiffness: 300,
          damping: 30,
        };
      case "bubble-text":
        return {
          text: "Bbbbbbble text",
        };
      case "magnetic-button":
        return {
          children: "Hover Me",
          maxDistance: 30,
          stiffness: 150,
          damping: 10,
          mass: 0.1,
        };
      case "radial-gradient-card":
        return {
          color1: "rgba(59, 130, 246)",
          shape: "circle",
          size: "10rem",
          opacity: 0.5,
        };
      default:
        return {};
    }
  }, [normalizedSlug]);

  const [customizer, setCustomizer] = useState<Record<string, any>>(getInitialCustomizer);

  // ResizeObserver for uniform responsive viewport simulation
  useEffect(() => {
    const el = stageContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Send UPDATE_PROPS to iframe
  const sendPropsToIframe = useCallback(
    (propsToSend: Record<string, any>) => {
      if (!iframeRef.current?.contentWindow) return;

      // Transform radial-gradient-card flattened controls to props object
      let formatted = { ...propsToSend };
      if (normalizedSlug === "radial-gradient-card") {
        formatted = {
          radialGradient: {
            color1: propsToSend.color1 || "rgba(59, 130, 246)",
            color2: "transparent",
            shape: propsToSend.shape || "circle",
            size: propsToSend.size || "10rem",
            opacity: typeof propsToSend.opacity === "number" ? propsToSend.opacity : 0.5,
          },
        };
      }

      iframeRef.current.contentWindow.postMessage(
        {
          type: "UPDATE_PROPS",
          props: formatted,
        },
        "*"
      );
    },
    [normalizedSlug]
  );

  // Listen for iframe messages (PREVIEW_READY, SCROLL_CHANGED)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "PREVIEW_READY") {
        sendPropsToIframe(customizer);
      } else if (data.type === "SCROLL_CHANGED") {
        if (typeof data.progress === "number") {
          setScrollProgress(data.progress);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [customizer, sendPropsToIframe]);

  // Listen for external TRY_COMPONENT_VARIANT events dispatched from ComponentVariants
  useEffect(() => {
    const handleVariantSelect = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.props) {
        const next = { ...customizer, ...customEvent.detail.props };
        setCustomizer(next);
        sendPropsToIframe(next);

        // Scroll smoothly to stage
        const stageEl = document.getElementById("sandbox-stage");
        if (stageEl) {
          stageEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    window.addEventListener("TRY_COMPONENT_VARIANT", handleVariantSelect);
    return () => window.removeEventListener("TRY_COMPONENT_VARIANT", handleVariantSelect);
  }, [customizer, sendPropsToIframe]);

  const updateProp = (key: string, value: any) => {
    setCustomizer((prev) => {
      const next = { ...prev, [key]: value };
      sendPropsToIframe(next);
      return next;
    });
  };

  const handleReplay = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: "REPLAY" }, "*");
  };

  const handleReset = () => {
    const defaults = getInitialCustomizer();
    setCustomizer(defaults);
    setScrollProgress(0);
    iframeRef.current?.contentWindow?.postMessage({ type: "RESET" }, "*");
    sendPropsToIframe(defaults);
  };

  const handleScrollScrub = (val: number) => {
    const prog = Math.min(1, Math.max(0, val / 100));
    setScrollProgress(prog);
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "SET_SCROLL",
        progress: prog,
        smooth: false,
      },
      "*"
    );
  };

  const handleCopyCode = async () => {
    const textToCopy =
      codeSubTab === "component" ? component.code : component.usage;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.warn("Clipboard copy failed", err);
    }
  };

  // Uniform scale calculation for tablet & mobile simulation
  let targetWidth = containerDimensions.width;
  let scale = 1;
  if (viewportMode === "tablet") {
    targetWidth = 768;
    scale = containerDimensions.width < 768 ? containerDimensions.width / 768 : 1;
  } else if (viewportMode === "mobile") {
    targetWidth = 375;
    scale = containerDimensions.width < 375 ? containerDimensions.width / 375 : 1;
  }

  const rawCode = codeSubTab === "component" ? component.code : component.usage;
  const codeLines = rawCode.trim().split("\n");

  return (
    <div
      id="sandbox-stage"
      className={`my-8 flex flex-col gap-4 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-[#0a0a0c] p-4 sm:p-6 overflow-hidden flex flex-col"
          : "w-full"
      }`}
    >
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4 rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white/90 dark:bg-[#121316]/90 shadow-sm backdrop-blur-md">
        {/* Left: Stage Mode Toggle & Viewport Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preview vs Code pills */}
          <div className="flex items-center gap-1 bg-[var(--ca-ink)]/5 dark:bg-white/5 p-1 rounded-lg border border-[var(--ca-ink)]/10 dark:border-white/10">
            <button
              onClick={() => setStageTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                stageTab === "preview"
                  ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs font-bold"
                  : "text-[var(--ca-ink)]/60 dark:text-white/60 hover:text-[var(--ca-ink)] dark:hover:text-white"
              }`}
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setStageTab("code")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                stageTab === "code"
                  ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs font-bold"
                  : "text-[var(--ca-ink)]/60 dark:text-white/60 hover:text-[var(--ca-ink)] dark:hover:text-white"
              }`}
            >
              <CodeIcon size={13} />
              <span>Code</span>
            </button>
          </div>

          {/* Viewport switchers (only visible in preview tab) */}
          {stageTab === "preview" && (
            <div className="hidden sm:flex items-center gap-1 bg-[var(--ca-ink)]/5 dark:bg-white/5 p-1 rounded-lg border border-[var(--ca-ink)]/10 dark:border-white/10">
              <button
                onClick={() => setViewportMode("desktop")}
                title="Desktop View (100%)"
                className={`p-1.5 rounded-md transition-all ${
                  viewportMode === "desktop"
                    ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs"
                    : "text-[var(--ca-ink)]/50 dark:text-white/50 hover:text-[var(--ca-ink)] dark:hover:text-white"
                }`}
              >
                <Monitor size={14} />
              </button>
              <button
                onClick={() => setViewportMode("tablet")}
                title="Tablet View (768px)"
                className={`p-1.5 rounded-md transition-all ${
                  viewportMode === "tablet"
                    ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs"
                    : "text-[var(--ca-ink)]/50 dark:text-white/50 hover:text-[var(--ca-ink)] dark:hover:text-white"
                }`}
              >
                <Tablet size={14} />
              </button>
              <button
                onClick={() => setViewportMode("mobile")}
                title="Mobile View (375px)"
                className={`p-1.5 rounded-md transition-all ${
                  viewportMode === "mobile"
                    ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs"
                    : "text-[var(--ca-ink)]/50 dark:text-white/50 hover:text-[var(--ca-ink)] dark:hover:text-white"
                }`}
              >
                <Smartphone size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right: Controls (Replay, Reset, Fullscreen, Copy) */}
        <div className="flex items-center gap-2">
          {stageTab === "preview" ? (
            <>
              <button
                onClick={handleReplay}
                title="Replay Animation"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 text-xs font-mono font-medium text-[var(--ca-ink)]/80 dark:text-white/80 hover:bg-[var(--ca-ink)]/5 dark:hover:bg-white/5 transition-all"
              >
                <RotateCcw size={13} />
                <span className="hidden md:inline">Replay</span>
              </button>

              <button
                onClick={handleReset}
                title="Reset Defaults"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 text-xs font-mono font-medium text-[var(--ca-ink)]/80 dark:text-white/80 hover:bg-[var(--ca-ink)]/5 dark:hover:bg-white/5 transition-all"
              >
                <SlidersHorizontal size={13} />
                <span className="hidden md:inline">Reset</span>
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                className="p-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 text-[var(--ca-ink)]/80 dark:text-white/80 hover:bg-[var(--ca-ink)]/5 dark:hover:bg-white/5 transition-all"
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[var(--ca-ink)]/5 dark:bg-white/5 p-1 rounded-lg border border-[var(--ca-ink)]/10 dark:border-white/10 text-xs font-mono">
                <button
                  onClick={() => setCodeSubTab("component")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    codeSubTab === "component"
                      ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs font-bold"
                      : "text-[var(--ca-ink)]/60 dark:text-white/60"
                  }`}
                >
                  Component
                </button>
                <button
                  onClick={() => setCodeSubTab("usage")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    codeSubTab === "usage"
                      ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs font-bold"
                      : "text-[var(--ca-ink)]/60 dark:text-white/60"
                  }`}
                >
                  Usage
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
                  copiedCode
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold"
                    : "border-[var(--ca-ink)]/15 dark:border-white/10 text-[var(--ca-ink)] dark:text-white hover:bg-[var(--ca-ink)]/5 dark:hover:bg-white/5"
                }`}
              >
                {copiedCode ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                <span>{copiedCode ? "Copied" : "Copy"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Sandbox Grid (Preview Stage + Customize Sidebar) */}
      <div className={`grid gap-6 ${stageTab === "preview" ? "lg:grid-cols-12" : "grid-cols-1"} flex-1`}>
        {/* Dominant Preview / Code Stage */}
        <div
          className={`${
            stageTab === "preview" ? "lg:col-span-8" : "w-full"
          } flex flex-col rounded-2xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#0c0d12] overflow-hidden shadow-lg`}
        >
          {stageTab === "preview" ? (
            <div className="flex flex-col w-full h-full">
              {/* Optional Scrubber Bar for Scroll Heroes */}
              {isScrollHero && (
                <div className="p-3 sm:px-4 bg-[#14161d] border-b border-white/10 flex items-center gap-4">
                  <div className="flex-1">
                    <ScrubberTrack
                      label="Scroll Position Scrubber"
                      value={Math.round(scrollProgress * 100)}
                      min={0}
                      max={100}
                      step={1}
                      unit="%"
                      onChange={handleScrollScrub}
                    />
                  </div>
                </div>
              )}

              {/* Viewport Simulation Stage */}
              <div
                ref={stageContainerRef}
                className="relative flex-1 min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] w-full flex items-center justify-center overflow-hidden bg-neutral-950 p-2 sm:p-4"
              >
                {/* Scaled Device Container */}
                <div
                  style={{
                    width: viewportMode === "desktop" ? "100%" : `${targetWidth}px`,
                    height: viewportMode === "desktop" ? "100%" : `${containerDimensions.height / scale}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                    transition: "width 0.25s ease-out, transform 0.2s ease-out",
                  }}
                  className={`relative ${
                    viewportMode !== "desktop"
                      ? "rounded-2xl border-4 border-neutral-700 shadow-2xl overflow-hidden"
                      : "w-full h-full"
                  }`}
                >
                  <iframe
                    ref={iframeRef}
                    src={`/preview/${normalizedSlug}`}
                    title={`${component.name} Isolated Preview`}
                    className="w-full h-full border-0 block bg-neutral-950"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Syntax Highlighted Code Viewer */
            <div className="bg-[#0b0d13] p-4 min-h-[500px] max-h-[640px] overflow-auto select-text font-mono text-xs leading-6 text-neutral-300">
              {codeLines.map((line, idx) => (
                <div key={idx} className="flex min-w-full hover:bg-white/[0.04]">
                  <span className="w-10 select-none text-neutral-600 text-right pr-4 shrink-0 tabular-nums">
                    {idx + 1}
                  </span>
                  <span className="flex-1 whitespace-pre">{highlightLine(line)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customize Sidebar (visible in preview tab) */}
        {stageTab === "preview" && (
          <aside className="lg:col-span-4 flex flex-col gap-5 p-5 rounded-2xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white/80 dark:bg-[#121316]/90 shadow-sm overflow-y-auto max-h-[640px]">
            <div className="flex items-center justify-between border-b border-[var(--ca-ink)]/10 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-[var(--ca-orange)]" />
                <h3 className="font-mono text-sm font-bold text-[var(--ca-ink)] dark:text-white uppercase tracking-wider">
                  Interactive Controls
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--ca-ink)]/5 dark:bg-white/10 text-[var(--ca-ink)]/60 dark:text-white/60">
                Live Sync
              </span>
            </div>

            {/* OVERLAPPING TEXT HERO CONTROLS */}
            {normalizedSlug === "overlapping-text-hero" && (
              <div className="flex flex-col gap-4">
                {/* Presets */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-mono text-[var(--ca-ink)]/60 dark:text-neutral-400 uppercase">
                    Presets
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const preset = {
                          title: "SPIDER-MAN",
                          subTitle1: "FRIENDLY NEIGHBORHOOD",
                          subTitle1Color: "#2563eb",
                          subTitle2: "WEB-SLINGER",
                          subTitle2Color: "#dc2626",
                          imgPath: "/sipderman.png",
                          textColor: "#dc2626",
                          bgColor: "#e2e4e9",
                        };
                        setCustomizer(preset);
                        sendPropsToIframe(preset);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 text-xs font-mono font-medium hover:bg-[var(--ca-ink)]/5 dark:hover:bg-white/5 text-left"
                    >
                      Spider-Man
                    </button>
                    <button
                      onClick={() => {
                        const preset = {
                          title: "BATMAN",
                          subTitle1: "DARK KNIGHT",
                          subTitle1Color: "#eab308",
                          subTitle2: "GOTHAM PROTECTOR",
                          subTitle2Color: "#64748b",
                          imgPath: "/sipderman.png",
                          textColor: "#0f172a",
                          bgColor: "#cbd5e1",
                        };
                        setCustomizer(preset);
                        sendPropsToIframe(preset);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 text-xs font-mono font-medium hover:bg-[var(--ca-ink)]/5 dark:hover:bg-white/5 text-left"
                    >
                      Dark Knight
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                    Title
                  </label>
                  <input
                    type="text"
                    value={customizer.title || ""}
                    onChange={(e) => updateProp("title", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                      Subtitle 1
                    </label>
                    <input
                      type="text"
                      value={customizer.subTitle1 || ""}
                      onChange={(e) => updateProp("subTitle1", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                      Sub 1 Color
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={customizer.subTitle1Color || "#2563eb"}
                        onChange={(e) => updateProp("subTitle1Color", e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer border border-neutral-700 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={customizer.subTitle1Color || ""}
                        onChange={(e) => updateProp("subTitle1Color", e.target.value)}
                        className="flex-1 px-2 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                      Subtitle 2
                    </label>
                    <input
                      type="text"
                      value={customizer.subTitle2 || ""}
                      onChange={(e) => updateProp("subTitle2", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                      Sub 2 Color
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={customizer.subTitle2Color || "#dc2626"}
                        onChange={(e) => updateProp("subTitle2Color", e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer border border-neutral-700 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={customizer.subTitle2Color || ""}
                        onChange={(e) => updateProp("subTitle2Color", e.target.value)}
                        className="flex-1 px-2 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                      Text Color
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={customizer.textColor || "#dc2626"}
                        onChange={(e) => updateProp("textColor", e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer border border-neutral-700 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={customizer.textColor || ""}
                        onChange={(e) => updateProp("textColor", e.target.value)}
                        className="flex-1 px-2 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                      Background
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={customizer.bgColor || "#e2e4e9"}
                        onChange={(e) => updateProp("bgColor", e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer border border-neutral-700 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={customizer.bgColor || ""}
                        onChange={(e) => updateProp("bgColor", e.target.value)}
                        className="flex-1 px-2 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                    Portrait Asset
                  </label>
                  <select
                    value={customizer.imgPath || "/sipderman.png"}
                    onChange={(e) => updateProp("imgPath", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white"
                  >
                    <option value="/sipderman.png">Spider-Man Cutout (/sipderman.png)</option>
                    <option value="/Profile-removebg.png">Jayant Potdar Cutout (/Profile-removebg.png)</option>
                  </select>
                </div>
              </div>
            )}

            {/* TELESCOPE HERO CONTROLS */}
            {normalizedSlug === "telescope-hero" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                    Centerpiece Quote
                  </label>
                  <textarea
                    rows={3}
                    value={customizer.quote || ""}
                    onChange={(e) => updateProp("quote", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                    Backdrop Wallpaper
                  </label>
                  <select
                    value={customizer.bgImage || "/mountains-wallpaper.jpg"}
                    onChange={(e) => updateProp("bgImage", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white"
                  >
                    <option value="/mountains-wallpaper.jpg">Mountains Wallpaper (/mountains-wallpaper.jpg)</option>
                    <option value="https://images.unsplash.com/photo-1618083707368-b3823daa2726?q=80&w=1470&auto=format&fit=crop">Unsplash Alpine Vista</option>
                  </select>
                </div>
              </div>
            )}

            {/* BINARY GRID CONTROLS */}
            {normalizedSlug === "binary-grid" && (
              <div className="flex flex-col gap-4">
                <ScrubberTrack
                  label="Spotlight Aperture Radius"
                  value={customizer.circleSize || 60}
                  min={30}
                  max={140}
                  step={5}
                  unit="px"
                  onChange={(val) => updateProp("circleSize", val)}
                />
                <ScrubberTrack
                  label="Spring Stiffness"
                  value={customizer.stiffness || 300}
                  min={100}
                  max={500}
                  step={20}
                  onChange={(val) => updateProp("stiffness", val)}
                />
                <ScrubberTrack
                  label="Spring Damping"
                  value={customizer.damping || 30}
                  min={10}
                  max={50}
                  step={2}
                  onChange={(val) => updateProp("damping", val)}
                />
              </div>
            )}

            {/* BUBBLE TEXT CONTROLS */}
            {normalizedSlug === "bubble-text" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                    Interactive Text
                  </label>
                  <input
                    type="text"
                    value={customizer.text || ""}
                    onChange={(e) => updateProp("text", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateProp("text", "Bbbbbbble text")}
                    className="px-2.5 py-1 rounded-md border border-[var(--ca-ink)]/15 dark:border-white/10 text-xs font-mono hover:bg-[var(--ca-ink)]/5"
                  >
                    Default
                  </button>
                  <button
                    onClick={() => updateProp("text", "Creative Portfolio")}
                    className="px-2.5 py-1 rounded-md border border-[var(--ca-ink)]/15 dark:border-white/10 text-xs font-mono hover:bg-[var(--ca-ink)]/5"
                  >
                    Portfolio
                  </button>
                  <button
                    onClick={() => updateProp("text", "Hover Dynamic Weight")}
                    className="px-2.5 py-1 rounded-md border border-[var(--ca-ink)]/15 dark:border-white/10 text-xs font-mono hover:bg-[var(--ca-ink)]/5"
                  >
                    Typography
                  </button>
                </div>
              </div>
            )}

            {/* MAGNETIC BUTTON CONTROLS */}
            {normalizedSlug === "magnetic-button" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={customizer.children || "Hover Me"}
                    onChange={(e) => updateProp("children", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white"
                  />
                </div>
                <ScrubberTrack
                  label="Magnetic Pull Radius"
                  value={customizer.maxDistance || 30}
                  min={10}
                  max={60}
                  step={2}
                  unit="px"
                  onChange={(val) => updateProp("maxDistance", val)}
                />
                <ScrubberTrack
                  label="Spring Stiffness"
                  value={customizer.stiffness || 150}
                  min={50}
                  max={400}
                  step={10}
                  onChange={(val) => updateProp("stiffness", val)}
                />
                <ScrubberTrack
                  label="Spring Damping"
                  value={customizer.damping || 10}
                  min={5}
                  max={40}
                  step={1}
                  onChange={(val) => updateProp("damping", val)}
                />
                <ScrubberTrack
                  label="Spring Mass"
                  value={customizer.mass || 0.1}
                  min={0.05}
                  max={0.5}
                  step={0.05}
                  onChange={(val) => updateProp("mass", val)}
                />
              </div>
            )}

            {/* RADIAL GRADIENT CARD CONTROLS */}
            {normalizedSlug === "radial-gradient-card" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                    Spotlight Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customizer.color1?.startsWith("#") ? customizer.color1 : "#3b82f6"}
                      onChange={(e) => updateProp("color1", e.target.value)}
                      className="h-8 w-8 rounded cursor-pointer border border-neutral-700 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={customizer.color1 || ""}
                      onChange={(e) => updateProp("color1", e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 uppercase">
                    Shape
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateProp("shape", "circle")}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
                        customizer.shape !== "ellipse"
                          ? "bg-[var(--ca-ink)]/10 dark:bg-white/15 border-[var(--ca-ink)]/30 dark:border-white/30 font-bold"
                          : "border-[var(--ca-ink)]/15 dark:border-white/10"
                      }`}
                    >
                      Circle
                    </button>
                    <button
                      onClick={() => updateProp("shape", "ellipse")}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
                        customizer.shape === "ellipse"
                          ? "bg-[var(--ca-ink)]/10 dark:bg-white/15 border-[var(--ca-ink)]/30 dark:border-white/30 font-bold"
                          : "border-[var(--ca-ink)]/15 dark:border-white/10"
                      }`}
                    >
                      Ellipse
                    </button>
                  </div>
                </div>

                <ScrubberTrack
                  label="Spotlight Opacity"
                  value={Math.round((customizer.opacity ?? 0.5) * 100)}
                  min={10}
                  max={100}
                  step={5}
                  unit="%"
                  onChange={(val) => updateProp("opacity", val / 100)}
                />
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};
