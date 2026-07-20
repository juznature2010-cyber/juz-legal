import type { LegalDocumentSection } from "@/lib/legal-documents/types";

function SectionBlock({ section, depth = 0 }: { section: LegalDocumentSection; depth?: number }) {
  const isChapter = section.children && section.children.length > 0;

  return (
    <section
      id={section.id}
      className={depth === 0 ? "scroll-mt-28 border-b border-navy/[0.06] pb-8" : "mt-6"}
    >
      <h3
        className={
          depth === 0
            ? "font-display text-2xl text-navy"
            : "text-lg font-semibold text-navy"
        }
      >
        {section.label}
        {section.title ? `: ${section.title}` : ""}
      </h3>
      {section.content && (
        <p className="mt-3 leading-relaxed text-muted">{section.content}</p>
      )}
      {isChapter && (
        <div className="mt-4 space-y-4 border-l-2 border-gold/20 pl-4">
          {section.children!.map((child) => (
            <SectionBlock key={child.id} section={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </section>
  );
}

export function LegalDocumentContent({ sections }: { sections: LegalDocumentSection[] }) {
  const toc = sections.flatMap((section) => [
    section,
    ...(section.children ?? []),
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <aside className="card-luxury h-fit overflow-hidden lg:sticky lg:top-28">
        <div className="border-b border-navy/[0.06] bg-surface/80 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Mục lục
          </p>
        </div>
        <nav className="max-h-[24rem] overflow-y-auto p-3">
          <ul className="space-y-1 text-sm">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block rounded-sm px-2 py-1.5 text-muted transition hover:bg-gold/10 hover:text-navy"
                >
                  {item.label}
                  {item.title ? ` — ${item.title}` : ""}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="card-luxury p-5 sm:p-8">
        <div className="space-y-8">
          {sections.map((section) => (
            <SectionBlock key={section.id} section={section} />
          ))}
        </div>
        <p className="mt-8 border-t border-navy/[0.06] pt-6 text-xs leading-relaxed text-muted">
          Nội dung hiển thị là bản trích yếu phục vụ tra cứu nhanh. Để xem toàn văn chính thức,
          vui lòng tham chiếu nguồn CSDL Quốc gia về văn bản pháp luật khi có liên kết.
        </p>
      </div>
    </div>
  );
}
