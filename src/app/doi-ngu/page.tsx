import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { team } from "@/lib/data";

export const metadata = createMetadata({
  title: "Đội ngũ luật sư",
  description: "Đội ngũ luật sư và chuyên viên pháp lý JUZ Legal.",
  path: "/doi-ngu",
});

export default function TeamPage() {
  return (
    <>
      <PageBanner
        eyebrow="Đội ngũ"
        title="Luật sư & chuyên viên"
        subtitle="Chuyên môn sâu, kinh nghiệm thực tiễn và cam kết bảo mật tuyệt đối."
        image="team"
      />
      <section className="section-premium bg-ivory">
        <div className="container-premium">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
            {team.map((m) => (
              <article
                key={m.slug}
                className="card-luxury flex flex-col overflow-hidden md:flex-row"
              >
                <div className="relative aspect-[4/3] w-full shrink-0 bg-navy-mid md:aspect-square md:w-48 lg:w-56" />
                <div className="p-5 sm:p-6">
                  <h2 className="font-display text-2xl text-navy">{m.name}</h2>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-gold">
                    {m.role}
                  </p>
                  <dl className="mt-4 space-y-2 text-sm text-muted">
                    <div>
                      <dt className="font-medium text-navy">Chuyên môn</dt>
                      <dd>{m.specialty}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-navy">Kinh nghiệm</dt>
                      <dd>{m.experience}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-navy">Chứng chỉ</dt>
                      <dd>{m.license}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
