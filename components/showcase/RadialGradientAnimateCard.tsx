"use client";

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
  children?: ReactNode;

  // Content props matching preview image
  imageSrc?: string;
  badge?: string;
  badgeColor?: string;
  title?: string;
  description?: string;
  buttonText?: string;

  // Flat props support for direct customizer mapping
  color1?: string;
  color2?: string;
  shape?: "ellipse" | "circle";
  size?: string;
  opacity?: number;
};

export const RadialGradientAnimateCard: React.FC<RadialGradientAnimateCardProps> = ({
  style,
  radialGradient = {},
  className,
  children,
  imageSrc = "/images/classic-sports-shoes.jpg",
  badge = "TRENDING",
  badgeColor,
  title = "Classic Sports Shoes",
  description = "Experience comfort and style with our latest minimalist sports design, perfect for both athletic performance and everyday casual wear.",
  buttonText = "Buy Now",
  color1,
  color2,
  shape,
  size,
  opacity,
  ...props
}) => {
  // Extract configuration with fallback to flat props or default values
  const resolvedColor1 = color1 ?? radialGradient.color1 ?? "rgba(59, 130, 246)";
  const resolvedColor2 = color2 ?? radialGradient.color2 ?? "transparent";
  const resolvedShape = shape ?? radialGradient.shape ?? "circle";
  const resolvedSize = size ?? radialGradient.size ?? "10rem";
  const resolvedOpacity = opacity ?? radialGradient.opacity ?? 0.5;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const background = useMotionTemplate`radial-gradient(${resolvedShape} ${resolvedSize} at ${mouseX}px ${mouseY}px, ${resolvedColor1}, ${resolvedColor2})`;

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
        "group relative w-full max-w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#090d16] p-4 text-[#94a3b8] shadow-2xl select-none transition-colors",
        className
      )}
      style={style}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          background,
          opacity: isHovered ? resolvedOpacity : 0,
        }}
      />
      {children || (
        <div className="relative z-10 flex flex-col">
          {/* Product Image Window */}
          <div className="relative h-48 w-full overflow-hidden rounded-xl bg-neutral-900 border border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Product Details matching preview image */}
          <div className="pt-4 flex flex-col">
            <span
              className="font-mono text-xs font-bold uppercase tracking-wider"
              style={{ color: badgeColor || "#3b82f6" }}
            >
              {badge}
            </span>

            <h2 className="mt-1 font-mono text-xl font-bold tracking-tight text-white">
              {title}
            </h2>

            <p className="mt-2 font-mono text-xs leading-relaxed text-neutral-400">
              {description}
            </p>

            <button
              type="button"
              className="mt-5 w-full rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-[0.98] py-2.5 text-center font-mono text-xs font-semibold uppercase tracking-wider text-white transition-all shadow-md focus:outline-hidden cursor-pointer"
            >
              {buttonText}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
