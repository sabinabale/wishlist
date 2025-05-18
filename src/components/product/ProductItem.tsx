"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import showToast from "../ui/Toast";
import { Button } from "../ui/Button";
import RemoveIcon from "../icons/RemoveIcon";
import Link from "next/link";
import AddItemToWishlist from "@/components/wishlist/AddItemToWishlist";
import MoveItemToAnotherWishlist from "@/components/wishlist/MoveItemToAnotherWishlist";
import { Product } from "@/types/types";
import { removeFromWishlist } from "../wishlist/RemoveItemFromWishlist";

export default function ProductItem({
  className,
  layout = "default",
  productIds,
  wishlistId,
  onRemoveProduct,
}: {
  className?: string;
  layout?: "default" | "full-width";
  productIds?: string[];
  wishlistId: string;
  onRemoveProduct?: (productId: string) => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const data = await response.json();
      const filteredProducts = productIds
        ? data.filter((product: Product) => productIds.includes(product.id))
        : data;
      setProducts(filteredProducts);
    };
    fetchProducts();
  }, [productIds]);

  return (
    <>
      {products.map((product) => (
        <div
          key={product.id}
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
              {layout === "default" && (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute top-2 right-2 z-10 hidden sm:block"
                >
                  <AddItemToWishlist productId={product.id} />
                </div>
              )}

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
                  {product.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                  kč
                </p>
              </div>

              {layout !== "default" && (
                <div className="flex flex-col justify-center sm:flex-row gap-6 items-center px-6">
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showToast("Added to cart");
                      }}
                      variant="primary"
                      size="default"
                      className="w-fit h-fit"
                    >
                      Add to cart
                    </Button>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <MoveItemToAnotherWishlist />
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromWishlist(
                        product.id,
                        wishlistId,
                        (removedProductId) => {
                          setProducts((prev) =>
                            prev.filter((p) => p.id !== removedProductId)
                          );
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
                    (removedProductId) => {
                      setProducts((prev) =>
                        prev.filter((p) => p.id !== removedProductId)
                      );
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
      ))}
    </>
  );
}
