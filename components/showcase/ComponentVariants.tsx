"use client";

import React, { useState } from "react";
import { Copy, Check, Code as CodeIcon, Eye, Play, Sparkles } from "lucide-react";
import { CraftComponent } from "@/lib/components-data";
import { highlightLine } from "./CodeViewer";

interface ComponentVariantsProps {
  component: CraftComponent;
}

interface VariantCardProps {
  id: string;
  badge: string;
  title: string;
  description: string;
  presetProps: Record<string, any>;
  codeSnippet: string;
  children: React.ReactNode;
}

const AceternityVariantCard: React.FC<VariantCardProps> = ({
  badge,
  title,
  description,
  presetProps,
  codeSnippet,
  children,
}) => {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy code snippet", err);
    }
  };

  const handleTryInPreview = () => {
    window.dispatchEvent(
      new CustomEvent("TRY_COMPONENT_VARIANT", {
        detail: { props: presetProps },
      })
    );
  };

  const codeLines = codeSnippet.trim().split("\n");

  return (
    <article className="w-full flex flex-col rounded-2xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white/90 dark:bg-[#121316]/90 shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:px-6 bg-[#faf8f4]/80 dark:bg-[#15161b]/80 border-b border-[var(--ca-ink)]/10 dark:border-white/10">
        <div className="flex flex-col gap-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-[var(--ca-orange)]/10 text-[var(--ca-orange)] border border-[var(--ca-orange)]/25">
              {badge}
            </span>
            <h3 className="font-mono text-base sm:text-lg font-bold text-[var(--ca-ink)] dark:text-white">
              {title}
            </h3>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[var(--ca-ink)]/70 dark:text-neutral-400">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTryInPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-[var(--ca-orange)] text-white shadow-xs hover:opacity-90 transition-all"
            title="Load preset into main sandbox preview"
          >
            <Play size={12} fill="currentColor" />
            <span>Try in Preview</span>
          </button>

          <button
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all ${
              showCode
                ? "bg-[var(--ca-ink)]/10 dark:bg-white/10 border-[var(--ca-ink)]/20 dark:border-white/20 font-bold"
                : "bg-white dark:bg-neutral-900 border-[var(--ca-ink)]/15 dark:border-white/10 text-[var(--ca-ink)] dark:text-white hover:bg-[var(--ca-ink)]/5"
            }`}
          >
            <CodeIcon size={12} />
            <span>{showCode ? "Hide Code" : "Code"}</span>
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium border shadow-xs transition-all ${
              copied
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold"
                : "bg-white dark:bg-neutral-900 border-[var(--ca-ink)]/15 dark:border-white/10 text-[var(--ca-ink)] dark:text-white hover:bg-[var(--ca-ink)]/5"
            }`}
            title="Copy usage snippet"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Static Visual Representation Card */}
      <div className="relative w-full min-h-[220px] sm:min-h-[260px] bg-[#0c0d12] flex items-center justify-center p-6 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative z-10 w-full flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* Expandable Code Snippet */}
      {showCode && (
        <div className="bg-[#0d0f14] border-t border-[var(--ca-ink)]/10 dark:border-white/10 overflow-hidden">
          <div className="p-4 max-h-[360px] overflow-auto select-text font-mono text-xs leading-6 text-neutral-300">
            {codeLines.map((line, idx) => (
              <div key={idx} className="flex min-w-full hover:bg-white/[0.04]">
                <span className="w-10 select-none text-neutral-600 text-right pr-4 shrink-0 tabular-nums">
                  {idx + 1}
                </span>
                <span className="flex-1 whitespace-pre">{highlightLine(line)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export const ComponentVariants: React.FC<ComponentVariantsProps> = ({
  component,
}) => {
  const normalizedSlug =
    component.slug === "radial-gradient-animate-card"
      ? "radial-gradient-card"
      : component.slug;

  return (
    <section className="w-full flex flex-col gap-6 my-10">
      {/* Section Header */}
      <div className="flex flex-col gap-1 border-b border-[var(--ca-ink)]/10 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-[var(--ca-orange)]/10 border border-[var(--ca-orange)]/25 text-[var(--ca-orange)] font-mono text-xs font-bold uppercase">
            [01 // VARIATIONS]
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ca-ink)] dark:text-white font-sans">
            Examples & Variations
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-sans text-[var(--ca-ink)]/70 dark:text-neutral-400 mt-1">
          Explore static visual presets and configurations. Click &ldquo;Try in Preview&rdquo; to load any configuration directly into the live sandbox above.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {/* OVERLAPPING TEXT HERO VARIANTS */}
        {normalizedSlug === "overlapping-text-hero" && (
          <>
            <AceternityVariantCard
              id="spiderman-hero"
              badge="VARIANT 01 // COMIC HERO"
              title="Spider-Man Cinematic Cutout"
              description="High-contrast comic hero banner featuring Six Caps display typography, dual halftone aperture masks, and responsive frame contraction."
              presetProps={{
                title: "SPIDER-MAN",
                subTitle1: "FRIENDLY NEIGHBORHOOD",
                subTitle1Color: "#2563eb",
                subTitle2: "WEB-SLINGER",
                subTitle2Color: "#dc2626",
                imgPath: "/sipderman.png",
                textColor: "#dc2626",
                bgColor: "#e2e4e9",
              }}
              codeSnippet={`<OverlappingTextHero
  title="SPIDER-MAN"
  subTitle1="FRIENDLY NEIGHBORHOOD"
  subTitle1Color="#2563eb"
  subTitle2="WEB-SLINGER"
  subTitle2Color="#dc2626"
  imgPath="/sipderman.png"
  textColor="#dc2626"
  bgColor="#e2e4e9"
/>`}
            >
              <div className="relative w-full max-w-xl h-44 rounded-xl bg-[#e2e4e9] p-4 flex flex-col justify-between overflow-hidden shadow-inner border border-neutral-300">
                <div className="font-sixCap text-7xl text-[#dc2626] tracking-tight leading-none">
                  SPIDER-MAN
                </div>
                <div className="flex justify-between font-inter text-xs font-semibold">
                  <span className="text-[#2563eb]">FRIENDLY NEIGHBORHOOD</span>
                  <span className="text-[#dc2626]">WEB-SLINGER</span>
                </div>
                <img
                  src="/sipderman.png"
                  alt="Spider-Man"
                  className="absolute right-6 -bottom-4 h-36 object-contain pointer-events-none"
                />
              </div>
            </AceternityVariantCard>

            <AceternityVariantCard
              id="portfolio-hero"
              badge="VARIANT 02 // PERSONAL PORTFOLIO"
              title="Developer Portfolio Hero"
              description="Warm editorial portfolio header with full-name typography, qualification subtitle flags, and personal cutout image."
              presetProps={{
                title: "JAYANT POTDAR",
                subTitle1: "B.TECH",
                subTitle1Color: "#475569",
                subTitle2: "FULL STACK WEB DEVELOPER",
                subTitle2Color: "#dc2626",
                imgPath: "/Profile-removebg.png",
                textColor: "#db4b29",
                bgColor: "#e3e2dd",
              }}
              codeSnippet={`<OverlappingTextHero
  title="JAYANT POTDAR"
  subTitle1="B.TECH"
  subTitle1Color="#475569"
  subTitle2="FULL STACK WEB DEVELOPER"
  subTitle2Color="#dc2626"
  imgPath="/Profile-removebg.png"
  textColor="#db4b29"
  bgColor="#e3e2dd"
/>`}
            >
              <div className="relative w-full max-w-xl h-44 rounded-xl bg-[#e3e2dd] p-4 flex flex-col justify-between overflow-hidden shadow-inner border border-neutral-300">
                <div className="font-sixCap text-7xl text-[#db4b29] tracking-tight leading-none">
                  JAYANT POTDAR
                </div>
                <div className="flex justify-between font-inter text-xs font-semibold">
                  <span className="text-[#475569]">B.TECH</span>
                  <span className="text-[#dc2626]">FULL STACK WEB DEVELOPER</span>
                </div>
                <img
                  src="/Profile-removebg.png"
                  alt="Jayant Potdar"
                  className="absolute right-6 -bottom-4 h-36 object-contain pointer-events-none"
                />
              </div>
            </AceternityVariantCard>

            <AceternityVariantCard
              id="dark-knight-hero"
              badge="VARIANT 03 // NEO-NOIR"
              title="Dark Knight Neo-Noir"
              description="Deep slate monochrome canvas with high-voltage amber accents for dramatic nighttime landing pages."
              presetProps={{
                title: "BATMAN",
                subTitle1: "DARK KNIGHT",
                subTitle1Color: "#eab308",
                subTitle2: "GOTHAM PROTECTOR",
                subTitle2Color: "#64748b",
                imgPath: "/sipderman.png",
                textColor: "#0f172a",
                bgColor: "#cbd5e1",
              }}
              codeSnippet={`<OverlappingTextHero
  title="BATMAN"
  subTitle1="DARK KNIGHT"
  subTitle1Color="#eab308"
  subTitle2="GOTHAM PROTECTOR"
  subTitle2Color="#64748b"
  imgPath="/sipderman.png"
  textColor="#0f172a"
  bgColor="#cbd5e1"
/>`}
            >
              <div className="relative w-full max-w-xl h-44 rounded-xl bg-[#cbd5e1] p-4 flex flex-col justify-between overflow-hidden shadow-inner border border-neutral-400">
                <div className="font-sixCap text-7xl text-[#0f172a] tracking-tight leading-none">
                  BATMAN
                </div>
                <div className="flex justify-between font-inter text-xs font-semibold">
                  <span className="text-[#eab308]">DARK KNIGHT</span>
                  <span className="text-[#64748b]">GOTHAM PROTECTOR</span>
                </div>
              </div>
            </AceternityVariantCard>
          </>
        )}

        {/* TELESCOPE HERO VARIANTS */}
        {normalizedSlug === "telescope-hero" && (
          <>
            <AceternityVariantCard
              id="alpine-telescope"
              badge="VARIANT 01 // NATURE PANORAMA"
              title="Alpine Vista Telescope"
              description="3D camera-depth flight through layered perspective frames into an expansive snow-capped mountain range."
              presetProps={{
                quote: "Life is either a daring adventure or nothing at all",
                bgImage: "/mountains-wallpaper.jpg",
              }}
              codeSnippet={`<TelescopeHero
  quote="Life is either a daring adventure or nothing at all"
  bgImage="/mountains-wallpaper.jpg"
/>`}
            >
              <div className="relative w-full max-w-xl h-44 rounded-xl overflow-hidden border border-white/20 shadow-xl flex items-center justify-center">
                <img
                  src="/mountains-wallpaper.jpg"
                  alt="Alpine Vista"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                <div className="relative z-10 font-bebasNeue text-3xl sm:text-4xl text-white text-center font-bold tracking-wide px-4">
                  Life is either a daring adventure or nothing at all
                </div>
              </div>
            </AceternityVariantCard>

            <AceternityVariantCard
              id="cosmic-telescope"
              badge="VARIANT 02 // COSMIC EXPLORATION"
              title="Deep Space Telescope"
              description="Astronomical parallax telescope navigating through starry deep space into cosmic nebula formations."
              presetProps={{
                quote: "Somewhere, something incredible is waiting to be known",
                bgImage: "https://images.unsplash.com/photo-1618083707368-b3823daa2726?q=80&w=1470&auto=format&fit=crop",
              }}
              codeSnippet={`<TelescopeHero
  quote="Somewhere, something incredible is waiting to be known"
  bgImage="https://images.unsplash.com/photo-1618083707368-b3823daa2726?q=80&w=1470&auto=format&fit=crop"
/>`}
            >
              <div className="relative w-full max-w-xl h-44 rounded-xl overflow-hidden border border-white/20 shadow-xl flex items-center justify-center bg-indigo-950">
                <img
                  src="https://images.unsplash.com/photo-1618083707368-b3823daa2726?q=80&w=1470&auto=format&fit=crop"
                  alt="Cosmic Starfield"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 font-bebasNeue text-3xl sm:text-4xl text-white text-center font-bold tracking-wide px-4">
                  Somewhere, something incredible is waiting to be known
                </div>
              </div>
            </AceternityVariantCard>
          </>
        )}

        {/* BINARY GRID VARIANTS */}
        {normalizedSlug === "binary-grid" && (
          <>
            <AceternityVariantCard
              id="matrix-spotlight"
              badge="VARIANT 01 // CYBERPUNK LAB"
              title="Decrypted Cyber Matrix"
              description="Precision cursor aperture revealing hidden hacker alphanumeric streams with dynamic radial feathering."
              presetProps={{
                circleSize: 60,
                stiffness: 300,
                damping: 30,
              }}
              codeSnippet={`<BinaryGrid
  circleSize={60}
  stiffness={300}
  damping={30}
/>`}
            >
              <div className="relative w-full max-w-xl h-44 rounded-xl bg-neutral-950 border border-neutral-800 p-4 font-mono text-[11px] text-neutral-600 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-28 w-28 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <span className="text-cyan-300 font-bold text-xs tracking-wider">
                      H A P P Y
                    </span>
                  </div>
                </div>
                <div className="pointer-events-none select-none opacity-40 break-all leading-4">
                  01001000 01000001 01010000 01010000 01011001 01011111 01000011 01001111 01000100 01001001 01001110 01000111
                </div>
              </div>
            </AceternityVariantCard>

            <AceternityVariantCard
              id="broad-beam-grid"
              badge="VARIANT 02 // SEARCHLIGHT APERTURE"
              title="Broad Tactical Beam"
              description="Extra-wide cursor radius with softer spring damping for gentle organic exploration."
              presetProps={{
                circleSize: 110,
                stiffness: 220,
                damping: 22,
              }}
              codeSnippet={`<BinaryGrid
  circleSize={110}
  stiffness={220}
  damping={22}
/>`}
            >
              <div className="relative w-full max-w-xl h-44 rounded-xl bg-neutral-950 border border-neutral-800 p-4 font-mono text-[11px] text-neutral-600 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-36 w-36 rounded-full bg-white/10 border border-white/30 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                    <span className="text-white font-bold text-xs tracking-wider">
                      SPOTLIGHT
                    </span>
                  </div>
                </div>
                <div className="pointer-events-none select-none opacity-40 break-all leading-4">
                  01001000 01000001 01010000 01010000 01011001 01011111 01000011 01001111 01000100 01001001 01001110 01000111
                </div>
              </div>
            </AceternityVariantCard>
          </>
        )}

        {/* BUBBLE TEXT VARIANTS */}
        {normalizedSlug === "bubble-text" && (
          <>
            <AceternityVariantCard
              id="indigo-bubble"
              badge="VARIANT 01 // INTERACTIVE TITLE"
              title="Indigo Proximity Wave"
              description="Dynamic Raleway character weight modulation calculating cursor distance with 900-700-500-100 falloffs."
              presetProps={{
                text: "Bbbbbbble text",
              }}
              codeSnippet={`<BubbleText text="Bbbbbbble text" />`}
            >
              <div className="w-full max-w-xl h-44 rounded-xl bg-[#0e1017] border border-indigo-900/40 p-4 flex items-center justify-center">
                <span className="font-raleway text-4xl sm:text-5xl font-thin text-indigo-300 tracking-wide">
                  <span>B</span>
                  <span className="font-black text-white">b</span>
                  <span className="font-bold text-indigo-200">b</span>
                  <span className="font-medium text-indigo-300">b</span>
                  <span className="font-thin text-indigo-400">b</span>
                  <span>bble text</span>
                </span>
              </div>
            </AceternityVariantCard>

            <AceternityVariantCard
              id="portfolio-bubble"
              badge="VARIANT 02 // EDITORIAL ACCENT"
              title="Headline Display Wave"
              description="Creative headline lettering providing tactile typographic feedback on mouse proximity."
              presetProps={{
                text: "Creative Portfolio",
              }}
              codeSnippet={`<BubbleText text="Creative Portfolio" />`}
            >
              <div className="w-full max-w-xl h-44 rounded-xl bg-[#0e1017] border border-indigo-900/40 p-4 flex items-center justify-center">
                <span className="font-raleway text-3xl sm:text-4xl font-thin text-indigo-300 tracking-wide">
                  <span>C</span>
                  <span className="font-black text-white">r</span>
                  <span className="font-bold text-indigo-200">e</span>
                  <span className="font-medium text-indigo-300">a</span>
                  <span>tive Portfolio</span>
                </span>
              </div>
            </AceternityVariantCard>
          </>
        )}

        {/* MAGNETIC BUTTON VARIANTS */}
        {normalizedSlug === "magnetic-button" && (
          <>
            <AceternityVariantCard
              id="dashed-magnet"
              badge="VARIANT 01 // CALL TO ACTION"
              title="Dashed Target Boundary"
              description="Physics-driven attraction button revealing a dashed boundary ring on hover with snappy spring mechanics."
              presetProps={{
                children: "Hover Me",
                maxDistance: 30,
                stiffness: 150,
                damping: 10,
                mass: 0.1,
              }}
              codeSnippet={`<MagneticButton
  maxDistance={30}
  stiffness={150}
  damping={10}
  mass={0.1}
>
  Hover Me
</MagneticButton>`}
            >
              <div className="w-full max-w-xl h-44 rounded-xl bg-[#0a0a0c] border border-neutral-800 p-4 flex items-center justify-center">
                <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-900 p-2">
                  <div className="rounded-xl bg-zinc-200 px-6 py-3 font-mono text-xs font-bold text-zinc-900 shadow-md">
                    Hover Me
                  </div>
                </div>
              </div>
            </AceternityVariantCard>

            <AceternityVariantCard
              id="heavy-pull-magnet"
              badge="VARIANT 02 // FIRM TRAJECTORY"
              title="Heavy Magnet Pull"
              description="Higher magnetic pull distance with stiffer spring damping for a weighty, authoritative feel."
              presetProps={{
                children: "Follow Cursor",
                maxDistance: 50,
                stiffness: 260,
                damping: 18,
                mass: 0.15,
              }}
              codeSnippet={`<MagneticButton
  maxDistance={50}
  stiffness={260}
  damping={18}
  mass={0.15}
>
  Follow Cursor
</MagneticButton>`}
            >
              <div className="w-full max-w-xl h-44 rounded-xl bg-[#0a0a0c] border border-neutral-800 p-4 flex items-center justify-center">
                <div className="rounded-2xl border-2 border-dashed border-zinc-500 bg-zinc-900 p-2.5">
                  <div className="rounded-xl bg-zinc-100 px-7 py-3.5 font-mono text-xs font-bold text-zinc-900 shadow-lg">
                    Follow Cursor
                  </div>
                </div>
              </div>
            </AceternityVariantCard>
          </>
        )}

        {/* RADIAL GRADIENT CARD VARIANTS */}
        {normalizedSlug === "radial-gradient-card" && (
          <>
            <AceternityVariantCard
              id="cobalt-radial"
              badge="VARIANT 01 // SAAS FEATURE"
              title="Cobalt Electric Spotlight"
              description="Smooth cursor-tracking cobalt radial glow across deep obsidian surface with zero layout re-renders."
              presetProps={{
                color1: "rgba(59, 130, 246)",
                shape: "circle",
                size: "10rem",
                opacity: 0.5,
              }}
              codeSnippet={`<RadialGradientAnimateCard
  radialGradient={{
    color1: "rgba(59, 130, 246)",
    color2: "transparent",
    shape: "circle",
    size: "10rem",
    opacity: 0.5,
  }}
>
  <div className="flex flex-col gap-2">
    <h4 className="text-xl font-bold text-white">Enterprise Cloud</h4>
    <p className="text-xs text-neutral-400">Reactive cursor lighting with zero re-renders.</p>
  </div>
</RadialGradientAnimateCard>`}
            >
              <div className="relative w-full max-w-sm rounded-xl border border-blue-500/30 bg-[#090d16] p-6 shadow-2xl overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle 8rem at 70% 40%, rgba(59, 130, 246, 0.4), transparent)",
                  }}
                />
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                  Feature Spotlight
                </span>
                <h4 className="mt-1 text-lg font-bold text-white">
                  Enterprise Cloud
                </h4>
                <p className="mt-1 text-xs text-neutral-400">
                  Reactive cursor spotlight projection across obsidian cards.
                </p>
              </div>
            </AceternityVariantCard>

            <AceternityVariantCard
              id="magenta-radial"
              badge="VARIANT 02 // GAMING & CREATIVE"
              title="Cyberpunk Magenta Beam"
              description="Vibrant high-contrast magenta and violet radial illumination for gaming platforms and web3 showcases."
              presetProps={{
                color1: "rgba(236, 72, 153)",
                shape: "ellipse",
                size: "14rem",
                opacity: 0.65,
              }}
              codeSnippet={`<RadialGradientAnimateCard
  radialGradient={{
    color1: "rgba(236, 72, 153)",
    color2: "transparent",
    shape: "ellipse",
    size: "14rem",
    opacity: 0.65,
  }}
>
  <div className="flex flex-col gap-2">
    <h4 className="text-xl font-bold text-white">Cyberpunk Arcade</h4>
    <p className="text-xs text-neutral-400">High-contrast magenta beam tracking.</p>
  </div>
</RadialGradientAnimateCard>`}
            >
              <div className="relative w-full max-w-sm rounded-xl border border-pink-500/30 bg-[#090d16] p-6 shadow-2xl overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 10rem at 30% 50%, rgba(236, 72, 153, 0.4), transparent)",
                  }}
                />
                <span className="text-[10px] font-mono text-pink-400 font-bold uppercase">
                  Creative Canvas
                </span>
                <h4 className="mt-1 text-lg font-bold text-white">
                  Cyberpunk Arcade
                </h4>
                <p className="mt-1 text-xs text-neutral-400">
                  High-contrast magenta illumination with elliptical aperture.
                </p>
              </div>
            </AceternityVariantCard>
          </>
        )}
      </div>
    </section>
  );
};
