import type { LegalDocument } from "./types";

export const legalDocuments: LegalDocument[] = [
  {
    slug: "luat-doanh-nghiep-2020",
    number: "59/2020/QH14",
    docType: "luat",
    title: "Luật Doanh nghiệp số 59/2020/QH14",
    issuer: "quoc-hoi",
    field: "doanh-nghiep",
    status: "con-hieu-luc",
    issuedDate: "2020-06-17",
    effectiveDate: "2021-01-01",
    signer: "Chủ tịch Quốc hội Nguyễn Thị Kim Ngân",
    sourceUrl: "https://vbpl.vn/VBQPPL/Pages/vbpq-toanvan.aspx?ItemID=149086",
    sections: [
      {
        id: "chuong-1",
        label: "Chương I",
        title: "Những quy định chung",
        children: [
          {
            id: "dieu-1",
            label: "Điều 1",
            title: "Phạm vi điều chỉnh",
            content:
              "Luật này quy định về việc thành lập, tổ chức quản lý, tái tổ chức, giải thể và hoạt động có liên quan của doanh nghiệp.",
          },
          {
            id: "dieu-4",
            label: "Điều 4",
            title: "Loại hình doanh nghiệp",
            content:
              "Doanh nghiệp bao gồm công ty trách nhiệm hữu hạn, công ty cổ phần, công ty hợp danh và doanh nghiệp tư nhân.",
          },
        ],
      },
      {
        id: "chuong-2",
        label: "Chương II",
        title: "Thành lập doanh nghiệp",
        children: [
          {
            id: "dieu-28",
            label: "Điều 28",
            title: "Hồ sơ đăng ký thành lập doanh nghiệp",
            content:
              "Hồ sơ đăng ký thành lập doanh nghiệp gồm giấy đề nghị đăng ký, điều lệ công ty, danh sách thành viên hoặc cổ đông sáng lập và các giấy tờ pháp lý khác theo quy định.",
          },
        ],
      },
    ],
    relatedSlugs: ["nghi-dinh-01-2021-nd-cp", "nghi-dinh-168-2025-nd-cp"],
  },
  {
    slug: "nghi-dinh-01-2021-nd-cp",
    number: "01/2021/NĐ-CP",
    docType: "nghi-dinh",
    title:
      "Nghị định quy định về đăng ký doanh nghiệp",
    issuer: "chinh-phu",
    field: "doanh-nghiep",
    status: "con-hieu-luc",
    issuedDate: "2021-01-04",
    effectiveDate: "2021-01-04",
    signer: "Thủ tướng Chính phủ Nguyễn Xuân Phúc",
    sourceUrl: "https://vbpl.vn/VBQPPL/Pages/vbpq-toanvan.aspx?ItemID=149088",
    sections: [
      {
        id: "dieu-1",
        label: "Điều 1",
        title: "Phạm vi điều chỉnh",
        content:
          "Nghị định này quy định chi tiết thủ tục đăng ký doanh nghiệp, đăng ký thay đổi nội dung đăng ký doanh nghiệp và đăng ký giải thể doanh nghiệp.",
      },
      {
        id: "dieu-12",
        label: "Điều 12",
        title: "Thời hạn giải quyết hồ sơ",
        content:
          "Trong thời hạn 03 ngày làm việc kể từ ngày nhận hồ sơ hợp lệ, Cơ quan đăng ký kinh doanh cấp tỉnh có trách nhiệm cấp Giấy chứng nhận đăng ký doanh nghiệp.",
      },
    ],
    relatedSlugs: ["luat-doanh-nghiep-2020"],
  },
  {
    slug: "luat-dau-tu-2020",
    number: "61/2020/QH14",
    docType: "luat",
    title: "Luật Đầu tư số 61/2020/QH14",
    issuer: "quoc-hoi",
    field: "dau-tu",
    status: "con-hieu-luc",
    issuedDate: "2020-06-17",
    effectiveDate: "2021-01-01",
    signer: "Chủ tịch Quốc hội Nguyễn Thị Kim Ngân",
    sourceUrl: "https://vbpl.vn/VBQPPL/Pages/vbpq-toanvan.aspx?ItemID=149087",
    sections: [
      {
        id: "dieu-3",
        label: "Điều 3",
        title: "Nguyên tắc đầu tư",
        content:
          "Nhà đầu tư được tự do kinh doanh trong các ngành, nghề mà pháp luật không cấm; được bình đẳng trước pháp luật và được Nhà nước bảo hộ quyền, lợi ích hợp pháp.",
      },
      {
        id: "dieu-36",
        label: "Điều 36",
        title: "Thủ tục đầu tư",
        content:
          "Dự án đầu tư thuộc diện chấp thuận chủ trương đầu tư phải thực hiện thủ tục chấp thuận chủ trương trước khi triển khai các bước tiếp theo.",
      },
    ],
    relatedSlugs: ["nghi-dinh-31-2021-nd-cp"],
  },
  {
    slug: "nghi-dinh-31-2021-nd-cp",
    number: "31/2021/NĐ-CP",
    docType: "nghi-dinh",
    title:
      "Nghị định quy định chi tiết một số điều của Luật Đầu tư",
    issuer: "chinh-phu",
    field: "dau-tu",
    status: "con-hieu-luc",
    issuedDate: "2021-03-26",
    effectiveDate: "2021-03-26",
    signer: "Thủ tướng Chính phủ Phạm Minh Chính",
    sections: [
      {
        id: "dieu-5",
        label: "Điều 5",
        title: "Hồ sơ đăng ký đầu tư",
        content:
          "Hồ sơ đăng ký đầu tư bao gồm văn bản đề nghị thực hiện dự án đầu tư, bản sao giấy tờ pháp lý của nhà đầu tư và các tài liệu chứng minh năng lực tài chính.",
      },
    ],
    relatedSlugs: ["luat-dau-tu-2020"],
  },
  {
    slug: "bo-luat-lao-dong-2019",
    number: "45/2019/QH14",
    docType: "bo-luat",
    title: "Bộ luật Lao động số 45/2019/QH14",
    issuer: "quoc-hoi",
    field: "lao-dong",
    status: "con-hieu-luc",
    issuedDate: "2019-11-20",
    effectiveDate: "2021-01-01",
    signer: "Chủ tịch Quốc hội Nguyễn Thị Kim Ngân",
    sourceUrl: "https://vbpl.vn/VBQPPL/Pages/vbpq-toanvan.aspx?ItemID=142194",
    sections: [
      {
        id: "dieu-13",
        label: "Điều 13",
        title: "Hợp đồng lao động",
        content:
          "Hợp đồng lao động là sự thỏa thuận giữa người lao động và người sử dụng lao động về việc làm có trả lương, điều kiện lao động, quyền và nghĩa vụ của mỗi bên.",
      },
      {
        id: "dieu-41",
        label: "Điều 41",
        title: "Thời giờ làm việc",
        content:
          "Thời giờ làm việc bình thường không quá 08 giờ trong một ngày và không quá 48 giờ trong một tuần.",
      },
    ],
    relatedSlugs: ["thong-tu-10-2020-tt-bldtbxh"],
  },
  {
    slug: "thong-tu-10-2020-tt-bldtbxh",
    number: "10/2020/TT-BLĐTBXH",
    docType: "thong-tu",
    title:
      "Thông tư hướng dẫn ghi nội dung hợp đồng lao động",
    issuer: "bo-lao-dong",
    field: "lao-dong",
    status: "con-hieu-luc",
    issuedDate: "2020-08-12",
    effectiveDate: "2020-08-12",
    signer: "Bộ trưởng Bộ Lao động - Thương binh và Xã hội",
    sections: [
      {
        id: "dieu-2",
        label: "Điều 2",
        title: "Nội dung bắt buộc của hợp đồng lao động",
        content:
          "Hợp đồng lao động phải ghi rõ tên công việc, địa điểm làm việc, thời hạn hợp đồng, mức lương và các phụ cấp liên quan.",
      },
    ],
    relatedSlugs: ["bo-luat-lao-dong-2019"],
  },
  {
    slug: "luat-so-huu-tri-tue-2005",
    number: "50/2005/QH11",
    docType: "luat",
    title: "Luật Sở hữu trí tuệ số 50/2005/QH11",
    issuer: "quoc-hoi",
    field: "so-huu-tri-tue",
    status: "sua-doi-bo-sung",
    issuedDate: "2005-11-29",
    effectiveDate: "2006-07-01",
    signer: "Chủ tịch Quốc hội Nguyễn Văn An",
    sourceUrl: "https://vbpl.vn/VBQPPL/Pages/vbpq-toanvan.aspx?ItemID=23204",
    sections: [
      {
        id: "dieu-4",
        label: "Điều 4",
        title: "Quyền sở hữu công nghiệp",
        content:
          "Quyền sở hữu công nghiệp bao gồm quyền đối với sáng chế, giải pháp hữu ích, kiểu dáng công nghiệp, nhãn hiệu, tên thương mại và chỉ dẫn địa lý.",
      },
      {
        id: "dieu-72",
        label: "Điều 72",
        title: "Điều kiện bảo hộ nhãn hiệu",
        content:
          "Nhãn hiệu được bảo hộ nếu là dấu hiệu nhìn thấy được, có khả năng phân biệt hàng hóa, dịch vụ của chủ sở hữu với hàng hóa, dịch vụ của tổ chức, cá nhân khác.",
      },
    ],
    relatedSlugs: ["thong-tu-23-2023-tt-bkhdt"],
  },
  {
    slug: "thong-tu-23-2023-tt-bkhdt",
    number: "23/2023/TT-BKHĐT",
    docType: "thong-tu",
    title:
      "Thông tư hướng dẫn thủ tục đăng ký nhãn hiệu",
    issuer: "cuc-shtt",
    field: "so-huu-tri-tue",
    status: "con-hieu-luc",
    issuedDate: "2023-12-31",
    effectiveDate: "2024-02-15",
    signer: "Cục trưởng Cục Sở hữu trí tuệ",
    sections: [
      {
        id: "dieu-5",
        label: "Điều 5",
        title: "Hồ sơ đăng ký nhãn hiệu",
        content:
          "Hồ sơ gồm tờ khai, mẫu nhãn hiệu, danh mục hàng hóa, dịch vụ và phí, lệ phí theo quy định hiện hành.",
      },
    ],
    relatedSlugs: ["luat-so-huu-tri-tue-2005"],
  },
  {
    slug: "luat-dat-dai-2024",
    number: "31/2024/QH15",
    docType: "luat",
    title: "Luật Đất đai số 31/2024/QH15",
    issuer: "quoc-hoi",
    field: "dat-dai",
    status: "con-hieu-luc",
    issuedDate: "2024-01-18",
    effectiveDate: "2025-01-01",
    signer: "Chủ tịch Quốc hội Vương Đình Huệ",
    sourceUrl: "https://vbpl.vn/VBQPPL/Pages/vbpq-toanvan.aspx?ItemID=170048",
    sections: [
      {
        id: "dieu-3",
        label: "Điều 3",
        title: "Nguyên tắc sử dụng đất",
        content:
          "Việc sử dụng đất phải phù hợp quy hoạch, kế hoạch sử dụng đất, đúng mục đích và tuân thủ quy định của pháp luật về đất đai.",
      },
    ],
  },
  {
    slug: "nghi-dinh-168-2025-nd-cp",
    number: "168/2025/NĐ-CP",
    docType: "nghi-dinh",
    title:
      "Nghị định quy định chi tiết thi hành Luật Doanh nghiệp về quản trị công ty",
    issuer: "chinh-phu",
    field: "doanh-nghiep",
    status: "con-hieu-luc",
    issuedDate: "2025-12-30",
    effectiveDate: "2026-02-01",
    signer: "Thủ tướng Chính phủ",
    sections: [
      {
        id: "dieu-1",
        label: "Điều 1",
        title: "Phạm vi điều chỉnh",
        content:
          "Nghị định này quy định chi tiết quyền, nghĩa vụ của thành viên, cổ đông, hội đồng quản trị, ban kiểm soát và người quản lý công ty.",
      },
    ],
    relatedSlugs: ["luat-doanh-nghiep-2020"],
  },
  {
    slug: "huong-dan-thu-tuc-dau-tu-2026",
    number: "JUZ/HD-2026/01",
    docType: "huong-dan",
    title: "Hướng dẫn thủ tục đầu tư 2026 — checklist thực hành",
    issuer: "juz-legal",
    field: "dau-tu",
    status: "con-hieu-luc",
    issuedDate: "2026-06-20",
    effectiveDate: "2026-06-20",
    signer: "JUZ Legal",
    sections: [
      {
        id: "muc-1",
        label: "Mục 1",
        title: "Chuẩn bị hồ sơ",
        content:
          "Rà soát cấu trúc vốn, mục tiêu dự án, ngành nghề có điều kiện và thống nhất thông tin giữa các biểu mẫu trước khi nộp.",
      },
      {
        id: "muc-2",
        label: "Mục 2",
        title: "Theo dõi sau cấp phép",
        content:
          "Lập lịch cập nhật báo cáo, thay đổi đăng ký và lưu vết phiên bản tài liệu để phản hồi yêu cầu bổ sung nhanh.",
      },
    ],
    relatedSlugs: ["luat-dau-tu-2020", "nghi-dinh-31-2021-nd-cp"],
  },
  {
    slug: "huong-dan-hop-dong-thuong-mai",
    number: "JUZ/HD-2026/02",
    docType: "huong-dan",
    title: "Hướng dẫn rà soát hợp đồng thương mại — điểm rủi ro thường gặp",
    issuer: "juz-legal",
    field: "thuong-mai",
    status: "con-hieu-luc",
    issuedDate: "2026-06-12",
    effectiveDate: "2026-06-12",
    signer: "JUZ Legal",
    sections: [
      {
        id: "muc-1",
        label: "Mục 1",
        title: "Điều khoản then chốt",
        content:
          "Tập trung rà soát phạm vi, giá, nghiệm thu, thanh toán, bất khả kháng và cơ chế giải quyết tranh chấp.",
      },
    ],
  },
  {
    slug: "luat-thuong-mai-2005",
    number: "36/2005/QH11",
    docType: "luat",
    title: "Luật Thương mại số 36/2005/QH11",
    issuer: "quoc-hoi",
    field: "thuong-mai",
    status: "sua-doi-bo-sung",
    issuedDate: "2005-06-14",
    effectiveDate: "2006-01-01",
    signer: "Chủ tịch Quốc hội Nguyễn Văn An",
    sourceUrl: "https://vbpl.vn/VBQPPL/Pages/vbpq-toanvan.aspx?ItemID=23189",
    sections: [
      {
        id: "dieu-3",
        label: "Điều 3",
        title: "Phạm vi điều chỉnh",
        content:
          "Luật này quy định về hoạt động thương mại và quyền, nghĩa vụ của các chủ thể tham gia hoạt động thương mại.",
      },
    ],
  },
  {
    slug: "nghi-dinh-126-2020-nd-cp",
    number: "126/2020/NĐ-CP",
    docType: "nghi-dinh",
    title:
      "Nghị định quy định chi tiết thi hành Luật Thuế giá trị gia tăng",
    issuer: "chinh-phu",
    field: "thue-tai-chinh",
    status: "con-hieu-luc",
    issuedDate: "2020-10-19",
    effectiveDate: "2020-12-05",
    signer: "Thủ tướng Chính phủ Nguyễn Xuân Phúc",
    sections: [
      {
        id: "dieu-1",
        label: "Điều 1",
        title: "Phạm vi điều chỉnh",
        content:
          "Nghị định này quy định chi tiết thi hành Luật Thuế giá trị gia tăng về đối tượng không chịu thuế, đối tượng chịu thuế và phương pháp tính thuế.",
      },
    ],
  },
];

export function getLegalDocumentBySlug(slug: string) {
  return legalDocuments.find((doc) => doc.slug === slug);
}
