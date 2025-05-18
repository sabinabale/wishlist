"use client";

import React from "react";
import { Button } from "../ui/Button";
import BinIcon from "../icons/BinIcon";
import showToast from "../ui/Toast";
import { useRouter } from "next/navigation";

interface RemoveAllItemsFromCartProps {
  onRemoveAll?: () => void;
  className?: string;
}

export default function RemoveAllItemsFromCart({
  onRemoveAll,
  className = "",
}: RemoveAllItemsFromCartProps) {
  const router = useRouter();

  const handleRemoveAll = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove all items from cart");
      }

      showToast("All items removed from cart");
      router.refresh();
      onRemoveAll?.();
    } catch (error) {
      console.error("Error removing all items from cart:", error);
      showToast("Failed to remove all items from cart", 1500);
    }
  };

  return (
    <Button
      onClick={handleRemoveAll}
      variant="destructive"
      size="none"
      className={`w-fit h-fit self-end ${className} mr-2`}
    >
      <BinIcon />
      Remove all items from cart
    </Button>
  );
}
