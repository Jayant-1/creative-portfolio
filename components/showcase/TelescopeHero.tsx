"use client";

import React, { useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";

export interface TelescopeHeroProps {
  quote?: string;
  bgImage?: string;
  compactMode?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  progress?: number;
  fontSize?: string;
}

const FLOATING_IMAGES_1 = [
  {
    id: 1,
    src: "https://picsum.photos/200/300",
    top: "3%",
    left: "18%",
    rotate: "12deg",
    speed: 0.15,
  },
  {
    id: 2,
    src: "https://picsum.photos/400/310",
    top: "14%",
    left: "68%",
    rotate: "8deg",
    speed: 0.35,
  },
  {
    id: 3,
    src: "https://picsum.photos/350/350",
    top: "45%",
    left: "8%",
    rotate: "-6deg",
    speed: 0.25,
  },
  {
    id: 4,
    src: "https://picsum.photos/400/300",
    top: "55%",
    left: "72%",
    rotate: "10deg",
    speed: 0.5,
  },
  {
    id: 5,
    src: "https://picsum.photos/300/400",
    top: "64%",
    left: "38%",
    rotate: "-4deg",
    speed: 0.3,
  },
  {
    id: 6,
    src: "https://picsum.photos/600/400",
    top: "18%",
    left: "38%",
    rotate: "3deg",
    speed: 0.2,
  },
  {
    id: 7,
    src: "https://picsum.photos/300/450",
    top: "5%",
    left: "85%",
    rotate: "-15deg",
    speed: 0.4,
  },
  {
    id: 8,
    src: "https://picsum.photos/500/300",
    top: "25%",
    left: "5%",
    rotate: "5deg",
    speed: 0.1,
  },
];

const FLOATING_IMAGES_2 = [
  {
    id: 1,
    src: "https://picsum.photos/id/1015/400/600",
    top: "8%",
    left: "15%",
    rotate: "-8deg",
    speed: 0.28,
  },
  {
    id: 2,
    src: "https://picsum.photos/id/1016/600/400",
    top: "13%",
    left: "60%",
    rotate: "15deg",
    speed: 0.4,
  },
  {
    id: 3,
    src: "https://picsum.photos/id/101/400/400",
    top: "55%",
    left: "12%",
    rotate: "10deg",
    speed: 0.3,
  },
  {
    id: 4,
    src: "https://picsum.photos/id/1018/500/350",
    top: "65%",
    left: "68%",
    rotate: "-12deg",
    speed: 0.45,
  },
  {
    id: 5,
    src: "https://picsum.photos/id/1019/350/500",
    top: "82%",
    left: "42%",
    rotate: "6deg",
    speed: 0.25,
  },
  {
    id: 6,
    src: "https://picsum.photos/id/1020/800/450",
    top: "15%",
    left: "35%",
    rotate: "-5deg",
    speed: 0.35,
  },
  {
    id: 7,
    src: "https://picsum.photos/id/1021/500/600",
    top: "23%",
    left: "76%",
    rotate: "18deg",
    speed: 0.35,
  },
];

export const TelescopeHero: React.FC<TelescopeHeroProps> = ({
  quote = "Life is either a daring adventure or nothing at all",
  bgImage = "/mountains-wallpaper.jpg",
  compactMode = false,
  scrollContainerRef,
  progress,
  fontSize,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalProgress = useMotionValue(0);

  const { scrollYProgress } = useScroll(
    scrollContainerRef
      ? {
          container: scrollContainerRef,
          target: containerRef,
          offset: ["start start", "end end"],
        }
      : {
          target: containerRef,
          offset: ["start start", "end end"],
        }
  );

  useEffect(() => {
    if (progress !== undefined) {
      internalProgress.set(progress);
      return;
    }
    return scrollYProgress.on("change", (v) => {
      internalProgress.set(v);
    });
  }, [progress, scrollYProgress, internalProgress]);

  // Optical depth transformations
  const z1 = useTransform(internalProgress, [0, 0.4], [-400, 1600]);
  const z2 = useTransform(internalProgress, [0.22, 0.7], [-2400, 800]);

  // Fix reverse-scroll glitch:
  // Layer 1 is visible near start and fades out smoothly to 0 by scroll 0.36.
  // Beyond 0.36 it is clamped to 0. When scrolling backward, it stays invisible
  // until entering its focal range.
  const opacityZ1 = useTransform(
    internalProgress,
    [0, 0.04, 0.22, 0.36],
    [0.95, 1, 0.9, 0],
    { clamp: true }
  );

  // Layer 2 is invisible before 0.22, fades in smoothly to 1 between 0.22 and 0.32,
  // remains in focus through 0.52, and fades out to 0 between 0.52 and 0.68.
  // Beyond 0.68 it is clamped to 0. When scrolling backward, it does not float
  // backward through the focal plane.
  const opacityZ2 = useTransform(
    internalProgress,
    [0.22, 0.32, 0.52, 0.68],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // Reveal backdrop: fades in as Layer 2 finishes fading out
  const opacityZ3 = useTransform(
    internalProgress,
    [0.65, 0.85],
    [0, 1],
    { clamp: true }
  );
  const scaleZ3 = useTransform(
    internalProgress,
    [0.65, 0.85],
    [1.12, 1],
    { clamp: true }
  );

  // Center display quote
  const textScale = useTransform(
    internalProgress,
    [0.45, 0.72, 0.85],
    [1, 1.25, 1],
    { clamp: true }
  );
  const textY = useTransform(
    internalProgress,
    [0.65, 0.85],
    [0, compactMode ? 100 : 350],
    { clamp: true }
  );
  const textX = useTransform(
    internalProgress,
    [0.85, 1],
    [0, compactMode ? -350 : -1400],
    { clamp: true }
  );

  // Hook rules: mapped arrays initialized at top level
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
        className={`sticky top-0 left-0 flex w-full items-center justify-center overflow-hidden bg-[#090a0e] select-none ${
          compactMode ? "h-[520px]" : "h-screen"
        }`}
        style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}
      >
        {/* Layer 1 Floating Elements (Foreground Plane) */}
        {FLOATING_IMAGES_1.map((img, idx) => (
          <motion.div
            key={`img1-${img.id}`}
            className="absolute z-30 pointer-events-none rounded-lg overflow-hidden border border-white/20 shadow-2xl bg-neutral-900"
            style={{
              top: img.top,
              left: img.left,
              rotate: img.rotate,
              z: z1Values[idx],
              opacity: opacityZ1,
              width: compactMode ? "105px" : "180px",
              height: compactMode ? "82px" : "130px",
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

        {/* Layer 2 Floating Elements (Mid-Deep Plane) */}
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
              width: compactMode ? "115px" : "200px",
              height: compactMode ? "88px" : "140px",
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

        {/* Center Display Quote */}
        <motion.div
          layout
          className="relative z-40 px-6 text-center font-black uppercase text-white mix-blend-difference pointer-events-none tracking-tight select-none"
          style={{
            scale: textScale,
            y: textY,
            x: textX,
            fontSize:
              fontSize || (compactMode ? "2rem" : "clamp(2.5rem, 5vw, 5.5rem)"),
            maxWidth: compactMode ? "90%" : "75rem",
            lineHeight: 1.05,
            fontFamily: "'Bebas Neue', Impact, sans-serif",
          }}
        >
          {quote}
        </motion.div>

        {/* Final Reveal Backdrop */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            opacity: opacityZ3,
            scale: scaleZ3,
          }}
        >
          <img
            src={bgImage}
            alt="Reveal backdrop"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        </motion.div>
      </div>
    </div>
  );
};
