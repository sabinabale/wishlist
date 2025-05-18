import React, { useEffect, useRef } from "react";
import { Button } from "./Button";
import RemoveIcon from "../icons/RemoveIcon";
import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  returnFocusOnClose?: boolean;
}

export default function Modal({
  children,
  onClose,
  returnFocusOnClose = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();

        if (!returnFocusOnClose) {
          document.body.focus();

          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscapeKey);

    if (
      modalRef.current &&
      !document.activeElement?.matches(
        'input, textarea, [contenteditable="true"]'
      )
    ) {
      modalRef.current.focus();
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose, returnFocusOnClose]);

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div
        ref={modalRef}
        className="bg-white py-10 px-8 rounded-lg shadow-lg relative w-96 z-50"
        tabIndex={-1}
      >
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
    </div>,
    document.body
  );
}
