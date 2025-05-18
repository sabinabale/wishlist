"use client";

import React, { useState } from "react";
import showToast from "../ui/Toast";
import Image from "next/image";
import Link from "next/link";

import { Product } from "@/types/types";
import RemoveFromCart from "./RemoveFromCart";

export default function CartProductItem({
  product,
  onRemoveProduct,
  onUpdateQuantity,
  className,
  initialQuantity = 1,
}: {
  product: Product;
  onRemoveProduct?: (productId: string) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  className?: string;
  initialQuantity?: number;
}) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;

    setQuantity(newQuantity);
    onUpdateQuantity?.(product.id, newQuantity);
  };

  if (!product) {
    return null;
  }

  return (
    <div
      className={`group relative border border-gray-300 rounded-lg overflow-hidden flex gap-2 w-full flex-col sm:flex-row sm:gap-6 ${className}`}
    >
      <Link href={`/product/${product.id}`} className="contents">
        <div className="relative overflow-hidden group-hover:opacity-75 p-4 bg-gray-100 flex items-center justify-center w-full sm:w-40 h-40">
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
          <div className="flex flex-col gap-1 p-4 flex-grow justify-center">
            <div>
              <h3 className="text-sm text-gray-700">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              kč
            </p>
          </div>
        </div>
      </Link>

      <div className="flex flex-col justify-center sm:flex-row gap-6 items-center px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleQuantityChange(quantity - 1);
                showToast("Quantity updated");
              }}
              className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100 cursor-pointer"
            >
              -
            </button>
            <span className="px-4 py-1">{quantity}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleQuantityChange(quantity + 1);
                showToast("Quantity updated");
              }}
              className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100 cursor-pointer"
            >
              +
            </button>
          </div>
          <div className="text-sm font-medium">
            Total:{" "}
            {(product.price * quantity)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
            kč
          </div>
        </div>
        <RemoveFromCart
          productId={product.id}
          onRemove={(productId) => {
            onRemoveProduct?.(productId);
          }}
        />
      </div>
    </div>
  );
}
