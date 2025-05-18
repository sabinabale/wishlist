import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJsonFile, writeJsonFile } from "@/utils/JSONfileOperations";
import { WishlistsData } from "@/types/types";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const wishlistId = params.id;
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get product ID from request
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Read wishlists data
    const wishlistsData = await readJsonFile<WishlistsData>("wishlists.json");

    // Check if user's wishlists exist
    if (!wishlistsData[userId]) {
      wishlistsData[userId] = [];
    }

    // Find the wishlist
    const wishlistIndex = wishlistsData[userId].findIndex(
      (w) => w.id === wishlistId
    );

    if (wishlistIndex === -1) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 }
      );
    }

    // Check if product already exists in wishlist
    if (wishlistsData[userId][wishlistIndex].products.includes(productId)) {
      return NextResponse.json(
        { error: "Product already in wishlist" },
        { status: 409 }
      );
    }

    // Add product to wishlist
    wishlistsData[userId][wishlistIndex].products.push(productId);

    // Save updated wishlists
    await writeJsonFile("wishlists.json", wishlistsData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add product to wishlist" },
      { status: 500 }
    );
  }
}
