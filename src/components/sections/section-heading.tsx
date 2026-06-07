"use client";

import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <FadeIn
      className={cn(
        align === "center" && "mx-auto max-w-3xl text-center",
        className
      )}
    >
      {eyebrow && <p className="text-eyebrow">{eyebrow}</p>}
      <div className={cn("gold-line mt-4", align === "center" && "mx-auto")} />
      <h2
        className={cn(
          "text-display-sm mt-4 sm:mt-6",
          dark ? "text-white" : "text-navy"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-3 sm:mt-5",
            dark ? "text-sm text-white/65 sm:text-base" : "text-lead-dark"
          )}
        >
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}
