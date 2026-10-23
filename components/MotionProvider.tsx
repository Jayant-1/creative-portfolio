"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

const loadFeatures = async () => {
  // Let the server-rendered page paint before downloading optional motion features.
  // Two animation frames yield a paint opportunity without a fixed opening delay.
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
  return (await import("@/lib/motion-features")).default;
};

export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
