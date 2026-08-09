"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/Magnetic";
import InkButton from "@/components/site/InkButton";
import { ease } from "@/lib/motion";
import type { PortfolioProfile } from "@/lib/portfolio-types";

export default function Contact({
  profile,
  ctaHref,
}: {
  profile?: PortfolioProfile;
  ctaHref: string;
}) {
  const reduce = useReducedMotion();
  const email = profile?.contactEmail || "treshnanda@gmail.com";
  const socials = [
    { label: "GitHub", href: profile?.socials?.github },
    { label: "LinkedIn", href: profile?.socials?.linkedin },
    { label: "WhatsApp", href: profile?.socials?.whatsapp || ctaHref },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-[#0e0e0e] text-white"
    >
      <div className="site-shell py-20 md:py-28">
        <div className="mb-16 flex items-center justify-between gap-4">
          <p className="ink-kicker !text-white/45">04 · Contact</p>
          <p className="ink-kicker !text-white/45">Bali, Indonesia · GMT+8</p>
        </div>

        <motion.h2
          id="contact-title"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, filter: "blur(6px)" }}
          whileInView={
            reduce
              ? { opacity: 1 }
              : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: ease.out }}
          className="max-w-[52rem] text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] text-white md:text-[clamp(3rem,5.4vw,4.9rem)]"
        >
          Tell me what&apos;s slowing you down.
        </motion.h2>

        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.1, ease: ease.out }}
          className="mt-8 max-w-lg text-[15px] leading-relaxed text-white/50 md:text-[17px]"
        >
          Most projects start with a process someone runs by hand, every week,
          forever. I build the system that runs it instead.
        </motion.p>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.16, ease: ease.out }}
          className="mt-12 flex flex-wrap items-center gap-6"
        >
          <Magnetic strength={0.3}>
            <InkButton href={ctaHref} variant="inverse" external>
              Start a project
            </InkButton>
          </Magnetic>
          <a
            href={`mailto:${email}`}
            className="group ink-link-arrow text-sm font-medium text-white"
          >
            <span className="link-underline group-hover:[background-size:100%_1px]">
              {email}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.22, ease: ease.out }}
          className="mt-20 flex flex-wrap gap-x-8 gap-y-3"
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="ink-link-arrow text-sm text-white/50 transition-colors duration-200 hover:text-white"
            >
              {s.label}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
