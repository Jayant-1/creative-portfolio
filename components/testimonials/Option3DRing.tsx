"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Testimonial } from "@/lib/testimonials";
import { TestimonialCard } from "./TestimonialCard";

interface Option3DRingProps {
  items: Testimonial[];
}

export function Option3DRing({ items }: Option3DRingProps) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [radius, setRadius] = useState(380);
  const [cardWidth, setCardWidth] = useState(320);
  const [activeIdx, setActiveIdx] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; rotation: number; time: number }>({ x: 0, rotation: 0, time: 0 });
  const velocityRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const total = items.length;
  const angleStep = total > 0 ? 360 / total : 60;

  // Responsive radius & card width adjustments
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCardWidth(270);
        setRadius(Math.max(260, Math.round((270 / 2) / Math.tan(Math.PI / Math.max(total, 4)))));
      } else if (width < 1024) {
        setCardWidth(310);
        setRadius(Math.max(340, Math.round((310 / 2) / Math.tan(Math.PI / Math.max(total, 4)))));
      } else {
        setCardWidth(340);
        setRadius(Math.max(400, Math.round((340 / 2) / Math.tan(Math.PI / Math.max(total, 4)))));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [total]);

  // Determine current active front card based on rotation
  useEffect(() => {
    if (total === 0) return;
    const normalized = ((-rotation % 360) + 360) % 360;
    const closestIdx = Math.round(normalized / angleStep) % total;
    setActiveIdx(closestIdx);
  }, [rotation, angleStep, total]);

  // Inertia animation loop after pointer release
  const applyInertia = useCallback(() => {
    if (Math.abs(velocityRef.current) < 0.04) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    setRotation((prev) => prev + velocityRef.current);
    velocityRef.current *= 0.92; // Friction decay
    animFrameRef.current = requestAnimationFrame(applyInertia);
  }, []);

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      rotation,
      time: Date.now(),
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const newRotation = dragStartRef.current.rotation + deltaX * 0.35;
    
    // Calculate instantaneous velocity
    const now = Date.now();
    const dt = Math.max(16, now - dragStartRef.current.time);
    velocityRef.current = (deltaX * 0.35) / (dt / 16);
    dragStartRef.current.time = now;
    
    setRotation(newRotation);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    animFrameRef.current = requestAnimationFrame(applyInertia);
  };

  // Next / Prev step navigation with snapping
  const rotateStep = (direction: "prev" | "next") => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const delta = direction === "next" ? -angleStep : angleStep;
    const target = Math.round((rotation + delta) / angleStep) * angleStep;
    setRotation(target);
  };

  const rotateToIndex = (idx: number) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const target = -idx * angleStep;
    setRotation(target);
  };

  return (
    <div className="relative mx-auto w-full max-w-6xl py-4 sm:py-8 overflow-hidden select-none">
      {/* 3D Ring Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative mx-auto flex h-[520px] sm:h-[560px] w-full items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          perspective: "1300px",
          WebkitPerspective: "1300px",
          perspectiveOrigin: "50% 50%",
          WebkitPerspectiveOrigin: "50% 50%",
        }}
      >
        {/* The Rotating 3D Cylinder Anchor */}
        <div
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            transform: `rotateY(${rotation}deg) translate3d(0, 0, 0)`,
            WebkitTransform: `rotateY(${rotation}deg) translate3d(0, 0, 0)`,
            transition: isDragging ? "none" : "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {items.map((item, idx) => {
            const cardAngle = idx * angleStep;
            
            // Calculate relative angle to camera (-180 to +180)
            const relAngle = ((((cardAngle + rotation) % 360) + 540) % 360) - 180;
            const isFacingFront = Math.abs(relAngle) < 85;
            const isFocalCenter = Math.abs(relAngle) < 25;

            return (
              <div
                key={item.id}
                onClick={(e) => {
                  if (Math.abs(relAngle) > 20) {
                    e.stopPropagation();
                    rotateToIndex(idx);
                  }
                }}
                className={`absolute top-1/2 left-1/2 will-change-transform transition-opacity duration-300 ${
                  isFocalCenter ? "z-30 cursor-default" : "z-10 cursor-pointer"
                }`}
                style={{
                  width: `${cardWidth}px`,
                  marginLeft: `-${cardWidth / 2}px`,
                  marginTop: "-225px",
                  transformStyle: "preserve-3d",
                  WebkitTransformStyle: "preserve-3d",
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px) scale(${isFocalCenter ? 1.02 : 0.94}) translate3d(0, 0, 0)`,
                  WebkitTransform: `rotateY(${cardAngle}deg) translateZ(${radius}px) scale(${isFocalCenter ? 1.02 : 0.94}) translate3d(0, 0, 0)`,
                  opacity: isFacingFront ? (isFocalCenter ? 1 : 0.78) : 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  pointerEvents: isFacingFront ? "auto" : "none",
                }}
              >
                <div
                  style={{
                    filter: isFocalCenter ? "none" : "blur(0.5px)",
                    transition: "filter 0.3s ease",
                  }}
                >
                  <TestimonialCard testimonial={item} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Controls & Drag Guide */}
      <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between px-4 sm:px-8">
        {/* Drag Instruction Cue */}
        <div className="flex items-center gap-2 text-xs ca-mono font-bold uppercase tracking-wider text-[var(--ca-ink)]/70">
          <span className="inline-block animate-pulse">↔</span>
          <span>Drag horizontally to spin 3D ring • Click any card to focus</span>
        </div>

        {/* Navigation Arrows & Dot Indicators with 44px Touch Targets */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => rotateStep("prev")}
            aria-label="Previous testimonial"
            className="ca-spring-hover flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--ca-ink)] bg-white text-[var(--ca-ink)] shadow-[2px_2px_0_var(--ca-ink)] hover:bg-[var(--ca-yellow)] active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Stepper Dots with 44px Touch Targets */}
          <div className="flex items-center gap-0.5 px-1">
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => rotateToIndex(idx)}
                aria-label={`Jump to review by ${item.name}`}
                className="flex h-11 min-w-[28px] items-center justify-center px-1"
              >
                <span
                  className={`h-2.5 rounded-full transition-all ${
                    idx === activeIdx
                      ? "w-6 bg-[var(--ca-ink)] shadow-[1px_1px_0_var(--ca-yellow)]"
                      : "w-2.5 bg-[var(--ca-ink)]/25 hover:bg-[var(--ca-ink)]/60"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => rotateStep("next")}
            aria-label="Next testimonial"
            className="ca-spring-hover flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--ca-ink)] bg-white text-[var(--ca-ink)] shadow-[2px_2px_0_var(--ca-ink)] hover:bg-[var(--ca-yellow)] active:scale-95"
          >
            <ChevronRight size={20} />
          </button>

          <button
            type="button"
            onClick={() => {
              if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
              setRotation(0);
            }}
            title="Reset orientation"
            aria-label="Reset orientation"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--ca-ink)]/30 text-[var(--ca-ink)]/70 hover:text-[var(--ca-ink)] hover:bg-white active:scale-95 transition-colors"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
