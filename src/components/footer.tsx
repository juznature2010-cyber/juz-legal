import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { mainNav, services } from "@/lib/data";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="relative border-t border-gold/20 bg-navy-deep text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="container-premium py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Logo href="/" size="lg" />
            <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/40 sm:text-[11px] sm:tracking-[0.25em]">
              {siteConfig.legalName}
            </p>
            <div className="gold-line mt-6 sm:mt-8" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:mt-6">
              {siteConfig.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10 lg:col-span-7">
            <div>
              <h3 className="text-eyebrow text-[10px] text-gold/90">Liên kết</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/65 sm:mt-5 sm:space-y-2.5">
                {mainNav.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="transition duration-300 hover:text-gold"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/dat-lich" className="transition hover:text-gold">
                    Đặt lịch tư vấn
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-eyebrow text-[10px] text-gold/90">Dịch vụ</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/65 sm:mt-5 sm:space-y-2.5">
                {services.slice(0, 5).map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/dich-vu/${s.slug}`}
                      className="line-clamp-2 transition hover:text-gold"
                    >
                      {s.title.replace(/^Tư vấn (pháp luật )?/, "")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-eyebrow text-[10px] text-gold/90">Liên hệ</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/65 sm:mt-5 sm:space-y-4">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{siteConfig.address}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  <a href={`tel:${siteConfig.phone}`} className="hover:text-gold">
                    {siteConfig.phoneDisplay}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  <a href={`mailto:${siteConfig.email}`} className="break-all hover:text-gold">
                    {siteConfig.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-center text-[10px] uppercase tracking-[0.12em] text-white/35 sm:mt-14 sm:flex-row sm:gap-4 sm:pt-8 sm:text-left sm:text-[11px] sm:tracking-[0.15em]">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}</p>
          <p>Bảo mật · Chuyên nghiệp · Toàn cầu</p>
        </div>
      </div>
    </footer>
  );
}
