"use client";

import Image from "next/image";
import { FadeIn } from "@/components/motion";
import { images, type ImageKey } from "@/lib/images";
import { cn } from "@/lib/utils";

export function PageBanner({
  eyebrow,
  title,
  subtitle,
  image = "default",
  tall = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: ImageKey;
  tall?: boolean;
}) {
  const src = images[image];

  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden bg-navy-deep text-white",
        tall
          ? "min-h-[42svh] sm:min-h-[48vh] md:min-h-[55vh] lg:min-h-[58vh]"
          : "min-h-[36svh] sm:min-h-[40vh] md:min-h-[44vh]"
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        priority
        className="object-cover object-[center_35%] md:object-center"
        sizes="100vw"
      />
      <div className="overlay-banner absolute inset-0" />
      <div className="grain absolute inset-0" />
      <div
        className={cn(
          "relative z-10 w-full",
          "pb-10 pt-[calc(var(--header-height)+1.25rem)]",
          "md:pb-14 md:pt-[calc(var(--header-height-md)+1.75rem)]",
          "lg:pb-20"
        )}
      >
        <div className="container-premium">
          <FadeIn className="max-w-4xl">
            {eyebrow && <p className="text-eyebrow">{eyebrow}</p>}
            <div className="gold-line mt-3 sm:mt-4" />
            <h1 className="text-display-sm mt-4 text-white sm:mt-6">{title}</h1>
            {subtitle && (
              <p className="text-lead mt-4 max-w-2xl sm:mt-6">{subtitle}</p>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
