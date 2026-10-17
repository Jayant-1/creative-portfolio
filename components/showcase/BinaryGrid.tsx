"use client";

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

  const background = useMotionTemplate`radial-gradient(circle ${springSize}px at ${springX}px ${springY}px, rgba(255, 255, 255, 0.7) 70%, rgba(255, 255, 255, 0.15) 100%)`;

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
};
