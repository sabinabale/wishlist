import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { readJsonFile, writeJsonFile } from "@/utils/JSONfileOperations";
import { WishlistsData } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function PATCH(request: NextRequest) {
  try {
    // Extract the id from the URL
    const url = new URL(request.url);
    const wishlistId = url.pathname.split("/").filter(Boolean).at(-1);

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get the updated data from request body
    const { name, description } = await request.json();

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

    // Update wishlist fields
    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json(
          { error: "Wishlist name is required" },
          { status: 400 }
        );
      }
      wishlistsData[userId][wishlistIndex].name = name.trim();
    }

    if (description !== undefined) {
      wishlistsData[userId][wishlistIndex].description = description;
    }

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
    console.error("Error updating wishlist:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Extract the id from the URL
    const url = new URL(request.url);
    const wishlistId = url.pathname.split("/").filter(Boolean).at(-1);

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
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

    // Find the wishlist index
    const wishlistIndex = wishlistsData[userId].findIndex(
      (w) => w.id === wishlistId
    );

    if (wishlistIndex === -1) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 }
      );
    }

    // Remove the wishlist
    wishlistsData[userId].splice(wishlistIndex, 1);

    // Save updated wishlists
    await writeJsonFile("wishlists.json", wishlistsData);

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/wishlist");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    return NextResponse.json(
      { error: "Failed to delete wishlist" },
      { status: 500 }
    );
  }
}
