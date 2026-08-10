"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronRight, ExternalLink, Layout, X } from "lucide-react";
import SmoothScroll from "@/components/SmoothScroll";
import InkButton from "@/components/site/InkButton";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import ProjectGrid from "@/components/site/ProjectGrid";
import Experience from "@/components/site/Experience";
import Skills from "@/components/site/Skills";
import Contact from "@/components/site/Contact";
import FooterWordmark from "@/components/site/FooterWordmark";
import ScrollProgress from "@/components/site/ScrollProgress";
import PortfolioLoader from "@/components/PortfolioLoader";
import ChapterRail from "@/components/ChapterRail";
import { ease, spring } from "@/lib/motion";
import type { PortfolioProfile, PortfolioProject } from "@/lib/portfolio-types";

const DEFAULT_CTA = "https://wa.me/6287852986638";

function projectYear(project: PortfolioProject) {
  const meta = project.metadata as { year?: string } | null;
  if (meta?.year) return meta.year;
  if (project.createdAt) return String(new Date(project.createdAt).getFullYear());
  return "2026";
}

function projectRole(project: PortfolioProject) {
  const meta = project.metadata as { role?: string } | null;
  return meta?.role ?? "Design, engineering";
}

function projectStack(project: PortfolioProject) {
  if (project.tags && project.tags.length > 0) return project.tags.slice(0, 3).join(" · ");
  return project.category;
}

const STATUS_LABELS: Record<string, string> = {
  live: "Live in production",
  published: "Live in production",
  development: "In development",
  "in-progress": "In development",
  archived: "Archived",
};

function projectStatus(project: PortfolioProject) {
  const raw = project.status?.trim();
  if (!raw) return project.link ? "Live in production" : "In development";
  return STATUS_LABELS[raw.toLowerCase()] ?? raw.charAt(0).toUpperCase() + raw.slice(1);
}

/** "https://manmade.fit/shop" -> "manmade.fit" for the visit button label. */
function linkHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "site";
  }
}

