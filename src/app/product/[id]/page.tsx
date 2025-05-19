import ProductPage from "@/components/product/ProductPage";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return <ProductPage id={id} />;
}
