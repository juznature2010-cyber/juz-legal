import type { Locale } from "@/i18n/routing";
import type { BlogPost, Service, TeamMember } from "@/lib/data";
import * as vi from "@/lib/data";
import { enOverrides } from "./en";
import { zhOverrides } from "./zh";

type Overrides = {
  mainNav: { href: string; label: string }[];
  services: Record<string, Partial<Service>>;
  companyIntro: Partial<typeof vi.companyIntro>;
  whyUs: { title: string; desc: string }[];
  workProcess: { step: string; title: string; desc: string }[];
  teamRoles: Record<string, Partial<TeamMember>>;
  testimonials: { quote: string; author: string }[];
  clients: string[];
  blogPosts: Record<string, Partial<BlogPost>>;
  companyHistory: { year: string; event: string }[];
  values: { title: string; desc: string }[];
  achievements: string[];
  homeFaq: { q: string; a: string }[];
};

function applyOverrides(base: typeof vi, overrides: Overrides) {
  const services = base.services.map((service) => ({
    ...service,
    ...(overrides.services[service.slug as keyof typeof overrides.services] ?? {}),
  }));

  const team = base.team.map((member) => ({
    ...member,
    ...(overrides.teamRoles[member.slug] ?? {}),
  }));

  const blogPosts = base.blogPosts.map((post) => ({
    ...post,
    ...(overrides.blogPosts[post.slug] ?? {}),
  }));

  const companyIntro = {
    ...base.companyIntro,
    ...overrides.companyIntro,
    serviceHighlights: base.companyIntro.serviceHighlights.map((item, index) => {
      const translated = services[index];
      if (!translated) return item;
      return {
        title: translated.title,
        desc: translated.short,
      };
    }),
  };

  return {
    mainNav: overrides.mainNav,
    services,
    practiceAreas: services.map((s) => ({
      slug: s.slug,
      title: s.title,
      short: s.short,
      icon: s.icon,
    })),
    companyIntro,
    whyUs: overrides.whyUs,
    workProcess: overrides.workProcess,
    team,
    testimonials: overrides.testimonials,
    clients: overrides.clients,
    blogPosts,
    companyHistory: overrides.companyHistory,
    values: overrides.values,
    achievements: overrides.achievements,
    homeFaq: overrides.homeFaq,
    getService: (slug: string) => services.find((s) => s.slug === slug),
    getBlogPost: (slug: string) => blogPosts.find((p) => p.slug === slug),
    getTeamMember: (slug: string) => team.find((m) => m.slug === slug),
  };
}

const viData = {
  mainNav: vi.mainNav,
  services: vi.services,
  practiceAreas: vi.practiceAreas,
  companyIntro: vi.companyIntro,
  whyUs: vi.whyUs,
  workProcess: vi.workProcess,
  team: vi.team,
  testimonials: vi.testimonials,
  clients: vi.clients,
  blogPosts: vi.blogPosts,
  companyHistory: vi.companyHistory,
  values: vi.values,
  achievements: vi.achievements,
  homeFaq: vi.homeFaq,
  getService: vi.getService,
  getBlogPost: vi.getBlogPost,
  getTeamMember: vi.getTeamMember,
};

const enData = applyOverrides(vi, enOverrides as unknown as Overrides);
const zhData = applyOverrides(vi, zhOverrides as unknown as Overrides);

export type LocaleData = ReturnType<typeof applyOverrides>;

export function getLocaleData(locale: Locale): LocaleData {
  if (locale === "en") return enData;
  if (locale === "zh") return zhData;
  return viData as unknown as LocaleData;
}
