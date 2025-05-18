"use client";

import React from "react";
import { Button } from "../ui/Button";
import RemoveIcon from "../icons/RemoveIcon";
import showToast from "../ui/Toast";
import { Cart } from "@/types/types";

interface RemoveFromCartProps {
  productId: string;
  onRemove: (productId: string, updatedCart: Cart) => void;
  variant?: "icon" | "text";
  className?: string;
}

export default function RemoveFromCart({
  productId,
  onRemove,
  variant = "icon",
  className = "",
}: RemoveFromCartProps) {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      const updatedCart = await response.json();
      onRemove(productId, updatedCart);
      showToast("Item removed from cart", 1500);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      showToast("Failed to remove item from cart", 1500);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        onClick={handleRemove}
        variant="icon"
        size="none"
        className={`w-fit h-fit ${className}`}
      >
        <RemoveIcon />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleRemove}
      variant="icon"
      size="none"
      className={`w-full h-fit bg-red-100 rounded-none py-2 text-red-500 ${className}`}
    >
      Remove item
    </Button>
  );
}
