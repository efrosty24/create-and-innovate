"use client";

import { useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Order: [center first, right when center=0, left when center=0] so prev/next give product left, design right
const IMAGES = [
  { src: "/Prism_Watch3.png", alt: "Prism Watch" },
  { src: "/design.png", alt: "Prism microcontroller design" },
  { src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80", alt: "Prism device - wearable safety beacon" },
] as const;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const prev = (current - 1 + IMAGES.length) % IMAGES.length;
  const next = (current + 1) % IMAGES.length;

  return (
    <div className="mt-10 w-full max-w-4xl sm:mt-16">
      <div className="relative flex items-center justify-center gap-2 sm:gap-4">
        {/* Left (previous) - smaller, opaque */}
        <button
          type="button"
          onClick={() => setCurrent(prev)}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#ff6b35] sm:left-2"
          aria-label="Previous image"
        >
          <FiChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>

        <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
          {/* Left image - smaller, opaque when not current */}
          <div
            className={`relative hidden sm:block w-[22%] max-w-[140px] aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900 transition-all duration-300 ${
              current === prev ? "opacity-100 scale-100" : "opacity-40 scale-95 cursor-pointer"
            }`}
            onClick={() => current !== prev && setCurrent(prev)}
          >
            <Image
              src={IMAGES[prev].src}
              alt={IMAGES[prev].alt}
              fill
              className="object-contain"
              sizes="140px"
            />
          </div>

          {/* Center - main image */}
          <div className="relative w-full max-w-xl aspect-[4/3] overflow-hidden rounded-xl bg-zinc-900 sm:rounded-2xl flex-shrink-0 shadow-xl">
            <Image
              src={IMAGES[current].src}
              alt={IMAGES[current].alt}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 576px"
              priority={current === 0}
            />
          </div>

          {/* Right image - smaller, opaque when not current */}
          <div
            className={`relative hidden sm:block w-[22%] max-w-[140px] aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900 transition-all duration-300 ${
              current === next ? "opacity-100 scale-100" : "opacity-40 scale-95 cursor-pointer"
            }`}
            onClick={() => current !== next && setCurrent(next)}
          >
            <Image
              src={IMAGES[next].src}
              alt={IMAGES[next].alt}
              fill
              className="object-contain"
              sizes="140px"
            />
          </div>
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => setCurrent(next)}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#ff6b35] sm:right-2"
          aria-label="Next image"
        >
          <FiChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>
      </div>

      {/* Dots for mobile / indicator */}
      <div className="mt-4 flex justify-center gap-2 sm:mt-6">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-6 bg-[#ff6b35]" : "w-2 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to image ${i + 1}`}
            aria-current={i === current ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
