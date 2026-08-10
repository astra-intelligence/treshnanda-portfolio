"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "inverse" | "ghost";
  className?: string;
  external?: boolean;
};

const MotionLink = motion.create(Link);

/* Snappy micro-spring for the arrow swap (amicro slide-arrow pattern). */
const swap = { type: "spring", stiffness: 600, damping: 25 } as const;

export default function InkButton({
  href,
  children,
  variant = "solid",
  className,
  external,
}: Props) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  // Hover choreography is pointer-only; touch synthesizes sticky :hover which
  // would pin the arrow open after a tap.
  const finePointer = useRef(false);
  useEffect(() => {
    finePointer.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
  }, []);

  const isExternal = external || href.startsWith("http") || href.startsWith("mailto:");
  const opensNewTab = isExternal && !href.startsWith("mailto:");
  const Arrow = opensNewTab ? ArrowUpRight : ArrowRight;

  const styles =
    variant === "solid"
      ? "ink-button"
      : variant === "inverse"
        ? "ink-button-inverse"
        : "inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink";

  if (variant === "ghost") {
    const shared = { className: cn(styles, "press", className) };
    return isExternal ? (
      <a href={href} target={opensNewTab ? "_blank" : undefined} rel="noreferrer" {...shared}>
        {children}
      </a>
    ) : (
      <Link href={href} {...shared}>
        {children}
      </Link>
    );
  }

  // Slide-arrow pill: on hover an arrow springs in from the right and the
  // label glides over; the pill's own width change rides the same layout
  // spring so nothing snaps. Exit pops the arrow out (mode="popLayout") so
  // the label returns without waiting for it.
  const shared = {
    className: cn(styles, "press", className),
    layout: true,
    transition: swap,
    onMouseEnter: () => {
      if (finePointer.current && !reduce) setHovered(true);
    },
    onMouseLeave: () => setHovered(false),
  };

  const label = (
    <>
      <motion.span layout transition={swap} className="inline-block">
        {children}
      </motion.span>
      <AnimatePresence mode="popLayout" initial={false}>
        {hovered && (
          <motion.span
            key="arrow"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={swap}
            className="ml-2 flex shrink-0 items-center"
          >
            <Arrow className="h-4 w-4" aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );

  if (isExternal) {
    return (
      <motion.a
        href={href}
        target={opensNewTab ? "_blank" : undefined}
        rel="noreferrer"
        {...shared}
      >
        {label}
      </motion.a>
    );
  }

  return (
    <MotionLink href={href} {...shared}>
      {label}
    </MotionLink>
  );
}
