import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AdminBackLink({ href = "/admin" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gold transition hover:text-navy"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Quay lại bảng điều khiển
    </Link>
  );
}
