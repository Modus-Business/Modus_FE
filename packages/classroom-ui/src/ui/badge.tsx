import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib";

const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-primary/12 text-primary",
      secondary: "bg-secondary text-secondary-foreground",
      outline: "border border-border bg-transparent text-muted-foreground",
      success: "bg-emerald-100 text-emerald-700",
      warning: "bg-amber-100 text-amber-700"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

function Badge({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
