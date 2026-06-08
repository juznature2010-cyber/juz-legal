import type { BlogPost, Service, TeamMember } from "@/lib/data";

type ServiceOverride = Partial<
  Pick<Service, "title" | "short" | "intro" | "items"> & {
    process: { step: number; title: string; desc: string }[];
    faq: { q: string; a: string }[];
  }
>;

export const enOverrides = {
  mainNav: [
    { href: "/", label: "Home" },
    { href: "/gioi-thieu", label: "About" },
    { href: "/dich-vu", label: "Services" },
    { href: "/doi-ngu", label: "Team" },
    { href: "/tin-tuc", label: "News" },
    { href: "/lien-he", label: "Contact" },
  ],
  services: {
    "doanh-nghiep": {
      title: "Corporate legal advisory",
      short: "Formation, operations, M&A and compliance for businesses.",
      intro:
        "JUZ Legal supports businesses throughout their lifecycle — from incorporation and restructuring to commercial contracts, compliance, and internal disputes.",
      items: [
        "Company formation, merger and demerger",
        "Commercial contract drafting and review",
        "Governance and regulatory compliance",
        "M&A and equity transfers",
        "Shareholder rights protection",
      ],
    },
    "dau-tu": {
      title: "Investment advisory",
      short: "Project structuring, licensing and investor protection.",
      intro:
        "We assist domestic and foreign investors with transaction structuring, legal due diligence, and investment regulatory compliance.",
      items: [
        "Investment and FDI law advisory",
        "Project legal due diligence",
        "Licenses and investment incentives",
        "Joint venture and cooperation agreements",
        "Investment dispute resolution",
      ],
    },
    "tranh-tung": {
      title: "Litigation and dispute resolution",
      short: "Court representation, arbitration and negotiation.",
      intro:
        "Our litigators protect client interests through mediation, arbitration, and litigation with a clear strategy.",
      items: [
        "Commercial contract disputes",
        "Labor and shareholder disputes",
        "Commercial arbitration",
        "Civil judgment enforcement",
        "Dispute prevention advisory",
      ],
    },
    "dat-dai": {
      title: "Real estate and land",
      short: "Transactions, transfers and land clearance.",
      intro:
        "Comprehensive advisory on real estate transactions, planning, title procedures, and land disputes.",
      items: [
        "Land use rights due diligence",
        "Sale, purchase and lease agreements",
        "Real estate projects",
        "Land disputes",
        "Land clearance",
      ],
    },
    "lao-dong": {
      title: "Labor law advisory",
      short: "Internal rules, employment contracts and labor disputes.",
      intro:
        "We help businesses build compliant HR systems under the Labor Code, reducing litigation risk.",
      items: [
        "Internal labor rules and policies",
        "Contracts, termination and dismissal",
        "Insurance and compensation",
        "Labor disputes",
        "Occupational safety compliance",
      ],
    },
    "so-huu-tri-tue": {
      title: "Intellectual property",
      short: "Trademarks, copyright and IP enforcement.",
      intro:
        "Protecting intellectual assets — trademarks, patents, software copyright, and market infringement handling.",
      items: [
        "Trademark and industrial design registration",
        "Technology transfer agreements",
        "IP infringement enforcement",
        "Trade secret protection",
        "Franchise advisory",
      ],
    },
    "hon-nhan-gia-dinh": {
      title: "Family and marriage",
      short: "Divorce, asset division and child custody.",
      intro:
        "Confidential advisory and representation in marriage, divorce, and inheritance matters.",
      items: [
        "Cross-border marriage and divorce",
        "Asset division",
        "Child custody and alimony",
        "Inheritance and wills",
        "Children's rights protection",
      ],
    },
  } satisfies Record<string, ServiceOverride>,
  companyIntro: {
    title: "JUZ LEGAL – INTERNATIONAL LEGAL STANDARDS",
    lead:
      "In a constantly changing global economy, understanding and complying with the law is both a duty and a shield for sustainable growth. JUZ LEGAL is your strategic partner for success and legal protection in Vietnam.",
    experience:
      "With over 18 years of practice and 500+ clients, JUZ LEGAL offers a comprehensive legal ecosystem across seven core areas:",
    whyChooseTitle: "Why clients choose JUZ LEGAL",
    quote:
      "We do not only provide legal advice — we deliver optimal business solutions.",
    closing:
      "Every client matter is handled with integrity, confidentiality, and the highest responsibility.",
  },
  whyUs: [
    { title: "Multi-practice expertise", desc: "Senior lawyers with local knowledge and business acumen." },
    { title: "Absolute confidentiality", desc: "Strict information security aligned with international firm standards." },
    { title: "Transparency & dedication", desc: "A clear 5-step process with upfront fee disclosure." },
    { title: "24/7 urgent support", desc: "Hotline readiness for unexpected legal situations." },
  ],
  workProcess: [
    { step: "01", title: "Intake", desc: "Listen, record and classify legal needs." },
    { step: "02", title: "Analysis & quote", desc: "Risk assessment and transparent fee proposal." },
    { step: "03", title: "Engagement", desc: "Agreement on terms, confidentiality and timeline." },
    { step: "04", title: "Execution", desc: "Dedicated lawyer until completion." },
    { step: "05", title: "Follow-up", desc: "Legal updates and ongoing support." },
  ],
  teamRoles: {
    "tran-dinh-long": { role: "Managing Director", specialty: "Corporate, M&A, FDI", experience: "40 years — former Chief Judge and Deputy Chief Judge", license: "International arbitration certificate" },
    "tran-thi-binh": { role: "Head of Litigation", specialty: "Commercial disputes, arbitration", experience: "14 years — 200+ court and arbitration cases", license: "Ho Chi Minh City Bar Association" },
    "le-minh-cuong": { role: "Investment & Real Estate Advisor", specialty: "Investment, real estate", experience: "12 years — large FDI and real estate projects", license: "Ho Chi Minh City Bar Association" },
    "pham-thu-ha": { role: "IP & Labor Lawyer", specialty: "IP, labor law", experience: "10 years — trademark registration and HR advisory", license: "Hanoi Bar Association" },
  } as Record<string, Partial<TeamMember>>,
  testimonials: [
    { quote: "JUZ Legal supported our M&A transaction with professionalism and reliable speed.", author: "Director — Technology company" },
    { quote: "The team understands FDI investment law and helped our project comply from day one.", author: "Investor — Singapore" },
    { quote: "Sound labor advisory significantly reduced dispute risk with employees.", author: "HR Director — Manufacturing" },
  ],
  clients: ["Technology group", "FDI investors", "Manufacturing firms", "Retail chains", "Fintech startups", "Business families"],
  blogPosts: {
    "luat-dau-tu-2026": { title: "Investment Law 2026: Key updates for businesses", excerpt: "Important changes affecting domestic and foreign investors.", category: "Investment", readTime: "8 min", content: ["Amended investment law brings opportunities and higher compliance requirements.", "JUZ Legal recommends reviewing licenses and capital structure before expansion."] },
    "hop-dong-lao-dong-mau": { title: "Employment contracts 2026: Standard templates for HR", excerpt: "Mandatory clauses under the Labor Code.", category: "Labor", readTime: "6 min", content: ["Non-compliant contracts are a common cause of labor disputes.", "Review all active contracts at least annually."] },
    "dang-ky-nhan-hieu": { title: "Trademark registration: Process and common risks", excerpt: "Protect your brand early to avoid disputes.", category: "IP", readTime: "7 min", content: ["Pre-filing search reduces rejection and opposition risk.", "JUZ Legal supports search, filing and lifecycle management."] },
  } as Record<string, Partial<BlogPost>>,
  companyHistory: [
    { year: "2015", event: "JUZ legal established in Ho Chi Minh City." },
    { year: "2018", event: "Expanded FDI and commercial litigation practice." },
    { year: "2022", event: "Strategic partnerships with ASEAN law firms." },
    { year: "2026", event: "Launched JUZ Legal online booking platform." },
  ],
  values: [
    { title: "Integrity", desc: "Honest and transparent practice." },
    { title: "Depth", desc: "Continuous legal and practical updates." },
    { title: "Dedication", desc: "Client interests at the center." },
    { title: "Innovation", desc: "Technology-enhanced legal experience." },
  ],
  achievements: [
    "500+ corporate and individual clients",
    "98% internal client satisfaction",
    "Advisor on 50+ FDI projects",
    "20+ lawyers and legal professionals",
  ],
  homeFaq: [
    { q: "How do I book a consultation?", a: "Visit the booking page, choose service, lawyer and time. We confirm within 2 business hours." },
    { q: "How are fees calculated?", a: "Hourly, per matter, or package — disclosed transparently before engagement." },
    { q: "Do you serve clients outside Ho Chi Minh City?", a: "Yes. Nationwide online consultation and on-site representation by agreement." },
  ],
} as const;
