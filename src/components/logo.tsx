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
  sm: { width: 120, height: 40, className: "h-8 w-auto sm:h-9" },
  md: { width: 150, height: 48, className: "h-9 w-auto sm:h-10 md:h-11" },
  lg: { width: 200, height: 64, className: "h-12 w-auto sm:h-14 md:h-16" },
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
        "w-auto object-contain object-left",
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
        "group inline-flex shrink-0 items-center rounded-sm bg-white/95 px-2 py-1 transition hover:bg-white sm:px-2.5 sm:py-1.5",
        className
      )}
      aria-label={`${siteConfig.name} — Trang chủ`}
    >
      {image}
    </Link>
  );
}
