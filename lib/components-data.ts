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
      text: "Hover & Pull Me 🧲",
      maxDistance: 35,
      stiffness: 180,
      damping: 12,
      variant: "blueprint",
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

export type MagneticButtonProps = HTMLMotionProps<"button"> & {
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

  // Motion values avoid React re-renders during mousemove
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth physics spring applied to raw coordinates
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
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={twMerge("relative inline-block cursor-pointer", bgClassName)}
      style={bgStyle}
    >
      <motion.button
        style={{ ...style, x, y }}
        className={twMerge(
          "relative z-10 flex select-none items-center justify-center font-medium",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    </div>
  );
};`,
    usage: `import { MagneticButton } from "@/components/ui/MagneticButton";

export default function Demo() {
  return (
    <MagneticButton
      maxDistance={40}
      stiffness={200}
      damping={15}
      className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-blue-700"
    >
      Explore Projects ↗
    </MagneticButton>
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
        defaultValue: '"Bubble Text"',
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
      text: "JAYANT POTDAR",
      fontSize: "text-6xl sm:text-7xl",
      color: "var(--ca-ink)",
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

type BubbleTextProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  charClassName?: string;
  charStyle?: React.CSSProperties;
};

export const BubbleText = ({
  text = "Bubble text",
  className,
  style,
  charClassName,
  charStyle,
  ...props
}: BubbleTextProps) => {
  const [currentHoverValue, setCurrentHoverValue] = useState<number | null>(null);

  const chars = useMemo(() => {
    return text.split("");
  }, [text]);

  return (
    <h2
      className={twMerge(
        "cursor-default text-center text-6xl font-thin tracking-wide wrap-anywhere",
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
            key={idx}
            className={twMerge("inline-block transition-all", charClassName)}
            style={charStyle}
            onMouseEnter={() => setCurrentHoverValue(idx)}
            onMouseLeave={() => setCurrentHoverValue(null)}
            animate={{
              fontWeight:
                distance === 0
                  ? 900
                  : distance === 1
                  ? 700
                  : distance === 2
                  ? 500
                  : 100,
              opacity: currentHoverValue === null ? 0.75 : 1,
            }}
            transition={{ duration: 0.1 }}
          >
            {child === " " ? "\\u00A0" : child}
          </motion.span>
        );
      })}
    </h2>
  );
};`,
    usage: `import { BubbleText } from "@/components/ui/BubbleText";

