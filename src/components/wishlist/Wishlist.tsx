"use client";

import React, { useEffect, useState, useCallback } from "react";
import ProductItem from "../product/ProductItem";
import { Button } from "../ui/Button";
import showToast from "../ui/Toast";
import UpdateWishlistName from "@/components/wishlist/UpdateWishlistName";
import { WishlistData } from "@/types/types";
import { useRouter } from "next/navigation";

interface WishlistProps {
  wishlist_name: string;
  wishlistId: string;
}

export default function Wishlist({ wishlist_name, wishlistId }: WishlistProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productIds, setProductIds] = useState<string[]>([]);
  const router = useRouter();

  const fetchWishlistData = useCallback(async () => {
    try {
      setLoading(true);

      const wishlistResponse = await fetch("/api/wishlists");

      if (!wishlistResponse.ok) {
        throw new Error("Failed to fetch wishlists");
      }

      const wishlists: WishlistData[] = await wishlistResponse.json();
      const currentWishlist = wishlists.find((w) => w.id === wishlistId);

      if (currentWishlist) {
        setProductIds(currentWishlist.products || []);
      } else {
        setProductIds([]);
      }
    } catch (err) {
      console.error("Error fetching wishlist products:", err);
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [wishlistId]);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  const handleProductRemoval = (removedProductId: string) => {
    setProductIds((prev) => prev.filter((id) => id !== removedProductId));
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{wishlist_name}</h2>
          <UpdateWishlistName wishlistId={wishlistId} />
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{wishlist_name}</h2>
          <UpdateWishlistName wishlistId={wishlistId} />
        </div>
        <div className="text-red-500 text-center p-6">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">{wishlist_name}</h2>
        <UpdateWishlistName wishlistId={wishlistId} />
      </div>

      {productIds.length > 0 ? (
        <div className="space-y-4">
          <ProductItem
            wishlistId={wishlistId}
            layout="full-width"
            productIds={productIds}
            onRemoveProduct={handleProductRemoval}
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No products in this wishlist yet.</p>
        </div>
      )}

      {productIds.length > 0 && (
        <Button
          onClick={() => {
            showToast("Added all items to cart");
          }}
          className="self-end"
          variant="primary"
          size="default"
        >
          Add all items to cart
        </Button>
      )}
    </div>
  );
}
