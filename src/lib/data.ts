export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: string;
  intro: string;
  items: string[];
  process: { step: number; title: string; desc: string }[];
  faq: { q: string; a: string }[];
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  license: string;
  image: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  featured?: boolean;
  content: string[];
};

export const mainNav = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/doi-ngu", label: "Đội ngũ" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" },
] as const;

export const services: Service[] = [
  {
    slug: "doanh-nghiep",
    title: "Tư vấn pháp luật doanh nghiệp",
    short: "Thành lập, vận hành, M&A và tuân thủ pháp luật cho doanh nghiệp.",
    icon: "Building2",
    intro:
      "JUZ Legal đồng hành cùng doanh nghiệp trong suốt vòng đời — từ thành lập, điều chỉnh cơ cấu, hợp đồng thương mại đến tuân thủ và giải quyết tranh chấp nội bộ.",
    items: [
      "Thành lập, sáp nhập, chia tách doanh nghiệp",
      "Soạn thẩm định hợp đồng thương mại",
      "Tư vấn quản trị và tuân thủ pháp luật",
      "M&A, chuyển nhượng vốn",
      "Bảo vệ quyền lợi cổ đông",
    ],
    process: [
      { step: 1, title: "Tiếp nhận & phân loại", desc: "Làm rõ nhu cầu, phạm vi và mục tiêu pháp lý." },
      { step: 2, title: "Phân tích rủi ro", desc: "Đánh giá văn bản, quy định và bối cảnh kinh doanh." },
      { step: 3, title: "Đề xuất giải pháp", desc: "Lộ trình thực hiện và phương án tối ưu chi phí." },
      { step: 4, title: "Triển khai & theo dõi", desc: "Hỗ trợ thực thi và cập nhật thay đổi pháp luật." },
    ],
    faq: [
      { q: "JUZ Legal có hỗ trợ doanh nghiệp FDI không?", a: "Có. Chúng tôi tư vấn thành lập, giấy phép và tuân thủ cho nhà đầu tư nước ngoài tại Việt Nam." },
      { q: "Thời gian soạn hợp đồng mẫu?", a: "Tùy độ phức tạp, thường từ 3–10 ngày làm việc với hợp đồng chuẩn doanh nghiệp." },
    ],
  },
  {
    slug: "dau-tu",
    title: "Tư vấn đầu tư",
    short: "Cấu trúc dự án, giấy phép và bảo vệ quyền lợi nhà đầu tư.",
    icon: "TrendingUp",
    intro:
      "Chúng tôi hỗ trợ nhà đầu tư trong và ngoài nước trong việc cấu trúc giao dịch, thẩm định pháp lý (legal due diligence) và tuân thủ quy định đầu tư.",
    items: [
      "Tư vấn luật đầu tư, FDI",
      "Thẩm định pháp lý dự án",
      "Giấy phép, ưu đãi đầu tư",
      "Hợp đồng liên doanh, hợp tác",
      "Giải quyết tranh chấp đầu tư",
    ],
    process: [
      { step: 1, title: "Khảo sát dự án", desc: "Thu thập thông tin, mục tiêu và hạn mức pháp lý." },
      { step: 2, title: "Due diligence", desc: "Rà soát rủi ro pháp lý, tài sản và nghĩa vụ." },
      { step: 3, title: "Cấu trúc giao dịch", desc: "Thiết kế phương án đầu tư phù hợp quy định." },
      { step: 4, title: "Hoàn thiện hồ sơ", desc: "Hỗ trợ đăng ký, ký kết và vận hành sau đầu tư." },
    ],
    faq: [
      { q: "Có tư vấn đầu tư bất động sản không?", a: "Có, kết hợp chuyên môn đất đai và đầu tư để đánh giá toàn diện dự án." },
    ],
  },
  {
    slug: "tranh-tung",
    title: "Tranh tụng và giải quyết tranh chấp",
    short: "Đại diện tại tòa án, trọng tài và thương lượng.",
    icon: "Scale",
    intro:
      "Đội ngũ litigator của JUZ Legal bảo vệ quyền lợi khách hàng qua các giai đoạn hòa giải, trọng tài và tố tụng với chiến lược rõ ràng.",
    items: [
      "Tranh chấp hợp đồng thương mại",
      "Tranh chấp lao động, cổ đông",
      "Trọng tài thương mại",
      "Thi hành án dân sự",
      "Tư vấn phòng ngừa tranh chấp",
    ],
    process: [
      { step: 1, title: "Đánh giá vụ việc", desc: "Phân tích chứng cứ và khả năng thành công." },
      { step: 2, title: "Chiến lược", desc: "Lựa chọn hòa giải, trọng tài hoặc kiện tụng." },
      { step: 3, title: "Thực hiện", desc: "Soạn đơn, đại diện và tham gia phiên tòa." },
      { step: 4, title: "Thi hành", desc: "Hỗ trợ thi hành phán quyết, kết quả trọng tài." },
    ],
    faq: [
      { q: "Có nhận tranh chấp quốc tế không?", a: "Có, phối hợp luật sư đối tác khi vụ việc có yếu tố nước ngoài." },
    ],
  },
  {
    slug: "dat-dai",
    title: "Đất đai và bất động sản",
    short: "Giao dịch, chuyển nhượng và giải phóng mặt bằng.",
    icon: "Landmark",
    intro:
      "Tư vấn toàn diện các giao dịch bất động sản, quy hoạch, thủ tục sổ đỏ và tranh chấp đất đai cho doanh nghiệp và cá nhân.",
    items: [
      "Thẩm định quyền sử dụng đất",
      "Hợp đồng mua bán, thuê BĐS",
      "Dự án bất động sản",
      "Tranh chấp đất đai",
      "Giải phóng mặt bằng",
    ],
    process: [
      { step: 1, title: "Rà soát pháp lý", desc: "Kiểm tra sổ, quy hoạch và nghĩa vụ tài chính." },
      { step: 2, title: "Cấu trúc giao dịch", desc: "Thiết kế hợp đồng và bảo đảm quyền lợi." },
      { step: 3, title: "Thủ tục hành chính", desc: "Hỗ trợ công chứng, sang tên, nộp hồ sơ." },
      { step: 4, title: "Hậu giao dịch", desc: "Theo dõi bàn giao và giải quyết phát sinh." },
    ],
    faq: [
      { q: "Có hỗ trợ dự án đầu tư lớn không?", a: "Có, phối hợp đội ngũ đầu tư và tranh tụng khi cần." },
    ],
  },
  {
    slug: "lao-dong",
    title: "Tư vấn lao động",
    short: "Nội quy, hợp đồng lao động và tranh chấp người lao động.",
    icon: "Users",
    intro:
      "Giúp doanh nghiệp xây dựng hệ thống lao động tuân thủ Bộ luật Lao động, giảm rủi ro kiện tụng và tối ưu chính sách nhân sự.",
    items: [
      "Nội quy, quy chế lao động",
      "Hợp đồng, sa thải, chấm dứt",
      "Bảo hiểm, lương thưởng",
      "Tranh chấp lao động",
      "Tuân thủ an toàn lao động",
    ],
    process: [
      { step: 1, title: "Kiểm tra tuân thủ", desc: "Rà soát hồ sơ và chính sách hiện hành." },
      { step: 2, title: "Chuẩn hóa", desc: "Soạn, sửa văn bản nội bộ." },
      { step: 3, title: "Đào tạo", desc: "Hướng dẫn HR và quản lý." },
      { step: 4, title: "Giải quyết tranh chấp", desc: "Đại diện thương lượng hoặc tố tụng." },
    ],
    faq: [
      { q: "Có tư vấn lao động cho FDI không?", a: "Có, bao gồm lao động expat và thỏa ước lao động tập thể." },
    ],
  },
  {
    slug: "so-huu-tri-tue",
    title: "Sở hữu trí tuệ",
    short: "Nhãn hiệu, bản quyền và bảo vệ quyền SHTT.",
    icon: "Lightbulb",
    intro:
      "Bảo vệ tài sản trí tuệ — nhãn hiệu, sáng chế, bản quyền phần mềm và xử lý vi phạm trên thị trường.",
    items: [
      "Đăng ký nhãn hiệu, kiểu dáng",
      "Hợp đồng chuyển giao công nghệ",
      "Xử lý vi phạm SHTT",
      "Bảo vệ bí mật kinh doanh",
      "Tư vấn franchise",
    ],
    process: [
      { step: 1, title: "Tra cứu & đánh giá", desc: "Kiểm tra khả năng đăng ký và xung đột." },
      { step: 2, title: "Nộp hồ sơ", desc: "Chuẩn bị và theo dõi thủ tục Cục SHTT." },
      { step: 3, title: "Gia hạn & chuyển nhượng", desc: "Quản lý danh mục SHTT doanh nghiệp." },
      { step: 4, title: "Bảo vệ quyền", desc: "Cảnh báo, khởi kiện khi bị vi phạm." },
    ],
    faq: [
      { q: "Thời gian đăng ký nhãn hiệu?", a: "Thông thường 12–18 tháng tùy loại hình và phản đối." },
    ],
  },
  {
    slug: "hon-nhan-gia-dinh",
    title: "Hôn nhân và gia đình",
    short: "Ly hôn, phân chia tài sản và quyền nuôi con.",
    icon: "Heart",
    intro:
      "Tư vấn và đại diện trong các vụ việc hôn nhân, ly hôn, thừa kế với sự tôn trọng, bảo mật và ưu tiên giải pháp hòa giải khi phù hợp.",
    items: [
      "Kết hôn, ly hôn có yếu tố nước ngoài",
      "Phân chia tài sản",
      "Quyền nuôi con, cấp dưỡng",
      "Thừa kế, di chúc",
      "Bảo vệ quyền trẻ em",
    ],
    process: [
      { step: 1, title: "Tư vấn bảo mật", desc: "Làm rõ tình huống và mục tiêu khách hàng." },
      { step: 2, title: "Thương lượng", desc: "Ưu tiên thỏa thuận, hòa giải." },
      { step: 3, title: "Tố tụng", desc: "Đại diện khi không thể thỏa thuận." },
      { step: 4, title: "Thi hành", desc: "Hỗ trợ thực hiện bản án, thỏa thuận." },
    ],
    faq: [
      { q: "Thông tin có được bảo mật không?", a: "Tuyệt đối. JUZ Legal tuân thủ quy tắc bảo mật và đạo đức nghề nghiệp." },
    ],
  },
];

