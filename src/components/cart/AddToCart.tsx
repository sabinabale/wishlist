"use client";

import React from "react";
import { Button } from "../ui/Button";
import showToast from "../ui/Toast";
import { useRouter } from "next/navigation";

interface AddToCartProps {
  productId: string;
  className?: string;
}

export default function AddToCart({ productId, className }: AddToCartProps) {
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
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

      showToast("Item added to cart");
      router.refresh();
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Failed to add item to cart", 1500);
    }
  };

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAddToCart();
      }}
      variant="primary"
      size="default"
      className={className}
    >
      Add to Cart
    </Button>
  );
}
