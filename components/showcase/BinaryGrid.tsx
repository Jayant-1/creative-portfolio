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

      {/* Interactive Center Vignette */}
      <div className="relative z-10 flex min-h-[340px] flex-col items-center justify-center text-center">
        <span className="ca-mono rounded-full border border-cyan-400/30 bg-cyan-950/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
          Radial Aperture Active
        </span>
        <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Encrypted Stream Aperture
        </h3>
        <p className="mt-2 max-w-sm text-xs font-mono text-neutral-400 uppercase tracking-widest">
          Move your pointer across this matrix to open the spotlight
        </p>
      </div>
    </div>
  );
};