export const practiceAreas = services.map((s) => ({
  slug: s.slug,
  title: s.title,
  short: s.short,
  icon: s.icon,
}));

export const whyUs = [
  {
    title: "Chuyên môn đa lĩnh vực",
    desc: "Đội ngũ luật sư giàu kinh nghiệm trong doanh nghiệp, đầu tư, tranh tụng và SHTT.",
  },
  {
    title: "Tư duy giải pháp kinh doanh",
    desc: "Không chỉ tuân thủ pháp luật — chúng tôi tối ưu chi phí và thời gian cho khách hàng.",
  },
  {
    title: "Bảo mật tuyệt đối",
    desc: "Quy trình bảo mật thông tin và hồ sơ theo chuẩn công ty luật quốc tế.",
  },
  {
    title: "Hỗ trợ 24/7 khẩn cấp",
    desc: "Đường dây nóng pháp lý cho các tình huống cần xử lý ngay.",
  },
];

export const workProcess = [
  { step: "01", title: "Tiếp nhận yêu cầu", desc: "Lắng nghe, ghi nhận và phân loại nhu cầu pháp lý." },
  { step: "02", title: "Phân tích & báo phí", desc: "Đánh giá rủi ro, đề xuất phạm vi và phí dịch vụ minh bạch." },
  { step: "03", title: "Ký hợp đồng", desc: "Thỏa thuận điều khoản, cam kết bảo mật và tiến độ." },
  { step: "04", title: "Triển khai", desc: "Luật sư phụ trách theo sát đến khi hoàn tất." },
  { step: "05", title: "Hậu kỳ", desc: "Cập nhật thay đổi pháp luật và hỗ trợ phát sinh." },
];

