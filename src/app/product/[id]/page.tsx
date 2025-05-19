import ProductPage from "@/components/product/ProductPage";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return <ProductPage id={id} />;
}
