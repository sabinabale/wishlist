import ProductPage from "@/components/product/ProductPage";
import React from "react";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <ProductPage id={id} />;
}
