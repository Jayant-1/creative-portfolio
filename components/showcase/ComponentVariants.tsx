"use client";

import React, { useState } from "react";
import { Copy, Check, Code as CodeIcon, Eye } from "lucide-react";
import { CraftComponent } from "@/lib/components-data";
import { MagneticButton } from "./MagneticButton";
import { BubbleText } from "./BubbleText";
import { RadialGradientAnimateCard } from "./RadialGradientAnimateCard";
import { BinaryGrid } from "./BinaryGrid";
import { OverlappingTextHero } from "./OverlappingTextHero";
import { TelescopeHero } from "./TelescopeHero";
import { highlightLine } from "./CodeViewer";

interface ComponentVariantsProps {
  component: CraftComponent;
}

interface ExampleCardProps {
  id: string;
  badge: string;
  title: string;
  description: string;
  codeSnippet: string;
  children: React.ReactNode;
}

const ExampleCard: React.FC<ExampleCardProps> = ({
  badge,
  title,
  description,
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
      console.error("Failed to copy code snippet", err);
    }
  };

  const codeLines = codeSnippet.trim().split("\n");

  return (
    <article className="flex flex-col rounded-2xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white/80 dark:bg-[#121316] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Card Header */}
      <div className="flex flex-col gap-1 p-5 border-b border-[var(--ca-ink)]/10 dark:border-white/10 bg-[#faf8f4]/60 dark:bg-[#15161b]/60">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-[var(--ca-ink)]/5 dark:bg-white/10 text-[var(--ca-orange)] border border-[var(--ca-ink)]/10 dark:border-white/10">
            {badge}
          </span>
          <button
            onClick={() => setShowCode((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
              showCode
                ? "bg-[var(--ca-orange)] text-white shadow-xs"
                : "bg-[var(--ca-ink)]/5 dark:bg-white/10 text-[var(--ca-ink)]/70 dark:text-neutral-300 hover:bg-[var(--ca-ink)]/10"
            }`}
          >
            {showCode ? <Eye size={12} /> : <CodeIcon size={12} />}
            <span>{showCode ? "Hide Code" : "View Code"}</span>
          </button>
        </div>
        <h3 className="font-mono text-base font-bold text-[var(--ca-ink)] dark:text-white mt-1">
          {title}
        </h3>
        <p className="font-sans text-xs text-[var(--ca-ink)]/70 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Live Interactive Mini-Preview */}
      <div className="relative p-4 sm:p-6 bg-[#0c0d12] flex items-center justify-center overflow-hidden min-h-[260px]">
        {/* Subtle dot background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative z-10 w-full flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* Expandable Code Snippet */}
      {showCode && (
        <div className="border-t border-[var(--ca-ink)]/10 dark:border-white/10 bg-[#0d0f14] flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-[#14161f] border-b border-white/10 text-xs font-mono">
            <span className="text-neutral-400 text-[11px]">Usage Snippet</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {copied ? (
                <Check size={12} className="text-emerald-400" />
              ) : (
                <Copy size={12} />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <div className="p-3 max-h-[220px] overflow-auto scrollbar-thin select-text font-mono text-[11px] leading-5 text-neutral-300">
            {codeLines.map((line, idx) => (
              <div key={idx} className="flex min-w-full">
                <span className="w-8 select-none text-neutral-600 text-right pr-3 shrink-0 tabular-nums">
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
    /* XPath: .../main/div/section[1] */
    <section className="w-full flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col gap-1 border-b border-[var(--ca-ink)]/10 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-[var(--ca-orange)]/10 border border-[var(--ca-orange)]/25 text-[var(--ca-orange)] font-mono text-xs font-bold uppercase">
            [01 // VARIATIONS]
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ca-ink)] dark:text-white font-sans">
            Real-World Examples
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-sans text-[var(--ca-ink)]/70 dark:text-neutral-400 mt-1">
          Production patterns, responsive presets, and motion tunings across varying use-cases.
        </p>
      </div>

      {/* OVERLAPPING TEXT HERO EXAMPLES */}
      {normalizedSlug === "overlapping-text-hero" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ExampleCard
            id="spiderman-hero"
            badge="VARIANT 01 // COMIC"
            title="Spider-Man Hero Banner"
            description="Hero banner featuring Spider-Man cutout, bold Six Caps typography, and halftone aperture."
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
            <div className="w-full h-[220px] rounded-xl overflow-hidden relative flex items-center justify-center bg-[#0d0e12]">
              <OverlappingTextHero
                title="SPIDER-MAN"
                subTitle1="FRIENDLY NEIGHBORHOOD"
                subTitle1Color="#2563eb"
                subTitle2="WEB-SLINGER"
                subTitle2Color="#dc2626"
                imgPath="/sipderman.png"
                textColor="#dc2626"
                bgColor="#e2e4e9"
                compactMode={true}
                fontSize="3rem"
              />
            </div>
          </ExampleCard>

          <ExampleCard
            id="editorial-ochre"
            badge="VARIANT 02 // EDITORIAL"
            title="Editorial Ochre Portfolio"
            description="Warm terracotta typography on cream textured paper with dual radial apertures."
            codeSnippet={`<OverlappingTextHero
  title="JAYANT POTDAR"
  subTitle1="B.TECH"
  subTitle1Color="#191510"
  subTitle2="FULL STACK DEVELOPER"
  subTitle2Color="#db4b29"
  imgPath="/Profile-removebg.png"
  textColor="#db4b29"
  bgColor="#e3e2dd"
/>`}
          >
            <div className="w-full h-[220px] rounded-xl overflow-hidden relative flex items-center justify-center bg-[#0d0e12]">
              <OverlappingTextHero
                title="JAYANT POTDAR"
                subTitle1="B.TECH"
                subTitle1Color="#191510"
                subTitle2="FULL STACK DEVELOPER"
                subTitle2Color="#db4b29"
                imgPath="/Profile-removebg.png"
                textColor="#db4b29"
                bgColor="#e3e2dd"
                compactMode={true}
                fontSize="2.8rem"
              />
            </div>
          </ExampleCard>

          <ExampleCard
            id="cyber-matrix"
            badge="VARIANT 03 // CYBER"
            title="Stealth Cyan Matrix"
            description="High-contrast phosphor cyan title on pitch space background with sharp halftone aperture."
            codeSnippet={`<OverlappingTextHero
  title="CREATIVE TECH"
  subTitle1="THREE.JS & SHADERS"
  subTitle1Color="#06b6d4"
  subTitle2="FRAMER MOTION"
  subTitle2Color="#38bdf8"
  imgPath="/Profile-removebg.png"
  textColor="#06b6d4"
  bgColor="#090b10"
/>`}
          >
            <div className="w-full h-[220px] rounded-xl overflow-hidden relative flex items-center justify-center bg-[#0d0e12]">
              <OverlappingTextHero
                title="CREATIVE TECH"
                subTitle1="THREE.JS & SHADERS"
                subTitle1Color="#06b6d4"
                subTitle2="FRAMER MOTION"
                subTitle2Color="#38bdf8"
                imgPath="/Profile-removebg.png"
                textColor="#06b6d4"
                bgColor="#090b10"
                compactMode={true}
                fontSize="2.8rem"
              />
            </div>
          </ExampleCard>
        </div>
      )}

      {/* TELESCOPE HERO EXAMPLES */}
      {normalizedSlug === "telescope-hero" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ExampleCard
            id="alpine-expedition"
            badge="VARIANT 01 // NATURE"
            title="Alpine Mountain Vista"
            description="Multi-plane nature photography drifting through 3D focal depths into panoramic summit."
            codeSnippet={`<TelescopeHero
  quote="Life is either a daring adventure or nothing at all"
  bgImage="/mountains-wallpaper.jpg"
/>`}
          >
            <div className="w-full h-[220px] rounded-xl overflow-hidden relative flex items-center justify-center bg-[#090a0e]">
              <TelescopeHero
                quote="Life is either a daring adventure or nothing at all"
                bgImage="/mountains-wallpaper.jpg"
                compactMode={true}
                fontSize="1.6rem"
              />
            </div>
          </ExampleCard>

          <ExampleCard
            id="cosmic-stellar"
            badge="VARIANT 02 // COSMIC"
            title="Stellar Deep Void"
            description="Perspective z-axis coordinate drift calibrated for astronomical exploratory themes."
            codeSnippet={`<TelescopeHero
  quote="The cosmos is within us, we are made of star-stuff"
  bgImage="/mountains-wallpaper.jpg"
/>`}
          >
            <div className="w-full h-[220px] rounded-xl overflow-hidden relative flex items-center justify-center bg-[#090a0e]">
              <TelescopeHero
                quote="The cosmos is within us, we are made of star-stuff"
                bgImage="/mountains-wallpaper.jpg"
                compactMode={true}
                fontSize="1.5rem"
              />
            </div>
          </ExampleCard>

          <ExampleCard
            id="brutalist-arch"
            badge="VARIANT 03 // ARCHITECTURE"
            title="Brutalist Concrete Scale"
            description="Minimalist concrete structural photography with smooth reverse-scroll focal clipping."
            codeSnippet={`<TelescopeHero
  quote="Simplicity is the ultimate sophistication"
  bgImage="/mountains-wallpaper.jpg"
/>`}
          >
            <div className="w-full h-[220px] rounded-xl overflow-hidden relative flex items-center justify-center bg-[#090a0e]">
              <TelescopeHero
                quote="Simplicity is the ultimate sophistication"
                bgImage="/mountains-wallpaper.jpg"
                compactMode={true}
                fontSize="1.6rem"
              />
            </div>
          </ExampleCard>
        </div>
      )}

      {/* MAGNETIC BUTTON EXAMPLES */}
      {normalizedSlug === "magnetic-button" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ExampleCard
            id="launch-trigger"
            badge="VARIANT 01 // ACTION"
            title="Snappy Amber Trigger"
            description="High spring stiffness (180) providing an elastic snap on cursor proximity."
            codeSnippet={`<MagneticButton
  maxDistance={35}
  stiffness={180}
  damping={12}
  mass={0.1}
  className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-mono font-bold px-6 py-3 rounded-xl text-xs uppercase"
>
  Launch App
</MagneticButton>`}
          >
            <div className="p-8 flex items-center justify-center">
              <MagneticButton
                maxDistance={35}
                stiffness={180}
                damping={12}
                mass={0.1}
                className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-mono font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-md"
              >
                <span>Launch App</span>
              </MagneticButton>
            </div>
          </ExampleCard>

          <ExampleCard
            id="cyber-command"
            badge="VARIANT 02 // TERMINAL"
            title="Cyber Console Command"
            description="Expanded 50px attraction radius suited for technical console HUDs and commands."
            codeSnippet={`<MagneticButton
  maxDistance={50}
  stiffness={130}
  damping={9}
  mass={0.12}
  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 font-mono font-bold px-6 py-3 rounded-lg text-xs uppercase shadow-[0_0_15px_rgba(6,182,212,0.2)]"
>
  > EXECUTE_NODE
</MagneticButton>`}
          >
            <div className="p-8 flex items-center justify-center">
              <MagneticButton
                maxDistance={50}
                stiffness={130}
                damping={9}
                mass={0.12}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 font-mono font-bold px-6 py-3 rounded-lg text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              >
                <span>&gt; EXECUTE_NODE</span>
              </MagneticButton>
            </div>
          </ExampleCard>

          <ExampleCard
            id="minimal-pill"
            badge="VARIANT 03 // MINIMAL"
            title="Minimalist Ivory Pill"
            description="Gentle micro-pull physics with higher damping for understated navigational elements."
            codeSnippet={`<MagneticButton
  maxDistance={25}
  stiffness={200}
  damping={16}
  mass={0.08}
  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono font-medium px-6 py-3 rounded-full text-xs uppercase tracking-wider"
>
  Explore Works
</MagneticButton>`}
          >
            <div className="p-8 flex items-center justify-center">
              <MagneticButton
                maxDistance={25}
                stiffness={200}
                damping={16}
                mass={0.08}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono font-medium px-6 py-3 rounded-full text-xs uppercase tracking-wider"
              >
                <span>Explore Works</span>
              </MagneticButton>
            </div>
          </ExampleCard>
        </div>
      )}

      {/* BUBBLE TEXT EXAMPLES */}
      {normalizedSlug === "bubble-text" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExampleCard
            id="bubble-cyberpunk"
            badge="VARIANT 01 // DISPLAY"
            title="Cyberpunk Terminal Wave"
            description="Phosphor emerald proximity weight wave radiating across bold display characters."
            codeSnippet={`<BubbleText
  text="NEO TOKYO 2088"
  className="font-black text-4xl sm:text-5xl text-emerald-400 tracking-wider"
/>`}
          >
            <div className="p-8 w-full flex items-center justify-center">
              <BubbleText
                text="NEO TOKYO 2088"
                className="font-black text-3xl sm:text-4xl text-emerald-400 tracking-wider"
              />
            </div>
          </ExampleCard>

          <ExampleCard
            id="bubble-editorial"
            badge="VARIANT 02 // EDITORIAL"
            title="Editorial Monospace Scale"
            description="Classic warm typography wave on paper background with progressive letter weight."
            codeSnippet={`<BubbleText
  text="CREATIVE STUDIO"
  className="font-mono text-3xl sm:text-4xl text-[#f97316] font-light tracking-tight"
/>`}
          >
            <div className="p-8 w-full flex items-center justify-center">
              <BubbleText
                text="CREATIVE STUDIO"
                className="font-mono text-3xl sm:text-4xl text-[#f97316] font-light tracking-tight"
              />
            </div>
          </ExampleCard>
        </div>
      )}

      {/* BINARY GRID EXAMPLES */}
      {normalizedSlug === "binary-grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExampleCard
            id="binary-vault"
            badge="VARIANT 01 // PRECISION"
            title="High Precision Aperture"
            description="Concentrated 60px aperture with tight spring stiffness for surgical matrix inspection."
            codeSnippet={`<BinaryGrid
  circleSize={60}
  stiffness={400}
  damping={25}
/>`}
          >
            <div className="w-full">
              <BinaryGrid circleSize={60} stiffness={400} damping={25} />
            </div>
          </ExampleCard>

          <ExampleCard
            id="binary-expansive"
            badge="VARIANT 02 // EXPANSIVE"
            title="Expansive Stream Reveal"
            description="Wide 120px radial aura revealing broad cross-sections of the decrypted data stream."
            codeSnippet={`<BinaryGrid
  circleSize={120}
  stiffness={220}
  damping={40}
/>`}
          >
            <div className="w-full">
              <BinaryGrid circleSize={120} stiffness={220} damping={40} />
            </div>
          </ExampleCard>
        </div>
      )}

      {/* RADIAL GRADIENT CARD EXAMPLES */}
      {normalizedSlug === "radial-gradient-card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExampleCard
            id="card-violet"
            badge="VARIANT 01 // VIOLET"
            title="Violet Focus Specimen"
            description="Pointer-responsive violet spotlight illuminating dark glass container surface."
            codeSnippet={`<RadialGradientAnimateCard
  radialGradient={{
    color1: "rgba(139, 92, 246, 0.5)",
    size: "14rem",
    shape: "circle",
    opacity: 0.6,
  }}
  className="w-full bg-[#111218] border border-white/10 rounded-2xl p-6 text-white"
>
  <h4 className="font-mono text-lg font-bold">Violet Focus Card</h4>
  <p className="font-sans text-xs text-white/70">Reactive radial highlight</p>
</RadialGradientAnimateCard>`}
          >
            <div className="w-full max-w-sm">
              <RadialGradientAnimateCard
                radialGradient={{
                  color1: "rgba(139, 92, 246, 0.5)",
                  size: "14rem",
                  shape: "circle",
                  opacity: 0.6,
                }}
                className="w-full bg-[#111218] border border-white/10 rounded-2xl p-6 text-white"
              >
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-purple-400 uppercase">
                    PRESET 01 / VIOLET
                  </span>
                  <h4 className="font-mono text-base font-bold text-white">
                    Violet Focus Card
                  </h4>
                  <p className="font-sans text-xs text-white/70">
                    Pointer-responsive glow tracking hover coordinates across surface.
                  </p>
                </div>
              </RadialGradientAnimateCard>
            </div>
          </ExampleCard>

          <ExampleCard
            id="card-amber"
            badge="VARIANT 02 // AMBER"
            title="Warm Amber Spotlight"
            description="Incandescent amber glow designed for warm editorial drafting cards."
            codeSnippet={`<RadialGradientAnimateCard
  radialGradient={{
    color1: "rgba(245, 158, 11, 0.5)",
    size: "14rem",
    shape: "circle",
    opacity: 0.6,
  }}
  className="w-full bg-[#111218] border border-white/10 rounded-2xl p-6 text-white"
>
  <h4 className="font-mono text-lg font-bold">Amber Focus Card</h4>
  <p className="font-sans text-xs text-white/70">Warm incandescent highlight</p>
</RadialGradientAnimateCard>`}
          >
            <div className="w-full max-w-sm">
              <RadialGradientAnimateCard
                radialGradient={{
                  color1: "rgba(245, 158, 11, 0.5)",
                  size: "14rem",
                  shape: "circle",
                  opacity: 0.6,
                }}
                className="w-full bg-[#111218] border border-white/10 rounded-2xl p-6 text-white"
              >
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                    PRESET 02 / AMBER
                  </span>
                  <h4 className="font-mono text-base font-bold text-white">
                    Amber Focus Card
                  </h4>
                  <p className="font-sans text-xs text-white/70">
                    Warm drafting illumination following the pointer with smooth fading.
                  </p>
                </div>
              </RadialGradientAnimateCard>
            </div>
          </ExampleCard>
        </div>
      )}
    </section>
  );
};
