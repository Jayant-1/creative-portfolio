"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Testimonial } from "@/lib/testimonials";
import { TestimonialCard } from "./TestimonialCard";

interface OptionDeskDeckProps {
  items: Testimonial[];
}

export function OptionDeskDeck({ items }: OptionDeskDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState<"left" | "right">("right");
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const total = items.length;
  if (total === 0) return null;

  const currentItem = items[currentIndex];
  const nextItem = items[(currentIndex + 1) % total];
  const prevItem = items[(currentIndex - 1 + total) % total];

  const goNext = () => {
    setFlipDirection("right");
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const goPrev = () => {
    setFlipDirection("left");
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Mobile Touch Swipe Handlers (Preserves vertical page scroll with touch-pan-y)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Detect horizontal swipe if deltaX is dominant (> 1.4x deltaY) and exceeds 35px
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl py-6 select-none touch-pan-y">
      {/* 3-Layer Stacked Cards Deck with Touch Swipe */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative mx-auto h-[440px] sm:h-[420px] w-full max-w-xl px-4 flex items-center justify-center touch-pan-y"
      >
        {/* Layer 3: Deepest Background Peek Card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute w-full max-w-lg -rotate-[4deg] scale-[0.92] opacity-40 blur-[0.6px] transition-all duration-300"
          style={{ top: "8px" }}
        >
          <TestimonialCard testimonial={prevItem} />
        </div>

        {/* Layer 2: Mid Peek Card */}
        <div
          aria-hidden="true"
          onClick={goNext}
          className="absolute w-full max-w-lg cursor-pointer rotate-[3deg] scale-[0.96] opacity-75 transition-all duration-300 hover:rotate-[4.5deg]"
          style={{ top: "14px" }}
        >
          <TestimonialCard testimonial={nextItem} />
        </div>

        {/* Layer 1: Front Active Card */}
        <div
          key={currentItem.id}
          className={`relative z-20 w-full max-w-lg transition-transform duration-300 ${
            flipDirection === "right" ? "animate-in slide-in-from-right-4 fade-in-60" : "animate-in slide-in-from-left-4 fade-in-60"
          }`}
        >
          <TestimonialCard testimonial={currentItem} />
        </div>
      </div>

      {/* Desk Deck Controls */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[var(--ca-ink)]/15 pt-6 sm:flex-row px-4">
        {/* Monospace Counter */}
        <div className="flex items-center gap-2 ca-mono text-sm font-bold uppercase tracking-wider text-[var(--ca-ink)]">
          <span className="text-[var(--ca-blue)]">0{currentIndex + 1}</span>
          <span className="text-[var(--ca-ink)]/40">/</span>
          <span>0{total}</span>
          <span className="text-xs font-normal text-[var(--ca-ink)]/60">
            • {currentItem.type === "client" ? "Client Review" : "Peer Review"}
          </span>
        </div>

        {/* Card Selector Pills with 44px Minimum Touch Targets */}
        <div className="flex items-center gap-1">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setFlipDirection(idx > currentIndex ? "right" : "left");
                setCurrentIndex(idx);
              }}
              aria-label={`Show testimonial ${idx + 1}`}
              className="flex h-11 min-w-[28px] items-center justify-center px-1"
            >
              <span
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-7 bg-[var(--ca-ink)]"
                    : "w-2.5 bg-[var(--ca-ink)]/20 hover:bg-[var(--ca-ink)]/50"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Navigation Buttons with 44x44px Touch Targets */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous testimonial"
            className="ca-spring-hover flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--ca-ink)] bg-white text-[var(--ca-ink)] shadow-[2px_2px_0_var(--ca-ink)] hover:bg-[var(--ca-yellow)] active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next testimonial"
            className="ca-spring-hover flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--ca-ink)] bg-white text-[var(--ca-ink)] shadow-[2px_2px_0_var(--ca-ink)] hover:bg-[var(--ca-yellow)] active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
