"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Dot Pattern (Magic UI)
 *
 * An SVG dot grid that fills its container, sized from the element's own
 * bounding box and re-measured on resize. Dots take their colour from the
 * current text colour, so placement is controlled with a text utility.
 *
 * @param width   horizontal spacing between dots
 * @param height  vertical spacing between dots
 * @param x, y    offset of the whole pattern
 * @param cx, cy  offset of individual dots
 * @param cr      dot radius
 * @param glow    fade and pulse each dot on its own random cycle
 */
type Dot = {
  x: number;
  y: number;
  delay: number;
  duration: number;
};

interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  glow?: boolean;
  [key: string]: unknown;
}

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dots, setDots] = useState<Dot[]>([]);

  // The grid is built inside the effect rather than during render. The glow
  // timings come from Math.random, and calling that while rendering breaks
  // React's purity rule: every re-render would reshuffle the animation.
  useEffect(() => {
    const build = () => {
      const el = containerRef.current;
      if (!el) return;

      const { width: w, height: h } = el.getBoundingClientRect();
      const cols = Math.ceil(w / width);
      const rows = Math.ceil(h / height);

      setDots(
        Array.from({ length: cols * rows }, (_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          return {
            x: col * width + cx + x,
            y: row * height + cy + y,
            delay: Math.random() * 5,
            duration: Math.random() * 3 + 2,
          };
        }),
      );
    };

    build();
    window.addEventListener("resize", build);
    return () => window.removeEventListener("resize", build);
  }, [width, height, x, y, cx, cy]);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80",
        className,
      )}
      {...props}
    >
      <defs>
        <radialGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {dots.map((dot) => (
        <motion.circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={cr}
          fill={glow ? `url(#${id}-gradient)` : "currentColor"}
          initial={glow ? { opacity: 0.4, scale: 1 } : {}}
          animate={glow ? { opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] } : {}}
          transition={
            glow
              ? {
                  duration: dot.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: dot.delay,
                  ease: "easeInOut",
                }
              : {}
          }
        />
      ))}
    </svg>
  );
}
