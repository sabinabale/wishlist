import { DetailProps } from "@/types/types";
import React from "react";

export default function Detail({ label, value }: DetailProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="max-w-96 min-w-60 w-full border rounded-lg px-4 py-2 h-[60px] bg-gray-100 border-[rgba(0,0,0,0.2)]">
        <div className="text-black/50 text-[12px]">{label}</div>
        <div>{value}</div>
      </div>
    </div>
  );
}
