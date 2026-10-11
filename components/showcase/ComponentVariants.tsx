"use client";

import React from "react";
import { CraftComponent } from "@/lib/components-data";
import { MagneticButton } from "./MagneticButton";
import { BubbleText } from "./BubbleText";
import { RadialGradientAnimateCard } from "./RadialGradientAnimateCard";
import { BinaryGrid } from "./BinaryGrid";

interface ComponentVariantsProps {
  component: CraftComponent;
}

export const ComponentVariants: React.FC<ComponentVariantsProps> = ({
  component,
}) => {
  return (
    <section className="w-full flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ca-ink)]/50">
          Examples &amp; Variations
        </h2>
        <p className="text-sm font-sans text-[var(--ca-ink)]/80">
          Explore alternative colorways, spring tunings, and practical integration patterns.
        </p>
      </div>

      {/* VARIANTS ACCORDING TO COMPONENT */}
      {component.slug === "magnetic-button" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preset 01 */}
          <div className="flex flex-col justify-between p-6 rounded-2xl border border-[var(--ca-ink)]/10 bg-white/60 gap-8">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase font-bold text-[var(--ca-orange)]">
                Preset 01 / Amber Action
              </span>
              <h3 className="font-mono text-sm font-semibold text-[var(--ca-ink)]">
                Launch Trigger
              </h3>
              <p className="text-xs text-[var(--ca-ink)]/60 font-sans">
                Snappy Newtonian pull with higher spring stiffness (180).
              </p>
            </div>
            <div className="flex items-center justify-center py-4">
              <MagneticButton
                maxDistance={35}
                stiffness={180}
                damping={12}
                mass={0.1}
                bgClassName="p-10 -m-10 flex items-center justify-center"
                className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-mono font-medium px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm"
              >
                <span>Launch App</span>
              </MagneticButton>
            </div>
          </div>

          {/* Preset 02 */}
          <div className="flex flex-col justify-between p-6 rounded-2xl border border-cyan-500/20 bg-[#0d121f] text-white gap-8">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase font-bold text-cyan-400">
                Preset 02 / Cyber Terminal
              </span>
              <h3 className="font-mono text-sm font-semibold text-white">
                Console Command
              </h3>
              <p className="text-xs text-white/60 font-sans">
                Wide proximity attraction threshold (50px).
              </p>
            </div>
            <div className="flex items-center justify-center py-4">
              <MagneticButton
                maxDistance={50}
                stiffness={130}
                damping={9}
                mass={0.12}
                bgClassName="p-10 -m-10 flex items-center justify-center"
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 font-mono font-medium px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <span>&gt; EXECUTE_NODE</span>
              </MagneticButton>
            </div>
          </div>

          {/* Preset 03 */}
          <div className="flex flex-col justify-between p-6 rounded-2xl border border-[var(--ca-ink)]/10 bg-white/60 gap-8">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase font-bold text-emerald-600">
                Preset 03 / Minimal Pill
              </span>
              <h3 className="font-mono text-sm font-semibold text-[var(--ca-ink)]">
                Secondary Link
              </h3>
              <p className="text-xs text-[var(--ca-ink)]/60 font-sans">
                Gentle micro-pull with soft damping.
              </p>
            </div>
            <div className="flex items-center justify-center py-4">
              <MagneticButton
                maxDistance={25}
                stiffness={220}
                damping={15}
                mass={0.08}
                bgClassName="p-10 -m-10 flex items-center justify-center"
                className="bg-transparent hover:bg-emerald-500/10 text-emerald-800 border border-emerald-600/40 font-mono font-medium px-6 py-2.5 rounded-full text-xs uppercase tracking-wider"
              >
                <span>Explore Works</span>
              </MagneticButton>
            </div>
          </div>
        </div>
      )}

      {component.slug === "bubble-text" && (
        <div className="flex flex-col gap-4">
          <div className="p-8 bg-[#0c0d11] text-white rounded-2xl flex flex-col items-center justify-center border border-white/10">
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-4">
              Cyberpunk Terminal Display
            </span>
            <BubbleText
              text="NEO TOKYO 2088"
              className="text-3xl sm:text-5xl font-black tracking-widest text-emerald-400"
            />
          </div>

          <div className="p-8 bg-white/70 rounded-2xl flex flex-col items-center justify-center border border-[var(--ca-ink)]/10">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ca-orange)] mb-4">
              Editorial Monospace Scale
            </span>
            <BubbleText
              text="CREATIVE STUDIO"
              className="text-3xl sm:text-5xl font-mono font-bold tracking-tight text-[var(--ca-ink)]"
            />
          </div>
        </div>
      )}

      {component.slug === "radial-gradient-card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-center w-full">
            <RadialGradientAnimateCard
              radialGradient={{
                color1: "rgba(139, 92, 246, 0.45)",
                size: "14rem",
                shape: "circle",
                opacity: 0.6,
              }}
              className="w-full bg-[#111218] border border-white/10 rounded-2xl p-6 text-white"
            >
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-purple-400">
                  SPEC 01 / QUANTUM
                </span>
                <h4 className="font-mono text-lg font-bold text-white">
                  Vector Quantum Core
                </h4>
                <p className="font-sans text-xs text-white/70">
                  Low latency real-time matrix decomposition with SIMD acceleration.
                </p>
              </div>
            </RadialGradientAnimateCard>
          </div>

          <div className="flex justify-center w-full">
            <RadialGradientAnimateCard
              radialGradient={{
                color1: "rgba(245, 158, 11, 0.45)",
                size: "14rem",
                shape: "circle",
                opacity: 0.6,
              }}
              className="w-full bg-[#111218] border border-white/10 rounded-2xl p-6 text-white"
            >
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  SPEC 02 / SOLAR
                </span>
                <h4 className="font-mono text-lg font-bold text-white">
                  Solar Flare Generator
                </h4>
                <p className="font-sans text-xs text-white/70">
                  Dynamic procedural surface emission modeled on thermonuclear telemetry.
                </p>
              </div>
            </RadialGradientAnimateCard>
          </div>
        </div>
      )}

      {component.slug === "binary-grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 bg-neutral-950 rounded-2xl border border-white/10">
            <span className="font-mono text-[11px] text-white/70 mb-2 uppercase">
              Tight Spring (Radius: 60px, Stiffness: 400)
            </span>
            <BinaryGrid circleSize={60} stiffness={400} damping={25} />
          </div>
          <div className="flex flex-col items-center p-4 bg-neutral-950 rounded-2xl border border-white/10">
            <span className="font-mono text-[11px] text-white/70 mb-2 uppercase">
              Wide Aura (Radius: 120px, Damping: 45)
            </span>
            <BinaryGrid circleSize={120} stiffness={220} damping={45} />
          </div>
        </div>
      )}

      {component.slug === "overlapping-text-hero" && (
        <div className="p-6 rounded-2xl border border-[var(--ca-ink)]/10 bg-white/70 font-mono text-xs flex flex-col gap-3">
          <div className="font-bold text-xs uppercase tracking-wider text-[var(--ca-ink)]">
            Production Integration Modes
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-[var(--ca-ink)]/75">
            <li>
              <strong>Sticky Viewport Hero:</strong> 150vh target section with height contraction and blur focus.
            </li>
            <li>
              <strong>Dynamic Radial Apertures:</strong> Twin radial gradient masks that open to reveal background dot grid.
            </li>
            <li>
              <strong>Subject Separation:</strong> Parallax layer for transparent cutout photography.
            </li>
          </ul>
        </div>
      )}

      {component.slug === "telescope-hero" && (
        <div className="p-6 rounded-2xl border border-[var(--ca-ink)]/10 bg-white/70 font-mono text-xs flex flex-col gap-3">
          <div className="font-bold text-xs uppercase tracking-wider text-[var(--ca-ink)]">
            Camera Depth Planes
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-[var(--ca-ink)]/75">
            <li>
              <strong>Multi-plane Z Coordinates:</strong> Floating picture layers travel along perspective axis.
            </li>
            <li>
              <strong>Climax Backdrop Dissolve:</strong> Transition into full-screen destination landscape at terminal scroll point.
            </li>
          </ul>
        </div>
      )}
    </section>
  );
};
