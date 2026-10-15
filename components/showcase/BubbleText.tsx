"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

export type BubbleTextProps = {
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
}: BubbleTextProps) => {
  const [currentHoverValue, setCurrentHoverValue] = useState<number | null>(null);

  const chars = useMemo(() => {
    return text.split("");
  }, [text]);

  return (
    <h2
      className={twMerge(
        "font-raleway cursor-default text-center text-6xl sm:text-7xl md:text-8xl font-thin wrap-anywhere text-indigo-300",
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
            className={twMerge("inline-block transition-all hover:font-black", charClassName)}
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
              opacity: currentHoverValue === null ? 0.5 : 1,
            }}
            transition={{ duration: 0 }}
          >
            {child === " " ? "\u00A0" : child}
          </motion.span>
        );
      })}
    </h2>
  );
};
