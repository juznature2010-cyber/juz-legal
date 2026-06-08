export const siteConfig = {
  name: "JUZ LEGAL",
  logo: "/logo.png",
  legalName: "Dịch vụ Pháp lý JUZ legal",
  description:
    "JUZ Legal cung cấp dịch vụ pháp lý chuyên sâu trong lĩnh vực doanh nghiệp, đầu tư, tranh tụng, đất đai, lao động, sở hữu trí tuệ và hôn nhân gia đình.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://juzlegal.com",
  googleAnalyticsId:
    process.env.NEXT_PUBLIC_GA_ID ?? "G-NX6GE58D37",
  ogImage: "/og-image.jpg",
  locale: "vi_VN",
  phone: "1900633266",
  phoneDisplay: "1900 633 266",
  email: "juz.legal2010@gmail.com",
  address: "Tầng 12, Tòa nhà ABC, Quận 1, TP. Hồ Chí Minh",
  workingHours: "Thứ 2 – Thứ 6: 8:00 – 18:00 | Thứ 7: 8:00 – 12:00",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.954!2d106.7!3d10.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzAwLjAiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1svi!2s!4v1",
} as const;
