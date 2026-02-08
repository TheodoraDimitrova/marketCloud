import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* Primary – основен CTA: Buy now, Add to cart, Shop collection */
        default:
          "text-lg font-normal uppercase px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded shadow-sm ring-2 ring-primary/20 transition-all duration-200",
        /* Destructive – Delete, Remove, Clear cart */
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        /* Ghost/Outline – Cancel, Back; прозрачен фон, рамка, hover accent */
        outline:
          "border-2 bg-transparent text-foreground hover:bg-accent/10 hover:border-accent hover:text-accent border-[hsl(var(--border-outline))]",
        /* Secondary – Learn more, View details; бордо */
        secondary:
          "text-lg font-normal uppercase px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded shadow-sm transition-all duration-200",
        ghost:
          "bg-transparent hover:bg-muted hover:text-muted-foreground text-foreground",
        /* Link – за hero върху тъмно */
        link: "text-lg uppercase font-normal leading-normal py-2 px-10 border-2 border-white text-white bg-transparent hover:bg-white/10 rounded",
        /* Accent – highlight, малки CTA; dusty rose */
        accent:
          "text-lg font-normal uppercase px-10 py-2 bg-accent text-accent-foreground rounded shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
