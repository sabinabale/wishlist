import React from "react";

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`max-w-[1860px] w-full mx-auto p-4 mt-20 flex flex-col ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}
