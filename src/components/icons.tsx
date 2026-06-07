import {
  Building2,
  TrendingUp,
  Scale,
  Landmark,
  Users,
  Lightbulb,
  Heart,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Building2,
  TrendingUp,
  Scale,
  Landmark,
  Users,
  Lightbulb,
  Heart,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Building2;
  return <Icon className={className} aria-hidden />;
}
