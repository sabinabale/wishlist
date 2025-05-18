// import CartItem from "@/components/cart/CartItem";
// import Container from "@/components/layout/Container";
// import React from "react";

// export default function Page() {
//   return (
//     <Container>
//       Cart
//       <div className="flex flex-col gap-4 mt-8">
//         <CartItem />
//       </div>
//     </Container>
//   );
// }

"use client";

import CartProductItem from "@/components/cart/CartItem";
import Container from "@/components/layout/Container";
import React, { useEffect, useState } from "react";
import { Cart, CartItem, Product } from "@/types/types";

export default function Page() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      try {
        setIsLoading(true);

        // Fetch cart data
        const cartResponse = await fetch("/api/cart");
        if (!cartResponse.ok) {
          throw new Error("Failed to fetch cart");
        }
        const cartData = await cartResponse.json();
        setCart(cartData);

        if (cartData.items && cartData.items.length > 0) {
          const productIds = cartData.items.map(
            (item: CartItem) => item.productId
          );
          const productsResponse = await fetch("/api/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ productIds }),
          });

          if (!productsResponse.ok) {
            throw new Error("Failed to fetch products");
          }

          const productsData = await productsResponse.json();
          setProducts(productsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching cart data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartAndProducts();
  }, []);

  const handleRemoveProduct = async (productId: string) => {
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove product");
      }

      setProducts(products.filter((product) => product.id !== productId));
      setCart((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.filter((item) => item.productId !== productId),
        };
      });
    } catch (err) {
      console.error("Error removing product:", err);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      // Update local state
      setCart((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        };
      });
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {isLoading ? (
        <div className="py-8 text-center">Loading cart...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">Error: {error}</div>
      ) : !cart || !cart.items || cart.items.length === 0 ? (
        <div className="py-8 text-center">Your cart is empty</div>
      ) : (
        <>
          <div className="flex flex-col gap-4 mt-8">
            {products.map((product) => {
              const cartItem = cart.items.find(
                (item) => item.productId === product.id
              );

              return (
                <CartProductItem
                  key={product.id}
                  product={product}
                  onRemoveProduct={handleRemoveProduct}
                  onUpdateQuantity={handleUpdateQuantity}
                  className=""
                />
              );
            })}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex justify-between">
              <span className="text-lg font-medium">Total</span>
              <span className="text-lg font-bold">
                {cart.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} kč
              </span>
            </div>
            <div className="mt-6">
              <button
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
                onClick={() => (window.location.href = "/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
