"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import showToast from "../ui/Toast";

interface DeleteWishlistProps {
  wishlistId: string;
  onWishlistDeleted?: () => void;
}

export default function DeleteWishlist({
  wishlistId,
  onWishlistDeleted,
}: DeleteWishlistProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this wishlist?")) {
      return;
    }

    try {
      const response = await fetch(`/api/wishlists/${wishlistId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete wishlist");
      }
      showToast("Wishlist deleted successfully");
      onWishlistDeleted?.();
      router.push("/wishlist");
      router.refresh();
    } catch (error) {
      console.error("Error deleting wishlist:", error);
      showToast("Failed to delete wishlist. Please try again.", 1500);
    }
  };

  return (
    <Button variant="destructive" size="none" onClick={handleDelete}>
      Delete wishlist
    </Button>
  );
}
