import { createMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/sections/page-banner";
import { BookingForm } from "@/components/sections/booking-form";

export const metadata = createMetadata({
  title: "Đặt lịch tư vấn",
  description: "Đặt lịch tư vấn pháp lý trực tuyến hoặc tại văn phòng JUZ Legal.",
  path: "/dat-lich",
});

export default function BookingPage() {
  return (
    <>
      <PageBanner
        eyebrow="Tư vấn"
        title="Đặt lịch tư vấn"
        subtitle="Chọn dịch vụ, luật sư, ngày giờ và hình thức tư vấn phù hợp."
        image="contact"
      />
      <section className="section-premium bg-ivory">
        <div className="container-narrow">
          <div className="card-luxury p-5 sm:p-8 md:p-10">
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  );
}
