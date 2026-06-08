import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { ContactForm } from "@/components/sections/contact-form";
import { siteConfig } from "@/lib/site";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export const metadata = createMetadata({
  title: "Liên hệ",
  description: "Liên hệ JUZ Legal — hotline, email, địa chỉ văn phòng và form liên hệ.",
  path: "/lien-he",
});

export default function ContactPage() {
  return (
    <>
      <PageBanner
        eyebrow="Liên hệ"
        title="Liên hệ JUZ Legal"
        subtitle="Chúng tôi sẵn sàng lắng nghe và phản hồi trong thời gian sớm nhất."
        image="contact"
      />
      <section className="section-premium bg-ivory">
        <div className="container-premium">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-medium">Địa chỉ</p>
                  <p className="text-muted">{siteConfig.address}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-medium">Hotline</p>
                  <a href={`tel:${siteConfig.phone}`} className="text-muted hover:text-gold">
                    {siteConfig.phoneDisplay}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-muted hover:text-gold"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-medium">Giờ làm việc</p>
                  <p className="text-muted">{siteConfig.workingHours}</p>
                </div>
              </div>
              <div className="aspect-video min-h-[200px] overflow-hidden border border-navy/10 sm:min-h-0">
                <iframe
                  title="Bản đồ văn phòng JUZ Legal"
                  src={siteConfig.mapEmbed}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <div className="card-luxury p-10">
              <h2 className="font-display text-xl text-navy">Gửi tin nhắn</h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
