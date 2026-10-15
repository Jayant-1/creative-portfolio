"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import React, { useRef } from "react";

const BINARY_CHARS =
  "01001010 01100001 01111001 01100001 01101110 01110100 00100000 01010000 01101111 01110100 01100100 01100001 01110010 00100000 01000011 01010010 01000001 01000110 01010100 00100000 01001100 01000001 01000010 00100000 01000011 01001111 01001101 01010000 01001111 01001110 01000101 01001110 01010100 01010011 00100001 01001000 01000001 01010000 01010000 01011001 01011111 01000011 01001111 01000100 01001001 01001110 01000111 00100001 01110011 01111001 01110011 01110100 01100101 01101101 01110011 00100000 01101101 01100001 01110100 01110010 01101001 01111000 00100000 01100001 01110000 01100101 01110010 01110100 01110101 01110010 01100101 ";

export type BinaryGridProps = {
  circleSize?: number;
  stiffness?: number;
  damping?: number;
};

export const BinaryGrid = ({
  circleSize = 75,
  stiffness = 300,
  damping = 30,
}: BinaryGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const targetSize = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness, damping });
  const springY = useSpring(mouseY, { stiffness, damping });
  const springSize = useSpring(targetSize, {
    mass: 1.5,
    damping: 20,
    stiffness: 220,
  });

  const background = useMotionTemplate`radial-gradient(circle ${springSize}px at ${springX}px ${springY}px, rgba(255, 255, 255, 0.95) 55%, transparent 100%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const repeatedMatrix = BINARY_CHARS.repeat(16);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => targetSize.set(circleSize)}
      onMouseLeave={() => targetSize.set(0)}
      className="relative min-h-[380px] w-full overflow-hidden rounded-2xl bg-neutral-950 p-6 select-none"
    >
      {/* Background dimmed layer */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden p-6 font-mono text-[11px] leading-4 text-neutral-800 break-all opacity-40">
        {repeatedMatrix}
      </div>

      {/* Illuminated mask layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-1 select-none overflow-hidden p-6 font-mono text-[11px] leading-4 text-cyan-300 break-all"
        style={{
          WebkitMaskImage: background,
          maskImage: background,
        }}
      >
        {repeatedMatrix}
      </motion.div>

      {/* Interactive Center Vignette HUD matching thumbnail */}
      <div className="relative z-10 flex min-h-[340px] items-center justify-center p-4">
        <div className="relative flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-2xl border border-cyan-400/40 bg-[#080b12]/80 backdrop-blur-md shadow-[0_0_60px_rgba(6,182,212,0.15)] max-w-md w-full">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-3 py-1 text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Radial Aperture Active</span>
          </div>
          <h3 className="mt-3.5 text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Binary Grid
          </h3>
          <p className="mt-2 text-xs font-mono text-neutral-300 leading-relaxed">
            Reactive cursor spotlight revealing decrypted matrix streams in real-time
          </p>
          <div className="mt-4 pt-3 border-t border-cyan-500/20 w-full flex items-center justify-center gap-2 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
            <span>Mask: <span className="text-cyan-300">Radial-Gradient</span></span>
            <span>&bull;</span>
            <span>Physics: <span className="text-cyan-300">Framer Motion</span></span>
            <span>&bull;</span>
            <span className="text-neutral-500">60 FPS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
