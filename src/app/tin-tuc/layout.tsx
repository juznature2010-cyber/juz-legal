import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Tin tức pháp lý",
  description: "Tin tức, phân tích pháp luật và cập nhật văn bản mới cho doanh nghiệp — JUZ Legal.",
  path: "/tin-tuc",
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