export const team: TeamMember[] = [
  {
    slug: "nguyen-van-an",
    name: "LS. Nguyễn Văn An",
    role: "Giám đốc điều hành",
    specialty: "Doanh nghiệp, M&A, FDI",
    experience: "18 năm — từng là cố vấn tại tập đoàn đa quốc gia",
    license: "Thành viên Đoàn luật sư TP.HCM",
    image: "/team/placeholder-1.jpg",
  },
  {
    slug: "tran-thi-binh",
    name: "LS. Trần Thị Bình",
    role: "Trưởng bộ phận Tranh tụng",
    specialty: "Tranh chấp thương mại, trọng tài",
    experience: "14 năm — hơn 200 vụ việc tại tòa và trọng tài",
    license: "Thành viên Đoàn luật sư TP.HCM",
    image: "/team/placeholder-2.jpg",
  },
  {
    slug: "le-minh-cuong",
    name: "LS. Lê Minh Cường",
    role: "Cố vấn Đầu tư & Đất đai",
    specialty: "Đầu tư, bất động sản",
    experience: "12 năm — dự án FDI và BĐS quy mô lớn",
    license: "Thành viên Đoàn luật sư TP.HCM",
    image: "/team/placeholder-3.jpg",
  },
  {
    slug: "pham-thu-ha",
    name: "LS. Phạm Thu Hà",
    role: "Luật sư SHTT & Lao động",
    specialty: "Sở hữu trí tuệ, lao động",
    experience: "10 năm — đăng ký nhãn hiệu và tư vấn HR",
    license: "Thành viên Đoàn luật sư Hà Nội",
    image: "/team/placeholder-4.jpg",
  },
];

