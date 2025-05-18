import HeartIcon from "@/components/icons/HeartIcon";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import showToast from "@/components/ui/Toast";
import { WishlistData } from "@/types/types";
import React, { useState } from "react";

export default function AddItemToWishlist({
  className,
  productId,
}: {
  className?: string;
  productId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlists, setWishlists] = useState<WishlistData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openModal = () => {
    setIsOpen(true);
    fetchWishlists();
  };

  const closeModal = () => setIsOpen(false);

  const fetchWishlists = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/wishlists");

      if (!response.ok) {
        throw new Error("Failed to fetch wishlists");
      }

      const data = await response.json();
      setWishlists(data);
    } catch (err) {
      console.error("Error fetching wishlists:", err);
      setError("Failed to load wishlists");
    } finally {
      setLoading(false);
    }
  };

  const createDefaultWishlist = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/wishlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Favorites",
          description: "My favorite items",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create wishlist");
      }

      const newWishlist = await response.json();
      setWishlists([newWishlist]);

      if (productId) {
        await addProductToWishlist(newWishlist.id);
      }
    } catch (err) {
      console.error("Error creating wishlist:", err);
      setError("Failed to create wishlist");
    } finally {
      setLoading(false);
    }
  };

  const addProductToWishlist = async (wishlistId: string) => {
    if (!productId) {
      console.error("No product ID provided");
      setError("No product ID provided");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/wishlists/${wishlistId}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        if (response.status === 409) {
          showToast("Product already in wishlist");
          closeModal();
          return;
        }

        throw new Error(data.error || "Failed to add product to wishlist");
      }

      showToast("Added to wishlist");
      closeModal();
    } catch (err) {
      console.error("Error adding product to wishlist:", err);
      setError("Failed to add product to wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (wishlistId: string) => {
    await addProductToWishlist(wishlistId);
  };

  return (
    <>
      <Button
        onClick={openModal}
        variant="icon"
        size="none"
        className={className}
      >
        <HeartIcon />
      </Button>

      {isOpen && (
        <Modal onClose={closeModal}>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Add Item To Wishlist:</h2>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-3">{error}</div>
            ) : wishlists.length === 0 ? (
              <div className="flex flex-col gap-3">
                <p className="text-gray-600">
                  You don&apos;t have any wishlists yet.
                </p>
                <Button
                  onClick={createDefaultWishlist}
                  variant="primary"
                  size="default"
                >
                  Create &quot;Favorites&quot; Wishlist
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {wishlists.map((wishlist) => (
                  <Button
                    key={wishlist.id}
                    onClick={() => handleAddToWishlist(wishlist.id)}
                    variant="secondary"
                    size="default"
                    className="text-left justify-start"
                  >
                    {wishlist.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
