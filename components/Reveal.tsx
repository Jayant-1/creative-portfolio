"use client";

import { useEffect, useRef, useState } from "react";
import { usePageAnimationReady } from "@/components/Motion";

export default function Reveal({
  children,
  className = "",
  delay = 0,
  priority = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(priority);
  const isIntersectingRef = useRef(false);
  const pageReady = usePageAnimationReady();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersectingRef.current = true;
            if (pageReady) {
              setVisible(true);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pageReady]);

  // When pageReady turns true, if already in viewport, trigger reveal immediately
  useEffect(() => {
    if (pageReady && isIntersectingRef.current && !visible) {
      setVisible(true);
    }
  }, [pageReady, visible]);

  return (
    <div
      ref={ref}
      className={`reveal-entry ${visible ? "is-visible" : ""} ${priority ? "is-priority" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