export default function HomePage({
  initialProjects,
  userProfile,
  skills,
  skillsUpdated,
}: {
  initialProjects: PortfolioProject[];
  userProfile?: PortfolioProfile;
  skills?: string[];
  skillsUpdated?: string;
}) {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgDir, setImgDir] = useState(0);
  const reduce = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  // Intro loader: plays on every full page load (reloads included), never
  // under reduced motion. It doubles as the paint-settling curtain, so
  // replaying on reload keeps the arrival consistent.
  const showLoader = !reduce;
  const [released, setReleased] = useState(false);

  const handleLoaderRelease = useCallback(() => {
    setReleased(true);
  }, []);

  const ctaHref =
    userProfile?.socials?.whatsapp ||
    (userProfile?.contactEmail ? `mailto:${userProfile.contactEmail}` : DEFAULT_CTA);

  const openProject = useCallback((project: PortfolioProject) => {
    lastFocusedElement.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setCurrentImageIndex(0);
    setImgDir(0);
    setSelectedProject(project);
  }, []);

  const closeProject = useCallback(() => {
    setSelectedProject(null);
    window.requestAnimationFrame(() => lastFocusedElement.current?.focus());
  }, []);

  // In-modal jump to another project: keeps the original trigger recorded so
  // closing still restores focus to where the user entered from.
  const goToProject = useCallback((project: PortfolioProject) => {
    setCurrentImageIndex(0);
    setImgDir(0);
    setSelectedProject(project);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
  }, []);

  const nextProject = useMemo(() => {
    if (!selectedProject || initialProjects.length < 2) return null;
    const idx = initialProjects.findIndex((p) => p.id === selectedProject.id);
    if (idx === -1) return null;
    return initialProjects[(idx + 1) % initialProjects.length];
  }, [selectedProject, initialProjects]);

  useEffect(() => {
    if (!selectedProject) return;
    const pageContent = document.querySelector<HTMLElement>("[data-page-content]");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    pageContent?.setAttribute("inert", "");
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      pageContent?.removeAttribute("inert");
    };
  }, [selectedProject]);

  const allImages = useMemo(() => {
    if (!selectedProject) return [];
    const images = selectedProject.images ?? [];
    const cover = selectedProject.imageUrl;
    if (cover && !images.includes(cover)) return [cover, ...images];
    if (images.length > 0) return images;
    return cover ? [cover] : [];
  }, [selectedProject]);

  const paginate = useCallback(
    (dir: number) => {
      setImgDir(dir);
      setCurrentImageIndex((prev) => (prev + dir + allImages.length) % allImages.length);
    },
    [allImages.length],
  );

  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeProject();
        return;
      }
      if (event.key === "ArrowRight" && allImages.length > 1) paginate(1);
      else if (event.key === "ArrowLeft" && allImages.length > 1) paginate(-1);
      else if (event.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProject, allImages.length, paginate, closeProject]);

  const modalPanel = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.15 } },
        transition: { duration: 0.25 },
      }
    : {
        initial: { opacity: 0, scale: 0.97, y: 20, filter: "blur(6px)" },
        animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
        exit: {
          opacity: 0,
          scale: 0.98,
          y: 10,
          filter: "blur(4px)",
          transition: { duration: 0.2, ease: ease.in },
        },
        transition: { duration: 0.45, ease: ease.drawer },
      };

  const imgSlide: Variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d > 0 ? 40 : -40 }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: ease.out },
    },
    exit: (d: number) => ({
      opacity: 0,
      x: reduce ? 0 : d > 0 ? -40 : 40,
      transition: { duration: 0.28, ease: ease.in },
    }),
  };

  const bio =
    userProfile?.bio ||
    "CS grad, 3.97 GPA. I architect logic that scales with zero friction: systems that take repetitive work off people's plates and run it reliably, end to end.";

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-paper text-ink">
        {/* Stays mounted after release so its AnimatePresence exit can finish. */}
        {showLoader && (
          <PortfolioLoader portraitUrl="/avatar.jpg" onRelease={handleLoaderRelease} />
        )}
        <ScrollProgress />
        <ChapterRail />
        <a
          href="#work"
          className="press sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[400] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to selected work
        </a>

        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={closeProject}
                className="absolute inset-0 bg-ink/40 backdrop-blur-md"
              />
              <motion.div
                ref={modalRef}
                {...modalPanel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-modal-title"
                className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-[2rem] bg-white shadow-2xl"
              >
                <motion.button
                  ref={closeButtonRef}
                  onClick={closeProject}
                  aria-label="Close project details"
                  whileHover={reduce ? undefined : { scale: 1.08 }}
                  whileTap={reduce ? undefined : { scale: 0.92 }}
                  transition={spring.press}
                  className="absolute right-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm"
                >
                  <X className="h-5 w-5" />
                </motion.button>

                {/* Cover image — full-bleed across the top of the card. */}
                <div className="relative aspect-[16/9] max-h-[46vh] w-full shrink-0 overflow-hidden bg-paper-soft">
                  {allImages[currentImageIndex] ? (
                    <AnimatePresence initial={false} custom={imgDir}>
                      <motion.img
                        key={currentImageIndex}
                        custom={imgDir}
                        variants={imgSlide}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        src={allImages[currentImageIndex]}
                        alt={selectedProject.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </AnimatePresence>
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-faint">
                      <Layout className="h-16 w-16" />
                    </div>
                  )}

                  {allImages.length > 1 && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-4">
                      <motion.button
                        type="button"
                        aria-label="Previous project image"
                        onClick={(e) => {
                          e.stopPropagation();
                          paginate(-1);
                        }}
                        whileHover={reduce ? undefined : { scale: 1.1 }}
                        whileTap={reduce ? undefined : { scale: 0.9 }}
                        transition={spring.press}
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow"
                      >
                        <ChevronRight className="h-4 w-4 rotate-180" />
                      </motion.button>
                      <motion.button
                        type="button"
                        aria-label="Next project image"
                        onClick={(e) => {
                          e.stopPropagation();
                          paginate(1);
                        }}
                        whileHover={reduce ? undefined : { scale: 1.1 }}
                        whileTap={reduce ? undefined : { scale: 0.9 }}
                        transition={spring.press}
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Content — tight editorial rhythm: kicker sits close under the
                    image, description reads at body size (not display), and the
                    meta/footer blocks step down in even ~28px beats. */}
                <div className="px-7 pb-7 pt-6 sm:px-10 sm:pb-8 sm:pt-7">
                  <p className="ink-kicker">
                    {selectedProject.category} · {projectYear(selectedProject)}
                  </p>
                  <h2
                    id="project-modal-title"
                    className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
                  >
                    {selectedProject.title}
                  </h2>
                  <p className="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-ink-muted text-pretty">
                    {selectedProject.content || selectedProject.description}
                  </p>

                  {/* Meta strip — hairline-ruled columns, magazine style. Stack
                      gets the widest column so its value holds one line; Year is
                      narrow (four digits never need a quarter of the card). */}
                  <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-[1.1fr_1.5fr_0.6fr_1fr]">
                    {[
                      ["Role", projectRole(selectedProject)],
                      ["Stack", projectStack(selectedProject)],
                      ["Year", projectYear(selectedProject)],
                      ["Status", projectStatus(selectedProject)],
                    ].map(([label, value]) => (
                      <div key={label} className="border-t border-ink-line pt-2.5">
                        <dt className="ink-kicker">{label}</dt>
                        <dd className="mt-1 text-sm text-ink">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.link && (
                        <InkButton href={selectedProject.link} external>
                          Visit {linkHost(selectedProject.link)}
                        </InkButton>
                      )}
                      {selectedProject.github && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noreferrer"
                          className="press ink-link-arrow inline-flex items-center gap-2 rounded-full border border-ink-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper-soft"
                        >
                          Source <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    {nextProject && (
                      <button
                        type="button"
                        onClick={() => goToProject(nextProject)}
                        className="press ink-link-arrow text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
                      >
                        Next project: <span className="font-medium">{nextProject.title}</span>
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div data-page-content>
          <Header ctaHref={ctaHref} />
          <main>
            <Hero profile={userProfile} ctaHref={ctaHref} start={!showLoader || released} />
            <ProjectGrid
              projects={initialProjects}
              onOpen={openProject}
              ctaHref={ctaHref}
            />
            <Experience />
            <Skills bio={bio} skills={skills} updated={skillsUpdated} />
            <Contact profile={userProfile} ctaHref={ctaHref} />
          </main>
          <FooterWordmark />
        </div>
      </div>
    </SmoothScroll>
  );
}
