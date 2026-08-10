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
            Monochrome materialize on the same paper as the hero beneath, so the
            exit stays a quiet crossfade — but with a real setpiece:
            1. an ink ring draws itself around the portrait, leaves a small gap,
               then orbits slowly (the ambient "still working" layer),
            2. the portrait resolves from a blur inside it — the same portrait
               that lands in the hero headline pill, so the loader hands off,
            3. the wordmark rises letter by letter,
            4. a shimmer hairline sweeps underneath while we wait.
          */}
          <motion.div
            className="flex flex-col items-center gap-7"
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.2 } }
                : {
                    opacity: 0,
                    scale: 0.94,
                    filter: "blur(6px)",
                    transition: { duration: 0.4, ease: ease.in },
                  }
            }
          >
            <div className="relative h-[88px] w-[88px]">
              <motion.svg
                viewBox="0 0 88 88"
                className="absolute inset-0 h-full w-full text-ink"
                initial={{ rotate: -90 }}
                animate={reduce ? { rotate: -90 } : { rotate: 270 }}
                transition={
                  reduce
                    ? undefined
                    : { duration: 10, repeat: Infinity, ease: "linear" }
                }
              >
                <motion.circle
                  cx="44"
                  cy="44"
                  r="42.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 0.92 }}
                  transition={{ duration: reduce ? 0.15 : 0.9, ease: ease.out }}
                />
              </motion.svg>
              <motion.div
                className="absolute inset-[7px] overflow-hidden rounded-full"
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.85, filter: "blur(10px)" }
                }
                animate={
                  reduce
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, filter: "blur(0px)" }
                }
                transition={{ duration: reduce ? 0.15 : 0.7, delay: 0.1, ease: ease.out }}
              >
                {portraitUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={portraitUrl}
                    alt=""
                    className="h-full w-full object-cover object-[58%_42%]"
                  />
                ) : (
                  <div className="h-full w-full bg-paper-soft" />
                )}
              </motion.div>
            </div>

            <p
              aria-hidden="true"
              className="flex overflow-hidden pb-[0.08em] text-[17px] font-semibold tracking-[-0.02em] text-ink"
            >
              {"Treshnanda".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: 0, y: "105%", filter: "blur(6px)" }
                  }
                  animate={
                    reduce
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, filter: "blur(0px)" }
                  }
                  transition={{
                    duration: reduce ? 0.15 : 0.6,
                    delay: reduce ? 0 : 0.3 + i * 0.035,
                    ease: ease.out,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: reduce ? 0 : 0.7 }}
              className="shimmer-line h-px w-12"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
