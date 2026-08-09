"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ProjectCard from "@/components/site/ProjectCard";
import InkButton from "@/components/site/InkButton";
import { ease } from "@/lib/motion";
import type { PortfolioProject } from "@/lib/portfolio-types";

export default function ProjectGrid({
  projects,
  onOpen,
  ctaHref,
}: {
  projects: PortfolioProject[];
  onOpen: (project: PortfolioProject) => void;
  ctaHref: string;
}) {
  const reduce = useReducedMotion();

  return (
    <section id="work" aria-labelledby="work-title" className="py-20 md:py-28">
      <div className="site-shell">
        <motion.header
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: ease.out }}
          className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="ink-kicker">01 · Selected work</p>
            <h2 id="work-title" className="ink-display mt-4">
              Shipped, and still running.
            </h2>
          </div>
          <p className="ink-kicker md:pb-2">
            {projects.length} projects · 2024–2026
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={onOpen}
            />
          ))}

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.2, ease: ease.out }}
            className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-ink-line px-6 py-12 text-center"
          >
            <p className="text-base font-medium text-ink">
              Your project could be next.
            </p>
            <InkButton href={ctaHref} external className="mt-6 gap-2">
              Start a project
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </InkButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
