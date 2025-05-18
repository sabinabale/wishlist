import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJsonFile, writeJsonFile } from "@/utils/JSONfileOperations";
import { CartsData, CartItem } from "@/types/types";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const cartsData = await readJsonFile<CartsData>("carts.json");

    if (!cartsData.carts) {
      cartsData.carts = [];
    }

    const userCart = cartsData.carts.find((cart) => cart.userId === userId);

    if (!userCart) {
      return NextResponse.json({
        id: "",
        userId,
        items: [],
        total: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(userCart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const cartsData = await readJsonFile<CartsData>("carts.json");

    if (!cartsData.carts) {
      cartsData.carts = [];
    }

    let userCart = cartsData.carts.find((cart) => cart.userId === userId);
    const now = new Date().toISOString();

    if (!userCart) {
      userCart = {
        id: crypto.randomUUID(),
        userId,
        items: [],
        total: 0,
        createdAt: now,
        updatedAt: now,
      };
      cartsData.carts.push(userCart);
    }

    const existingItemIndex = userCart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex !== -1) {
      userCart.items[existingItemIndex].quantity =
        quantity || userCart.items[existingItemIndex].quantity + 1;
    } else {
      const newItem: CartItem = {
        productId,
        quantity: quantity || 1,
      };
      userCart.items.push(newItem);
    }

    userCart.total = userCart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    userCart.updatedAt = now;

    await writeJsonFile("carts.json", cartsData);

    return NextResponse.json(userCart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const cartsData = await readJsonFile<CartsData>("carts.json");

    const userCart = cartsData.carts?.find((cart) => cart.userId === userId);

    if (!userCart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const itemIndex = userCart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    userCart.items.splice(itemIndex, 1);

    userCart.total = userCart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    userCart.updatedAt = new Date().toISOString();

    await writeJsonFile("carts.json", cartsData);

    return NextResponse.json(userCart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const cartsData = await readJsonFile<CartsData>("carts.json");
    const userCart = cartsData.carts?.find((cart) => cart.userId === userId);

    if (!userCart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Clear all items from the cart
    userCart.items = [];
    userCart.total = 0;
    userCart.updatedAt = new Date().toISOString();

    await writeJsonFile("carts.json", cartsData);

    return NextResponse.json(userCart);
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
