import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJsonFile, writeJsonFile } from "@/utils/JSONfileOperations";
import { WishlistsData } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const wishlistsData = await readJsonFile<WishlistsData>("wishlists.json");

    const userWishlists = wishlistsData[userId] || [];

    return NextResponse.json(userWishlists);
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlists" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get wishlist data from request
    const { name, description = "" } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Wishlist name is required" },
        { status: 400 }
      );
    }

    // Read existing wishlists
    let wishlistsData: WishlistsData;
    try {
      wishlistsData = await readJsonFile<WishlistsData>("wishlists.json");
    } catch {
      wishlistsData = {};
    }

    // Initialize user's wishlists array if it doesn't exist
    if (!wishlistsData[userId]) {
      wishlistsData[userId] = [];
    }

    // Create new wishlist
    const newWishlist = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description,
      isPublic: false,
      products: [],
      createdAt: new Date().toISOString(),
    };

    // Add to user's wishlists
    wishlistsData[userId].push(newWishlist);

    // Save updated wishlists
    await writeJsonFile("wishlists.json", wishlistsData);

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/wishlist");

    return NextResponse.json(
      {
        success: true,
        wishlist: newWishlist,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating wishlist:", error);
    return NextResponse.json(
      { error: "Failed to create wishlist" },
      { status: 500 }
    );
  }
}
