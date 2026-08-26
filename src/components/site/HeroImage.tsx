"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Hero media — Figma fabric at the artboard's 1392×820 ratio, with a slow
 * ken-burns on a nested layer. Grain is a separate sibling. Reduced motion:
 * still photograph.
 */
export default function HeroImage({
  src,
  active = true,
}: {
  src: string;
  active?: boolean;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const yRaw = useTransform(scrollY, [0, 900], reduce ? [0, 0] : [0, 36]);
  const y = useSpring(yRaw, { stiffness: 140, damping: 32, mass: 0.85 });
  const drift = active && !reduce;

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={reduce ? undefined : { y }}
    >
      <motion.div
        className="absolute -inset-[6%]"
        animate={
          drift
            ? {
                x: ["0%", "-0.9%", "0.6%", "0%"],
                y: ["0%", "-0.7%", "0.5%", "0%"],
                scale: [1.02, 1.045, 1.03, 1.02],
              }
            : undefined
        }
        transition={
          drift
            ? { duration: 28, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        <Image
          src={src}
          alt=""
          fill
          preload
          quality={90}
          sizes="(max-width: 768px) 100vw, 1392px"
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}
