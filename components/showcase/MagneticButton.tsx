"use client";

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
};
