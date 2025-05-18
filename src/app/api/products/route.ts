// app/api/products/route.ts
import { NextResponse } from "next/server";
import { readJsonFile } from "@/utils/JSONfileOperations";
import { ProductsData } from "@/types/types";

export async function GET() {
  try {
    const productsData = await readJsonFile<ProductsData>("products.json");

    if (!productsData.products) {
      return NextResponse.json([], { status: 404 });
    }

    return NextResponse.json(productsData.products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { productIds } = await request.json();
    const productsData = await readJsonFile<ProductsData>("products.json");

    if (!productsData.products) {
      return NextResponse.json([], { status: 404 });
    }

    const filteredProducts = productsData.products.filter((product) =>
      productIds.includes(product.id)
    );

    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
