import ProductPage from "@/components/product/ProductPage";
import { PageProps } from "@/types/types";
import React from "react";

export default async function Page({ params }: PageProps) {
  const { id } = params;
  return <ProductPage id={id} />;
}
