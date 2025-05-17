import React from "react";
import { cva, VariantProps } from "class-variance-authority";

const labelVariants = cva("block ml-1 font-normal bg-transparent", {
  variants: {
    variant: {
      default: "text-black/60 text-[12px]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface InputLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  children: React.ReactNode;
  className?: string;
}

export default function InputLabel({
  children,
  variant,
  className,
  ...props
}: InputLabelProps) {
  return (
    <label className={labelVariants({ variant, className })} {...props}>
      {children}
    </label>
  );
}

export { InputLabel, labelVariants };
