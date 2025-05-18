import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { readJsonFile, writeJsonFile } from "@/utils/JSONfileOperations";
import { WishlistsData } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function PATCH(
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

    // Get the updated name from request body
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Wishlist name is required" },
        { status: 400 }
      );
    }

    // Read wishlists data
    const wishlistsData = await readJsonFile<WishlistsData>("wishlists.json");

    // Check if user's wishlists exist
    if (!wishlistsData[userId]) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 }
      );
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

    // Update wishlist name
    wishlistsData[userId][wishlistIndex].name = name.trim();

    // Save updated wishlists
    await writeJsonFile("wishlists.json", wishlistsData);

    revalidatePath("/");
    revalidatePath("/wishlist");
    revalidatePath(`/wishlist/${wishlistId}`);

    return NextResponse.json({
      success: true,
      wishlist: wishlistsData[userId][wishlistIndex],
    });
  } catch (error) {
    console.error("Error updating wishlist name:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist name" },
      { status: 500 }
    );
  }
}
