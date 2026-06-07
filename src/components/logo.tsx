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
  sm: { width: 176, height: 176, className: "h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20" },
  md: { width: 208, height: 208, className: "h-20 w-20 md:h-24 md:w-24" },
  lg: { width: 280, height: 280, className: "h-28 w-28 md:h-36 md:w-36" },
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
