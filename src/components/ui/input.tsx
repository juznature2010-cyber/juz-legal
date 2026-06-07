import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-12 w-full border border-navy/10 bg-white/95 px-4 text-sm transition-all duration-300 placeholder:text-muted-light focus-visible:border-gold/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/30",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
