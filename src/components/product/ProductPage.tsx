"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Container from "../layout/Container";
import AddItemToWishlist from "@/components/wishlist/AddItemToWishlist";
import { Product } from "@/types/types";
import AddToCart from "../cart/AddToCart";

export default function ProductPage({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }
  return (
    <Container>
      <div className="flex flex-col md:flex-row gap-10 justify-center mx-auto">
        <div className="bg-gray-100 rounded-lg p-4 w-fit h-fit">
          <Image
            src={product.image}
            alt={product.name}
            width={700}
            height={420}
            className="w-[500px] h-auto"
            priority={true}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-gray-500">{product.category}</p>
          <div className="flex flex-col gap-2 mt-2"></div>
          <div className="mt-auto flex gap-6 items-center">
            <p className="text-xl font-bold">
              {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              kč
            </p>
            <AddToCart productId={product.id} />
            <AddItemToWishlist productId={product.id} />
          </div>
        </div>
      </div>
    </Container>
  );
}
