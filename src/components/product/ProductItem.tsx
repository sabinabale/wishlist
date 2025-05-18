"use client";
import React from "react";
import Image from "next/image";
import showToast from "../ui/Toast";
import { Button } from "../ui/Button";
import RemoveIcon from "../icons/RemoveIcon";
import Link from "next/link";
import AddItemToWishlist from "@/components/wishlist/AddItemToWishlist";
import MoveItemToAnotherWishlist from "@/components/wishlist/MoveItemToAnotherWishlist";

export default function ProductItem({
  className,
  layout = "default",
}: {
  className?: string;
  layout?: "default" | "full-width";
}) {
  const mockProducts = [
    {
      id: "1",
      name: "Nike SB",
      category: "Sneakers",
      price: 3299,
      image:
        "https://static.flexdog.cz/flexdog-7/products/images/113bae92-5259-4a80-9be5-a7484ae092f5.png?width=1500&quality=80",
    },
    {
      id: "2",
      name: "New Balance Black Castlerock",
      category: "Running",
      price: 3999,
      image:
        "https://static.flexdog.cz/flexdog-2/products/images/61e5b479-2c72-4ba7-9297-0d7f22dd65bb.png?width=1500&quality=80",
    },
    {
      id: "3",
      name: "Nike Air Force 1",
      category: "Casual",
      price: 1899,
      image:
        "https://static.flexdog.cz/flexdog-d/products/images/1e77f94e-69fd-461b-aeec-991614c427e2_imager.jpeg?width=828&quality=80",
    },
  ];

  return (
    <>
      {mockProducts.map((product) => (
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
                  <AddItemToWishlist />
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
                      showToast("Removed from wishlist");
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
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                showToast("Removed from wishlist");
              }}
              variant="icon"
              size="none"
              className="w-full h-fit bg-red-100 rounded-none py-2 sm:hidden text-red-500"
            >
              Remove item
            </Button>
          </Link>
        </div>
      ))}
    </>
  );
}
