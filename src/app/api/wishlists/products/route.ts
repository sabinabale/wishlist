import { WishlistsData } from "@/types/types";
import { readJsonFile } from "@/utils/JSONfileOperations";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// /api/wishlists/products/route.ts
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  const wishlistsData = await readJsonFile<WishlistsData>("wishlists.json");

  if (!wishlistsData[userId]) {
    return NextResponse.json({ isInWishlist: false, wishlists: [] });
  }

  const wishlistsWithProduct = wishlistsData[userId].filter((wishlist) =>
    wishlist.products.includes(productId)
  );

  return NextResponse.json({
    isInWishlist: wishlistsWithProduct.length > 0,
    wishlists: wishlistsWithProduct,
  });
}
