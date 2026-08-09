"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

const DEFAULT_SKILLS = [
  "Next.js",
  "TypeScript",
  "PostgreSQL",
  "AI systems",
  "Python",
  "React Native",
  "Docker",
  "Automation",
];

export default function Skills({
  bio,
  skills = DEFAULT_SKILLS,
  updated = "07 / 2026",
}: {
  bio: string;
  skills?: string[];
  updated?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="py-20 md:py-28"
    >
      <div className="site-shell">
        <p className="ink-kicker">03 · About</p>
        <motion.h2
          id="about-title"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={
            reduce
              ? { opacity: 1 }
              : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: ease.out }}
          className="mt-6 max-w-4xl text-[1.6rem] font-medium leading-[1.28] tracking-[-0.015em] text-ink text-pretty md:text-[2.1rem]"
        >
          {bio}
        </motion.h2>

        <div className="mt-16 border-t border-ink-line pt-6">
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="ink-kicker">Technical index</p>
            <p className="ink-kicker">Updated {updated}</p>
          </div>

          {/* Left-packed skill rows, hairline-separated, no vertical dividers. */}
          <ul className="mt-6">
            {[skills.slice(0, 4), skills.slice(4)].map((row, rowIndex) => (
              <li
                key={rowIndex}
                className="flex flex-wrap gap-x-[3.25rem] gap-y-4 border-t border-ink-line py-8"
              >
                {row.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.4,
                      delay: (rowIndex * 4 + i) * 0.04,
                      ease: ease.out,
                    }}
                    className="inline-block text-[1.375rem] tracking-tight text-ink transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5"
                  >
                    {skill}
                  </motion.span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
