/** Ảnh nền chất lượng cao (Unsplash) — thay bằng ảnh thật khi triển khai */
export const images = {
  hero:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85",
  about:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85",
  services:
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=2400&q=85",
  team:
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=2400&q=85",
  insights:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2400&q=85",
  contact:
    "https://images.unsplash.com/photo-1564501042548-fc3c61e3e8e0?auto=format&fit=crop&w=2400&q=85",
  default:
    "https://images.unsplash.com/photo-1479140164179-4759bd7b72d0?auto=format&fit=crop&w=2400&q=85",
} as const;

export type ImageKey = keyof typeof images;
