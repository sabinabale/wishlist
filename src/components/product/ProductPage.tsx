"use client";
import Image from "next/image";
import React from "react";
import Container from "../layout/Container";
import { Button } from "../ui/Button";
import AddItemToWishlist from "@/components/wishlist/AddItemToWishlist";

export default function ProductPage() {
  const mockProduct = {
    id: "1",
    name: "Nike SB",
    category: "Sneakers",
    price: 3299,
    sizes: [36, 37, 38, 39, 40, 41, 42],
    image:
      "https://static.flexdog.cz/flexdog-7/products/images/113bae92-5259-4a80-9be5-a7484ae092f5.png?width=1500&quality=80",
  };

  return (
    <Container>
      <div className="flex gap-10 justify-center">
        <div className="bg-gray-100 rounded-lg p-4 w-fit h-fit">
          <Image
            src={mockProduct.image}
            alt={mockProduct.name}
            width={700}
            height={420}
            className="w-[500px] h-auto"
            priority={true}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{mockProduct.name}</h1>
          <p className="text-sm text-gray-500">{mockProduct.category}</p>
          <div className="flex flex-col gap-2 mt-2">
            <div>Size:</div>
            <div className="flex flex-wrap gap-2 max-w-90">
              {mockProduct.sizes.map((size) => (
                <Button
                  key={size}
                  className="w-fit border rounded-lg px-2 py-1"
                  variant="secondary"
                  size="default"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-auto flex gap-6 items-center">
            <p className="text-xl font-bold">
              {mockProduct.price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              kč
            </p>
            <Button variant="primary" size="default">
              Add to cart
            </Button>
            <AddItemToWishlist />
          </div>
        </div>
      </div>
    </Container>
  );
}
