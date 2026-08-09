"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Magnetic from "@/components/Magnetic";
import { cn } from "@/lib/cn";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
];

const EASE = [0.23, 1, 0.32, 1] as const;
const DRAWER = [0.32, 0.72, 0, 1] as const;

/** Hover/focus expand is pointer-only; touch synthesizes sticky :hover which
 *  would pin the island open. */
function canHoverExpand() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

export default function Header({ ctaHref }: { ctaHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [mdUp, setMdUp] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduce = () => setReduced(reduceMq.matches);
    onReduce();
    reduceMq.addEventListener("change", onReduce);

    const mdMq = window.matchMedia("(min-width: 768px)");
    const onMd = () => setMdUp(mdMq.matches);
    onMd();
    mdMq.addEventListener("change", onMd);

    return () => {
      window.removeEventListener("scroll", onScroll);
      reduceMq.removeEventListener("change", onReduce);
      mdMq.removeEventListener("change", onMd);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Scroll-spy: which section owns the viewport.
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.href.slice(1))).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Clear interaction state after a nav click so the island settles back to the
  // collapsed pill instead of staying pinned open where the scroll landed.
  const settle = () => {
    setOpen(false);
    setHovered(false);
    setFocused(false);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  const island = scrolled && mdUp && !reduced; // compact pill only on desktop
  const expanded = island && (hovered || focused);
  const showChrome = !island || expanded;
  const ink = scrolled; // dark island -> white content; top -> ink content

  const barMax = reduced || !scrolled ? 1600 : island ? (expanded ? 660 : 208) : 1600;
  const barHeight = scrolled ? 48 : 68;

  // The bar<->island morph is the page's biggest chrome change: slower, drawer
  // ease. Hover expand/collapse is frequent: snappy.
  const prevScrolled = useRef(scrolled);
  const isScrollMorph = prevScrolled.current !== scrolled;
  useEffect(() => {
    prevScrolled.current = scrolled;
  });
  const morph = reduced
    ? { duration: 0 }
    : isScrollMorph
      ? { duration: 0.62, ease: DRAWER }
      : { duration: 0.4, ease: EASE };
  const xfade = reduced
    ? { duration: 0 }
    : isScrollMorph
      ? { duration: 0.5, ease: DRAWER }
      : { duration: 0.36, ease: EASE };

  const sizing = reduced
    ? {}
    : { animate: { maxWidth: barMax, height: barHeight }, style: { maxWidth: barMax, height: barHeight } };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="px-3 pt-3 md:px-6 md:pt-4">
        <motion.div
          transition={morph}
          onMouseEnter={() => canHoverExpand() && setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => canHoverExpand() && setFocused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
          }}
          {...sizing}
          className={cn(
            "mx-auto flex items-center overflow-hidden rounded-full transition-[background-color,border-color,box-shadow] duration-300",
            scrolled
              ? "justify-between border border-black/5 bg-ink/90 pl-5 pr-2 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.45)] backdrop-blur-xl md:justify-center"
              : "justify-between border border-transparent bg-transparent px-2 md:px-4",
          )}
        >
          {/* Wordmark — stays mounted and glides as the chrome width morphs. */}
          <Link
            href="/"
            onClick={settle}
            className={cn(
              "shrink-0 whitespace-nowrap text-[15px] font-semibold tracking-tight transition-colors duration-300 hover:opacity-70",
              ink ? "text-white" : "text-ink",
            )}
          >
            Treshnanda
          </Link>

          {/* Desktop links + CTA: permanently mounted and tabbable (focus expands
              the island), width + opacity + blur animate for a smooth two-way morph. */}
          <motion.div
            initial={false}
            animate={{
              maxWidth: showChrome ? 720 : 0,
              opacity: showChrome ? 1 : 0,
              filter: showChrome ? "blur(0px)" : "blur(8px)",
            }}
            transition={xfade}
            className="hidden flex-1 items-center justify-end overflow-hidden whitespace-nowrap md:flex"
          >
            <div className="ml-4 flex items-center gap-1.5">
              {NAV.map((item) => (
                <NavLink
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  ink={ink}
                  active={active === item.href}
                  reduced={reduced}
                  onClick={settle}
                />
              ))}
              <Magnetic strength={0.25}>
                <Link
                  href={ctaHref}
                  target={ctaHref.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  onClick={settle}
                  className={cn(
                    "press ml-2 inline-flex items-center rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors duration-300",
                    ink ? "bg-white text-ink hover:bg-white/90" : "bg-ink text-white hover:bg-ink-soft",
                  )}
                >
                  Start a project
                </Link>
              </Magnetic>
            </div>
          </motion.div>

          {/* Mobile hamburger — morphs into a close glyph. */}
          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "press inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 md:hidden",
              ink ? "border-white/20 text-white" : "border-ink-line text-ink",
            )}
          >
            <span className="relative block h-3 w-4">
              <motion.span
                className={cn("absolute left-0 block h-px w-4", ink ? "bg-white" : "bg-ink")}
                style={{ top: 0 }}
                animate={open ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
              />
              <motion.span
                className={cn("absolute left-0 block h-px w-4", ink ? "bg-white" : "bg-ink")}
                style={{ top: 5 }}
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className={cn("absolute left-0 block h-px w-4", ink ? "bg-white" : "bg-ink")}
                style={{ top: 10 }}
                animate={open ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
              />
            </span>
          </button>
        </motion.div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mx-3 mt-2 overflow-hidden rounded-3xl border border-ink-line bg-white/95 p-2 backdrop-blur-xl md:hidden"
          >
            {NAV.map((item, i) => (
              <motion.div
                key={item.href}
                initial={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + i * 0.05, duration: 0.35, ease: EASE }}
              >
                <Link
                  href={item.href}
                  onClick={settle}
                  className="block rounded-2xl px-4 py-3.5 text-2xl font-semibold tracking-tight text-ink"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <Link
              href={ctaHref}
              target={ctaHref.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              onClick={settle}
              className="press mt-1 block rounded-2xl bg-ink px-4 py-3.5 text-center text-base font-medium text-white"
            >
              Start a project
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  label,
  href,
  ink,
  active,
  reduced,
  onClick,
}: {
  label: string;
  href: string;
  ink: boolean;
  active: boolean;
  reduced: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "group relative rounded-full px-3 py-1.5 text-[13px] transition-colors duration-200",
        ink
          ? active
            ? "text-white"
            : "text-white/65 hover:text-white"
          : active
            ? "text-ink"
            : "text-[#7a7a7a] hover:text-ink",
      )}
    >
      {label}
      {/* Active pill indicator (scroll-spy) — shared-layout so it glides between items. */}
      {active && !reduced && (
        <motion.span
          layoutId="nav-active"
          className={cn("absolute inset-x-2.5 -bottom-px h-px", ink ? "bg-white" : "bg-ink")}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      {/* Hover underline for non-active items. */}
      <span
        className={cn(
          "pointer-events-none absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
          active && "hidden",
          ink ? "bg-white/60" : "bg-ink/50",
        )}
      />
    </Link>
  );
}
