import React from "react";
import { Button } from "./Button";
import RemoveIcon from "../icons/RemoveIcon";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="bg-white py-10 px-8 rounded-lg shadow-lg relative w-96">
        <Button
          onClick={onClose}
          className="absolute top-4 right-4"
          aria-label="Close modal"
          variant="icon"
          size="none"
        >
          <RemoveIcon />
        </Button>
        {children}
      </div>
    </div>
  );
}
