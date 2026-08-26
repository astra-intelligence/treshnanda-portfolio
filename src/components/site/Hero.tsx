"use client";

import Image from "next/image";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Magnetic from "@/components/Magnetic";
import InkButton from "@/components/site/InkButton";
import HeroImage from "@/components/site/HeroImage";
import { ease } from "@/lib/motion";
import type { PortfolioProfile } from "@/lib/portfolio-types";

const DESIGN_BIO =
  "I’m Nanda, an AI systems engineer in Bali. I design and ship agents, automations, and systems that take repetitive work off your plate.";

const LEGACY_HEADLINE = "Work that does itself.";
const LEGACY_BIO =
  "I'm Nanda, an AI systems and automation engineer in Bali. I design and ship agents, automations, and web systems that take repetitive work off your plate.";

const CLAIM_WORDS = ["I", "build", "AI", "systems."] as const;

export default function Hero({
  profile,
  ctaHref,
  start = true,
}: {
  profile?: PortfolioProfile;
  ctaHref: string;
  /** Holds the entrance while the intro loader covers the page. */
  start?: boolean;
}) {
  const reduce = useReducedMotion();
  const avatar = "/avatar.jpg";
  const name = profile?.name || "Treshnanda";
  const claim =
    profile?.heroHeadline && profile.heroHeadline !== LEGACY_HEADLINE
      ? profile.heroHeadline
      : "I build AI systems.";
  const sub =
    !profile?.heroSubheadline || profile.heroSubheadline === LEGACY_BIO
      ? DESIGN_BIO
      : profile.heroSubheadline;

  const claimWords = claim === "I build AI systems." ? [...CLAIM_WORDS] : claim.split(" ");

  const fade = (delay = 0): Pick<MotionProps, "initial" | "animate" | "transition"> => {
    const initial = reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(8px)" };
    const animate = reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" };
    return {
      initial,
      animate: start ? animate : initial,
      transition: reduce
        ? { duration: 0.3, delay }
        : { duration: 0.7, delay, ease: ease.out },
    };
  };

  const cardHidden = reduce
    ? { opacity: 0 }
    : {
        opacity: 0,
        scale: 0.985,
        clipPath: "inset(8% 4% 10% 4% round 2.5rem)",
      };
  const cardShown = reduce
    ? { opacity: 1 }
    : {
        opacity: 1,
        scale: 1,
        clipPath: "inset(0% 0% 0% 0% round 2.5rem)",
      };

  return (
    <section
      aria-labelledby="hero-title"
      className="box-border flex h-svh flex-col pb-3 pt-16"
    >
      <div className="hero-shell flex min-h-0 flex-1 flex-col justify-end md:justify-center">
        <motion.div
          initial={cardHidden}
          animate={start ? cardShown : cardHidden}
          transition={
            reduce
              ? { duration: 0.35 }
              : { duration: 1.05, ease: ease.drawer }
          }
          className="hero-card"
        >
          <HeroImage src="/hero.webp" active={start} />
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <Image
              src="/hero-grain.webp"
              alt=""
              fill
              unoptimized
              fetchPriority="low"
              className="object-cover"
            />
          </div>
          <div className="hero-scrim" aria-hidden="true" />

          {/*
            Figma: content is a bottom block (left 56, top 390 on a 1392×820
            artboard) — not vertically centered. justify-end + the 56px inset
            recreates that.
          */}
          <div className="relative z-10 flex h-full flex-col justify-end p-[var(--hero-pad)]">
            <div className="flex w-full flex-col gap-[clamp(1.25rem,2.874cqw,2.5rem)]">
              <motion.h1
                id="hero-title"
                initial="hidden"
                animate={start ? "visible" : "hidden"}
                className="hero-type flex flex-col items-start gap-[clamp(0.5rem,0.862cqw,0.75rem)]"
              >
                <span className="flex items-center gap-[clamp(0.85rem,1.724cqw,1.5rem)]">
                  <motion.span
                    variants={
                      reduce
                        ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                        : {
                            hidden: { opacity: 0, scale: 0.92, filter: "blur(8px)" },
                            visible: {
                              opacity: 1,
                              scale: 1,
                              filter: "blur(0px)",
                              transition: { duration: 0.7, delay: 0.28, ease: ease.out },
                            },
                          }
                    }
                    className="hero-avatar relative"
                  >
                    <Image
                      src={avatar}
                      alt=""
                      fill
                      sizes="141px"
                      loading="eager"
                      className="object-cover object-[58%_36%]"
                    />
                  </motion.span>
                  <span className="whitespace-nowrap">
                    <HeroWord word={name} index={0} reduce={!!reduce} delay={0.32} />
                  </span>
                </span>
                <span className="hero-claim flex flex-wrap items-baseline gap-x-[0.22em] sm:flex-nowrap sm:whitespace-nowrap">
                  {claimWords.map((word, i) => (
                    <HeroWord
                      key={`${word}-${i}`}
                      word={word}
                      index={i}
                      reduce={!!reduce}
                      delay={0.48}
                    />
                  ))}
                </span>
              </motion.h1>

              <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-[clamp(1.5rem,3.448cqw,3rem)]">
                <motion.p
                  {...fade(0.64)}
                  className="w-full max-w-[420px] text-[clamp(0.9375rem,1.221cqw,1.0625rem)] leading-[1.53] text-[#FFFFFFD6] text-pretty"
                >
                  {sub}
                </motion.p>

                <motion.div
                  {...fade(0.74)}
                  className="flex flex-wrap items-center gap-5"
                >
                  <Magnetic strength={0.22}>
                    <InkButton
                      href={ctaHref}
                      external
                      variant="inverse"
                      className="!px-8 !py-[18px] !text-[15px] !font-semibold !leading-none !text-[#1D1D1F] focus-visible:outline-white"
                    >
                      Start a project
                    </InkButton>
                  </Magnetic>
                  <a
                    href="#work"
                    className="group press inline-flex min-h-11 items-center gap-1.5 px-2 py-[18px] text-[15px] font-medium leading-none text-white transition-opacity duration-200 hover:opacity-70 focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
                  >
                    See selected work
                    <motion.span
                      aria-hidden="true"
                      animate={reduce ? undefined : { y: [0, 3, 0] }}
                      transition={
                        reduce
                          ? undefined
                          : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                      }
                      className="inline-flex"
                    >
                      <ArrowDown className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-[3px]" />
                    </motion.span>
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
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
  delay = 0.05,
}: {
  word: string;
  index: number;
  reduce: boolean;
  delay?: number;
}) {
  return (
    <span className="inline-block overflow-hidden pb-[0.04em] align-baseline">
      <motion.span
        className="inline-block"
        variants={
          reduce
            ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
            : {
                hidden: { y: "108%", opacity: 0, filter: "blur(10px)" },
                visible: {
                  y: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.75,
                    delay: delay + index * 0.08,
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
