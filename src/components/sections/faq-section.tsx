"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/sections/section-heading";

export function FaqSection({
  title = "Câu hỏi thường gặp",
  items,
}: {
  title?: string;
  items: { q: string; a: string }[];
}) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section className="section-premium bg-ivory">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replaceAll("<", "\\u003c"),
        }}
      />
      <div className="container-premium">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="FAQ" title={title} align="center" />
          <Accordion type="single" collapsible className="mt-12">
            {items.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`}>
                <AccordionTrigger className="font-display text-navy">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
