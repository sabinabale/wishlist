"use client";
import { Suspense, useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import ProductItem from "@/components/product/ProductItem";
import { Product } from "@/types/types";
import ProductSkeleton from "@/components/skeletons/Products";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <Container>
      <Suspense fallback={<ProductSkeleton />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} wishlistId="" />
          ))}
        </div>
      </Suspense>
    </Container>
  );
}
