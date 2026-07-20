import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .replace(/^LS\.\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function TeamPortrait({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex aspect-[3/4] w-full items-center justify-center bg-gradient-to-br from-navy-deep via-navy-mid to-navy",
        className
      )}
      role="img"
      aria-label={`Ảnh đại diện ${name}`}
    >
      <span className="font-display text-4xl font-light tracking-[0.12em] text-gold/85 sm:text-5xl">
        {initials(name)}
      </span>
    </div>
  );
}
