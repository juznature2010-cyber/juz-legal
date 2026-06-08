import type { BlogPost, Service, TeamMember } from "@/lib/data";

type ServiceOverride = Partial<
  Pick<Service, "title" | "short" | "intro" | "items"> & {
    process: { step: number; title: string; desc: string }[];
    faq: { q: string; a: string }[];
  }
>;

export const zhOverrides = {
  mainNav: [
    { href: "/", label: "首页" },
    { href: "/gioi-thieu", label: "关于我们" },
    { href: "/dich-vu", label: "法律服务" },
    { href: "/doi-ngu", label: "律师团队" },
    { href: "/tin-tuc", label: "新闻资讯" },
    { href: "/lien-he", label: "联系我们" },
  ],
  services: {
    "doanh-nghiep": {
      title: "企业法律顾问",
      short: "企业设立、运营、并购与合规服务。",
      intro: "JUZ Legal 陪伴企业全生命周期 — 从设立、重组、商业合同到合规与内部争议解决。",
      items: ["公司设立、合并与分立", "商业合同起草与审查", "公司治理与合规", "并购与股权转让", "股东权益保护"],
    },
    "dau-tu": {
      title: "投资咨询",
      short: "项目架构、许可审批与投资者权益保护。",
      intro: "我们为境内外投资者提供交易架构、法律尽职调查及投资合规咨询。",
      items: ["投资法与外商直接投资咨询", "项目法律尽职调查", "许可证与投资优惠", "合资与合作协议", "投资争议解决"],
    },
    "tranh-tung": {
      title: "诉讼与争议解决",
      short: "法庭代理、仲裁与谈判。",
      intro: "诉讼团队通过调解、仲裁与诉讼，以清晰策略维护客户权益。",
      items: ["商业合同争议", "劳动与股东争议", "商事仲裁", "民事判决执行", "争议预防咨询"],
    },
    "dat-dai": {
      title: "土地与房地产",
      short: "交易、转让与征地拆迁。",
      intro: "全面咨询房地产交易、规划、产权证手续及土地争议。",
      items: ["土地使用权尽职调查", "买卖与租赁合同", "房地产项目", "土地争议", "征地拆迁"],
    },
    "lao-dong": {
      title: "劳动法律",
      short: "内部规章、劳动合同与劳动争议。",
      intro: "帮助企业建立符合劳动法的用工体系，降低诉讼风险。",
      items: ["内部劳动规章", "合同、解雇与终止", "保险与薪酬", "劳动争议", "安全生产合规"],
    },
    "so-huu-tri-tue": {
      title: "知识产权",
      short: "商标、版权与知识产权维权。",
      intro: "保护商标、专利、软件著作权，处理市场侵权行为。",
      items: ["商标与外观设计注册", "技术转让协议", "知识产权侵权处理", "商业秘密保护", "特许经营咨询"],
    },
    "hon-nhan-gia-dinh": {
      title: "婚姻与家庭",
      short: "离婚、财产分割与子女抚养。",
      intro: "在婚姻、离婚、继承事务中提供保密咨询与代理服务。",
      items: ["跨境婚姻与离婚", "财产分割", "子女抚养与赡养", "继承与遗嘱", "儿童权益保护"],
    },
  } satisfies Record<string, ServiceOverride>,
  companyIntro: {
    title: "JUZ LEGAL – 国际法律标准",
    lead: "在全球经济不断变化的背景下，了解并遵守法律既是责任，也是可持续发展的保障。JUZ Legal 是您在越南取得成功与维护合法权益的战略合作伙伴。",
    experience: "凭借18年以上执业经验及500余位客户，JUZ Legal 在七大核心领域提供全面法律服务：",
    whyChooseTitle: "客户为何选择 JUZ Legal",
    quote: "我们不仅提供法律建议 — 更提供最优商业解决方案。",
    closing: "每一份客户委托都以诚信、保密和最高责任感对待。",
  },
  whyUs: [
    { title: "多领域专业实力", desc: "资深律师兼具本土知识与商业洞察。" },
    { title: "绝对保密", desc: "严格的信息安全流程，对标国际律所标准。" },
    { title: "透明与用心", desc: "清晰的五步流程，费用事先明示。" },
    { title: "24/7 紧急支持", desc: "热线随时响应突发法律问题。" },
  ],
  workProcess: [
    { step: "01", title: "受理需求", desc: "倾听、记录并分类法律需求。" },
    { step: "02", title: "分析与报价", desc: "风险评估与透明费用方案。" },
    { step: "03", title: "签约", desc: "约定条款、保密与进度。" },
    { step: "04", title: "执行", desc: "负责律师全程跟进。" },
    { step: "05", title: "后续服务", desc: "法律更新与持续支持。" },
  ],
  teamRoles: {
    "tran-dinh-long": { role: "执行董事", specialty: "企业、并购、外商直接投资", experience: "40年法律从业 — 原首席法官、副首席法官", license: "国际仲裁证书" },
    "tran-thi-binh": { role: "诉讼部负责人", specialty: "商事争议、仲裁", experience: "14年 — 200余起法院与仲裁案件", license: "胡志明市律师协会" },
    "le-minh-cuong": { role: "投资与房地产顾问", specialty: "投资、房地产", experience: "12年 — 大型外商直接投资与房地产项目", license: "胡志明市律师协会" },
    "pham-thu-ha": { role: "知识产权与劳动律师", specialty: "知识产权、劳动法", experience: "10年 — 商标注册与人力资源咨询", license: "河内律师协会" },
  } as Record<string, Partial<TeamMember>>,
  testimonials: [
    { quote: "JUZ Legal 以专业与高效协助我们完成并购交易。", author: "总监 — 科技公司" },
    { quote: "团队熟悉外商直接投资法律，帮助项目从一开始就合规运营。", author: "投资者 — 新加坡" },
    { quote: "规范的劳动咨询显著降低了与员工的争议风险。", author: "人力资源总监 — 制造业" },
  ],
  clients: ["科技集团", "外商投资者", "制造企业", "零售连锁", "金融科技初创", "企业家家族"],
  blogPosts: {
    "luat-dau-tu-2026": { title: "2026投资法更新：企业需知要点", excerpt: "影响境内外投资者的重要变化。", category: "投资", readTime: "8分钟", content: ["投资法修订带来机遇，也提高了合规要求。", "建议在扩张投资前审查许可证与资本结构。"] },
    "hop-dong-lao-dong-mau": { title: "2026劳动合同：人力资源标准模板", excerpt: "劳动法规定的必备条款。", category: "劳动", readTime: "6分钟", content: ["不合规合同是劳动争议的常见原因。", "建议至少每年审查一次在效合同。"] },
    "dang-ky-nhan-hieu": { title: "商标注册：流程与常见风险", excerpt: "尽早保护品牌，避免争议。", category: "知识产权", readTime: "7分钟", content: ["申请前检索可降低驳回与异议风险。", "JUZ Legal 提供检索、申请与全周期管理。"] },
  } as Record<string, Partial<BlogPost>>,
  companyHistory: [
    { year: "2015", event: "JUZ legal 在胡志明市成立。" },
    { year: "2018", event: "拓展外商直接投资与商事诉讼业务。" },
    { year: "2022", event: "与东盟律所建立战略合作。" },
    { year: "2026", event: "推出 JUZ Legal 在线预约平台。" },
  ],
  values: [
    { title: "正直", desc: "诚实透明的执业态度。" },
    { title: "专业", desc: "持续更新法律与实践。" },
    { title: "用心", desc: "以客户利益为核心。" },
    { title: "创新", desc: "以技术提升法律体验。" },
  ],
  achievements: [
    "500+ 企业与个人客户",
    "98% 内部客户满意度",
    "50+ 外商直接投资项目顾问",
    "20+ 律师与法律专业人员",
  ],
  homeFaq: [
    { q: "如何预约咨询？", a: "访问预约页面，选择服务、律师与时间。我们将在2个工作小时内确认。" },
    { q: "咨询费用如何计算？", a: "按小时、按案件或套餐 — 签约前透明报价。" },
    { q: "是否服务外省客户？", a: "可以。全国线上咨询，并按约定提供现场代理。" },
  ],
} as const;
