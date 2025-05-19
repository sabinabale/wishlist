"use client";

import CartProductItem from "@/components/cart/CartProductItem";
import Container from "@/components/layout/Container";
import React, { useEffect, useState } from "react";
import { Cart, CartItem, Product } from "@/types/types";
import { Button } from "@/components/ui/Button";
import RemoveAllItemsFromCart from "@/components/cart/RemoveAllItemsFromCart";

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

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await fetch("/api/cart", {
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
    <Container className="max-w-[1000px]">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {isLoading ? (
        <div className="py-8 text-center">Loading cart...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">Error: {error}</div>
      ) : !cart || !cart.items || cart.items.length === 0 ? (
        <div className="py-8 text-center">Your cart is empty</div>
      ) : (
        <>
          <div className="flex justify-end mb-4"></div>
          <div className="flex flex-col gap-4 mt-8">
            {products.map((product) => {
              const cartItem = cart.items.find(
                (item) => item.productId === product.id
              );
              if (!cartItem) return null;

              return (
                <CartProductItem
                  key={product.id}
                  product={product}
                  initialQuantity={cartItem.quantity}
                  onRemoveProduct={(productId) => {
                    setProducts(
                      products.filter((product) => product.id !== productId)
                    );
                    setCart((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        items: prev.items.filter(
                          (item) => item.productId !== productId
                        ),
                      };
                    });
                  }}
                  onUpdateCart={(updatedCart) => {
                    setCart(updatedCart);
                  }}
                  onUpdateQuantity={handleUpdateQuantity}
                  className=""
                />
              );
            })}
            <RemoveAllItemsFromCart
              onRemoveAll={() => {
                setCart((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    items: [],
                    total: 0,
                  };
                });
                setProducts([]);
              }}
            />
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex justify-between">
              <span className="text-lg font-medium">Total</span>
              <span className="text-lg font-bold">
                {products
                  .reduce((total, product) => {
                    const cartItem = cart.items.find(
                      (item) => item.productId === product.id
                    );
                    return total + product.price * (cartItem?.quantity || 0);
                  }, 0)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                kč
              </span>
            </div>
            <div className="mt-6">
              <Button
                variant="primary"
                size="default"
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
