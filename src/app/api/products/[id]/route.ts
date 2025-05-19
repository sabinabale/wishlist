import { NextResponse } from "next/server";
import { readJsonFile } from "@/utils/JSONfileOperations";
import { ProductsData } from "@/types/types";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const productsData = await readJsonFile<ProductsData>("products.json");

    if (!productsData.products) {
      return NextResponse.json(
        { error: "Products not found" },
        { status: 404 }
      );
    }

    const product = productsData.products.find((p) => p.id === id);

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
