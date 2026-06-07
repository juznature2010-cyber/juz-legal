import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[140px] w-full border border-navy/10 bg-white/95 px-4 py-3 text-sm transition-all duration-300 placeholder:text-muted-light focus-visible:border-gold/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/30",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";
