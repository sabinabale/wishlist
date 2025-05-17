import React from "react";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1860px] w-full mx-auto p-4 mt-20">{children}</div>
  );
}
