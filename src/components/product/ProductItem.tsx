"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/Button";
import RemoveIcon from "../icons/RemoveIcon";
import AddItemToWishlist from "@/components/wishlist/AddItemToWishlist";
import MoveItemToAnotherWishlist from "@/components/wishlist/MoveItemToAnotherWishlist";
import { Product } from "@/types/types";
import { removeFromWishlist } from "../wishlist/RemoveItemFromWishlist";
import AddToCart from "../cart/AddToCart";

interface ProductItemProps {
  className?: string;
  layout?: "default" | "full-width";
  product: Product;
  wishlistId: string;
  onRemoveProduct?: (productId: string) => void;
  onNewWishlistCreated?: (newWishlistId: string) => void;
}

export default function ProductItem({
  className,
  layout = "default",
  product,
  wishlistId,
  onRemoveProduct,
  onNewWishlistCreated,
}: ProductItemProps) {
  return (
    <div
      className={`
        group relative border border-gray-300 rounded-lg overflow-hidden
        ${
          layout === "default"
            ? "flex flex-col w-60"
            : "flex gap-2 w-full flex-col sm:flex-row sm:gap-6"
        }
        ${className}
      `}
    >
      <Link href={`/product/${product.id}`} className="contents">
        <div
          className={`
          relative overflow-hidden group-hover:opacity-75 p-4 bg-gray-100 flex items-center justify-center
          ${layout === "default" ? "w-full h-40" : "w-full sm:w-40 h-40"}
        `}
        >
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`absolute top-2 right-2 z-10 ${
              layout === "default" ? "block" : "hidden"
            }`}
          >
            <AddItemToWishlist productId={product.id} />
          </div>

          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={100}
              priority={true}
              className="w-40 h-auto object-center object-contain"
            />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
        <div className="flex flex-row gap-2 sm:flex-1">
          <div
            className={`
            flex flex-col gap-1 p-4
            ${layout === "full-width" ? "flex-grow justify-center" : ""}
          `}
          >
            <div>
              <h3 className="text-sm text-gray-700">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              kč
            </p>
          </div>

          {layout !== "default" && (
            <div className="flex flex-col justify-center sm:flex-row gap-6 items-center px-6">
              <div className="flex flex-col items-center gap-2">
                <AddToCart productId={product.id} />

                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <MoveItemToAnotherWishlist
                    productId={product.id}
                    currentWishlistId={wishlistId}
                    onMoved={() => {
                      onRemoveProduct?.(product.id);
                    }}
                    onNewWishlistCreated={onNewWishlistCreated}
                  />
                </div>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromWishlist(
                    product.id,
                    wishlistId,
                    "",
                    (removedProductId) => {
                      onRemoveProduct?.(removedProductId);
                    }
                  );
                }}
                variant="icon"
                size="none"
                className="w-fit h-fit hidden sm:block"
              >
                <RemoveIcon />
              </Button>
            </div>
          )}
        </div>
        {layout !== "default" && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeFromWishlist(
                product.id,
                wishlistId,
                "",
                (removedProductId) => {
                  onRemoveProduct?.(removedProductId);
                }
              );
            }}
            variant="icon"
            size="none"
            className="w-full h-fit bg-red-100 rounded-none py-2 sm:hidden text-red-500"
          >
            Remove item
          </Button>
        )}
      </Link>
    </div>
  );
}
