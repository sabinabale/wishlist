import HeartIcon from "@/components/icons/HeartIcon";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import showToast from "@/components/ui/Toast";
import { WishlistData } from "@/types/types";
import React, { useState, useEffect, useCallback } from "react";
import { removeFromWishlist } from "./RemoveItemFromWishlist";

export default function AddItemToWishlist({
  className,
  productId,
}: {
  className?: string;
  productId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlists, setWishlists] = useState<WishlistData[]>([]);
  const [productWishlists, setProductWishlists] = useState<WishlistData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "remove">("add");

  const checkProductInWishlists = useCallback(async () => {
    if (!productId) return;

    try {
      const response = await fetch(
        `/api/wishlists/products?productId=${productId}`
      );

      if (!response.ok) return;

      const data = await response.json();
      setProductWishlists(data.wishlists || []);
      setIsInWishlist(data.isInWishlist);
    } catch (err) {
      console.error("Error checking wishlist status:", err);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      checkProductInWishlists();
    }
  }, [productId, checkProductInWishlists]);

  const fetchWishlists = useCallback(async () => {
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
  }, []);

  const openModal = useCallback(() => {
    if (isInWishlist) {
      if (productWishlists.length > 0) {
        removeFromWishlist(productId!, productWishlists[0].id, () => {
          checkProductInWishlists();
        });
      }
    } else {
      setModalMode("add");
      fetchWishlists();
      setIsOpen(true);
    }
  }, [
    isInWishlist,
    fetchWishlists,
    productWishlists,
    productId,
    checkProductInWishlists,
  ]);

  const closeModal = useCallback(() => setIsOpen(false), []);

  const addProductToWishlist = useCallback(
    async (wishlistId: string) => {
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

        await checkProductInWishlists();
        showToast("Added to wishlist");
        closeModal();
      } catch (err) {
        console.error("Error adding product to wishlist:", err);
        setError("Failed to add product to wishlist");
      } finally {
        setLoading(false);
      }
    },
    [productId, checkProductInWishlists, closeModal]
  );

  const handleAddToWishlist = useCallback(
    (wishlistId: string) => {
      addProductToWishlist(wishlistId);
    },
    [addProductToWishlist]
  );

  const handleRemoveFromWishlist = useCallback(
    (wishlistId: string) => {
      if (!productId) return;
      removeFromWishlist(productId, wishlistId, () => {
        checkProductInWishlists();
      });
    },
    [productId, checkProductInWishlists]
  );

  const createDefaultWishlist = useCallback(async () => {
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
  }, [productId, addProductToWishlist]);

  return (
    <>
      <Button
        onClick={openModal}
        variant="icon"
        size="none"
        className={className}
      >
        <HeartIcon isInWishlist={isInWishlist} />
      </Button>

      {isOpen && (
        <Modal onClose={closeModal}>
          <div className="flex flex-col gap-4">
            {modalMode === "remove" ? (
              <>
                <h2 className="text-xl font-bold">Remove From Wishlist:</h2>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center p-3">{error}</div>
                ) : productWishlists.length === 0 ? (
                  <div className="text-gray-600">
                    This product is not in any of your wishlists.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {productWishlists.map((wishlist) => (
                      <Button
                        key={wishlist.id}
                        onClick={() => handleRemoveFromWishlist(wishlist.id)}
                        variant="secondary"
                        size="default"
                        className="text-left justify-start group"
                      >
                        <span className="flex-1">{wishlist.name}</span>
                        <span className="text-red-500 opacity-0 group-hover:opacity-100">
                          Remove
                        </span>
                      </Button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
