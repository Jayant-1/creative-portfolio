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
  compactMode?: boolean;
  progress?: number;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  fontSize?: string;
}

export const OverlappingTextHero: React.FC<OverlappingTextHeroProps> = ({
  title = "SPIDER-MAN",
  titleStyle = "",
  subTitle1 = "FRIENDLY NEIGHBORHOOD",
  subTitle1Color = "#2563eb",
  subTitle2 = "WEB-SLINGER",
  subTitle2Color = "#dc2626",
  imgPath = "/sipderman.png",
  textColor = "#dc2626",
  bgColor = "#e2e4e9",
  compactMode = false,
  progress,
  containerRef,
  fontSize,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const internalProgress = useMotionValue(0);

  // Native scroll progress binding when containerRef is supplied
  const { scrollYProgress } = useScroll(
    containerRef
      ? {
          container: containerRef,
          target: sectionRef,
          offset: ["start start", "end end"],
        }
      : {
          target: sectionRef,
          offset: ["start start", "end end"],
        }
  );

  // Sync scrollYProgress to internalProgress when not driven by manual progress
  useEffect(() => {
    if (progress !== undefined) {
      internalProgress.set(progress);
      return;
    }
    return scrollYProgress.on("change", (v) => {
      internalProgress.set(v);
    });
  }, [progress, scrollYProgress, internalProgress]);

  // Height & frame contraction
  const height = useTransform(
    internalProgress,
    [0, 1],
    compactMode ? ["100%", "82%"] : ["100vh", "75vh"]
  );

  const scale = useTransform(
    internalProgress,
    [0, 1],
    compactMode ? [1, 0.96] : [1, 0.96]
  );

  const borderRadius = useTransform(
    internalProgress,
    [0, 1],
    compactMode ? ["16px", "22px"] : ["0px", "28px"]
  );

  // Cutout portrait translation & reveal
  const y = useTransform(
    internalProgress,
    [0, 1],
    compactMode ? [70, 0] : [450, 0],
    { ease: easeOut }
  );

  const opacity = useTransform(
    internalProgress,
    [0, 0.35],
    compactMode ? [0.9, 1] : [0, 1],
    { ease: easeOut }
  );

  const filter = useTransform(
    internalProgress,
    [0, 0.45],
    compactMode ? ["blur(1px)", "blur(0px)"] : ["blur(8px)", "blur(0px)"],
    { ease: easeOut }
  );

  // Dual radial aperture mask reveal
  const [introDone, setIntroDone] = useState(false);
  const scrollMask = useTransform(internalProgress, [0.2, 1], [15, 8]);
  const maskSize = useMotionValue(3);

  useEffect(() => {
    const controls = animate(maskSize, 15, {
      duration: 2.2,
      ease: "easeIn",
      delay: 0.1,
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
      className={`flex w-full flex-col select-none ${
        compactMode
          ? containerRef
            ? "relative h-[1400px]"
            : "h-full min-h-[460px]"
          : "min-h-[150vh]"
      }`}
    >
      <div
        ref={sectionRef}
        className={`w-full bg-[#0d0e12] transition-colors ${
          compactMode
            ? containerRef
              ? "relative h-[1400px]"
              : "h-full min-h-[460px] p-2 sm:p-4 flex items-center justify-center"
            : "min-h-[150vh] p-2 sm:p-4 flex items-center justify-center"
        }`}
      >
        <div
          className={`w-full overflow-hidden ${
            compactMode
              ? containerRef
                ? "sticky top-0 left-0 h-[520px] flex items-center justify-center"
                : "h-[440px] sm:h-[480px] flex items-center justify-center relative"
              : "sticky top-0 h-screen flex items-center justify-center relative"
          }`}
        >
          <motion.div
            className="relative flex w-full flex-col items-center justify-center overflow-hidden shadow-2xl transition-colors"
            style={{
              height,
              scale,
              borderRadius,
              color: textColor,
              backgroundColor: bgColor,
            }}
          >
            {/* Halftone Dot Grid Aperture */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#e84e27 2px, transparent 0)",
                backgroundSize: "20px 20px",
                WebkitMaskImage: maskImageStyle,
                maskImage: maskImageStyle,
              }}
            />

            {/* Typography Stack */}
            <div className="relative z-10 flex w-full max-w-4xl flex-col items-stretch px-4 sm:px-8">
              {/* Six Caps Condensed Display Title */}
              <div
                className={`flex w-full items-center justify-center overflow-hidden select-none tracking-normal uppercase leading-[0.76] ${
                  fontSize
                    ? ""
                    : compactMode
                    ? "text-[3.2rem] xs:text-[4rem] sm:text-[5.5rem] md:text-[6.8rem]"
                    : "text-[12rem] sm:text-[20rem] md:text-[26rem] lg:text-[32rem]"
                } ${titleStyle}`}
                style={{
                  fontFamily: "'Six Caps', Impact, sans-serif",
                  fontSize: fontSize || undefined,
                }}
              >
                {title
                  .toLowerCase()
                  .split("")
                  .map((char, idx) => (
                    <motion.span
                      key={`${char}-${idx}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                        delay: idx * 0.05,
                      }}
                      className="inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
              </div>

              {/* Subtitles rule */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className={`flex w-full justify-between items-center font-sans font-bold tracking-tight mt-1 border-t border-black/15 pt-1.5 ${
                  compactMode ? "text-xs sm:text-sm" : "text-sm sm:text-xl md:text-2xl"
                }`}
              >
                <span style={{ color: subTitle1Color || "inherit" }}>
                  {subTitle1}
                </span>
                <span style={{ color: subTitle2Color || "inherit" }}>
                  {subTitle2}
                </span>
              </motion.div>
            </div>

            {/* Overlapping Cutout Portrait */}
            <motion.div
              className="absolute bottom-0 z-20 flex pointer-events-none items-end justify-center"
              style={{ y, opacity, filter }}
            >
              <img
                src={imgPath}
                alt={title}
                className={`object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)] ${
                  compactMode
                    ? "h-[250px] sm:h-[300px] max-w-[280px]"
                    : "h-[50vh] sm:h-[68vh] max-w-[500px]"
                }`}
                loading="eager"
              />
            </motion.div>

            {/* Layer 3: Foreground Stroked Text (3D Text Sandwich Effect) */}
            <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center select-none">
              <div className="relative flex w-full max-w-4xl flex-col items-stretch px-4 sm:px-8">
                <div
                  className={`flex w-full items-center justify-center overflow-hidden select-none tracking-normal uppercase leading-[0.76] ${
                    fontSize
                      ? ""
                      : compactMode
                      ? "text-[3.2rem] xs:text-[4rem] sm:text-[5.5rem] md:text-[6.8rem]"
                      : "text-[12rem] sm:text-[20rem] md:text-[26rem] lg:text-[32rem]"
                  } ${titleStyle}`}
                  style={{
                    fontFamily: "'Six Caps', Impact, sans-serif",
                    fontSize: fontSize || undefined,
                    color: "transparent",
                    WebkitTextStroke: "1.5px " + textColor,
                  }}
                  aria-hidden="true"
                >
                  {title
                    .toLowerCase()
                    .split("")
                    .map((char, idx) => (
                      <span
                        key={`stroke-${char}-${idx}`}
                        className="inline-block"
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                </div>

                {/* Subtitles alignment spacer */}
                <div
                  className={`flex w-full justify-between items-center mt-1 border-t border-transparent pt-1.5 opacity-0 invisible pointer-events-none ${
                    compactMode ? "text-xs sm:text-sm" : "text-sm sm:text-xl md:text-2xl"
                  }`}
                  aria-hidden="true"
                >
                  <span>&nbsp;</span>
                  <span>&nbsp;</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
