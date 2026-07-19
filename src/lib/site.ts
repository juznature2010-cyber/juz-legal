function resolveSiteUrl() {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.juzlegal.com";
  try {
    return new URL(candidate).origin;
  } catch {
    return "https://www.juzlegal.com";
  }
}

export const siteConfig = {
  name: "JUZ LEGAL",
  logo: "/logo.png",
  legalName: "Dịch vụ Pháp lý JUZ legal",
  description:
    "JUZ Legal cung cấp dịch vụ pháp lý chuyên sâu trong lĩnh vực doanh nghiệp, đầu tư, tranh tụng, đất đai, lao động, sở hữu trí tuệ và hôn nhân gia đình.",
  url: resolveSiteUrl(),
  googleAnalyticsId:
    process.env.NEXT_PUBLIC_GA_ID ?? "G-NX6GE58D37",
  ogImage: "/opengraph-image",
  locale: "vi_VN",
  phone: "1900633266",
  phoneDisplay: "1900 633 266",
  email: "juz.legal@gmail.com",
  // Resend sandbox: dùng email đăng ký Resend cho tới khi verify domain juzlegal.com
  bookingNotifyEmail: "juz.nature2010@gmail.com",
  address: "Tầng 6, Tòa nhà IMC, Quận 3, Hồ Chí Minh",
  workingHours: "Thứ 2 – Thứ 6: 8:00 – 18:00 | Thứ 7: 8:00 – 12:00",
  mapEmbed:
    "https://www.google.com/maps?q=T%C3%B2a%20nh%C3%A0%20IMC%2C%20Qu%E1%BA%ADn%203%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh&output=embed",
} as const;
