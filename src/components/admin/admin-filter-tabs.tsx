import Link from "next/link";
import { cn } from "@/lib/utils";

type Tab = {
  label: string;
  href: string;
  active: boolean;
};

export function AdminFilterTabs({ tabs }: { tabs: Tab[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "rounded border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition",
            tab.active
              ? "border-navy bg-navy text-white"
              : "border-navy/15 bg-white text-muted hover:border-gold/40 hover:text-navy"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
