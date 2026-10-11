"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Copy,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Code as CodeIcon,
  Sliders,
} from "lucide-react";
import { CraftComponent } from "@/lib/components-data";
import { ScrubberTrack } from "./ScrubberTrack";
import { MagneticButton } from "./MagneticButton";
import { BubbleText } from "./BubbleText";
import { RadialGradientAnimateCard } from "./RadialGradientAnimateCard";
import { BinaryGrid } from "./BinaryGrid";
import { OverlappingTextHero } from "./OverlappingTextHero";
import { TelescopeHero } from "./TelescopeHero";

interface ComponentSandboxProps {
  component: CraftComponent;
}

type ViewportMode = "desktop" | "tablet" | "mobile";
type CanvasTheme = "dark" | "paper" | "grid" | "dots";
type StageTab = "preview" | "code";

export const ComponentSandbox: React.FC<ComponentSandboxProps> = ({
  component,
}) => {
  const [stageTab, setStageTab] = useState<StageTab>("preview");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>("dark");
  const [remountKey, setRemountKey] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Live state controls initialized from defaultCustomizer
  const [customState, setCustomState] = useState<Record<string, any>>(
    component.defaultCustomizer || {}
  );

  const handleControlChange = (key: string, value: any) => {
    setCustomState((prev) => ({ ...prev, [key]: value }));
  };

  const resetControls = () => {
    setCustomState(component.defaultCustomizer || {});
    setRemountKey((k) => k + 1);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(component.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Canvas background styles
  const getCanvasBgClass = () => {
    switch (canvasTheme) {
      case "dark":
        return "bg-[#0c0d11] text-white border-white/5";
      case "paper":
        return "bg-[#fcfbf9] text-[#191510] border-black/5";
      case "dots":
        return "bg-[#0f1015] text-white [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] border-white/5";
      case "grid":
      default:
        return "bg-[#0b0c10] text-white [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] border-white/5";
    }
  };

  // Viewport container width constraints
  const getViewportWidth = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-[375px]";
      case "tablet":
        return "max-w-[768px]";
      case "desktop":
      default:
        return "w-full";
    }
  };

  // Render the selected interactive component
  const renderLiveComponent = () => {
    switch (component.slug) {
      case "magnetic-button": {
        const btnText = customState.label || customState.text || "Hover Near Me";
        const theme = customState.theme || "amber";
        return (
          <div className="flex flex-col items-center justify-center p-16 gap-4">
            <MagneticButton
              maxDistance={Number(customState.maxDistance || 35)}
              stiffness={Number(customState.stiffness || 160)}
              damping={Number(customState.damping || 12)}
              mass={Number(customState.mass || 0.1)}
              bgClassName="p-16 -m-16 flex items-center justify-center"
              className={
                theme === "amber"
                  ? "bg-[#f59e0b] hover:bg-[#d97706] text-black font-mono font-medium px-8 py-3.5 rounded-xl shadow-md transition-shadow text-xs uppercase tracking-wider"
                  : theme === "cyan"
                  ? "bg-[#06b6d4] hover:bg-[#0891b2] text-black font-mono font-medium px-8 py-3.5 rounded-xl shadow-md transition-shadow text-xs uppercase tracking-wider"
                  : theme === "emerald"
                  ? "bg-[#10b981] hover:bg-[#059669] text-black font-mono font-medium px-8 py-3.5 rounded-xl shadow-md transition-shadow text-xs uppercase tracking-wider"
                  : "bg-white hover:bg-neutral-100 text-black font-mono font-medium px-8 py-3.5 rounded-xl shadow-md transition-shadow text-xs uppercase tracking-wider"
              }
            >
              <span>{btnText}</span>
            </MagneticButton>
            <span className="font-mono text-[11px] opacity-40 text-center tracking-wide">
              Move cursor near the button to trigger elastic spring attraction
            </span>
          </div>
        );
      }

      case "bubble-text":
        return (
          <div className="flex flex-col items-center justify-center p-12 min-h-[280px]">
            <BubbleText
              text={customState.text || "BUBBLE CRAFT"}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight"
            />
            <span className="font-mono text-[11px] opacity-40 mt-8 text-center tracking-wide">
              Hover cursor over each letter for proximity wave displacement
            </span>
          </div>
        );

      case "radial-gradient-card":
        return (
          <div className="flex items-center justify-center p-8 w-full">
            <RadialGradientAnimateCard
              radialGradient={{
                color1: customState.accentColor || "rgba(6, 182, 212, 0.45)",
                size: `${customState.size || 14}rem`,
                shape: "circle",
                opacity: Number(customState.opacity || 0.6),
              }}
              className="w-full max-w-md bg-[#13141a] border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/90">
                    {customState.badge || "PROTOTYPE 04"}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <h3 className="font-mono text-xl font-bold text-white tracking-tight">
                  {customState.title || "Neural Synthesizer"}
                </h3>
                <p className="font-sans text-xs text-white/70 leading-relaxed">
                  {customState.description ||
                    "Real-time procedural mesh distortion with low GPU latency and multi-threaded computation."}
                </p>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-white/50">Hover to illuminate spotlight</span>
                  <span className="text-cyan-400 font-medium">Explore &rarr;</span>
                </div>
              </div>
            </RadialGradientAnimateCard>
          </div>
        );

      case "binary-grid":
        return (
          <div className="w-full flex items-center justify-center p-4">
            <BinaryGrid
              circleSize={Number(customState.circleSize || 85)}
              stiffness={Number(customState.stiffness || 300)}
              damping={Number(customState.damping || 30)}
            />
          </div>
        );

      case "overlapping-text-hero":
        return (
          <div className="w-full overflow-hidden rounded-2xl border border-white/10 shadow-inner">
            <div className="h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
              <OverlappingTextHero
                title={customState.title || "JAYANT POTDAR"}
                subTitle1={customState.subTitle1 || "B.TECH"}
                subTitle2={customState.subTitle2 || "FULL STACK DEVELOPER"}
                textColor={customState.textColor || "#db4b29"}
                bgColor={customState.bgColor || "#e3e2dd"}
                compactMode={true}
              />
            </div>
            <div className="p-2.5 bg-black/90 text-white/70 font-mono text-[11px] text-center border-t border-white/10">
              Scroll inside the window to trigger the mask reveal and cutout translation
            </div>
          </div>
        );

      case "telescope-hero":
        return (
          <div className="w-full overflow-hidden rounded-2xl border border-white/10 shadow-inner">
            <div className="h-[440px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
              <TelescopeHero
                quote={
                  customState.quote ||
                  "Life is either a daring adventure or nothing at all"
                }
                compactMode={true}
              />
            </div>
            <div className="p-2.5 bg-black/90 text-white/70 font-mono text-[11px] text-center border-t border-white/10">
              Scroll inside the window to trigger 3D focal space perspective
            </div>
          </div>
        );

      default:
        return <div>Preview not available</div>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* REACTBITS STYLE STAGE CONTAINER */}
      <div className="w-full rounded-2xl border border-[var(--ca-ink)]/15 bg-white/70 shadow-sm overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[var(--ca-surface)] border-b border-[var(--ca-ink)]/10 text-xs font-mono">
          {/* Left: Preview / Code Tabs */}
          <div className="flex items-center gap-1 bg-[var(--ca-ink)]/5 p-1 rounded-lg">
            <button
              onClick={() => setStageTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                stageTab === "preview"
                  ? "bg-white text-[var(--ca-ink)] shadow-sm"
                  : "text-[var(--ca-ink)]/60 hover:text-[var(--ca-ink)]"
              }`}
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setStageTab("code")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                stageTab === "code"
                  ? "bg-white text-[var(--ca-ink)] shadow-sm"
                  : "text-[var(--ca-ink)]/60 hover:text-[var(--ca-ink)]"
              }`}
            >
              <CodeIcon size={13} />
              <span>Code</span>
            </button>
          </div>

          {/* Right: Actions (Theme, Viewport, Reload, Copy) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Viewport Toggles (only relevant in preview) */}
            {stageTab === "preview" && (
              <div className="flex items-center bg-[var(--ca-ink)]/5 p-0.5 rounded-lg">
                <button
                  onClick={() => setViewport("desktop")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewport === "desktop"
                      ? "bg-white text-[var(--ca-ink)] shadow-sm"
                      : "text-[var(--ca-ink)]/50 hover:text-[var(--ca-ink)]"
                  }`}
                  title="Desktop View"
                >
                  <Monitor size={14} />
                </button>
                <button
                  onClick={() => setViewport("tablet")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewport === "tablet"
                      ? "bg-white text-[var(--ca-ink)] shadow-sm"
                      : "text-[var(--ca-ink)]/50 hover:text-[var(--ca-ink)]"
                  }`}
                  title="Tablet View"
                >
                  <Tablet size={14} />
                </button>
                <button
                  onClick={() => setViewport("mobile")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewport === "mobile"
                      ? "bg-white text-[var(--ca-ink)] shadow-sm"
                      : "text-[var(--ca-ink)]/50 hover:text-[var(--ca-ink)]"
                  }`}
                  title="Mobile View"
                >
                  <Smartphone size={14} />
                </button>
              </div>
            )}

            {/* Canvas Theme Selector */}
            {stageTab === "preview" && (
              <div className="flex items-center gap-1 bg-[var(--ca-ink)]/5 p-1 rounded-lg">
                {(["dark", "paper", "grid", "dots"] as CanvasTheme[]).map(
                  (theme) => (
                    <button
                      key={theme}
                      onClick={() => setCanvasTheme(theme)}
                      className={`w-4 h-4 rounded-full border transition-transform ${
                        canvasTheme === theme
                          ? "scale-110 border-[var(--ca-orange)] shadow-sm"
                          : "border-black/20 opacity-60 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor:
                          theme === "dark"
                            ? "#0c0d11"
                            : theme === "paper"
                            ? "#fcfbf9"
                            : theme === "dots"
                            ? "#1e2029"
                            : "#2a2d39",
                      }}
                      title={`Theme: ${theme}`}
                    />
                  )
                )}
              </div>
            )}

            {/* Reload Trigger */}
            <button
              onClick={resetControls}
              className="p-1.5 rounded-lg border border-[var(--ca-ink)]/15 text-[var(--ca-ink)]/70 hover:text-[var(--ca-ink)] hover:bg-[var(--ca-ink)]/5 transition-colors"
              title="Reload preview"
            >
              <RotateCcw size={13} />
            </button>

            {/* Copy Code Shortcut */}
            <button
              onClick={handleCopyCode}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors border ${
                copiedCode
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                  : "bg-white border-[var(--ca-ink)]/15 text-[var(--ca-ink)] hover:bg-[var(--ca-ink)]/5"
              }`}
            >
              {copiedCode ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedCode ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Stage Viewport */}
        {stageTab === "preview" ? (
          <div className="p-4 sm:p-8 flex items-center justify-center overflow-hidden min-h-[380px] bg-neutral-950/5">
            <div
              key={remountKey}
              className={`transition-all duration-300 w-full flex items-center justify-center rounded-xl p-4 sm:p-8 min-h-[340px] shadow-sm border ${getViewportWidth()} ${getCanvasBgClass()}`}
            >
              {renderLiveComponent()}
            </div>
          </div>
        ) : (
          /* Code View inside Stage */
          <div className="p-4 bg-[#0d0f14] text-white/90 font-mono text-xs max-h-[500px] overflow-auto scrollbar-thin">
            <pre className="m-0 leading-relaxed">
              <code>{component.code}</code>
            </pre>
          </div>
        )}
      </div>

      {/* CUSTOMIZE DRAWER / PANEL (with ReactBits Scrubber Tracks) */}
      <div className="w-full rounded-2xl border border-[var(--ca-ink)]/15 bg-white/70 p-6 shadow-sm flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--ca-ink)]/10">
          <div className="flex items-center gap-2">
            <Sliders size={15} className="text-[var(--ca-orange)]" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]">
              Customize
            </h3>
          </div>
          <button
            onClick={resetControls}
            className="text-[11px] font-mono text-[var(--ca-ink)]/50 hover:text-[var(--ca-ink)] transition-colors"
          >
            Reset Defaults
          </button>
        </div>

        {/* Controls Matrix with Scrubber Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {component.slug === "magnetic-button" && (
            <>
              {/* Button text */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 font-medium">
                  Label Text
                </label>
                <input
                  type="text"
                  value={customState.label || customState.text || "Hover Near Me"}
                  onChange={(e) => handleControlChange("label", e.target.value)}
                  className="px-3 py-1.5 text-xs font-mono bg-white border border-[var(--ca-ink)]/15 rounded-lg shadow-sm focus:outline-none focus:border-[var(--ca-orange)]"
                />
              </div>

              {/* Theme Selector */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 font-medium">
                  Colorway
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-[var(--ca-ink)]/5 border border-[var(--ca-ink)]/10 text-[11px] font-mono">
                  {(["amber", "cyan", "emerald", "white"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleControlChange("theme", t)}
                      className={`py-1 rounded capitalize transition-all ${
                        (customState.theme || "amber") === t
                          ? "bg-white text-[var(--ca-ink)] font-semibold shadow-sm"
                          : "text-[var(--ca-ink)]/60 hover:text-[var(--ca-ink)]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrubber: Max Pull Distance */}
              <ScrubberTrack
                label="Max Pull Distance"
                value={customState.maxDistance || 35}
                min={10}
                max={90}
                step={5}
                unit="px"
                onChange={(val) => handleControlChange("maxDistance", val)}
              />

              {/* Scrubber: Spring Stiffness */}
              <ScrubberTrack
                label="Spring Stiffness"
                value={customState.stiffness || 160}
                min={50}
                max={400}
                step={10}
                onChange={(val) => handleControlChange("stiffness", val)}
              />

              {/* Scrubber: Spring Damping */}
              <ScrubberTrack
                label="Spring Damping"
                value={customState.damping || 12}
                min={4}
                max={35}
                step={1}
                onChange={(val) => handleControlChange("damping", val)}
              />

              {/* Scrubber: Simulated Mass */}
              <ScrubberTrack
                label="Simulated Mass"
                value={customState.mass || 0.1}
                min={0.05}
                max={0.8}
                step={0.05}
                onChange={(val) => handleControlChange("mass", val)}
              />
            </>
          )}

          {component.slug === "bubble-text" && (
            <>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 font-medium">
                  Display String
                </label>
                <input
                  type="text"
                  value={customState.text || "BUBBLE CRAFT"}
                  onChange={(e) => handleControlChange("text", e.target.value)}
                  className="px-3 py-1.5 text-xs font-mono bg-white border border-[var(--ca-ink)]/15 rounded-lg shadow-sm focus:outline-none focus:border-[var(--ca-orange)]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 font-medium">
                  Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["DISCOVER", "INTERACTIVE", "CREATIVE", "ALGORITHM"].map(
                    (str) => (
                      <button
                        key={str}
                        onClick={() => handleControlChange("text", str)}
                        className="px-2 py-1 text-[11px] font-mono border border-[var(--ca-ink)]/15 hover:border-[var(--ca-ink)]/40 rounded-md bg-white transition-colors"
                      >
                        {str}
                      </button>
                    )
                  )}
                </div>
              </div>
            </>
          )}

          {component.slug === "radial-gradient-card" && (
            <>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 font-medium">
                  Title
                </label>
                <input
                  type="text"
                  value={customState.title || "Neural Synthesizer"}
                  onChange={(e) => handleControlChange("title", e.target.value)}
                  className="px-3 py-1.5 text-xs font-mono bg-white border border-[var(--ca-ink)]/15 rounded-lg shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 font-medium">
                  Badge
                </label>
                <input
                  type="text"
                  value={customState.badge || "PROTOTYPE 04"}
                  onChange={(e) => handleControlChange("badge", e.target.value)}
                  className="px-3 py-1.5 text-xs font-mono bg-white border border-[var(--ca-ink)]/15 rounded-lg shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 font-medium">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customState.accentColor || "#06b6d4"}
                    onChange={(e) =>
                      handleControlChange("accentColor", e.target.value)
                    }
                    className="w-7 h-7 rounded border border-[var(--ca-ink)]/20 cursor-pointer"
                  />
                  <span className="font-mono text-xs tabular-nums text-[var(--ca-ink)]/70">
                    {customState.accentColor || "#06b6d4"}
                  </span>
                </div>
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
                value={Number(customState.opacity || 0.6)}
                min={0.1}
                max={1.0}
                step={0.05}
                onChange={(val) => handleControlChange("opacity", val)}
              />
            </>
          )}

          {component.slug === "binary-grid" && (
            <>
              <ScrubberTrack
                label="Reveal Radius"
                value={customState.circleSize || 85}
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

          {component.slug === "overlapping-text-hero" && (
            <>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 font-medium">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={customState.title || "JAYANT POTDAR"}
                  onChange={(e) => handleControlChange("title", e.target.value)}
                  className="px-3 py-1.5 text-xs font-mono bg-white border border-[var(--ca-ink)]/15 rounded-lg shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 font-medium">
                  Subtitle 1
                </label>
                <input
                  type="text"
                  value={customState.subTitle1 || "B.TECH"}
                  onChange={(e) =>
                    handleControlChange("subTitle1", e.target.value)
                  }
                  className="px-3 py-1.5 text-xs font-mono bg-white border border-[var(--ca-ink)]/15 rounded-lg shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 font-medium">
                  Subtitle 2
                </label>
                <input
                  type="text"
                  value={customState.subTitle2 || "FULL STACK DEVELOPER"}
                  onChange={(e) =>
                    handleControlChange("subTitle2", e.target.value)
                  }
                  className="px-3 py-1.5 text-xs font-mono bg-white border border-[var(--ca-ink)]/15 rounded-lg shadow-sm"
                />
              </div>
            </>
          )}

          {component.slug === "telescope-hero" && (
            <div className="flex flex-col gap-2 md:col-span-3">
              <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 font-medium">
                Quote Statement
              </label>
              <input
                type="text"
                value={
                  customState.quote ||
                  "Life is either a daring adventure or nothing at all"
                }
                onChange={(e) => handleControlChange("quote", e.target.value)}
                className="px-3 py-1.5 text-xs font-mono bg-white border border-[var(--ca-ink)]/15 rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
