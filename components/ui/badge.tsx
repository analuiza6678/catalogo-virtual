import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#111827] text-white",
        secondary: "border-[#d8c3a0] bg-[#f7efe3] text-[#5f6b7a]",
        outline: "border-[#d8c3a0] text-foreground",
        promotion: "border-transparent bg-[#fff2f0] text-[#a15c52]",
        success: "border-transparent bg-[#f4ead7] text-[#9c7a3b]"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
