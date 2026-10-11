"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  animate,
  easeOut,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";

export interface OverlappingTextHeroProps {
  title?: string;
  titleStyle?: string;
  subTitle1?: string;
  subTitle1Color?: string;
  subTitle2?: string;
  subTitle2Color?: string;
  imgPath?: string;
  textColor?: string;
  bgColor?: string;
  compactMode?: boolean; // For preview inside smaller containers
}

export const OverlappingTextHero: React.FC<OverlappingTextHeroProps> = ({
  title = "jayant potdar",
  titleStyle = "",
  subTitle1 = "B.Tech",
  subTitle1Color = "#1a1a1a",
  subTitle2 = "Full Stack Web Developer",
  subTitle2Color = "#1a1a1a",
  imgPath = "/Profile-removebg.png",
  textColor = "#db4b29",
  bgColor = "#e3e2dd",
  compactMode = false,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const height = useTransform(
    scrollYProgress,
    [0, 1],
    compactMode ? ["100%", "85%"] : ["100vh", "75vh"]
  );

  const y = useTransform(scrollYProgress, [0.3, 1], [350, 0], {
    ease: easeOut,
  });
  const opacity = useTransform(scrollYProgress, [0.85, 1], [0, 1], {
    ease: easeOut,
  });
  const filter = useTransform(
    scrollYProgress,
    [0.3, 1],
    ["blur(6px)", "blur(0px)"],
    {
      ease: easeOut,
    }
  );

  const [introDone, setIntroDone] = useState(false);
  const scrollMask = useTransform(scrollYProgress, [0.3, 1], [15, 8]);
  const maskSize = useMotionValue(3);

  useEffect(() => {
    const controls = animate(maskSize, 15, {
      duration: 2.4,
      ease: "easeIn",
      delay: 0.2,
      onComplete: () => setIntroDone(true),
    });
    return () => controls.stop();
  }, [maskSize]);

  useEffect(() => {
    if (!introDone) return;
    return scrollMask.on("change", (v) => {
      maskSize.set(v);
    });
  }, [introDone, scrollMask, maskSize]);

  const maskImageStyle = useMotionTemplate`radial-gradient(circle at 0% 0%, black, transparent ${maskSize}%),radial-gradient(circle at 100% 0%, black, transparent ${maskSize}%)`;

  return (
    <div
      className={`flex w-full flex-col ${
        compactMode ? "h-[160vh]" : "min-h-[150vh]"
      }`}
    >
      <div
        ref={sectionRef}
        className={`w-full bg-[#111111] ${
          compactMode ? "h-[150vh]" : "h-[150vh]"
        }`}
      >
        <section
          className={`sticky top-0 flex w-full items-center justify-center overflow-hidden ${
            compactMode ? "h-[500px]" : "h-screen"
          }`}
        >
          <motion.div
            className="relative flex w-full flex-col items-center justify-center overflow-hidden transition-colors"
            style={{ height, color: textColor, backgroundColor: bgColor }}
          >
            {/* Halftone / Dot Grid Mask */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#e84e27 2px, transparent 0)",
                backgroundSize: "20px 20px",
                WebkitMaskImage: maskImageStyle,
                maskImage: maskImageStyle,
              }}
            />

            {/* Typography & Subtitles */}
            <div className="relative z-10 flex w-full max-w-6xl flex-col items-stretch px-6">
              {/* Display Title */}
              <div
                className={`flex w-full items-center justify-center overflow-hidden select-none tracking-tighter uppercase font-black ${
                  compactMode
                    ? "text-[4.5rem] sm:text-[7rem] md:text-[9rem] leading-none"
                    : "text-[5.5rem] sm:text-[9rem] md:text-[14rem] lg:text-[18rem] leading-[0.85]"
                } ${titleStyle}`}
                style={{
                  fontFamily:
                    "Impact, 'Bebas Neue', var(--font-handjet), sans-serif",
                }}
              >
                {title.split("").map((char, idx) => (
                  <motion.span
                    key={`${char}-${idx}`}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.35,
                      ease: "easeInOut",
                      delay: idx * 0.08,
                    }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>

              {/* Subtitles bar */}
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
                className={`flex w-full justify-between items-center font-mono font-bold tracking-wider uppercase border-t-2 border-current pt-2 mt-2 ${
                  compactMode ? "text-xs sm:text-sm" : "text-sm sm:text-lg md:text-xl"
                }`}
              >
                <span
                  style={{
                    color: subTitle1Color || "inherit",
                  }}
                >
                  {subTitle1}
                </span>
                <span
                  style={{
                    color: subTitle2Color || "inherit",
                  }}
                >
                  {subTitle2}
                </span>
              </motion.div>
            </div>

            {/* Portrait Cutout Image */}
            <motion.div
              className="absolute bottom-0 z-20 flex pointer-events-none items-end justify-center"
              style={{ y, opacity, filter }}
            >
              <img
                src={imgPath}
                alt={title}
                className={`object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] ${
                  compactMode
                    ? "h-72 max-w-[280px]"
                    : "h-[45vh] sm:h-[65vh] max-w-[500px]"
                }`}
                loading="eager"
              />
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};
