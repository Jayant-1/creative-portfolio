"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

export interface TelescopeHeroProps {
  quote?: string;
  bgImage?: string;
}

const FLOATING_IMAGES_1 = [
  {
    id: 1,
    src: "https://picsum.photos/200/300",
    top: "1%",
    left: "22%",
    rotate: "12deg",
    speed: 0.15,
  },
  {
    id: 2,
    src: "https://picsum.photos/400/310",
    top: "12%",
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

interface FloatingImageProps {
  img: {
    id: number;
    src: string;
    top: string;
    left: string;
    rotate: string;
    speed: number;
  };
  zSource: any;
  opacity: any;
  onLoad: () => void;
}

const FloatingImage: React.FC<FloatingImageProps> = ({
  img,
  zSource,
  opacity,
  onLoad,
}) => {
  const z = useTransform(zSource, (latest: number) => latest * img.speed);

  return (
    <motion.img
      onLoad={onLoad}
      src={img.src}
      alt=""
      className="absolute z-30 w-2xs object-cover rounded-lg shadow-2xl pointer-events-none"
      style={{
        top: img.top,
        left: img.left,
        rotate: img.rotate,
        z,
        opacity,
      }}
    />
  );
};

export const TelescopeHero: React.FC<TelescopeHeroProps> = ({
  quote = "Life is either a daring adventure or nothing at all",
  bgImage = "/mountains-wallpaper.jpg",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const z1 = useTransform(scrollYProgress, [0, 0.4], [-400, 1800]);
  const z2 = useTransform(scrollYProgress, [0.3, 0.7], [-3000, 800]);
  const z3 = useTransform(scrollYProgress, [0.65, 0.8, 1], [0, 1, 1]);

  const textScale = useTransform(
    scrollYProgress,
    [0.5, 0.75, 0.8],
    [1, 1.3, 1]
  );
  const textWidth = useTransform(
    scrollYProgress,
    [0.75, 0.8],
    ["50rem", "110rem"]
  );
  const textFontSize = useTransform(
    scrollYProgress,
    [0.75, 0.8],
    ["5rem", "6rem"]
  );
  const textColor = useTransform(
    scrollYProgress,
    [0.75, 0.8],
    ["#fafafa", "#afafaf"]
  );
  const textY = useTransform(scrollYProgress, [0.65, 0.8], [0, 400]);
  const textX = useTransform(scrollYProgress, [0.85, 1], [0, -1700]);

  // Clean opacity transitions preventing stuck images on backwards scroll
  const opacityZ1 = useTransform(scrollYProgress, [0, 0.15, 0.38, 0.45], [0.85, 1, 1, 0]);
  const opacityZ2 = useTransform(scrollYProgress, [0.2, 0.35, 0.68, 0.75], [0, 1, 1, 0]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Graceful fallback to dismiss spinner after images load or timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900 pointer-events-none">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-neutral-700 border-t-white" />
        </div>
      ) : null}

      <div ref={ref} className="h-[500vh] w-full relative">
        <div className="sticky top-0 left-0 flex h-screen w-full items-center justify-center overflow-hidden bg-neutral-900 perspective-near">
          {FLOATING_IMAGES_1.map((val) => (
            <FloatingImage
              key={`float-1-${val.id}`}
              img={val}
              zSource={z1}
              opacity={opacityZ1}
              onLoad={() => setIsLoading(false)}
            />
          ))}

          {FLOATING_IMAGES_2.map((val) => (
            <FloatingImage
              key={`float-2-${val.id}`}
              img={val}
              zSource={z2}
              opacity={opacityZ2}
              onLoad={() => setIsLoading(false)}
            />
          ))}

          <motion.div
            layout
            className="font-bebasNeue z-40 text-center font-black mix-blend-difference select-none"
            style={{
              scale: textScale,
              y: textY,
              x: textX,
              width: textWidth,
              color: textColor,
              fontSize: textFontSize,
            }}
          >
            {quote}
          </motion.div>

          <motion.img
            className="absolute top-0 left-0 h-screen w-full object-cover object-center select-none"
            src={bgImage}
            alt="Mountains Wallpaper"
            style={{
              opacity: z3,
              scale: z3,
            }}
          />
        </div>
      </div>
      <div className="h-[50vh] w-full" />
    </>
  );
};
