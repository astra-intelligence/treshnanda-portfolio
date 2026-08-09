"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  educationEntries,
  experienceEntries,
} from "@/data/experience";
import { ease } from "@/lib/motion";

export default function Experience() {
  const reduce = useReducedMotion();

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="py-20 md:py-28"
    >
      <div className="site-shell grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(6px)" }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: ease.out }}
          >
            <p className="ink-kicker">02 · Experience</p>
            <h2 id="experience-title" className="ink-display mt-4">
              Where I&apos;ve worked.
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-muted">
              Four roles across AI products, ML pipelines, and developer education.
            </p>
          </motion.div>

          <div className="mt-12 border-t border-ink-line pt-8">
            <p className="ink-kicker">Education</p>
            <ul className="mt-6 space-y-6">
              {educationEntries.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: ease.out }}
                >
                  <p className="text-[15px] font-semibold text-ink">{item.program}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {item.school} · {item.start}
                    {item.end !== item.start ? `–${item.end}` : ""} · {item.note}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul className="dim-siblings">
            {experienceEntries.map((job, i) => (
              <motion.li
                key={job.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.2), ease: ease.out }}
                className="group border-t border-ink-line py-7 md:py-8"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-[17px] font-semibold tracking-tight text-ink transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1">
                      {job.role}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">{job.company}</p>
                  </div>
                  <p className="shrink-0 pt-1 text-sm tabular-nums text-ink-faint transition-colors duration-300 group-hover:text-ink">
                    {job.start === job.end ? job.start : `${job.start}–${job.end}`}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
