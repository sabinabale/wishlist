import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJsonFile } from "@/utils/JSONfileOperations";
import { WishlistsData } from "@/types/types";

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
