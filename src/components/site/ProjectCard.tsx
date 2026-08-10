"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ease } from "@/lib/motion";
import type { PortfolioProject } from "@/lib/portfolio-types";

function projectYear(project: PortfolioProject) {
  const meta = project.metadata as { year?: string } | null;
  if (meta?.year) return meta.year;
  if (project.createdAt) return String(new Date(project.createdAt).getFullYear());
  return "2026";
}

export default function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: PortfolioProject;
  index: number;
  onOpen: (project: PortfolioProject) => void;
}) {
  const reduce = useReducedMotion();
  const year = projectYear(project);
  const hasLink = Boolean(project.link || project.github);

  // Pointer parallax: the image drifts a few px against the cursor, spring-
  // smoothed so it feels like the surface has mass. Bleed (-inset-2.5) keeps
  // the frame covered at the extremes. Fine-pointer + full-motion only.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 160, damping: 20, mass: 0.6 });
  const py = useSpring(my, { stiffness: 160, damping: 20, mass: 0.6 });
  const finePointer = useRef(false);
  useEffect(() => {
    finePointer.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce || !finePointer.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.article
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={
        reduce
          ? { opacity: 1 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.3), ease: ease.out }}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="group w-full text-left transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.985]"
      >
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-paper-soft"
          style={{ outline: "1px solid oklch(0 0 0 / 0.08)" }}
        >
          {project.imageUrl ? (
            <motion.div style={{ x: px, y: py }} className="absolute -inset-2.5">
              <Image
                src={project.imageUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
              />
            </motion.div>
          ) : (
            <div className="flex h-full items-center justify-center text-ink-faint">
              {project.title}
            </div>
          )}

          {/* Hover affordance — a "View" chip lifts in from the corner. Motion is
              never the only cue: the title arrow and cursor already signal the link. */}
          {hasLink && (
            <div className="pointer-events-none absolute bottom-3 left-3 flex translate-y-2 items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-medium text-ink opacity-0 shadow-sm backdrop-blur-sm transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-0 group-hover:opacity-100">
              View
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-3">
          <h3 className="flex items-center gap-1.5 text-[17px] font-semibold tracking-tight text-ink">
            <span>{project.title}</span>
            {hasLink && (
              <ArrowUpRight
                className="h-4 w-4 text-ink-muted transition-transform duration-220 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            )}
          </h3>
          <span className="shrink-0 text-[13px] tabular-nums text-ink-faint">{year}</span>
        </div>

        <p className="mt-1.5 text-[13px] text-ink-faint">{project.category}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted text-pretty">
          {project.description}
        </p>
      </button>
    </motion.article>
  );
}
