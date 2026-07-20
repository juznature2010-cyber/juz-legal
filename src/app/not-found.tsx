import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-navy-deep px-4 pb-16 pt-32 text-white">
      <div className="container-narrow text-center">
        <p className="text-eyebrow">404</p>
        <div className="gold-line mx-auto mt-4" />
        <h1 className="text-display-sm mt-6">Không tìm thấy trang</h1>
        <p className="mx-auto mt-5 max-w-lg text-white/65">
          Nội dung có thể đã được di chuyển hoặc đường dẫn không còn tồn tại.
        </p>
        <Button variant="luxury" className="mt-8" asChild>
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    </section>
  );
}
