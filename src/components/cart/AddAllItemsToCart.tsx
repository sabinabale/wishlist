"use client";

import React from "react";
import { Button } from "../ui/Button";
import showToast from "../ui/Toast";
import { useRouter } from "next/navigation";

interface AddAllItemsToCartProps {
  productIds: string[];
  className?: string;
}

export default function AddAllItemsToCart({
  productIds,
  className,
}: AddAllItemsToCartProps) {
  const router = useRouter();

  const handleAddAllToCart = async () => {
    try {
      for (const productId of productIds) {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }
      }

      showToast("Added all items to cart");
      router.refresh();
    } catch (error) {
      console.error("Error adding items to cart:", error);
      showToast("Failed to add items to cart", 1500);
    }
  };

  if (productIds.length === 0) {
    return null;
  }

  return (
    <Button
      onClick={handleAddAllToCart}
      className={className}
      variant="primary"
      size="default"
    >
      Add all items to cart
    </Button>
  );
}
