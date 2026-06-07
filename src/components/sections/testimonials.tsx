"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/lib/data";
import { images } from "@/lib/images";
import { FadeIn } from "@/components/motion";

export function TestimonialsSlider() {
  const [idx, setIdx] = useState(0);
  const t = testimonials[idx];

  return (
    <section className="relative overflow-hidden bg-navy-deep py-16 text-white sm:py-24 md:py-28 lg:py-36">
      <Image
        src={images.default}
        alt=""
        fill
        className="object-cover opacity-15"
        sizes="100vw"
      />
      <div className="overlay-banner absolute inset-0" />
      <div className="grain absolute inset-0" />
      <div className="container-premium relative z-10">
        <FadeIn className="mx-auto max-w-4xl text-center">
          <p className="text-eyebrow">Ý kiến khách hàng</p>
          <div className="gold-line mx-auto mt-3 sm:mt-4" />
          <blockquote className="mt-6 font-display text-xl font-light leading-relaxed sm:mt-10 sm:text-2xl md:text-3xl md:leading-snug lg:text-4xl">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-gold sm:mt-10 sm:text-[11px] sm:tracking-[0.25em]">
            {t.author}
          </p>
          <div className="mt-8 flex justify-center gap-3 sm:mt-12">
            <button
              type="button"
              onClick={() =>
                setIdx((i) => (i - 1 + testimonials.length) % testimonials.length)
              }
              className="flex h-11 w-11 items-center justify-center border border-white/15 transition hover:border-gold hover:text-gold sm:h-12 sm:w-12"
              aria-label="Trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % testimonials.length)}
              className="flex h-11 w-11 items-center justify-center border border-white/15 transition hover:border-gold hover:text-gold sm:h-12 sm:w-12"
              aria-label="Sau"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
