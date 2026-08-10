"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Scroll progress hairline pinned to the very top edge. `mix-blend-difference`
 * keeps it legible over both the paper sections and the dark contact zone.
 * Under reduced motion the raw scroll value is used — position indication
 * without the spring's independent motion.
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduce ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-white mix-blend-difference"
    />
  );
}
