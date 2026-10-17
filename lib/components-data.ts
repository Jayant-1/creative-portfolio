export type ComponentCategory =
  | "all"
  | "hero"
  | "motion"
  | "cards"
  | "backgrounds";

export type ComponentProp = {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  description: string;
};

export type ComponentVariant = {
  id: string;
  title: string;
  description: string;
  previewType: string;
};

export type CraftComponent = {
  slug: string;
  name: string;
  category: ComponentCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  thumbnail: string;
  dependencies: string[];
  installCommand: string;
  interactiveType: string;
  features: string[];
  props: ComponentProp[];
  code: string;
  usage: string;
  variants: ComponentVariant[];
  defaultCustomizer: Record<string, any>;
};

export const CATEGORIES: { id: ComponentCategory; label: string; count: number }[] = [
  { id: "all", label: "All Crafts", count: 6 },
  { id: "hero", label: "Hero & Parallax", count: 2 },
  { id: "motion", label: "Micro-Interactions", count: 2 },
  { id: "cards", label: "Cards & Containers", count: 1 },
  { id: "backgrounds", label: "Backgrounds & FX", count: 1 },
];

export const CRAFT_COMPONENTS: CraftComponent[] = [
  {
    slug: "overlapping-text-hero",
    name: "Overlapping Text Hero",
    category: "hero",
    categoryLabel: "Hero & Parallax",
    tagline: "Scroll-linked hero section featuring animated dual radial mask apertures and layered typography.",
    description:
      "A cinematic landing page hero section. Leverages scroll progress coordinates to contract viewport heights, de-blur overlapping subtitles, and dynamically animate twin radial mask cutouts across a technical grid pattern.",
    thumbnail: "/components/OverlappingTextHero.png",
    dependencies: ["framer-motion"],
    installCommand: "pnpm add framer-motion",
    interactiveType: "Scroll-Driven Geometry & Mask",
    features: [
      "Synchronized dual radial mask animations on scroll progress",
      "Smooth blur-to-focus and height contraction transforms",
      "Configurable titles, subtitles, color schemes, and portrait cutouts",
      "Pure hardware-accelerated transforms without layout jank",
    ],
    props: [
      {
        name: "title",
        type: "string",
        defaultValue: '"SPIDER-MAN"',
        description: "Primary large headline text rendered across the central canvas.",
      },
      {
        name: "subTitle1",
        type: "string",
        defaultValue: '"FRIENDLY NEIGHBORHOOD"',
        description: "First prominent badge or qualification subtitle.",
      },
      {
        name: "subTitle1Color",
        type: "string",
        defaultValue: '"#2563eb"',
        description: "Color of the first qualification subtitle.",
      },
      {
        name: "subTitle2",
        type: "string",
        defaultValue: '"WEB-SLINGER"',
        description: "Secondary role or focus area subtitle.",
      },
      {
        name: "subTitle2Color",
        type: "string",
        defaultValue: '"#dc2626"',
        description: "Color of the secondary focus area subtitle.",
      },
      {
        name: "textColor",
        type: "string",
        defaultValue: '"#dc2626"',
        description: "Primary typography color.",
      },
      {
        name: "bgColor",
        type: "string",
        defaultValue: '"#e2e4e9"',
        description: "Background color of the hero banner canvas.",
      },
      {
        name: "imgPath",
        type: "string",
        defaultValue: '"/sipderman.png"',
        description: "Path to the transparent cutout profile asset.",
      },
    ],
    defaultCustomizer: {
      title: "SPIDER-MAN",
      subTitle1: "FRIENDLY NEIGHBORHOOD",
      subTitle1Color: "#2563eb",
      subTitle2: "WEB-SLINGER",
      subTitle2Color: "#dc2626",
      imgPath: "/sipderman.png",
      textColor: "#dc2626",
      bgColor: "#e2e4e9",
    },
    variants: [
      {
        id: "classic-rust",
        title: "Rust & Oatmeal",
        description: "Classic earthy tones with high-contrast rust typography and grid dots.",
        previewType: "rust",
      },
      {
        id: "blueprint-dark",
        title: "Technical Dark Ink",
        description: "Monochrome technical dark presentation with high-visibility contrast.",
        previewType: "dark",
      },
    ],
    code: `"use client";

import {
  animate,
  easeOut,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

type OverlappingTextHeroProps = {
  title?: string;
  titleStyle?: string;
  subTitle1?: string;
  subTitle1Color?: string;
  subTitle2?: string;
  subTitle2Color?: string;
  imgPath?: string;
  textColor?: string;
  bgColor?: string;
};

export const OverlappingTextHero = ({
  title = "SPIDER-MAN",
  titleStyle = "",
  subTitle1 = "FRIENDLY NEIGHBORHOOD",
  subTitle1Color = "#2563eb",
  subTitle2 = "WEB-SLINGER",
  subTitle2Color = "#dc2626",
  imgPath = "/sipderman.png",
  textColor = "#dc2626",
  bgColor = "#e2e4e9",
}: OverlappingTextHeroProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
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
    },
  );

  const [introDone, setIntroDone] = useState(false);

  const scrollMask = useTransform(scrollYProgress, [0.3, 1], [15, 8]);

  const maskSize = useMotionValue(3);

  useEffect(() => {
    animate(maskSize, 15, {
      duration: 2.6,
      ease: "easeIn",
      delay: 0.2,
      onComplete: () => setIntroDone(true),
    });
  }, []);

  useEffect(() => {
    if (!introDone) return;

    return scrollMask.on("change", (v) => {
      maskSize.set(v);
    });
  }, [introDone]);

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
                // Dual radial mask apertures for top-left (0% 0%) and top-right (100% 0%)
                WebkitMaskImage: useMotionTemplate\`radial-gradient(circle at 0% 0%, black, transparent \${maskSize}%),radial-gradient(circle at 100% 0%, black, transparent \${maskSize}%)\`,
                maskImage: useMotionTemplate\`radial-gradient(circle at 0% 0%, black, transparent \${maskSize}%),radial-gradient(circle at 100% 0%, black, transparent \${maskSize}%)\`,
              }}
            />
            <div className="flex w-fit flex-col items-stretch">
              {/* Giant Six Caps Lettering */}
              <motion.div
                className={\`font-sixCap flex h-110 w-fit items-center justify-center overflow-hidden text-[34rem] \${titleStyle}\`}
              >
                {title
                  .toLowerCase()
                  .split("")
                  .map((val, idx) => {
                    return (
                      <motion.div
                        className="-mt-18"
                        key={\`\${idx}\`}
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
                        {val === " " ? "\\u00A0" : val}
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
              <img
                src={imgPath}
                alt=""
                className="size-160 object-contain object-bottom"
                style={{ objectPosition: "bottom" }}
              />
            </motion.div>

            {/* Layer 3: Foreground Stroked Text (3D Text Sandwich Effect) */}
            <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center select-none">
              <div className="flex w-fit flex-col items-stretch">
                <div
                  className={\`font-sixCap flex h-110 w-fit items-center justify-center overflow-hidden text-[34rem] \${titleStyle}\`}
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1.5px " + textColor,
                  }}
                  aria-hidden="true"
                >
                  {title
                    .toLowerCase()
                    .split("")
                    .map((val, idx) => (
                      <div key={idx} className="-mt-18">
                        {val === " " ? "\\u00A0" : val}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};`,
    usage: `import { OverlappingTextHero } from "@/components/ui/OverlappingTextHero";

export default function Demo() {
  return (
    <OverlappingTextHero
      title="SPIDER-MAN"
      subTitle1="FRIENDLY NEIGHBORHOOD"
      subTitle1Color="#2563eb"
      subTitle2="WEB-SLINGER"
      subTitle2Color="#dc2626"
      imgPath="/sipderman.png"
      textColor="#dc2626"
      bgColor="#e2e4e9"
    />
  );
}`,
  },
  {
    slug: "bubble-text",
    name: "Bubble Text",
    category: "motion",
    categoryLabel: "Micro-Interactions",
    tagline: "Interactive character proximity typography wave that dynamically alters font weight around the pointer.",
    description:
      "An innovative typographic micro-interaction that splits text into individually monitored glyphs. When the user hovers over any character, a continuous radial Gaussian weight wave radiates outward, inflating neighboring characters with proportional weight steps.",
    thumbnail: "/components/BubbleText.png",
    dependencies: ["framer-motion", "tailwind-merge"],
    installCommand: "pnpm add framer-motion tailwind-merge",
    interactiveType: "Character Index Proximity",
    features: [
      "Dynamic index-based distance calculation per character",
      "Interpolates font-weight from 100 up to 900 in real time",
      "Zero layout shift typography rendering",
      "Fully responsive and supports custom character styling",
    ],
    props: [
      {
        name: "text",
        type: "string",
        defaultValue: '"Bbbbbbble text"',
        required: true,
        description: "The string content rendered into interactive glyphs.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Tailwind CSS classes for the headline container element.",
      },
      {
        name: "charClassName",
        type: "string",
        defaultValue: "undefined",
        description: "Optional classes applied directly to each individual character span.",
      },
      {
        name: "style",
        type: "React.CSSProperties",
        defaultValue: "undefined",
        description: "Inline styles for the headline wrapper.",
      },
    ],
    defaultCustomizer: {
      text: "Bbbbbbble text",
    },
    variants: [
      {
        id: "hero-display",
        title: "Pixel Art Display",
        description: "Bold display lettering with stark black ink and proportional expansion.",
        previewType: "display",
      },
      {
        id: "indigo-glow",
        title: "Indigo Modernist",
        description: "Soft typography wave with atmospheric indigo gradients.",
        previewType: "indigo",
      },
      {
        id: "compact-tagline",
        title: "Compact Subtitle Wave",
        description: "Medium scale character wave suitable for section dividers.",
        previewType: "compact",
      },
    ],
    code: `"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

type PropType = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  charClassName?: string;
  charStyle?: React.CSSProperties;
};

export const BubbleText = ({
  text = "Bbbbbbble text",
  className,
  style,
  charClassName,
  charStyle,
  ...props
}: PropType) => {
  const [currentHoverValue, setCurrentHoverValue] = useState<number | null>(
    null
  );

  const chars = useMemo(() => {
    return text.split("");
  }, [text]);

  return (
    <h2
      className={twMerge(
        "font-raleway text-center text-9xl font-thin wrap-anywhere text-indigo-300",
        className
      )}
      style={style}
      {...props}
    >
      {chars.map((child, idx) => {
        const distance =
          currentHoverValue === null ? null : Math.abs(idx - currentHoverValue);
        return (
          <motion.span
            className={twMerge(
              "transition-all hover:font-black",
              charClassName
            )}
            style={charStyle}
            animate={{
              fontWeight:
                distance === 0
                  ? 900
                  : distance === 1
                  ? 700
                  : distance === 2
                  ? 500
                  : 100,

              opacity: currentHoverValue === null ? 0.5 : 1,
            }}
            transition={{ duration: 0 }}
            onMouseEnter={() => {
              setCurrentHoverValue(idx);
            }}
            onMouseLeave={() => {
              setCurrentHoverValue(null);
            }}
            key={idx}
          >
            {child}
          </motion.span>
        );
      })}
    </h2>
  );
};`,
    usage: `import { BubbleText } from "@/components/ui/BubbleText";

export default function Demo() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <BubbleText text="Bbbbbbble text" />
    </div>
  );
}`,
  },
  {
    slug: "telescope-hero",
    name: "Telescope Hero",
    category: "hero",
    categoryLabel: "Hero & Parallax",
    tagline: "Multi-layer focal parallax hero with physics-calibrated floating layers and dynamic scroll speed.",
    description:
      "An immersive 3D-like focal parallax landing section. Orchestrates multiple visual layers positioned at simulated physical depths that drift and telescope at varying relative velocities as the user scrolls, creating a remarkable illusion of optical depth.",
    thumbnail: "/components/TelescopeHero.png",
    dependencies: ["framer-motion"],
    installCommand: "pnpm add framer-motion",
    interactiveType: "Multi-Axis Focal Depth Parallax",
    features: [
      "Layered optical depth planes with independent velocity coefficients",
      "Spring-smooth scroll tracking with zero layout thrashing",
      "Modular image card coordinates and rotation offsets",
      "Touch and trackpad optimized physics",
    ],
    props: [
      {
        name: "quote",
        type: "string",
        defaultValue: '"Life is either a daring adventure or nothing at all"',
        description: "Main typography quote statement animated through optical parallax depths.",
      },
      {
        name: "bgImage",
        type: "string",
        defaultValue: '"mountains-wallpaper.jpg"',
        description: "Panoramic backdrop image revealed at final zoom depth.",
      },
    ],
    defaultCustomizer: {
      quote: "Life is either a daring adventure or nothing at all",
    },
    variants: [
      {
        id: "classic-gallery",
        title: "Curated Photography",
        description: "Artistic floating photographic frames drifting across varied depths.",
        previewType: "gallery",
      },
      {
        id: "minimalist-cards",
        title: "Monochrome Cards",
        description: "Clean minimalist typography cards drifting in simulated 3D space.",
        previewType: "minimal",
      },
    ],
    code: `"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

// Mock data for images with different positions and "depth" (speed)
const FLOATING_IMAGES_1 = [
  {
    id: 1,
    src: "https://picsum.photos/200/300", // 3:4 portrait
    top: "1%",
    left: "22%",
    rotate: "12deg",
    speed: 0.15,
  },
  {
    id: 2,
    src: "https://picsum.photos/400/310", // 4:3 landscape
    top: "12%",
    left: "68%",
    rotate: "8deg",
    speed: 0.35,
  },
  {
    id: 3,
    src: "https://picsum.photos/350/350", // 1:1 square
    top: "45%",
    left: "8%",
    rotate: "-6deg",
    speed: 0.25,
  },
  {
    id: 4,
    src: "https://picsum.photos/400/300", // 4:3 landscape
    top: "55%",
    left: "72%",
    rotate: "10deg",
    speed: 0.5,
  },
  {
    id: 5,
    src: "https://picsum.photos/300/400", // 3:4 portrait
    top: "64%",
    left: "38%",
    rotate: "-4deg",
    speed: 0.3,
  },
  {
    id: 6,
    src: "https://picsum.photos/600/400", // 3:2 landscape (hero image)
    top: "18%",
    left: "38%",
    rotate: "3deg",
    speed: 0.2,
  },
  {
    id: 7,
    src: "https://picsum.photos/300/450", // 2:3 portrait
    top: "5%",
    left: "85%",
    rotate: "-15deg",
    speed: 0.4,
  },
  {
    id: 8,
    src: "https://picsum.photos/500/300", // 5:3 landscape
    top: "25%",
    left: "5%",
    rotate: "5deg",
    speed: 0.1,
  },
];

const FLOATING_IMAGES_2 = [
  {
    id: 1,
    src: "https://picsum.photos/id/1015/400/600", // 2:3 portrait
    top: "8%",
    left: "15%",
    rotate: "-8deg",
    speed: 0.28,
  },
  {
    id: 2,
    src: "https://picsum.photos/id/1016/600/400", // 3:2 landscape
    top: "13%",
    left: "60%",
    rotate: "15deg",
    speed: 0.4,
  },
  {
    id: 3,
    src: "https://picsum.photos/id/101/400/400", // 1:1 square
    top: "55%",
    left: "12%",
    rotate: "10deg",
    speed: 0.3,
  },
  {
    id: 4,
    src: "https://picsum.photos/id/1018/500/350", // 10:7 landscape
    top: "65%",
    left: "68%",
    rotate: "-12deg",
    speed: 0.45,
  },
  {
    id: 5,
    src: "https://picsum.photos/id/1019/350/500", // 7:10 portrait
    top: "82%",
    left: "42%",
    rotate: "6deg",
    speed: 0.25,
  },
  {
    id: 6,
    src: "https://picsum.photos/id/1020/800/450", // 16:9 landscape (hero image)
    top: "15%",
    left: "35%",
    rotate: "-5deg",
    speed: 0.35,
  },
  {
    id: 7,
    src: "https://picsum.photos/id/1021/500/600", // 1:2 portrait
    top: "23%",
    left: "76%",
    rotate: "18deg",
    speed: 0.35,
  },
];

export const TelescopeHero = () => {
  const ref = useRef(null);
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
  const opacityZ1 = useTransform(scrollYProgress, [0, 0.2], [0.85, 1]);
  const opacityZ2 = useTransform(scrollYProgress, [0.2, 0.7], [0, 1]);

  // Pre-compute transformed z values
  const z1Values = FLOATING_IMAGES_1.map((val) =>
    useTransform(z1, (latest) => latest * val.speed)
  );
  const z2Values = FLOATING_IMAGES_2.map((val) =>
    useTransform(z2, (latest) => latest * val.speed)
  );

  return (
    <div ref={ref} className="h-[500vh] w-full">
      <div className="sticky top-0 left-0 flex h-screen w-full items-center justify-center overflow-hidden bg-neutral-900 perspective-near">
        {FLOATING_IMAGES_1.map((val, idx) => (
          <motion.img
            key={idx}
            src={val.src}
            className="absolute z-30 w-2xs"
            style={{
              top: val.top,
              left: val.left,
              rotate: val.rotate,
              z: z1Values[idx],
              opacity: opacityZ1,
            }}
          />
        ))}
        {FLOATING_IMAGES_2.map((val, idx) => (
          <motion.img
            key={idx}
            src={val.src}
            className="absolute z-30 w-2xs"
            style={{
              top: val.top,
              left: val.left,
              rotate: val.rotate,
              z: z2Values[idx],
              opacity: opacityZ2,
            }}
          />
        ))}

        <motion.div
          layout
          className="font-bebasNeue z-40 text-center font-black mix-blend-difference"
          style={{
            scale: textScale,
            y: textY,
            x: textX,
            width: textWidth,
            color: textColor,
            fontSize: textFontSize,
          }}
        >
          Life is either a daring adventure or nothing at all
        </motion.div>
        <motion.img
          className="absolute top-0 left-0 h-screen w-full object-cover object-center"
          src="/mountains-wallpaper.jpg"
          style={{
            opacity: z3,
            scale: z3,
          }}
        />
      </div>
    </div>
  );
};`,
    usage: `import { TelescopeHero } from "@/components/ui/TelescopeHero";

export default function Demo() {
  return <TelescopeHero />;
}`,
  },
  {
    slug: "magnetic-button",
    name: "Magnetic Button",
    category: "motion",
    categoryLabel: "Micro-Interactions",
    tagline: "Smooth physics-spring magnetic button that follows cursor proximity with soft elastic snapback.",
    description:
      "A high-polish micro-interaction component engineered with Framer Motion springs. When the cursor nears the button, it smoothly attracts the element toward the cursor coordinates up to a configurable maximum distance threshold, dampening with natural Newtonian physics on exit.",
    thumbnail: "/components/MagneticButton.png",
    dependencies: ["framer-motion", "tailwind-merge"],
    installCommand: "pnpm add framer-motion tailwind-merge",
    interactiveType: "Cursor Proximity Physics",
    features: [
      "Zero React re-renders during mousemove via MotionValues",
      "Adjustable physics parameters: stiffness, damping, and mass",
      "Direction-aware attraction clamped by maxDistance threshold",
      "Smooth spring release with zero layout shift",
    ],
    props: [
      {
        name: "maxDistance",
        type: "number",
        defaultValue: "30",
        description: "Maximum distance in pixels the button is allowed to pull toward the pointer.",
      },
      {
        name: "stiffness",
        type: "number",
        defaultValue: "150",
        description: "Spring stiffness coefficient. Higher values create a snappier attraction.",
      },
      {
        name: "damping",
        type: "number",
        defaultValue: "10",
        description: "Spring damping factor. Controls oscillation deceleration.",
      },
      {
        name: "mass",
        type: "number",
        defaultValue: "0.1",
        description: "Simulated physical mass of the button. Lower mass feels lighter and faster.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Tailwind CSS classes for styling the inner interactive button element.",
      },
      {
        name: "bgClassName",
        type: "string",
        defaultValue: "undefined",
        description: "Tailwind CSS classes for the magnetic backdrop or container element.",
      },
    ],
    defaultCustomizer: {
      label: "Follow",
      maxDistance: 30,
      stiffness: 150,
      damping: 10,
      mass: 0.1,
    },
    variants: [
      {
        id: "blueprint",
        title: "Blueprint Ink & Tape",
        description: "Classic tactile scrapbook aesthetic with dark ink borders and shadow offset.",
        previewType: "blueprint",
      },
      {
        id: "pill",
        title: "Modern Minimal Pill",
        description: "Clean dark tech pill with smooth rounded-full geometry.",
        previewType: "pill",
      },
      {
        id: "gradient",
        title: "Electric Gradient Action",
        description: "High-contrast electric blue gradient with luminous border.",
        previewType: "gradient",
      },
    ],
    code: `"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import React, { useRef, useState, type HTMLProps } from "react";
import { twMerge } from "tailwind-merge";

type MagneticButtonProps = HTMLMotionProps<"button"> & {
  maxDistance?: number;
  bgClassName?: HTMLProps<HTMLElement>["className"];
  bgStyle?: React.CSSProperties;
  stiffness?: number;
  damping?: number;
  mass?: number;
};

export const MagneticButton = ({
  style,
  bgStyle,
  className,
  bgClassName,
  maxDistance = 30,
  stiffness = 150,
  damping = 10,
  mass = 0.1,
  children,
  ...props
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values to avoid React re-renders during mousemove
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth physics spring applied to the raw coordinates
  const x = useSpring(rawX, { stiffness, damping, mass });
  const y = useSpring(rawY, { stiffness, damping, mass });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const { clientX, clientY } = e;

    let deltaX = clientX - (left + width / 2);
    let deltaY = clientY - (top + height / 2);

    const distance = Math.hypot(deltaX, deltaY);
    if (distance > maxDistance) {
      const scale = maxDistance / distance;
      deltaX *= scale;
      deltaY *= scale;
    }

    rawX.set(deltaX);
    rawY.set(deltaY);
    if (!isHovered) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setIsHovered(false);
  };

  return (
    <div
      className={twMerge(
        "inline-block rounded-2xl transition-all duration-200",
        isHovered
          ? "border-[3px] border-dashed border-zinc-100 bg-zinc-900"
          : "",
        bgClassName
      )}
      style={bgStyle}
    >
      <motion.div
        ref={ref}
        style={{ x, y, cursor: "pointer" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.button
          type="button"
          className={twMerge(
            "rounded-2xl bg-zinc-200 px-6 py-4 text-center font-semibold text-zinc-900",
            className
          )}
          style={style}
          {...props}
        >
          {children}
        </motion.button>
      </motion.div>
    </div>
  );
};`,
    usage: `import { MagneticButton } from "@/components/ui/MagneticButton";

export default function Demo() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <MagneticButton>Follow</MagneticButton>
    </div>
  );
}`,
  },
  {
    slug: "radial-gradient-card",
    name: "Radial Gradient Card",
    category: "cards",
    categoryLabel: "Cards & Containers",
    tagline: "Luminous cursor-following spotlight card that dynamically renders an organic radial glow under mouse coordinates.",
    description:
      "A sleek container component that tracks pointer movements across its surface to drive a hardware-accelerated CSS radial gradient. Delivers an atmospheric, subtle illumination effect that elevates cards and dashboards without heavy re-renders.",
    thumbnail: "/components/RadialGradientAnimateCard.png",
    dependencies: ["framer-motion", "tailwind-merge"],
    installCommand: "pnpm add framer-motion tailwind-merge",
    interactiveType: "2D Surface Pointer Tracking",
    features: [
      "Hardware-accelerated CSS template strings via useMotionTemplate",
      "Configurable spotlight color, shape, radius, and opacity",
      "Smooth entrance and exit alpha fading",
      "Seamless nesting of interactive card contents and actions",
    ],
    props: [
      {
        name: "radialGradient",
        type: "RadialGradientConfig",
        defaultValue: "{}",
        description: "Options object containing color1, color2, shape ('circle' | 'ellipse'), size, and opacity.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "undefined",
        description: "Tailwind CSS classes for styling the outer card border, background, and padding.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        required: true,
        description: "Content rendered within the illuminated card container.",
      },
    ],
    defaultCustomizer: {
      color1: "rgba(59, 130, 246)",
      size: "10rem",
      badge: "Trending",
      title: "Classic Sports Shoes",
      description:
        "Experience comfort and style with our latest minimalist sports design, perfect for both athletic performance and everyday casual wear.",
    },
    variants: [
      {
        id: "electric-blue",
        title: "Electric Blue Specimen",
        description: "Rich cobalt glow with high-contrast architectural typography.",
        previewType: "blue",
      },
      {
        id: "amber-glow",
        title: "Warm Amber Spotlight",
        description: "Warm golden glow reminiscent of incandescent drafting lamps.",
        previewType: "amber",
      },
      {
        id: "emerald-matrix",
        title: "Mint Cybernetic",
        description: "Refined emerald glow tailored for technical telemetry and metrics.",
        previewType: "mint",
      },
    ],
    code: `"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type HTMLMotionProps,
} from "framer-motion";
import React, { useState, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type RadialGradientConfig = {
  color1?: string;
  color2?: string;
  shape?: "ellipse" | "circle";
  size?: string;
  opacity?: number;
};

type CardPropsType = HTMLMotionProps<"div"> & {
  radialGradient?: RadialGradientConfig;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
};

export const RadialGradientAnimateCard = ({
  style,
  radialGradient = {},
  className,
  children,
  ...props
}: CardPropsType) => {
  // Extract configuration with sensible fallback defaults
  const {
    color1 = "rgba(59, 130, 246)",
    color2 = "transparent",
    shape = "circle",
    size = "10rem",
    opacity = 0.5,
  } = radialGradient;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const background = useMotionTemplate\`radial-gradient(\${shape} \${size} at \${mouseX}px \${mouseY}px, \${color1}, \${color2})\`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { left, top } = e.currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={twMerge(
        "group relative max-w-md overflow-hidden rounded-xl border border-blue-500/20 bg-[#090d16] px-8 py-16 text-[#94a3b8] shadow-2xl",
        className
      )}
      style={style}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300"
        style={{
          background,
          opacity: isHovered ? opacity : 0,
        }}
      />
      {children}
    </motion.div>
  );
};`,
    usage: `import { RadialGradientAnimateCard } from "@/components/ui/RadialGradientAnimateCard";

export default function Demo() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <RadialGradientAnimateCard className="p-0 max-w-sm">
        <img
          className="h-48 w-full rounded-md object-cover"
          src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1479&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
          alt="Classic Sports Shoes"
        />

        <div className="p-5">
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            Trending
          </span>

          <h3 className="mt-1 text-xl font-bold text-gray-300">
            Classic Sports Shoes
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-gray-400">
            Experience comfort and style with our latest minimalist sports
            design, perfect for both athletic performance and everyday casual
            wear.
          </p>

          <button className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
            Buy Now
          </button>
        </div>
      </RadialGradientAnimateCard>
    </div>
  );
}`,
  },
  {
    slug: "binary-grid",
    name: "Binary Grid",
    category: "backgrounds",
    categoryLabel: "Backgrounds & FX",
    tagline: "Dynamic cursor-revealed matrix stream that exposes an organic radial aperture over encoded binary streams.",
    description:
      "A high-impact atmospheric backdrop component that renders a dense typographic binary grid (0100101...). As the pointer moves across the screen, a spring-driven radial mask opens an illuminated window over the encrypted character stream.",
    thumbnail: "/components/BinaryGrid-v3.png",
    dependencies: ["framer-motion"],
    installCommand: "pnpm add framer-motion",
    interactiveType: "Radial Aperture Masking",
    features: [
      "Spring-dampened motion coordinates and radius expansion",
      "CSS mask-image composition with smooth edge gradient feathering",
      "Lightweight pseudo-element typography streaming",
      "Interactive Easter egg text integrated into the binary matrix",
    ],
    props: [
      {
        name: "circleSize",
        type: "number",
        defaultValue: "60",
        description: "Radius in pixels of the revealed aperture spotlight.",
      },
      {
        name: "stiffness",
        type: "number",
        defaultValue: "300",
        description: "Spring stiffness for pointer tracking responsiveness.",
      },
      {
        name: "damping",
        type: "number",
        defaultValue: "30",
        description: "Spring damping factor for smooth deceleration.",
      },
    ],
    defaultCustomizer: {
      circleSize: 60,
      stiffness: 300,
      damping: 30,
    },
    variants: [
      {
        id: "classic-matrix",
        title: "Monochrome Stream",
        description: "Clean dark background with high-contrast feathered binary reveal.",
        previewType: "classic",
      },
      {
        id: "blueprint-cyan",
        title: "Blueprint Engineering Grid",
        description: "Technical blueprint styling with cyan luminous mask.",
        previewType: "cyan",
      },
    ],
    code: `"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import React from "react";
import "./BinaryGrid.css";

export type BinaryGridProps = {
  circleSize?: number;
  stiffness?: number;
  damping?: number;
};

export const BinaryGrid: React.FC<BinaryGridProps> = ({
  circleSize: defaultCircleSize = 60,
  stiffness = 300,
  damping = 30,
}) => {
  const mouseX = useMotionValue<number>(0);
  const mouseY = useMotionValue<number>(0);
  const circleSize = useMotionValue<number>(0);

  const springSize = useSpring(circleSize, {
    mass: 2,
    damping: 20,
    stiffness: 200,
    bounce: 0,
  });
  const springX = useSpring(mouseX, { stiffness, damping });
  const springY = useSpring(mouseY, { stiffness, damping });

  const background = useMotionTemplate\`radial-gradient(circle \${springSize}px at \${springX}px \${springY}px, rgba(255, 255, 255, 0.7) 70%, rgba(255, 255, 255, 0.15) 100%)\`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => circleSize.set(0)}
        onMouseEnter={() => circleSize.set(defaultCircleSize)}
        id="static-binary-grid"
        className="absolute top-0 left-1/2 z-1 h-full max-h-screen w-screen -translate-x-1/2 transform overflow-hidden"
        style={{
          WebkitMaskImage: background,
          maskImage: background,
        }}
      />
    </div>
  );
};`,
    usage: `import { BinaryGrid } from "@/components/showcase/BinaryGrid";

export default function Demo() {
  return (
    <div className="relative min-h-screen w-full bg-neutral-950">
      <BinaryGrid circleSize={60} stiffness={300} damping={30} />
    </div>
  );
}`,
  },
];

export function getComponentBySlug(slug: string): CraftComponent | undefined {
  if (slug === "radial-gradient-animate-card") {
    return CRAFT_COMPONENTS.find(
      (c) => c.slug === "radial-gradient-animate-card" || c.slug === "radial-gradient-card"
    );
  }
  return CRAFT_COMPONENTS.find((c) => c.slug === slug);
}

export function getAllComponents(): CraftComponent[] {
  return CRAFT_COMPONENTS;
}

export function getComponentsByCategory(category: ComponentCategory): CraftComponent[] {
  if (category === "all") return CRAFT_COMPONENTS;
  return CRAFT_COMPONENTS.filter((c) => c.category === category);
}
