"use client";

import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

export type BubbleTextProps = {
  text?: string;
  className?: string;
  style?: React.CSSProperties;
  charClassName?: string;
  charStyle?: React.CSSProperties;
};

export const BubbleText: React.FC<BubbleTextProps> = ({
  text = "Bbbbbbble text",
  className,
  style,
  charClassName,
  charStyle,
  ...props
}) => {
  const [currentHoverValue, setCurrentHoverValue] = useState<number | null>(null);

  const chars = useMemo(() => {
    return text.split("");
  }, [text]);

  return (
    <h2
      className={twMerge(
        "font-raleway text-center text-7xl sm:text-8xl md:text-9xl font-thin wrap-anywhere text-indigo-300 select-none",
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
            className={twMerge(
              "transition-all hover:font-black inline-block",
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
          >
            {child === " " ? "\u00A0" : child}
          </motion.span>
        );
      })}
    </h2>
  );
};
