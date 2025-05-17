import * as React from "react";
import { cn } from "../../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "./Slot";

const buttonVariants = cva(
  "inline-flex w-fit items-center justify-center whitespace-nowrap rounded-lg flex-shrink-0 text-[14px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 transition-all duration-200 ease-in-out cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-black/90 text-white w-full hover:bg-[#333333] w-fit",
        secondary: "bg-white text-black/70 w-full hover:text-cyan-600 w-fit",
        destructive: "text-red-600/70 hover:text-red-600",
        icon: "bg-none border-none",
      },
      size: {
        default: "py-2 px-3",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, onClick, children, ...rest },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          onClick={onClick}
          {...rest}
        >
          {React.isValidElement(children) ? children : <span>{children}</span>}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
