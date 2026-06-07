import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:pointer-events-none disabled:opacity-50 sm:gap-2.5 sm:text-[11px] sm:tracking-[0.14em]",
  {
    variants: {
      variant: {
        default: "bg-navy text-white hover:bg-navy-mid",
        gold: "bg-gold text-navy hover:bg-gold-light",
        luxury:
          "border border-gold bg-gold/10 text-gold backdrop-blur-sm hover:bg-gold hover:text-navy",
        outline:
          "border border-navy/15 bg-transparent text-navy hover:border-navy/30 hover:bg-white",
        ghost: "text-navy hover:bg-surface",
        "ghost-light":
          "border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/10",
      },
      size: {
        default: "h-10 px-5 sm:h-11 sm:px-7",
        sm: "h-9 px-4 text-[10px] sm:px-5",
        lg: "h-11 px-7 sm:h-12 sm:px-9",
        xl: "h-12 px-6 text-[10px] sm:h-14 sm:px-10 sm:text-xs",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