export default function Demo() {
  return (
    <BubbleText
      text="CREATIVE LAB"
      className="text-7xl font-light text-neutral-900"
    />
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
      color1: "rgba(43, 87, 214, 0.45)",
      size: "12rem",
      title: "Interactive Architecture",
      body: "Luminous spotlight tracks pointer movement across the surface with zero layout cost.",
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

export type RadialGradientConfig = {
  color1?: string;
  color2?: string;
  shape?: "ellipse" | "circle";
  size?: string;
  opacity?: number;
};

export type RadialGradientAnimateCardProps = HTMLMotionProps<"div"> & {
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
}: RadialGradientAnimateCardProps) => {
  const {
    color1 = "rgba(43, 87, 214, 0.45)",
    color2 = "transparent",
    shape = "circle",
    size = "12rem",
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
        "relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
      style={style}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background,
          opacity: isHovered ? opacity : 0,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};`,
    usage: `import { RadialGradientAnimateCard } from "@/components/ui/RadialGradientAnimateCard";

export default function Demo() {
  return (
    <RadialGradientAnimateCard
      radialGradient={{ color1: "rgba(59, 130, 246, 0.5)", size: "14rem" }}
      className="max-w-md border-neutral-800 bg-neutral-900 text-white"
    >
      <h3 className="text-xl font-bold">Interactive Surface</h3>
      <p className="mt-2 text-sm text-neutral-400">
        Move your cursor across this card to watch the spotlight follow.
      </p>
    </RadialGradientAnimateCard>
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
    thumbnail: "/components/BinaryGrid.png",
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
      revealRadius: 80,
      stiffness: 250,
      damping: 25,
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
import React, { useRef } from "react";

export const BinaryGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const circleSize = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const springSize = useSpring(circleSize, {
    mass: 2,
    damping: 20,
    stiffness: 200,
  });

  const background = useMotionTemplate\`radial-gradient(circle \${springSize}px at \${springX}px \${springY}px, rgba(255, 255, 255, 0.85) 60%, transparent 100%)\`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => circleSize.set(70)}
      onMouseLeave={() => circleSize.set(0)}
      className="relative h-96 w-full overflow-hidden rounded-2xl bg-neutral-950 p-6"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-1 select-none font-mono text-[12px] leading-4 tracking-wider text-neutral-500 break-all"
        style={{
          WebkitMaskImage: background,
          maskImage: background,
        }}
      >
        01001010 01100001 01111001 01100001 01101110 01110100 00100000 01010000 01101111 01110100 01100100 01100001 01110010 00100000 01000011 01010010 01000001 01000110 01010100 00100000 01001110 01000001 01000010 00100000 01000011 01001111 01001101 01010000 01001111 01001110 01000101 01001110 01010100 01010011 00100001
      </motion.div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
          Move your cursor inside this canvas
        </p>
        <h3 className="mt-2 text-2xl font-bold text-white">
          Encrypted Stream Aperture
        </h3>
      </div>
    </div>
  );
};`,
    usage: `import { BinaryGrid } from "@/components/ui/BinaryGrid";

export default function Demo() {
  return (
    <div className="w-full">
      <BinaryGrid />
    </div>
  );
}`,
  },
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
        defaultValue: '"JAYANT POTDAR"',
        description: "Primary large headline text rendered across the central canvas.",
      },
      {
        name: "subTitle1",
        type: "string",
        defaultValue: '"Full Stack Engineer"',
        description: "First prominent badge or qualification subtitle.",
      },
      {
        name: "subTitle2",
        type: "string",
        defaultValue: '"Creative Motion Craft"',
        description: "Secondary role or focus area subtitle.",
      },
      {
        name: "textColor",
        type: "string",
        defaultValue: '"#db4b29"',
        description: "Primary typography color.",
      },
      {
        name: "bgColor",
        type: "string",
        defaultValue: '"#e3e2dd"',
        description: "Background color of the hero banner canvas.",
      },
      {
        name: "imgPath",
        type: "string",
        defaultValue: '"/Profile-removebg.png"',
        description: "Path to the transparent cutout profile asset.",
      },
    ],
    defaultCustomizer: {
      title: "JAYANT POTDAR",
      subTitle1: "Full Stack Engineer",
      subTitle2: "Creative Motion Craft",
      textColor: "#db4b29",
      bgColor: "#e3e2dd",
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
  subTitle1?: string;
  subTitle2?: string;
  imgPath?: string;
  textColor?: string;
  bgColor?: string;
};

export const OverlappingTextHero = ({
  title = "JAYANT POTDAR",
  subTitle1 = "Full Stack Engineer",
  subTitle2 = "Creative Motion Craft",
  imgPath = "/Profile-removebg.png",
  textColor = "#db4b29",
  bgColor = "#e3e2dd",
}: OverlappingTextHeroProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const height = useTransform(scrollYProgress, [0, 1], ["100vh", "75vh"]);
  const y = useTransform(scrollYProgress, [0.3, 1], [500, 0], { ease: easeOut });
  const opacity = useTransform(scrollYProgress, [0.85, 1], [0, 1], { ease: easeOut });
  const filter = useTransform(scrollYProgress, [0.3, 1], ["blur(6px)", "blur(0px)"], {
    ease: easeOut,
  });

  const [introDone, setIntroDone] = useState(false);
  const scrollMask = useTransform(scrollYProgress, [0.3, 1], [15, 8]);
  const maskSize = useMotionValue(3);

  useEffect(() => {
    animate(maskSize, 15, {
      duration: 2.2,
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
    <div className="flex h-[150vh] w-full flex-col">
      <div ref={sectionRef} className="h-[150vh] w-full bg-neutral-900">
        <section className="sticky top-0 flex h-screen w-full items-center">
          <motion.div
            className="relative flex w-full flex-col items-center justify-center overflow-hidden"
            style={{ height, color: textColor, backgroundColor: bgColor }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(#e84e27 2px, transparent 0)",
                backgroundSize: "20px 20px",
                WebkitMaskImage: useMotionTemplate\`radial-gradient(circle at 0% 0%, black, transparent \${maskSize}%),radial-gradient(circle at 100% 0%, black, transparent \${maskSize}%)\`,
                maskImage: useMotionTemplate\`radial-gradient(circle at 0% 0%, black, transparent \${maskSize}%),radial-gradient(circle at 100% 0%, black, transparent \${maskSize}%)\`,
              }}
            />
            <div className="relative z-10 flex flex-col items-center text-center">
              <h1 className="text-7xl font-black uppercase tracking-tighter sm:text-9xl">
                {title}
              </h1>
              <motion.div
                style={{ y, opacity, filter }}
                className="mt-4 flex flex-col items-center gap-1 font-mono text-sm uppercase tracking-widest text-neutral-800"
              >
                <span>{subTitle1}</span>
                <span className="font-bold">{subTitle2}</span>
              </motion.div>
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
      title="JAYANT POTDAR"
      subTitle1="Full Stack Engineer"
      subTitle2="Creative Motion Craft"
      textColor="#db4b29"
      bgColor="#e3e2dd"
    />
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
        name: "speedMultiplier",
        type: "number",
        defaultValue: "1",
        description: "Global scalar multiplier adjusting parallax drift speed.",
      },
      {
        name: "headline",
        type: "string",
        defaultValue: '"TELESCOPE"',
        description: "Primary headline centered within the optical focal plane.",
      },
    ],
    defaultCustomizer: {
      headline: "TELESCOPIC DEPTH",
      speedMultiplier: 1.2,
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

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const FLOATING_ITEMS = [
  { id: 1, top: "15%", left: "12%", rotate: "-6deg", speed: 0.25, label: "01 // Physics" },
  { id: 2, top: "22%", left: "75%", rotate: "8deg", speed: 0.45, label: "02 // Motion" },
  { id: 3, top: "60%", left: "18%", rotate: "5deg", speed: 0.35, label: "03 // Parallax" },
  { id: 4, top: "68%", left: "70%", rotate: "-10deg", speed: 0.55, label: "04 // Optics" },
  { id: 5, top: "45%", left: "45%", rotate: "2deg", speed: 0.15, label: "05 // Focus" },
];

export const TelescopeHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative h-[200vh] w-full bg-neutral-950">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Floating parallax planes */}
        {FLOATING_ITEMS.map((item) => {
          const y = useTransform(scrollYProgress, [0, 1], [0, -300 * item.speed]);
          return (
            <motion.div
              key={item.id}
              style={{
                top: item.top,
                left: item.left,
                y,
                rotate: item.rotate,
              }}
              className="absolute z-10 flex h-32 w-44 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-4 font-mono text-xs font-bold text-white shadow-2xl backdrop-blur-md"
            >
              {item.label}
            </motion.div>
          );
        })}

        <div className="relative z-20 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            Scroll to experience optical focal parallax
          </p>
          <h2 className="mt-3 text-7xl font-black uppercase tracking-tight text-white sm:text-9xl">
            TELESCOPE
          </h2>
        </div>
      </div>
    </div>
  );
};`,
    usage: `import { TelescopeHero } from "@/components/ui/TelescopeHero";

export default function Demo() {
  return <TelescopeHero />;
}`,
  },
];

export function getComponentBySlug(slug: string): CraftComponent | undefined {
  return CRAFT_COMPONENTS.find((c) => c.slug === slug);
}

export function getAllComponents(): CraftComponent[] {
  return CRAFT_COMPONENTS;
}

export function getComponentsByCategory(category: ComponentCategory): CraftComponent[] {
  if (category === "all") return CRAFT_COMPONENTS;
  return CRAFT_COMPONENTS.filter((c) => c.category === category);
}
