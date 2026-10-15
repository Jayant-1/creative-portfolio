"use client";

import React from "react";
import { motion } from "framer-motion";

interface ComponentTransitionProps {
  children: React.ReactNode;
  slug: string;
}

export const ComponentTransition: React.FC<ComponentTransitionProps> = ({
  children,
  slug,
}) => {
  return (
    <motion.div
      key={slug}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 min-w-0 flex flex-col gap-10"
    >
      {children}
    </motion.div>
  );
};
