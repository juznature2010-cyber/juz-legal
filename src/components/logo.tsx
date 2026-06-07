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
  sm: { width: 88, height: 88, className: "h-9 w-9 sm:h-10 sm:w-10" },
  md: { width: 104, height: 104, className: "h-10 w-10 md:h-12 md:w-12" },
  lg: { width: 140, height: 140, className: "h-14 w-14 md:h-[4.5rem] md:w-[4.5rem]" },
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
