"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import useReducedMotionPreference from "@/hooks/useReducedMotionPreference";
import { ease } from "@/lib/motion";
import {
  getLoaderReleaseTime,
  LOADER_MAX_MS,
} from "@/lib/portfolio-loader";

type PortfolioLoaderProps = {
  portraitUrl?: string | null;
  /** Fires the moment the loader starts its exit — lets the hero choreograph its entrance. */
  onRelease?: () => void;
};

function waitForPortrait(url?: string | null) {
  if (!url) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const image = new Image();
    const finish = () => resolve();

    image.onload = finish;
    image.onerror = finish;
    image.src = url;

    if (image.complete) {
      image.decode?.().catch(() => undefined).finally(finish);
    }
  });
}

export default function PortfolioLoader({ portraitUrl, onRelease }: PortfolioLoaderProps) {
  const reduce = useReducedMotionPreference();
  const startedAt = useRef<number | null>(null);
  const [visible, setVisible] = useState(true);
  const releaseCallback = useRef(onRelease);
  releaseCallback.current = onRelease;

  useEffect(() => {
    const start = performance.now();
    startedAt.current = start;
    let releaseTimer = 0;
    let released = false;

    const releaseAt = (readyAt: number | null) => {
      if (released || startedAt.current === null) return;

      const releaseTime = getLoaderReleaseTime(startedAt.current, readyAt);
      releaseTimer = window.setTimeout(() => {
        released = true;
        setVisible(false);
        releaseCallback.current?.();
      }, Math.max(0, releaseTime - performance.now()));
    };

    const fontReady = document.fonts?.ready ?? Promise.resolve();
    Promise.allSettled([fontReady, waitForPortrait(portraitUrl)]).then(() => {
      releaseAt(performance.now());
    });

    const safetyTimer = window.setTimeout(() => releaseAt(null), LOADER_MAX_MS);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(releaseTimer);
      window.clearTimeout(safetyTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [portraitUrl]);

  useEffect(() => {
    if (!visible) document.body.style.overflow = "";
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="portfolio-loader"
          className="fixed inset-0 z-[500] flex items-center justify-center bg-paper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: ease.out } }}
          aria-live="polite"
          aria-label="Preparing portfolio"
        >
          {/*
            Apple-style materialize: the wordmark arrives from a soft blur on
            the same paper background as the hero beneath, so the exit is a
            quiet crossfade instead of a curtain — no color cut, no theatrics.
          */}
          <div className="flex flex-col items-center gap-6">
            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: reduce ? 0.15 : 0.55, ease: ease.out }}
              className="text-[17px] font-semibold tracking-[-0.02em] text-ink"
            >
              Treshnanda
            </motion.p>
            <div className="h-px w-12 overflow-hidden bg-ink/10">
              <motion.div
                className="h-full origin-left bg-ink"
                initial={{ transform: "scaleX(0)" }}
                animate={{ transform: "scaleX(1)" }}
                transition={{ duration: reduce ? 0.15 : 1.0, ease: ease.out }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
