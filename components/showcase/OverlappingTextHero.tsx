"use client";

import {
  animate,
  easeOut,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export type OverlappingTextHeroProps = {
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
  containerRef?: React.RefObject<HTMLDivElement | null>;
  fontSize?: string;
};

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
  containerRef,
  fontSize,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    ...(containerRef ? { container: containerRef } : {}),
    offset: ["start start", "end end"],
  });

  const height = useTransform(scrollYProgress, [0, 1], ["100vh", "75vh"]);

  const y = useTransform(scrollYProgress, [0.3, 1], [500, 0], {
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
      duration: 2.6,
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

  // Dynamic font size: scale down for titles longer than 10 chars so "JAYANT POTDAR" is fully visible
  const resolvedFontSize =
    fontSize ||
    (title.length > 10
      ? `${Math.min(34, Math.max(20, Math.floor(340 / title.length)))}rem`
      : undefined);

  return (
    <div className="flex h-[151vh] w-full flex-col">
      <div ref={sectionRef} className="h-[150vh] w-full bg-neutral-900">
        <section className="sticky top-0 flex h-screen w-full items-center">
          <motion.div
            className="relative flex w-full flex-col items-center justify-center"
            style={{ height, color: textColor, backgroundColor: bgColor }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(#e84e27 2px, transparent 0)",
                backgroundSize: "20px 20px",
                WebkitMaskImage: maskImageStyle,
                maskImage: maskImageStyle,
              }}
            />
            <div className="flex w-fit flex-col items-stretch z-10">
              {/* Title */}
              <motion.div
                className={`font-sixCap flex h-110 w-fit items-center justify-center overflow-hidden text-[34rem] leading-none ${titleStyle}`}
                style={resolvedFontSize ? { fontSize: resolvedFontSize } : undefined}
              >
                {title
                  .toLowerCase()
                  .split("")
                  .map((val, idx) => {
                    return (
                      <motion.div
                        className="-mt-18"
                        key={`${idx}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{
                          verticalAlign: "bottom",
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                          delay: idx * 0.2,
                        }}
                      >
                        {val === " " ? "\u00A0" : val}
                      </motion.div>
                    );
                  })}
              </motion.div>
              {/* Subtitles */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.9 }}
                className="font-inter flex w-full justify-between text-2xl font-semibold"
              >
                <span style={{ color: subTitle1Color }}>{subTitle1}</span>
                <span style={{ color: subTitle2Color }}>{subTitle2}</span>
              </motion.div>
            </div>
            {/* Cutout Portrait */}
            <motion.div
              className="transform-all absolute bottom-0 flex z-20"
              style={{ y, opacity, filter }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgPath}
                alt={title}
                className="size-160 object-contain object-bottom"
                style={{ objectPosition: "bottom" }}
              />
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};
