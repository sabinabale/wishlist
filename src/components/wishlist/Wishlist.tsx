"use client";

import React from "react";
import ProductItem from "../product/ProductItem";
import { Button } from "../ui/Button";
import showToast from "../ui/Toast";
import UpdateWishlistName from "@/components/wishlist/UpdateWishlistName";

export default function Wishlist({ wishlist_name }: { wishlist_name: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">{wishlist_name}</h2>
        <UpdateWishlistName />
      </div>
      <ProductItem layout="full-width" />
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
    </div>
  );
}
