"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "inverse" | "ghost";
  className?: string;
  external?: boolean;
};

export default function InkButton({
  href,
  children,
  variant = "solid",
  className,
  external,
}: Props) {
  const styles =
    variant === "solid"
      ? "ink-button"
      : variant === "inverse"
        ? "ink-button-inverse"
        : "inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink";

  const shared = {
    className: cn(styles, "press", className),
  };

  // Pill labels ride a vertical slide on hover: the resting label exits up
  // while an identical clone rises in from below (see .btn-label in globals).
  const label =
    variant === "ghost" ? (
      children
    ) : (
      <span className="btn-label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    );

  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer" {...shared}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} {...shared}>
      {label}
    </Link>
  );
}
