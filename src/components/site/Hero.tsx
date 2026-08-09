"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Magnetic from "@/components/Magnetic";
import InkButton from "@/components/site/InkButton";
import HeroImage from "@/components/site/HeroImage";
import { ease } from "@/lib/motion";
import type { PortfolioProfile } from "@/lib/portfolio-types";

export default function Hero({
  profile,
  ctaHref,
}: {
  profile?: PortfolioProfile;
  ctaHref: string;
}) {
  const reduce = useReducedMotion();
  const avatar = "/avatar.jpg";
  const sub =
    profile?.heroSubheadline ||
    "I'm Nanda, an AI systems and automation engineer in Bali. I design and ship agents, automations, and web systems that take repetitive work off your plate.";

  const fade = (delay = 0) =>
    reduce
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.35, delay },
        }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.65, delay, ease: ease.out },
        };

  return (
    <section className="relative overflow-hidden pb-10 pt-24 md:pb-10 md:pt-24">
      <div className="site-shell">
        {/*
          Headline — left-aligned at the margin, two forced lines:
            Work that
            [pill] does itself.
          Kinetic reveal: each word rises + un-blurs in sequence (the one hero
          setpiece, plays once). Avatar pill scales in with the second line.
        */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-14">
        <motion.h1
          initial="hidden"
          animate="visible"
          className="ink-hero flex flex-col items-start"
        >
          <span className="flex flex-wrap items-baseline gap-x-[0.24em] overflow-hidden pb-[0.04em]">
            {["Work", "that"].map((word, i) => (
              <HeroWord key={word} word={word} index={i} reduce={!!reduce} />
            ))}
          </span>
          <span className="mt-[0.04em] flex items-center gap-[0.2em]">
            <motion.span
              variants={
                reduce
                  ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                  : {
                      hidden: { opacity: 0, scale: 0.86, filter: "blur(8px)" },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        transition: { duration: 0.7, delay: 0.3, ease: ease.out },
                      },
                    }
              }
              whileHover={reduce ? undefined : { width: "1.85em" }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="relative inline-block h-[0.78em] w-[1.25em] shrink-0 overflow-hidden rounded-full"
              style={{ outline: "1px solid oklch(0 0 0 / 0.08)" }}
            >
              <Image
                src={avatar}
                alt="Treshnanda"
                fill
                sizes="240px"
                className="object-cover object-[58%_42%]"
                priority
              />
            </motion.span>
            <HeroWord word="does" index={2} reduce={!!reduce} />
            <HeroWord word="itself." index={3} reduce={!!reduce} />
          </span>
        </motion.h1>

        {/* Bio + CTAs — right column beside the headline, bio stacked above
            the actions, both bottom-aligned with the headline block. */}
        {/* pt-[0.35em-ish] optically aligns the bio's cap height with the
            headline's cap height (the h1's line box carries extra lead). */}
        <div className="mt-2 flex flex-col gap-7 md:mt-0 md:max-w-[26rem] md:pt-3">
          <motion.p
            {...fade(0.5)}
            className="max-w-[29rem] text-[16px] leading-[1.5] text-[#6e6e6e] text-pretty md:text-[17px]"
          >
            {sub}
          </motion.p>

          <motion.div
            {...fade(0.58)}
            className="flex flex-wrap items-center gap-6"
          >
            <Magnetic strength={0.28}>
              <InkButton href={ctaHref} external className="!px-7 !py-[0.85rem] !text-[14px]">
                Start a project
              </InkButton>
            </Magnetic>
            <a
              href="#work"
              className="ink-link-arrow text-[14px] font-medium text-ink transition-opacity duration-200 hover:opacity-60"
            >
              See selected work
              <span aria-hidden="true" className="arrow-glyph ml-1 inline-block">
                ↓
              </span>
            </a>
          </motion.div>
        </div>
        </div>

        {/* Hero media reveal — the frame irises open from a slightly inset crop
            instead of fading in: the image reads as a surface arriving. */}
        <motion.div
          initial={
            reduce
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  scale: 1.015,
                  clipPath: "inset(10% 5% 10% 5% round 1.75rem)",
                }
          }
          animate={
            reduce
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  scale: 1,
                  clipPath: "inset(0% 0% 0% 0% round 1.75rem)",
                }
          }
          transition={
            reduce
              ? { duration: 0.35, delay: 0.4 }
              : { duration: 1.05, delay: 0.55, ease: ease.drawer }
          }
          className="mt-8 md:mt-6"
        >
          <HeroImage src="/hero.png" />
        </motion.div>

        <motion.div
          {...fade(0.74)}
          className="mt-5 flex items-center justify-between gap-4 ink-kicker md:mt-5"
        >
          <span className="truncate">
            AI agents · Workflow automation · Full-stack engineering
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            Scroll
            <motion.span
              aria-hidden="true"
              animate={reduce ? undefined : { y: [0, 3, 0] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
              }
              className="inline-block"
            >
              ↓
            </motion.span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/** One headline word — rises + un-blurs in sequence. The hero's kinetic setpiece. */
function HeroWord({
  word,
  index,
  reduce,
}: {
  word: string;
  index: number;
  reduce: boolean;
}) {
  return (
    <span className="inline-block overflow-hidden pb-[0.06em] align-baseline">
      <motion.span
        className="inline-block"
        variants={
          reduce
            ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
            : {
                hidden: { y: "110%", opacity: 0, filter: "blur(10px)" },
                visible: {
                  y: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.85,
                    delay: 0.05 + index * 0.09,
                    ease: ease.out,
                  },
                },
              }
        }
      >
        {word}
      </motion.span>
    </span>
  );
}
