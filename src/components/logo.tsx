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
  sm: { width: 80, height: 80, className: "h-9 w-9" },
  md: { width: 96, height: 96, className: "h-10 w-10 md:h-11 md:w-11" },
  lg: { width: 128, height: 128, className: "h-14 w-14 md:h-16 md:w-16" },
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
        "aspect-square object-contain object-center",
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
