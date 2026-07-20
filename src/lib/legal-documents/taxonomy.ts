import type { DocumentStatus, TaxonomyItem } from "./types";

export const documentTypes: TaxonomyItem[] = [
  { id: "hien-phap", label: "Hiến pháp" },
  { id: "luat", label: "Luật" },
  { id: "bo-luat", label: "Bộ luật" },
  { id: "nghi-quyet", label: "Nghị quyết" },
  { id: "nghi-dinh", label: "Nghị định" },
  { id: "quyet-dinh", label: "Quyết định" },
  { id: "thong-tu", label: "Thông tư" },
  { id: "thong-tu-lien-tich", label: "Thông tư liên tịch" },
  { id: "van-ban-hop-nhat", label: "Văn bản hợp nhất" },
  { id: "huong-dan", label: "Hướng dẫn chuyên môn" },
];

export const issuers: TaxonomyItem[] = [
  { id: "quoc-hoi", label: "Quốc hội" },
  { id: "chinh-phu", label: "Chính phủ" },
  { id: "thu-tuong", label: "Thủ tướng Chính phủ" },
  { id: "bo-tu-phap", label: "Bộ Tư pháp" },
  { id: "bo-ke-hoach-dau-tu", label: "Bộ Kế hoạch và Đầu tư" },
  { id: "bo-lao-dong", label: "Bộ Lao động - Thương binh và Xã hội" },
  { id: "bo-tai-chinh", label: "Bộ Tài chính" },
  { id: "bo-cong-thuong", label: "Bộ Công Thương" },
  { id: "cuc-shtt", label: "Cục Sở hữu trí tuệ" },
  { id: "juz-legal", label: "JUZ Legal" },
];

export const legalFields: TaxonomyItem[] = [
  { id: "doanh-nghiep", label: "Doanh nghiệp" },
  { id: "dau-tu", label: "Đầu tư" },
  { id: "lao-dong", label: "Lao động" },
  { id: "dat-dai", label: "Đất đai - Nhà ở" },
  { id: "so-huu-tri-tue", label: "Sở hữu trí tuệ" },
  { id: "thue-tai-chinh", label: "Thuế - Tài chính" },
  { id: "thuong-mai", label: "Thương mại" },
  { id: "hon-nhan-gia-dinh", label: "Hôn nhân và gia đình" },
  { id: "hanh-chinh", label: "Hành chính" },
  { id: "tranh-chap", label: "Tranh tụng - Trọng tài" },
];

export const documentStatusLabels: Record<DocumentStatus, string> = {
  "con-hieu-luc": "Còn hiệu lực",
  "het-hieu-luc": "Hết hiệu lực",
  "chua-co-hieu-luc": "Chưa có hiệu lực",
  "sua-doi-bo-sung": "Sửa đổi, bổ sung một phần",
};

export function getDocumentTypeLabel(id: string) {
  return documentTypes.find((item) => item.id === id)?.label ?? id;
}

export function getIssuerLabel(id: string) {
  return issuers.find((item) => item.id === id)?.label ?? id;
}

export function getFieldLabel(id: string) {
  return legalFields.find((item) => item.id === id)?.label ?? id;
}

export function getStatusLabel(status: DocumentStatus) {
  return documentStatusLabels[status];
}
