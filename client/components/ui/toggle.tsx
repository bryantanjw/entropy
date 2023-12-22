"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva("text-sm font-normal transition-all duration-200", {
  variants: {
    variant: {
      default: "",
      outline:
        "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      pill: "rounded-full text-sm font-normal transition-all duration-200 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    },
    size: {
      default: "h-7 px-3",
      sm: "h-6 px-3",
      lg: "h-10 px-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
