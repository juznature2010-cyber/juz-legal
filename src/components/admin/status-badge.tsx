import { cn } from "@/lib/utils";

const bookingStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-sky-50 text-sky-800 border-sky-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  done: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

const contactStyles: Record<string, string> = {
  new: "bg-amber-50 text-amber-800 border-amber-200",
  read: "bg-sky-50 text-sky-800 border-sky-200",
  replied: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

export function StatusBadge({
  label,
  status,
  type,
}: {
  label: string;
  status: string;
  type: "booking" | "contact";
}) {
  const styles = type === "booking" ? bookingStyles : contactStyles;

  return (
    <span
      className={cn(
        "inline-flex rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        styles[status] ?? "bg-surface text-muted border-navy/10"
      )}
    >
      {label}
    </span>
  );
}
