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
    color1 = "rgba(43, 87, 214, 0.45)",
    color2 = "transparent",
    shape = "circle",
    size = "12rem",
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
};