export const testimonials = [
  {
    quote:
      "JUZ Legal đã hỗ trợ chúng tôi hoàn tất thương vụ M&A với sự chuyên nghiệp và tốc độ đáng tin cậy.",
    author: "Giám đốc — Công ty công nghệ",
  },
  {
    quote:
      "Đội ngũ am hiểu luật đầu tư FDI, giúp dự án của chúng tôi vận hành đúng quy định ngay từ đầu.",
    author: "Nhà đầu tư — Singapore",
  },
  {
    quote:
      "Tư vấn lao động chuẩn mực, giảm đáng kể rủi ro tranh chấp với người lao động.",
    author: "HR Director — Sản xuất",
  },
];

export const clients = [
  "Tập đoàn công nghệ",
  "Nhà đầu tư FDI",
  "Doanh nghiệp sản xuất",
  "Chuỗi bán lẻ",
  "Startup fintech",
  "Gia đình doanh nhân",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "luat-dau-tu-2026",
    title: "Cập nhật Luật Đầu tư 2026: Điểm mới doanh nghiệp cần biết",
    excerpt:
      "Tổng hợp các thay đổi quan trọng ảnh hưởng đến nhà đầu tư trong và ngoài nước.",
    category: "Đầu tư",
    date: "2026-05-15",
    readTime: "8 phút",
    featured: true,
    content: [
      "Luật Đầu tư sửa đổi mang lại nhiều cơ hội nhưng cũng đặt ra yêu cầu tuân thủ cao hơn cho doanh nghiệp.",
      "JUZ Legal khuyến nghị rà soát giấy phép, điều kiện ngành nghề và cơ cấu vốn trước khi mở rộng đầu tư.",
    ],
  },
  {
    slug: "hop-dong-lao-dong-mau",
    title: "Hợp đồng lao động 2026: Mẫu chuẩn và lưu ý cho HR",
    excerpt: "Hướng dẫn cập nhật điều khoản bắt buộc theo Bộ luật Lao động.",
    category: "Lao động",
    date: "2026-05-10",
    readTime: "6 phút",
    content: [
      "Hợp đồng không đúng quy định là nguyên nhân phổ biến dẫn đến tranh chấp lao động.",
      "Doanh nghiệp nên rà soát toàn bộ hợp đồng đang hiệu lực ít nhất mỗi năm một lần.",
    ],
  },
  {
    slug: "dang-ky-nhan-hieu",
    title: "Đăng ký nhãn hiệu: Quy trình và rủi ro thường gặp",
    excerpt: "Bảo vệ thương hiệu sớm để tránh tranh chấp và mất quyền.",
    category: "Sở hữu trí tuệ",
    date: "2026-05-01",
    readTime: "7 phút",
    content: [
      "Tra cứu nhãn hiệu trước khi nộp đơn giúp giảm nguy cơ bị từ chối hoặc phản đối.",
      "JUZ Legal hỗ trợ tra cứu, nộp đơn và theo dõi toàn bộ vòng đời nhãn hiệu.",
    ],
  },
];

export const companyHistory = [
  { year: "2015", event: "Thành lập Công ty TNHH Dịch vụ Pháp lý JUZ tại TP.HCM." },
  { year: "2018", event: "Mở rộng bộ phận FDI và tranh tụng thương mại." },
  { year: "2022", event: "Đối tác chiến lược với các hãng luật khu vực ASEAN." },
  { year: "2026", event: "Ra mắt nền tảng đặt lịch tư vấn trực tuyến JUZ Legal." },
];

export const values = [
  { title: "Chính trực", desc: "Hành nghề trung thực, minh bạch trong mọi tư vấn." },
  { title: "Chuyên sâu", desc: "Không ngừng cập nhật pháp luật và thực tiễn." },
  { title: "Tận tâm", desc: "Đặt lợi ích khách hàng làm trọng tâm." },
  { title: "Đổi mới", desc: "Ứng dụng công nghệ nâng cao trải nghiệm pháp lý." },
];

export const achievements = [
  "500+ khách hàng doanh nghiệp và cá nhân",
  "98% khách hàng hài lòng khảo sát nội bộ",
  "Đối tác tư vấn cho 50+ dự án FDI",
  "Đội ngũ 20+ luật sư và chuyên viên pháp lý",
];

export const homeFaq = [
  {
    q: "Làm sao để đặt lịch tư vấn?",
    a: "Truy cập trang Đặt lịch, chọn dịch vụ, luật sư và khung giờ phù hợp. Chúng tôi xác nhận trong vòng 2 giờ làm việc.",
  },
  {
    q: "Phí tư vấn được tính như thế nào?",
    a: "Theo gói giờ, theo vụ việc hoặc trọn gói — được báo minh bạch trước khi ký hợp đồng dịch vụ.",
  },
  {
    q: "JUZ Legal có hỗ trợ khách hàng tỉnh khác không?",
    a: "Có. Tư vấn trực tuyến toàn quốc và đại diện tại các tỉnh thành theo thỏa thuận.",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getTeamMember(slug: string) {
  return team.find((m) => m.slug === slug);
}
