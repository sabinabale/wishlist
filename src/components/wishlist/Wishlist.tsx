// "use client";

// import React from "react";
// import ProductItem from "../product/ProductItem";
// import { Button } from "../ui/Button";
// import showToast from "../ui/Toast";
// import UpdateWishlistName from "@/components/wishlist/UpdateWishlistName";

// interface WishlistProps {
//   wishlist_name: string;
//   wishlistId: string;
// }

// export default function Wishlist({ wishlist_name }: WishlistProps) {
//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex items-center gap-3">
//         <h2 className="text-2xl font-bold">{wishlist_name}</h2>
//         <UpdateWishlistName />
//       </div>
//       <ProductItem layout="full-width" />
//       <Button
//         onClick={() => {
//           showToast("Added all items to cart");
//         }}
//         className="self-end"
//         variant="primary"
//         size="default"
//       >
//         Add all items to cart
//       </Button>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import ProductItem from "../product/ProductItem";
import { Button } from "../ui/Button";
import showToast from "../ui/Toast";
import UpdateWishlistName from "@/components/wishlist/UpdateWishlistName";
import { Product, WishlistData } from "@/types/types";

interface WishlistProps {
  wishlist_name: string;
  wishlistId: string;
}

export default function Wishlist({ wishlist_name, wishlistId }: WishlistProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        setLoading(true);

        const wishlistResponse = await fetch("/api/wishlists");

        if (!wishlistResponse.ok) {
          throw new Error("Failed to fetch wishlists");
        }

        const wishlists: WishlistData[] = await wishlistResponse.json();
        const currentWishlist = wishlists.find((w) => w.id === wishlistId);

        if (
          !currentWishlist ||
          !currentWishlist.products ||
          currentWishlist.products.length === 0
        ) {
          setFilteredProducts([]);
          setLoading(false);
          return;
        }

        const productsResponse = await fetch("/api/products");

        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }

        const allProducts: Product[] = await productsResponse.json();

        const products = allProducts.filter((product) =>
          currentWishlist.products.includes(product.id)
        );

        setFilteredProducts(products);
      } catch (err) {
        console.error("Error fetching wishlist products:", err);
        setError("Failed to load wishlist products");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{wishlist_name}</h2>
          <UpdateWishlistName />
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{wishlist_name}</h2>
          <UpdateWishlistName />
        </div>
        <div className="text-red-500 text-center p-6">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">{wishlist_name}</h2>
        <UpdateWishlistName />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="space-y-4">
          <ProductItem
            layout="full-width"
            productIds={filteredProducts.map((product) => product.id)}
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No products in this wishlist yet.</p>
        </div>
      )}

      <Button
        onClick={() => {
          showToast("Added all items to cart");
        }}
        className="self-end"
        variant="primary"
        size="default"
      >
        Add all items to cart
      </Button>
    </div>
  );
}
