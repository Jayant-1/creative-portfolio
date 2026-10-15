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
    color1 = "rgba(59, 130, 246)",
    color2 = "transparent",
    shape = "circle",
    size = "10rem",
    opacity = 0.5,
  } = radialGradient;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const background = useMotionTemplate`radial-gradient(${shape} ${size} at ${mouseX}px ${mouseY}px, ${color1}, ${color2})`;

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
};
