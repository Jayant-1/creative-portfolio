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

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  style,
  bgStyle,
  className,
  bgClassName,
  maxDistance = 30,
  stiffness = 150,
  damping = 10,
  mass = 0.1,
  children = "Hover Me",
  ...props
}) => {
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
};
