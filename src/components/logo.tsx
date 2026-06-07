import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

type LogoProps = {
  className?: string;
  imageClassName?: string;
  href?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: { width: 352, height: 352, className: "h-[9rem] w-[9rem] sm:h-40 sm:w-40" },
  md: { width: 416, height: 416, className: "h-40 w-40 md:h-48 md:w-48" },
  lg: { width: 560, height: 560, className: "h-56 w-56 md:h-72 md:w-72" },
};

export function Logo({
  className,
  imageClassName,
  href = "/",
  priority = false,
  size = "md",
}: LogoProps) {
  const dimensions = sizeMap[size];

  const image = (
    <Image
      src={siteConfig.logo}
      alt={siteConfig.name}
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={cn(
        "aspect-square object-contain object-center drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]",
        dimensions.className,
        imageClassName
      )}
    />
  );

  if (!href) {
    return <div className={cn("inline-flex shrink-0", className)}>{image}</div>;
  }

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex shrink-0 items-center transition hover:opacity-90",
        className
      )}
      aria-label={`${siteConfig.name} — Trang chủ`}
    >
      {image}
    </Link>
  );
}
