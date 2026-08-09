"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease, spring } from "@/lib/motion";

export default function FooterWordmark() {
  const reduce = useReducedMotion();
  const letters = "TRESHNANDA".split("");

  return (
    <footer className="bg-white">
      <div className="site-shell py-10 md:py-14">
        <div className="mb-10 grid grid-cols-1 gap-2 text-[13px] text-ink-faint md:mb-14 md:grid-cols-3 md:gap-4">
          <span className="justify-self-start">© 2026 Treshnanda</span>
          <span className="hidden text-center md:block">Automation engineer in Bali</span>
          <span className="justify-self-end tabular-nums">08°39&apos;S 115°13&apos;E · GMT+8</span>
        </div>

        <h2
          aria-label="Treshnanda"
          className="flex w-full select-none items-center justify-between overflow-hidden font-bold uppercase leading-[0.82] tracking-[-0.035em] text-ink"
          style={{ fontSize: "clamp(2.4rem, 12.2vw, 11rem)" }}
        >
          {letters.map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: "0.4em" }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.035,
                ease: ease.out,
              }}
              className="inline-block cursor-default"
            >
              <motion.span
                className="inline-block"
                whileHover={reduce ? undefined : { y: "-0.1em" }}
                transition={spring.pop}
              >
                {letter}
              </motion.span>
            </motion.span>
          ))}
        </h2>
      </div>
    </footer>
  );
}
