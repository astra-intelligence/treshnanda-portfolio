"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";

/**
 * Hero media — the sliced chromatic ribbon. Keeps its true 1280×540 ratio at
 * all times (never cropped): on desktop it scales down to fit the space left
 * over in the viewport-height hero, centered. Soft pointer parallax on the
 * wrapper only, so the aspect ratio is never touched.
 */
export default function HeroImage({ src }: { src: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 120, damping: 18, mass: 0.4 });
  const transform = useMotionTemplate`translate3d(${springX}px, ${springY}px, 0)`;

  return (
    <motion.div
      ref={ref}
      style={reduce ? undefined : { transform }}
      className="w-full"
      onPointerMove={(e) => {
        if (reduce) return;
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(px * -10);
        y.set(py * -7);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {/* Full-width at its true 1280×540 ratio — never cropped, never distorted. */}
      <Image
        src={src}
        alt="Abstract chromatic ribbon of workflows folding into motion"
        width={1280}
        height={540}
        priority
        sizes="(max-width: 768px) 100vw, 1280px"
        className="block h-auto w-full rounded-[1.5rem] md:rounded-[1.75rem]"
        style={{
          outline: "1px solid oklch(0 0 0 / 0.08)",
          backgroundColor: "#f3f3f3",
        }}
      />
    </motion.div>
  );
}
