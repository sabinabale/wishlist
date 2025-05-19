import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import showToast from "@/components/ui/Toast";
import { WishlistData } from "@/types/types";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AddWishlist from "./AddWishlist";

interface MoveItemToAnotherWishlistProps {
  className?: string;
  productId: string;
  currentWishlistId: string;
  onMoved?: () => void;
}

export default function MoveItemToAnotherWishlist({
  className,
  productId,
  currentWishlistId,
  onMoved,
}: MoveItemToAnotherWishlistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlists, setWishlists] = useState<WishlistData[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const openModal = async () => {
    setIsOpen(true);
    await fetchWishlists();
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
      // Filter out the current wishlist
      setWishlists(
        data.filter((w: WishlistData) => w.id !== currentWishlistId)
      );
    } catch (err) {
      console.error("Error fetching wishlists:", err);
      showToast("Failed to load wishlists", 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToWishlist = async (targetWishlistId: string) => {
    try {
      setLoading(true);

      // First, add the product to the target wishlist
      const addResponse = await fetch(
        `/api/wishlists/${targetWishlistId}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        }
      );

      if (!addResponse.ok) {
        const data = await addResponse.json();
        if (addResponse.status === 409) {
          showToast("Product is already in that wishlist! 😊", 1500);
          closeModal();
          return;
        }
        throw new Error(data.error || "Failed to add product to wishlist");
      }

      // Then, remove it from the current wishlist
      const removeResponse = await fetch(
        `/api/wishlists/${currentWishlistId}/products?productId=${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!removeResponse.ok) {
        throw new Error("Failed to remove product from current wishlist");
      }

      showToast("Moved to another wishlist!", 1500);
      closeModal();

      // Call onMoved callback to trigger a refresh
      if (onMoved) {
        onMoved();
      }

      // Force a router refresh
      router.refresh();
    } catch (error) {
      console.error("Error moving product:", error);
      showToast("Failed to move product", 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleNewWishlistCreated = async () => {
    // Fetch the updated list of wishlists
    await fetchWishlists();
    // Force a router refresh to update the wishlist tabs
    router.refresh();
  };

  return (
    <>
      <Button
        onClick={openModal}
        variant="secondary"
        size="none"
        className={className}
      >
        Move to another wishlist
      </Button>

      {isOpen && (
        <Modal onClose={closeModal}>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Move to wishlist:</h2>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600"></div>
              </div>
            ) : wishlists.length === 0 ? (
              <>
                <p className="text-gray-600">No other wishlists available.</p>
                <AddWishlist onWishlistAdded={handleNewWishlistCreated} />
              </>
            ) : (
              <div className="flex flex-col gap-2">
                {wishlists.map((wishlist) => (
                  <Button
                    key={wishlist.id}
                    onClick={() => handleMoveToWishlist(wishlist.id)}
                    variant="secondary"
                    size="default"
                    className="text-left justify-start"
                    disabled={loading}
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
