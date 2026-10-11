"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

export interface TelescopeHeroProps {
  quote?: string;
  bgImage?: string;
  compactMode?: boolean;
}

const FLOATING_IMAGES_1 = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80",
    top: "8%",
    left: "18%",
    rotate: "12deg",
    speed: 0.18,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&auto=format&fit=crop&q=80",
    top: "14%",
    left: "68%",
    rotate: "8deg",
    speed: 0.35,
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=80",
    top: "45%",
    left: "8%",
    rotate: "-6deg",
    speed: 0.25,
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500&auto=format&fit=crop&q=80",
    top: "56%",
    left: "72%",
    rotate: "10deg",
    speed: 0.45,
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1511497584788-87676104235f?w=500&auto=format&fit=crop&q=80",
    top: "68%",
    left: "38%",
    rotate: "-4deg",
    speed: 0.3,
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80",
    top: "18%",
    left: "38%",
    rotate: "3deg",
    speed: 0.2,
  },
];

const FLOATING_IMAGES_2 = [
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&auto=format&fit=crop&q=80",
    top: "8%",
    left: "12%",
    rotate: "-8deg",
    speed: 0.28,
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&auto=format&fit=crop&q=80",
    top: "12%",
    left: "60%",
    rotate: "15deg",
    speed: 0.4,
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500&auto=format&fit=crop&q=80",
    top: "58%",
    left: "14%",
    rotate: "10deg",
    speed: 0.3,
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop&q=80",
    top: "66%",
    left: "66%",
    rotate: "-12deg",
    speed: 0.42,
  },
];

export const TelescopeHero: React.FC<TelescopeHeroProps> = ({
  quote = "Life is either a daring adventure or nothing at all",
  bgImage = "/mountains-wallpaper.jpg",
  compactMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const z1 = useTransform(scrollYProgress, [0, 0.4], [-400, 1600]);
  const z2 = useTransform(scrollYProgress, [0.3, 0.7], [-2400, 800]);
  const z3 = useTransform(scrollYProgress, [0.65, 0.85, 1], [0, 1, 1]);

  const textScale = useTransform(
    scrollYProgress,
    [0.5, 0.75, 0.85],
    [1, 1.25, 1]
  );
  const textY = useTransform(scrollYProgress, [0.65, 0.85], [0, compactMode ? 120 : 350]);
  const textX = useTransform(scrollYProgress, [0.85, 1], [0, compactMode ? -400 : -1400]);

  const opacityZ1 = useTransform(scrollYProgress, [0, 0.25], [0.8, 1]);
  const opacityZ2 = useTransform(scrollYProgress, [0.25, 0.65], [0, 1]);

  // Hook rules: call useTransform at top level
  const z1Values = FLOATING_IMAGES_1.map((img) =>
    useTransform(z1, (val) => val * img.speed)
  );
  const z2Values = FLOATING_IMAGES_2.map((img) =>
    useTransform(z2, (val) => val * img.speed)
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${
        compactMode ? "h-[300vh]" : "h-[450vh]"
      } bg-[#0b0c10]`}
    >
      <div
        className={`sticky top-0 left-0 flex w-full items-center justify-center overflow-hidden bg-[#0a0a0c] select-none ${
          compactMode ? "h-[520px]" : "h-screen"
        }`}
        style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}
      >
        {/* Layer 1 Floating Elements */}
        {FLOATING_IMAGES_1.map((img, idx) => (
          <motion.div
            key={`img1-${img.id}`}
            className="absolute z-20 pointer-events-none rounded-lg overflow-hidden border border-white/20 shadow-2xl bg-neutral-900"
            style={{
              top: img.top,
              left: img.left,
              rotate: img.rotate,
              z: z1Values[idx],
              opacity: opacityZ1,
              width: compactMode ? "100px" : "180px",
              height: compactMode ? "80px" : "130px",
            }}
          >
            <img
              src={img.src}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}

        {/* Layer 2 Floating Elements */}
        {FLOATING_IMAGES_2.map((img, idx) => (
          <motion.div
            key={`img2-${img.id}`}
            className="absolute z-20 pointer-events-none rounded-lg overflow-hidden border border-white/20 shadow-2xl bg-neutral-900"
            style={{
              top: img.top,
              left: img.left,
              rotate: img.rotate,
              z: z2Values[idx],
              opacity: opacityZ2,
              width: compactMode ? "110px" : "200px",
              height: compactMode ? "85px" : "140px",
            }}
          >
            <img
              src={img.src}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}

        {/* Center Giant Typographic Quote */}
        <motion.div
          layout
          className="relative z-30 px-6 text-center font-black uppercase text-white mix-blend-difference pointer-events-none tracking-tight"
          style={{
            scale: textScale,
            y: textY,
            x: textX,
            fontSize: compactMode ? "2rem" : "clamp(2.5rem, 5vw, 5.5rem)",
            maxWidth: compactMode ? "90%" : "75rem",
            lineHeight: 1.05,
            fontFamily: "Impact, 'Bebas Neue', var(--font-handjet), sans-serif",
          }}
        >
          {quote}
        </motion.div>

        {/* Final reveal backdrop */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            opacity: z3,
            scale: z3,
          }}
        >
          <img
            src={bgImage}
            alt="Reveal backdrop"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        </motion.div>

        {/* Scroll Helper Badge */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-white/80 font-mono text-xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Scroll down to zoom through space</span>
        </div>
      </div>
    </div>
  );
};
