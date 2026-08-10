"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
  wrap,
} from "framer-motion";

/**
 * Scroll-velocity marquee. Items drift at a constant base speed, but the
 * scroll velocity feeds back into the motion: scroll down → faster, scroll up
 * → it reverses direction. Strictly monochrome; motion stays calm (no skew)
 * to match the ink/paper direction.
 *
 * Under reduced motion it collapses to a static, evenly-spaced row.
 */
export default function VelocityMarquee({
  items,
  baseVelocity = -3,
}: {
  items: string[];
  baseVelocity?: number;
}) {
  const reduce = useReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // -25% keeps two of the four repeated rows always covering the viewport.
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const Row = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-10 md:gap-16 px-5 md:px-8"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-10 md:gap-16">
          <span className="inline-block text-2xl md:text-5xl font-semibold tracking-[-0.03em] uppercase text-white/25 transition-colors duration-300 hover:text-white/70">
            {item}
          </span>
          <span aria-hidden="true" className="text-white/15 text-lg md:text-2xl">·</span>
        </span>
      ))}
    </div>
  );

  if (reduce) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {items.map((item) => (
          <span
            key={item}
            className="text-lg md:text-2xl font-semibold tracking-[-0.03em] uppercase text-white/25"
          >
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-nowrap overflow-hidden">
      <motion.div className="flex flex-nowrap" style={{ x }}>
        <Row />
        <Row ariaHidden />
        <Row ariaHidden />
        <Row ariaHidden />
      </motion.div>
    </div>
  );
}
