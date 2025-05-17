import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import InputLabel from "./InputLabel";

const inputVariants = cva(
  "w-full border rounded-lg px-4 pt-6 pb-2 h-[60px] transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        general:
          "border-[rgba(0,0,0,0.2)] hover:border-black focus:border-black focus:outline-black ",
        readonly:
          "border-[rgba(0,0,0,0.2)] bg-gray-100 cursor-default focus:outline-[rgba(0,0,0,0.2)]",
        error:
          "border-red-500 hover:border-red-600 focus:border-red-600 focus:outline-1 focus:outline-red-600",
        success:
          "border-green-500 hover:border-green-600 focus:border-green-600 focus:outline-1 focus:outline-green-600",
      },
    },
    defaultVariants: {
      variant: "general",
    },
  }
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label: string;
  required?: boolean;
  readonly?: boolean;
  pattern?: string;
  type?: string;
  maxLength?: number;
  className?: string;
}

const Input = ({
  className,
  variant,
  label,
  required,
  readonly,
  pattern,
  type,
  maxLength = 50,
  ...props
}: InputProps) => {
  return (
    <div className="relative">
      <input
        type={type}
        maxLength={maxLength}
        required={required}
        readOnly={readonly}
        pattern={pattern}
        className={`${inputVariants({
          variant,
          className,
        })} peer placeholder-transparent`}
        placeholder={label}
        {...props}
      />
      <InputLabel className="absolute left-3 top-2 text-black/60">
        {label}
      </InputLabel>
    </div>
  );
};

export { Input, inputVariants };
