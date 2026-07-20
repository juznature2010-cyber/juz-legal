/** Ảnh nền thương hiệu — thay bằng ảnh chụp thật khi có bộ media chính thức */
export const images = {
  hero: "/brand/hero.svg",
  about: "/brand/about.svg",
  services: "/brand/services.svg",
  team: "/brand/team.svg",
  insights: "/brand/insights.svg",
  contact: "/brand/contact.svg",
  default: "/brand/default.svg",
} as const;

export type ImageKey = keyof typeof images;
