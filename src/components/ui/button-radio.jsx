import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

const ButtonRadio = React.forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn("grid gap-2", className)}
    {...props}
    ref={ref}
  />
));
ButtonRadio.displayName = RadioGroupPrimitive.Root.displayName;

const ButtonRadioItem = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "h-10 px-4 py-2",
        "data-[state=checked]:border data-[state=checked]:border-primary data-[state=checked]:bg-secondary/25 data-[state=checked]:text-primary",
        "data-[state=unchecked]:bg-background data-[state=unchecked]:text-foreground data-[state=unchecked]:hover:bg-muted",
        "data-[state=unchecked]:border data-[state=unchecked]:border-input",
        className,
      )}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Item>
  ),
);
ButtonRadioItem.displayName = RadioGroupPrimitive.Item.displayName;

export { ButtonRadio, ButtonRadioItem };
