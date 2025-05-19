"use client";

import React, { useEffect, useState, useCallback } from "react";
import ProductItem from "../product/ProductItem";
import UpdateWishlistName from "@/components/wishlist/UpdateWishlistName";
import { WishlistData, Product } from "@/types/types";

import AddAllItemsToCart from "../cart/AddAllItemsToCart";

import DeleteWishlist from "./DeleteWishlist";
import WishlistDescription from "./WishlistDescription";

interface WishlistProps {
  wishlist_name: string;
  wishlistId: string;
  onNameUpdated?: () => void;
  onWishlistDeleted?: (wishlistId: string) => void;
  isFirstWishlist?: boolean;
  onNewWishlistCreated?: (newWishlistId: string) => void;
}

export default function Wishlist({
  wishlist_name,
  wishlistId,
  onNameUpdated,
  onWishlistDeleted,
  isFirstWishlist = false,
  onNewWishlistCreated,
}: WishlistProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productIds, setProductIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [description, setDescription] = useState("");

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
        setDescription(currentWishlist.description || "");
        if (currentWishlist.products && currentWishlist.products.length > 0) {
          const productsResponse = await fetch("/api/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productIds: currentWishlist.products,
            }),
          });
          if (!productsResponse.ok) throw new Error("Failed to fetch products");
          const productsData: Product[] = await productsResponse.json();
          setProducts(productsData);
        } else {
          setProducts([]);
        }
      } else {
        setProductIds([]);
        setProducts([]);
        setDescription("");
      }
    } catch (err) {
      console.error("Error fetching wishlist products:", err);
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [wishlistId]);

  const refreshWishlistData = useCallback(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  const handleProductRemoval = () => {
    refreshWishlistData();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{wishlist_name}</h2>
          <UpdateWishlistName
            wishlistId={wishlistId}
            onNameUpdated={onNameUpdated}
          />
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
          <UpdateWishlistName
            wishlistId={wishlistId}
            onNameUpdated={onNameUpdated}
          />
        </div>
        <div className="text-red-500 text-center p-6">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2">
            <h2 className="text-2xl font-bold">{wishlist_name}</h2>

            <UpdateWishlistName
              wishlistId={wishlistId}
              onNameUpdated={onNameUpdated}
            />
          </div>
          {!isFirstWishlist && (
            <DeleteWishlist
              wishlistId={wishlistId}
              onWishlistDeleted={() => {
                onWishlistDeleted?.(wishlistId);
                onNameUpdated?.();
              }}
            />
          )}
        </div>
        <div>
          <WishlistDescription
            wishlistId={wishlistId}
            initialDescription={description}
            onDescriptionUpdated={onNameUpdated}
          />
        </div>
      </div>

      {productIds.length > 0 ? (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              wishlistId={wishlistId}
              layout="full-width"
              product={product}
              onRemoveProduct={handleProductRemoval}
              onNewWishlistCreated={onNewWishlistCreated}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No products in this wishlist yet.</p>
        </div>
      )}

      <AddAllItemsToCart productIds={productIds} className="self-end" />
    </div>
  );
}
