import React from "react";
import { cva, VariantProps } from "class-variance-authority";

// Shared input variants for consistent styling across components
const textareaVariants = cva(
  "w-full border rounded-lg px-4 transition-all duration-300 ease-out",
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

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  required?: boolean;
  readonly?: boolean;
  className?: string;
}

const Textarea = ({
  className,
  variant,
  required,
  readonly,
  placeholder,
  ...props
}: TextareaProps) => {
  return (
    <div className="relative">
      <textarea
        required={required}
        readOnly={readonly}
        placeholder={placeholder}
        className={`${textareaVariants({
          variant,
          className,
        })} py-3 min-h-[100px] resize-y`}
        {...props}
      />
    </div>
  );
};

export { Textarea, textareaVariants };
