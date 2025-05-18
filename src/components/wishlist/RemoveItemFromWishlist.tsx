"use client";
import showToast from "../ui/Toast";

export async function removeFromWishlist(
  productId: string,
  wishlistId: string,
  onRemoved?: (productId: string) => void
): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/wishlists/${wishlistId}/products?productId=${productId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to remove product from wishlist");
    }

    showToast("Removed from wishlist");

    if (onRemoved) {
      console.log("Calling onRemoved callback with productId:", productId);
      onRemoved(productId);
    }

    return true;
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    showToast("Failed to remove from wishlist", 1500);
    return false;
  }
}
