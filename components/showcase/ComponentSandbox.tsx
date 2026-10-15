"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  RotateCcw,
  Copy,
  Check,
  Eye,
  Code as CodeIcon,
  SlidersHorizontal,
  Play,
  Pause,
  Maximize2,
  X,
  Monitor,
  Tablet,
  Smartphone,
  Mouse,
  Type,
  Layers,
  Sparkles,
} from "lucide-react";
import { CraftComponent } from "@/lib/components-data";
import { ScrubberTrack } from "./ScrubberTrack";
import { MagneticButton } from "./MagneticButton";
import { BubbleText } from "./BubbleText";
import { RadialGradientAnimateCard } from "./RadialGradientAnimateCard";
import { BinaryGrid } from "./BinaryGrid";
import { OverlappingTextHero } from "./OverlappingTextHero";
import { TelescopeHero } from "./TelescopeHero";
import { highlightLine } from "./CodeViewer";

interface ComponentSandboxProps {
  component: CraftComponent;
}

type StageTab = "preview" | "code";
type CodeSubTab = "component" | "usage";
type ViewportPreset = "desktop" | "tablet" | "mobile";

interface ComponentPreset {
  id: string;
  name: string;
  values: Record<string, any>;
}

export const ComponentSandbox: React.FC<ComponentSandboxProps> = ({
  component,
}) => {
  const [stageTab, setStageTab] = useState<StageTab>("preview");
  const [codeSubTab, setCodeSubTab] = useState<CodeSubTab>("component");
  const [remountKey, setRemountKey] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportMode, setViewportMode] = useState<ViewportPreset>("desktop");
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string>("default");

  const scrollerRef = useRef<HTMLDivElement>(null);
  const telescopeScrollRef = useRef<HTMLDivElement>(null);

  // Normalize component slug
  const normalizedSlug =
    component.slug === "radial-gradient-animate-card"
      ? "radial-gradient-card"
      : component.slug;

  // Initialize reactive customizer state with Spider-Man default for overlapping-text-hero
  const getInitialCustomizer = useCallback((): Record<string, any> => {
    if (normalizedSlug === "overlapping-text-hero") {
      return {
        title: "SPIDER-MAN",
        subTitle1: "FRIENDLY NEIGHBORHOOD",
        subTitle1Color: "#2563eb",
        subTitle2: "WEB-SLINGER",
        subTitle2Color: "#dc2626",
        imgPath: "/sipderman.png",
        textColor: "#dc2626",
        bgColor: "#e2e4e9",
        scrollProgress: 0,
        fontSize: "",
        compactMode: true,
      };
    }
    if (normalizedSlug === "telescope-hero") {
      return {
        quote: "Life is either a daring adventure or nothing at all",
        bgImage: "/mountains-wallpaper.jpg",
        scrollProgress: 0,
        fontSize: "",
        compactMode: true,
      };
    }
    if (normalizedSlug === "magnetic-button") {
      return {
        label: "Follow",
        maxDistance: 30,
        stiffness: 150,
        damping: 10,
        mass: 0.1,
        theme: "dark",
      };
    }
    if (normalizedSlug === "bubble-text") {
      return {
        text: "Bbbbbbble text",
        fontSize: "",
        theme: "indigo",
      };
    }
    if (normalizedSlug === "binary-grid") {
      return {
        circleSize: 75,
        stiffness: 300,
        damping: 30,
      };
    }
    if (normalizedSlug === "radial-gradient-card") {
      return {
        title: "Classic Sports Shoes",
        badge: "Trending",
        description:
          "Experience comfort and style with our latest minimalist sports design, perfect for both athletic performance and everyday casual wear.",
        color1: "rgba(59, 130, 246, 0.5)",
        size: 14,
        opacity: 0.5,
      };
    }
    return component.defaultCustomizer || {};
  }, [normalizedSlug, component.defaultCustomizer]);

  const [customState, setCustomState] = useState<Record<string, any>>(getInitialCustomizer);

  // Sync when component slug changes
  useEffect(() => {
    setCustomState(getInitialCustomizer());
    setActivePresetId("default");
    setRemountKey((k) => k + 1);
    setHasScrolled(false);
  }, [getInitialCustomizer]);

  // Presets configuration per component
  const getPresets = (): ComponentPreset[] => {
    switch (normalizedSlug) {
      case "overlapping-text-hero":
        return [
          {
            id: "default",
            name: "Spider-Man",
            values: {
              title: "SPIDER-MAN",
              subTitle1: "FRIENDLY NEIGHBORHOOD",
              subTitle1Color: "#2563eb",
              subTitle2: "WEB-SLINGER",
              subTitle2Color: "#dc2626",
              imgPath: "/sipderman.png",
              textColor: "#dc2626",
              bgColor: "#e2e4e9",
              scrollProgress: 0,
            },
          },
          {
            id: "editorial",
            name: "Editorial Ochre",
            values: {
              title: "JAYANT POTDAR",
              subTitle1: "B.TECH",
              subTitle1Color: "#191510",
              subTitle2: "FULL STACK DEVELOPER",
              subTitle2Color: "#db4b29",
              imgPath: "/Profile-removebg.png",
              textColor: "#db4b29",
              bgColor: "#e3e2dd",
              scrollProgress: 0,
            },
          },
          {
            id: "stealth",
            name: "Stealth Cyan",
            values: {
              title: "CYBER MATRIX",
              subTitle1: "SYSTEM OPERATOR",
              subTitle1Color: "#06b6d4",
              subTitle2: "SHADERS & MOTION",
              subTitle2Color: "#38bdf8",
              imgPath: "/Profile-removebg.png",
              textColor: "#06b6d4",
              bgColor: "#090b10",
              scrollProgress: 0,
            },
          },
        ];

      case "telescope-hero":
        return [
          {
            id: "default",
            name: "Alpine Vista",
            values: {
              quote: "Life is either a daring adventure or nothing at all",
              bgImage: "/mountains-wallpaper.jpg",
              scrollProgress: 0,
            },
          },
          {
            id: "cosmic",
            name: "Cosmic Void",
            values: {
              quote: "The cosmos is within us, we are made of star-stuff",
              bgImage: "/mountains-wallpaper.jpg",
              scrollProgress: 0,
            },
          },
          {
            id: "minimal",
            name: "Architectural",
            values: {
              quote: "Simplicity is the ultimate sophistication",
              bgImage: "/mountains-wallpaper.jpg",
              scrollProgress: 0,
            },
          },
        ];

      case "magnetic-button":
        return [
          {
            id: "default",
            name: "Follow Pill",
            values: {
              label: "Follow",
              maxDistance: 30,
              stiffness: 150,
              damping: 10,
              mass: 0.1,
              theme: "dark",
            },
          },
          {
            id: "launch",
            name: "Snappy Amber",
            values: {
              label: "Launch App",
              maxDistance: 40,
              stiffness: 220,
              damping: 14,
              mass: 0.08,
              theme: "amber",
            },
          },
          {
            id: "command",
            name: "Cyber Node",
            values: {
              label: "> EXECUTE",
              maxDistance: 55,
              stiffness: 130,
              damping: 9,
              mass: 0.15,
              theme: "cyan",
            },
          },
        ];

      case "bubble-text":
        return [
          {
            id: "default",
            name: "Bubble Wave",
            values: {
              text: "Bbbbbbble text",
              theme: "indigo",
            },
          },
          {
            id: "cyberpunk",
            name: "Neon 2088",
            values: {
              text: "NEO TOKYO 2088",
              theme: "emerald",
            },
          },
          {
            id: "editorial",
            name: "Studio Mono",
            values: {
              text: "CREATIVE CRAFT",
              theme: "rust",
            },
          },
        ];

      case "binary-grid":
        return [
          {
            id: "default",
            name: "Standard Vault",
            values: {
              circleSize: 75,
              stiffness: 300,
              damping: 30,
            },
          },
          {
            id: "tight",
            name: "High Precision",
            values: {
              circleSize: 55,
              stiffness: 420,
              damping: 24,
            },
          },
          {
            id: "expansive",
            name: "Wide Aperture",
            values: {
              circleSize: 130,
              stiffness: 200,
              damping: 35,
            },
          },
        ];

      case "radial-gradient-card":
        return [
          {
            id: "default",
            name: "Electric Blue",
            values: {
              title: "Classic Sports Shoes",
              badge: "Trending",
              color1: "rgba(59, 130, 246, 0.55)",
              size: 14,
              opacity: 0.55,
            },
          },
          {
            id: "amber",
            name: "Amber Warmth",
            values: {
              title: "Drafting Specimen",
              badge: "Architectural",
              color1: "rgba(245, 158, 11, 0.5)",
              size: 16,
              opacity: 0.6,
            },
          },
          {
            id: "emerald",
            name: "Mint Telemetry",
            values: {
              title: "Neural Engine Core",
              badge: "Telemetry",
              color1: "rgba(16, 185, 129, 0.5)",
              size: 12,
              opacity: 0.55,
            },
          },
        ];

      default:
        return [];
    }
  };

  const presets = getPresets();

  const handleControlChange = (key: string, value: any) => {
    setCustomState((prev) => ({ ...prev, [key]: value }));

    if (key === "scrollProgress") {
      const activeScroller =
        normalizedSlug === "telescope-hero"
          ? telescopeScrollRef.current
          : scrollerRef.current;
      if (activeScroller) {
        const maxScroll = activeScroller.scrollHeight - activeScroller.clientHeight;
        if (maxScroll > 0) {
          activeScroller.scrollTop = (Number(value) / 100) * maxScroll;
        }
      }
    }
  };

  const applyPreset = (preset: ComponentPreset) => {
    setActivePresetId(preset.id);
    setCustomState((prev) => ({ ...prev, ...preset.values }));
    setRemountKey((k) => k + 1);
  };

  const resetDefaults = () => {
    setCustomState(getInitialCustomizer());
    setActivePresetId("default");
    setRemountKey((k) => k + 1);
    setIsAutoPlaying(false);
    setHasScrolled(false);
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
    if (telescopeScrollRef.current) telescopeScrollRef.current.scrollTop = 0;
  };

  const getActiveCode = () => {
    return codeSubTab === "component" ? component.code : component.usage;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getActiveCode());
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;
    const progress = Math.max(0, Math.min(1, el.scrollTop / maxScroll));
    const roundedPercent = Math.round(progress * 100);
    setCustomState((prev) => ({ ...prev, scrollProgress: roundedPercent }));
    if (!hasScrolled && el.scrollTop > 15) {
      setHasScrolled(true);
    }
  };

  // Auto-play demo loop for scroll-based hero components
  useEffect(() => {
    if (!isAutoPlaying) return;
    let forward = true;
    const interval = setInterval(() => {
      setCustomState((prev) => {
        const cur = prev.scrollProgress || 0;
        let next = cur;
        if (forward) {
          if (cur >= 100) {
            forward = false;
            next = 98;
          } else {
            next = cur + 1.5;
          }
        } else {
          if (cur <= 0) {
            forward = true;
            next = 1.5;
          } else {
            next = cur - 1.5;
          }
        }

        const activeScroller =
          normalizedSlug === "telescope-hero"
            ? telescopeScrollRef.current
            : scrollerRef.current;
        if (activeScroller) {
          const maxScroll =
            activeScroller.scrollHeight - activeScroller.clientHeight;
          if (maxScroll > 0) {
            activeScroller.scrollTop = (next / 100) * maxScroll;
          }
        }
        return { ...prev, scrollProgress: next };
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isAutoPlaying, normalizedSlug]);

  // Handle ESC key for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Viewport width styling
  const getViewportWidth = (mode: ViewportPreset): string => {
    switch (mode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      case "desktop":
      default:
        return "100%";
    }
  };

  // Live Component Renderer
  const renderLiveComponent = () => {
    switch (normalizedSlug) {
      case "overlapping-text-hero":
        return (
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="relative h-[520px] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 select-none bg-[#0d0e12]"
          >
            <OverlappingTextHero
              title={customState.title || "SPIDER-MAN"}
              subTitle1={customState.subTitle1 || "FRIENDLY NEIGHBORHOOD"}
              subTitle1Color={customState.subTitle1Color || "#2563eb"}
              subTitle2={customState.subTitle2 || "WEB-SLINGER"}
              subTitle2Color={customState.subTitle2Color || "#dc2626"}
              imgPath={customState.imgPath || "/sipderman.png"}
              textColor={customState.textColor || "#dc2626"}
              bgColor={customState.bgColor || "#e2e4e9"}
              compactMode={true}
              progress={
                customState.scrollProgress !== undefined
                  ? customState.scrollProgress / 100
                  : undefined
              }
              containerRef={scrollerRef}
              fontSize={customState.fontSize || undefined}
            />
            {!hasScrolled && !isAutoPlaying && (
              <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white font-mono text-xs shadow-xl animate-bounce">
                <Mouse size={13} className="text-orange-400" />
                <span>Scroll inside the frame</span>
              </div>
            )}
          </div>
        );

      case "telescope-hero":
        return (
          <div
            ref={telescopeScrollRef}
            onScroll={handleScroll}
            className="relative h-[520px] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 select-none bg-[#090a0e]"
          >
            <TelescopeHero
              quote={
                customState.quote ||
                "Life is either a daring adventure or nothing at all"
              }
              bgImage={customState.bgImage || "/mountains-wallpaper.jpg"}
              compactMode={true}
              scrollContainerRef={telescopeScrollRef}
              progress={
                customState.scrollProgress !== undefined
                  ? customState.scrollProgress / 100
                  : undefined
              }
              fontSize={customState.fontSize || undefined}
            />
            {!hasScrolled && !isAutoPlaying && (
              <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white font-mono text-xs shadow-xl animate-bounce">
                <Mouse size={13} className="text-orange-400" />
                <span>Scroll inside the frame</span>
              </div>
            )}
          </div>
        );

      case "magnetic-button": {
        const btnText = customState.label || "Follow";
        const theme = customState.theme || "dark";
        return (
          <div className="flex flex-col items-center justify-center p-12 min-h-[460px] w-full bg-neutral-950 gap-5">
            <MagneticButton
              maxDistance={Number(customState.maxDistance || 30)}
              stiffness={Number(customState.stiffness || 150)}
              damping={Number(customState.damping || 10)}
              mass={Number(customState.mass || 0.1)}
              className={`font-mono text-xs sm:text-sm font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors shadow-lg ${
                theme === "amber"
                  ? "bg-[#f59e0b] hover:bg-[#d97706] text-black"
                  : theme === "cyan"
                  ? "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                  : "bg-zinc-100 hover:bg-white text-zinc-950"
              }`}
            >
              <span>{btnText}</span>
            </MagneticButton>
            <span className="font-mono text-[11px] text-neutral-400 opacity-70 text-center tracking-wide max-w-xs">
              Move cursor near the button to trigger elastic Newtonian pull
            </span>
          </div>
        );
      }

      case "bubble-text": {
        const theme = customState.theme || "indigo";
        return (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 min-h-[460px] w-full bg-neutral-950 gap-6">
            <BubbleText
              text={customState.text || "Bbbbbbble text"}
              className={`font-raleway text-5xl sm:text-7xl md:text-8xl font-thin tracking-normal ${
                theme === "emerald"
                  ? "text-emerald-400"
                  : theme === "rust"
                  ? "text-[#f97316]"
                  : "text-indigo-300"
              }`}
            />
            <span className="font-mono text-[11px] text-neutral-400 opacity-70 text-center tracking-wide">
              Hover cursor over glyphs to radiate Gaussian weight displacement
            </span>
          </div>
        );
      }

      case "binary-grid":
        return (
          <div className="w-full h-full min-h-[460px] flex items-center justify-center p-4 bg-neutral-950">
            <BinaryGrid
              circleSize={Number(customState.circleSize || 75)}
              stiffness={Number(customState.stiffness || 300)}
              damping={Number(customState.damping || 30)}
            />
          </div>
        );

      case "radial-gradient-card":
        return (
          <div className="flex items-center justify-center p-6 sm:p-8 min-h-[460px] w-full bg-neutral-950">
            <RadialGradientAnimateCard
              radialGradient={{
                color1: customState.color1 || "rgba(59, 130, 246, 0.5)",
                size: `${customState.size || 14}rem`,
                shape: "circle",
                opacity: Number(customState.opacity || 0.5),
              }}
              className="p-0 max-w-sm overflow-hidden border border-white/10 bg-[#0f1118]"
            >
              <img
                className="h-44 w-full rounded-t-xl object-cover"
                src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1479&auto=format&fit=crop"
                alt={customState.title || "Classic Sports Shoes"}
              />
              <div className="p-5">
                <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase">
                  {customState.badge || "Trending"}
                </span>

                <h3 className="mt-1.5 text-lg font-bold text-gray-100 font-sans">
                  {customState.title || "Classic Sports Shoes"}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-gray-400 font-sans">
                  {customState.description ||
                    "Experience comfort and style with our latest minimalist sports design, perfect for athletic performance."}
                </p>

                <button
                  type="button"
                  className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-blue-500 focus:outline-none"
                >
                  Buy Now
                </button>
              </div>
            </RadialGradientAnimateCard>
          </div>
        );

      default:
        return <div className="p-12 text-center text-white/50">Preview not available</div>;
    }
  };

  const lines = getActiveCode().split("\n");
  const isScrollDriven =
    normalizedSlug === "overlapping-text-hero" ||
    normalizedSlug === "telescope-hero";

  return (
    <>
      {/* ===================== FULLSCREEN PREVIEW MODAL ===================== */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#08090d] flex flex-col select-none">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-black/90 backdrop-blur-md border-b border-white/10 text-xs font-mono text-white">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                {component.name}
              </span>
              <span className="text-white/40">//</span>
              <span className="text-white/60">Fullscreen Stage</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1 rounded-lg bg-white/10 border border-white/10">
                <button
                  onClick={() => setViewportMode("desktop")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewportMode === "desktop"
                      ? "bg-white text-black shadow-sm"
                      : "text-white/60 hover:text-white"
                  }`}
                  title="Desktop (100%)"
                >
                  <Monitor size={14} />
                </button>
                <button
                  onClick={() => setViewportMode("tablet")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewportMode === "tablet"
                      ? "bg-white text-black shadow-sm"
                      : "text-white/60 hover:text-white"
                  }`}
                  title="Tablet (768px)"
                >
                  <Tablet size={14} />
                </button>
                <button
                  onClick={() => setViewportMode("mobile")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewportMode === "mobile"
                      ? "bg-white text-black shadow-sm"
                      : "text-white/60 hover:text-white"
                  }`}
                  title="Mobile (375px)"
                >
                  <Smartphone size={14} />
                </button>
              </div>

              <button
                onClick={resetDefaults}
                className="p-1.5 rounded-lg border border-white/15 bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Reset defaults"
              >
                <RotateCcw size={14} />
              </button>

              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
              >
                <X size={14} />
                <span>Exit (ESC)</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Canvas */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 bg-[#050608]">
            <div
              style={{
                width: getViewportWidth(viewportMode),
                maxWidth: "100%",
              }}
              className="h-[620px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0c0d12] relative transition-[max-width,width] duration-300 ease-out"
            >
              {renderLiveComponent()}
            </div>
          </div>
        </div>
      )}

      {/* ===================== SECTION 1 & SECTION 2 CONTAINER ===================== */}
      {/* XPath: .../main/div/div[1] */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start w-full">
        {/* ===================== SECTION 1: PREVIEW & DEMO STAGE ===================== */}
        {/* XPath: .../main/div/div[1]/div[1] */}
        <div className="flex flex-col gap-4 min-w-0 w-full">
          <div className="w-full rounded-2xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf8f4] dark:bg-[#121316] shadow-sm overflow-hidden flex flex-col">
            {/* ReactBits Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white/80 dark:bg-[#15161b] border-b border-[var(--ca-ink)]/10 dark:border-white/10 text-xs font-mono">
              {/* Left: Preview vs Code segmented tabs */}
              <div className="flex items-center gap-1 bg-[var(--ca-ink)]/5 dark:bg-white/5 p-1 rounded-xl border border-[var(--ca-ink)]/10 dark:border-white/10">
                <button
                  onClick={() => setStageTab("preview")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    stageTab === "preview"
                      ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs border border-[var(--ca-ink)]/10 dark:border-white/10"
                      : "text-[var(--ca-ink)]/60 dark:text-white/60 hover:text-[var(--ca-ink)] dark:hover:text-white"
                  }`}
                >
                  <Eye size={13} />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => setStageTab("code")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    stageTab === "code"
                      ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs border border-[var(--ca-ink)]/10 dark:border-white/10"
                      : "text-[var(--ca-ink)]/60 dark:text-white/60 hover:text-[var(--ca-ink)] dark:hover:text-white"
                  }`}
                >
                  <CodeIcon size={13} />
                  <span>Code</span>
                </button>
              </div>

              {/* Right: Actions Group */}
              <div className="flex items-center gap-2">
                {stageTab === "preview" && (
                  <>
                    {/* Viewport Presets Switcher: Desktop (100%), Tablet (768px), Mobile (375px) */}
                    <div className="flex items-center gap-0.5 p-1 rounded-xl bg-[var(--ca-ink)]/5 dark:bg-white/5 border border-[var(--ca-ink)]/10 dark:border-white/10">
                      <button
                        onClick={() => setViewportMode("desktop")}
                        className={`p-1.5 rounded-lg transition-all ${
                          viewportMode === "desktop"
                            ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs"
                            : "text-[var(--ca-ink)]/50 dark:text-white/50 hover:text-[var(--ca-ink)] dark:hover:text-white"
                        }`}
                        title="Desktop Viewport (100%)"
                      >
                        <Monitor size={14} />
                      </button>
                      <button
                        onClick={() => setViewportMode("tablet")}
                        className={`p-1.5 rounded-lg transition-all ${
                          viewportMode === "tablet"
                            ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs"
                            : "text-[var(--ca-ink)]/50 dark:text-white/50 hover:text-[var(--ca-ink)] dark:hover:text-white"
                        }`}
                        title="Tablet Viewport (768px)"
                      >
                        <Tablet size={14} />
                      </button>
                      <button
                        onClick={() => setViewportMode("mobile")}
                        className={`p-1.5 rounded-lg transition-all ${
                          viewportMode === "mobile"
                            ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs"
                            : "text-[var(--ca-ink)]/50 dark:text-white/50 hover:text-[var(--ca-ink)] dark:hover:text-white"
                        }`}
                        title="Mobile Viewport (375px)"
                      >
                        <Smartphone size={14} />
                      </button>
                    </div>

                    <div className="h-4 w-px bg-[var(--ca-ink)]/15 dark:bg-white/10 mx-0.5" />
                  </>
                )}

                {/* Reload / Restart Button */}
                <button
                  onClick={resetDefaults}
                  className="p-2 rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 text-[var(--ca-ink)]/70 dark:text-white/70 hover:text-[var(--ca-ink)] dark:hover:text-white hover:bg-[var(--ca-ink)]/5 dark:hover:bg-white/5 transition-colors shadow-xs"
                  title="Reload / Restart Animation"
                >
                  <RotateCcw size={13} />
                </button>

                {/* Fullscreen Toggle */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-2 rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 text-[var(--ca-ink)]/70 dark:text-white/70 hover:text-[var(--ca-ink)] dark:hover:text-white hover:bg-[var(--ca-ink)]/5 dark:hover:bg-white/5 transition-colors shadow-xs"
                  title="Fullscreen Playground"
                >
                  <Maximize2 size={13} />
                </button>

                {/* Copy Code Button */}
                <button
                  onClick={handleCopyCode}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors border shadow-xs ${
                    copiedCode
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-white dark:bg-neutral-900 border-[var(--ca-ink)]/15 dark:border-white/10 text-[var(--ca-ink)] dark:text-white hover:bg-[var(--ca-ink)]/5 dark:hover:bg-white/5"
                  }`}
                >
                  {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedCode ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Stage Canvas Area */}
            {stageTab === "preview" ? (
              <div className="relative w-full h-[520px] bg-[#0c0d12] flex items-center justify-center overflow-hidden">
                {/* Paper-craft dot grid canvas backdrop */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />

                {/* Responsive Viewport Frame */}
                <div
                  style={{
                    width: getViewportWidth(viewportMode),
                    maxWidth: "100%",
                  }}
                  className={`relative mx-auto h-[520px] overflow-hidden ${
                    viewportMode !== "desktop"
                      ? "border border-white/20 rounded-2xl bg-[#090a0f] shadow-2xl"
                      : "w-full"
                  } transition-[max-width,width] duration-300 ease-out`}
                >
                  <div key={remountKey} className="w-full h-full relative">
                    {renderLiveComponent()}
                  </div>
                </div>
              </div>
            ) : (
              /* Code Viewer Sub-Stage */
              <div className="bg-[#0d0f14] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#14161f] border-b border-white/10 font-mono text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCodeSubTab("component")}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        codeSubTab === "component"
                          ? "bg-white/10 text-white font-medium"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {component.name.replace(/\s+/g, "")}.tsx
                    </button>
                    <button
                      onClick={() => setCodeSubTab("usage")}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        codeSubTab === "usage"
                          ? "bg-white/10 text-white font-medium"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      Usage.tsx
                    </button>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-white/10 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                  >
                    {copiedCode ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                    <span>{copiedCode ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="py-3 px-1 max-h-[470px] overflow-auto scrollbar-thin scrollbar-thumb-white/20 select-text font-mono text-xs">
                  {lines.map((line, idx) => (
                    <div
                      key={idx}
                      className="flex min-w-full hover:bg-white/[0.04] transition-colors leading-6"
                    >
                      <span className="w-12 shrink-0 select-none text-right pr-4 text-neutral-600 font-mono text-[11px] tabular-nums">
                        {idx + 1}
                      </span>
                      <span className="flex-1 whitespace-pre font-mono text-[12px]">
                        {highlightLine(line)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 2: CUSTOMIZE SIDEBAR FRAME ===================== */}
        {/* XPath: .../main/div/div[1]/div[2] */}
        <div className="w-full xl:sticky xl:top-24 flex flex-col gap-5 rounded-2xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf8f4] dark:bg-[#121316] p-5 shadow-sm">
          {/* Title Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--ca-ink)]/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-[var(--ca-orange)]" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] dark:text-white">
                CUSTOMIZE
              </h3>
            </div>
            <button
              onClick={resetDefaults}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-orange)] transition-colors"
              title="Reset to default props"
            >
              <RotateCcw size={12} />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* Preset Selector */}
          {presets.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--ca-ink)]/60 dark:text-neutral-400 font-semibold">
                PRESETS
              </span>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[var(--ca-ink)]/5 dark:bg-white/5 border border-[var(--ca-ink)]/10 dark:border-white/10 text-[11px] font-mono">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p)}
                    className={`py-1.5 px-2 rounded-lg font-medium truncate transition-all text-center ${
                      activePresetId === p.id
                        ? "bg-white dark:bg-neutral-800 text-[var(--ca-orange)] font-bold shadow-xs border border-[var(--ca-ink)]/10 dark:border-white/10"
                        : "text-[var(--ca-ink)]/70 dark:text-neutral-300 hover:text-[var(--ca-ink)]"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls Stack with Dynamic Sliders & Value Readouts */}
          <div className="flex flex-col gap-4 max-h-[560px] overflow-y-auto scrollbar-thin pr-1">
            {/* OVERLAPPING TEXT HERO CONTROLS */}
            {normalizedSlug === "overlapping-text-hero" && (
              <>
                <ScrubberTrack
                  label="Scroll Progression"
                  value={Math.round(customState.scrollProgress || 0)}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  onChange={(val) => handleControlChange("scrollProgress", val)}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 dark:text-neutral-400 font-medium">
                    Headline Title
                  </label>
                  <input
                    type="text"
                    value={customState.title ?? "SPIDER-MAN"}
                    onChange={(e) => handleControlChange("title", e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-neutral-900 border border-[var(--ca-ink)]/15 dark:border-white/10 rounded-lg shadow-xs focus:outline-none focus:border-[var(--ca-orange)] text-[var(--ca-ink)] dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 dark:text-neutral-400 font-medium">
                    Subtitle 1 (Badge)
                  </label>
                  <input
                    type="text"
                    value={customState.subTitle1 ?? "FRIENDLY NEIGHBORHOOD"}
                    onChange={(e) =>
                      handleControlChange("subTitle1", e.target.value)
                    }
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-neutral-900 border border-[var(--ca-ink)]/15 dark:border-white/10 rounded-lg shadow-xs focus:outline-none focus:border-[var(--ca-orange)] text-[var(--ca-ink)] dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 dark:text-neutral-400 font-medium">
                    Subtitle 2 (Role)
                  </label>
                  <input
                    type="text"
                    value={customState.subTitle2 ?? "WEB-SLINGER"}
                    onChange={(e) =>
                      handleControlChange("subTitle2", e.target.value)
                    }
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-neutral-900 border border-[var(--ca-ink)]/15 dark:border-white/10 rounded-lg shadow-xs focus:outline-none focus:border-[var(--ca-orange)] text-[var(--ca-ink)] dark:text-white"
                  />
                </div>

                {/* Color Schemes */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 dark:text-neutral-400 font-medium">
                    Text Color Scheme
                  </label>
                  <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-[var(--ca-ink)]/5 dark:bg-white/5 border border-[var(--ca-ink)]/10 dark:border-white/10 text-[10px] font-mono">
                    {[
                      { label: "Spidey Red", val: "#dc2626" },
                      { label: "Terracotta", val: "#db4b29" },
                      { label: "Cyan", val: "#06b6d4" },
                      { label: "Pitch", val: "#111216" },
                    ].map((c) => (
                      <button
                        key={c.val}
                        onClick={() => handleControlChange("textColor", c.val)}
                        className={`py-1 rounded text-center truncate transition-all ${
                          (customState.textColor || "#dc2626") === c.val
                            ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white font-bold shadow-xs"
                            : "text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)]"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 dark:text-neutral-400 font-medium">
                    Canvas Paper Tint
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[var(--ca-ink)]/5 dark:bg-white/5 border border-[var(--ca-ink)]/10 dark:border-white/10 text-[10px] font-mono">
                    {[
                      { label: "Light Ash", val: "#e2e4e9" },
                      { label: "Cream Paper", val: "#e3e2dd" },
                      { label: "Dark Space", val: "#0d0e12" },
                    ].map((b) => (
                      <button
                        key={b.val}
                        onClick={() => handleControlChange("bgColor", b.val)}
                        className={`py-1 rounded text-center truncate transition-all ${
                          (customState.bgColor || "#e2e4e9") === b.val
                            ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white font-bold shadow-xs"
                            : "text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)]"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TELESCOPE HERO CONTROLS */}
            {normalizedSlug === "telescope-hero" && (
              <>
                <ScrubberTrack
                  label="3D Depth Navigation"
                  value={Math.round(customState.scrollProgress || 0)}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  onChange={(val) => {
                    handleControlChange("scrollProgress", val);
                    if (telescopeScrollRef.current) {
                      const maxScroll =
                        telescopeScrollRef.current.scrollHeight -
                        telescopeScrollRef.current.clientHeight;
                      telescopeScrollRef.current.scrollTop =
                        (val / 100) * maxScroll;
                    }
                  }}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 dark:text-neutral-400 font-medium">
                    Display Quote
                  </label>
                  <textarea
                    rows={2}
                    value={
                      customState.quote ||
                      "Life is either a daring adventure or nothing at all"
                    }
                    onChange={(e) => handleControlChange("quote", e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-neutral-900 border border-[var(--ca-ink)]/15 dark:border-white/10 rounded-lg shadow-xs focus:outline-none focus:border-[var(--ca-orange)] text-[var(--ca-ink)] dark:text-white resize-none"
                  />
                </div>
              </>
            )}

            {/* MAGNETIC BUTTON CONTROLS */}
            {normalizedSlug === "magnetic-button" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 dark:text-neutral-400 font-medium">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={customState.label || "Follow"}
                    onChange={(e) => handleControlChange("label", e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-neutral-900 border border-[var(--ca-ink)]/15 dark:border-white/10 rounded-lg shadow-xs focus:outline-none focus:border-[var(--ca-orange)] text-[var(--ca-ink)] dark:text-white"
                  />
                </div>

                <ScrubberTrack
                  label="Max Pull Distance"
                  value={customState.maxDistance || 30}
                  min={10}
                  max={80}
                  step={5}
                  unit="px"
                  onChange={(val) => handleControlChange("maxDistance", val)}
                />

                <ScrubberTrack
                  label="Spring Stiffness"
                  value={customState.stiffness || 150}
                  min={50}
                  max={350}
                  step={10}
                  onChange={(val) => handleControlChange("stiffness", val)}
                />

                <ScrubberTrack
                  label="Spring Damping"
                  value={customState.damping || 10}
                  min={4}
                  max={30}
                  step={1}
                  onChange={(val) => handleControlChange("damping", val)}
                />

                <ScrubberTrack
                  label="Physical Mass"
                  value={customState.mass || 0.1}
                  min={0.05}
                  max={0.5}
                  step={0.05}
                  onChange={(val) => handleControlChange("mass", val)}
                />
              </>
            )}

            {/* BUBBLE TEXT CONTROLS */}
            {normalizedSlug === "bubble-text" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 dark:text-neutral-400 font-medium">
                    Headline Content
                  </label>
                  <input
                    type="text"
                    value={customState.text || "Bbbbbbble text"}
                    onChange={(e) => handleControlChange("text", e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-neutral-900 border border-[var(--ca-ink)]/15 dark:border-white/10 rounded-lg shadow-xs focus:outline-none focus:border-[var(--ca-orange)] text-[var(--ca-ink)] dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 dark:text-neutral-400 font-medium">
                    Color Accent
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[var(--ca-ink)]/5 dark:bg-white/5 border border-[var(--ca-ink)]/10 dark:border-white/10 text-[10px] font-mono">
                    {[
                      { id: "indigo", label: "Indigo Glow" },
                      { id: "emerald", label: "Cyber Mint" },
                      { id: "rust", label: "Rust Fire" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleControlChange("theme", t.id)}
                        className={`py-1 rounded text-center truncate transition-all ${
                          (customState.theme || "indigo") === t.id
                            ? "bg-white dark:bg-neutral-800 text-[var(--ca-orange)] font-bold shadow-xs"
                            : "text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)]"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* BINARY GRID CONTROLS */}
            {normalizedSlug === "binary-grid" && (
              <>
                <ScrubberTrack
                  label="Reveal Radius"
                  value={customState.circleSize || 75}
                  min={30}
                  max={160}
                  step={5}
                  unit="px"
                  onChange={(val) => handleControlChange("circleSize", val)}
                />

                <ScrubberTrack
                  label="Spring Stiffness"
                  value={customState.stiffness || 300}
                  min={100}
                  max={500}
                  step={20}
                  onChange={(val) => handleControlChange("stiffness", val)}
                />

                <ScrubberTrack
                  label="Spring Damping"
                  value={customState.damping || 30}
                  min={10}
                  max={60}
                  step={2}
                  onChange={(val) => handleControlChange("damping", val)}
                />
              </>
            )}

            {/* RADIAL GRADIENT CARD CONTROLS */}
            {normalizedSlug === "radial-gradient-card" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 dark:text-neutral-400 font-medium">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={customState.title || "Classic Sports Shoes"}
                    onChange={(e) => handleControlChange("title", e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-neutral-900 border border-[var(--ca-ink)]/15 dark:border-white/10 rounded-lg shadow-xs focus:outline-none focus:border-[var(--ca-orange)] text-[var(--ca-ink)] dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 dark:text-neutral-400 font-medium">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={customState.badge || "Trending"}
                    onChange={(e) => handleControlChange("badge", e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono bg-white dark:bg-neutral-900 border border-[var(--ca-ink)]/15 dark:border-white/10 rounded-lg shadow-xs focus:outline-none focus:border-[var(--ca-orange)] text-[var(--ca-ink)] dark:text-white"
                  />
                </div>

                <ScrubberTrack
                  label="Glow Radius"
                  value={Number(customState.size || 14)}
                  min={8}
                  max={24}
                  step={1}
                  unit="rem"
                  onChange={(val) => handleControlChange("size", val)}
                />

                <ScrubberTrack
                  label="Spotlight Opacity"
                  value={Number(customState.opacity || 0.5)}
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  onChange={(val) => handleControlChange("opacity", val)}
                />
              </>
            )}

            {/* Auto-Play Toggle for Scroll Components */}
            {isScrollDriven && (
              <div className="pt-3 border-t border-[var(--ca-ink)]/10 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAutoPlaying((prev) => !prev)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      isAutoPlaying
                        ? "bg-orange-500 text-white shadow-xs"
                        : "bg-[var(--ca-ink)]/5 dark:bg-white/10 text-[var(--ca-ink)] dark:text-white hover:bg-[var(--ca-ink)]/10"
                    }`}
                  >
                    {isAutoPlaying ? <Pause size={12} /> : <Play size={12} />}
                    <span>{isAutoPlaying ? "Pause Loop" : "Auto-Play Loop"}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleControlChange("scrollProgress", 0)}
                  className="p-1.5 rounded-lg border border-[var(--ca-ink)]/15 dark:border-white/10 hover:bg-[var(--ca-ink)]/5 dark:hover:bg-white/5 text-[var(--ca-ink)]/60 dark:text-white/60 transition-colors"
                  title="Reset scroll to 0%"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
