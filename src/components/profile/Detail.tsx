import React from "react";
import { Button } from "../ui/Button";

interface DetailProps {
  label: string;
  value: string;
  buttonLabel: string;
  onClick: () => void;
}

export default function Detail({
  label,
  value,
  buttonLabel,
  onClick,
}: DetailProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="w-full border rounded-lg px-4 py-2 h-[60px] bg-gray-100 border-[rgba(0,0,0,0.2)]">
        <div className="text-black/50 text-[12px]">{label}</div>
        <div>{value}</div>
      </div>
      <Button
        className="self-end mr-2"
        variant="secondary"
        size="none"
        onClick={onClick}
      >
        {buttonLabel} {label.toLowerCase()}
      </Button>
    </div>
  );
}
