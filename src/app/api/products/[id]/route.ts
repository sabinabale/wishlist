import { NextResponse } from "next/server";
import { readJsonFile } from "@/utils/JSONfileOperations";
import { ProductsData } from "@/types/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    const productsData = await readJsonFile<ProductsData>("products.json");

    if (!productsData.products) {
      return NextResponse.json(
        { error: "Products not found" },
        { status: 404 }
      );
    }

    const product = productsData.products.find((p) => p.id === productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
