import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import showToast from "@/components/ui/Toast";
import React, { useState } from "react";
import { BasicInput } from "../ui/Input";
import PlusIcon from "../icons/PlusIcon";
import { useRouter } from "next/navigation";

interface AddWishlistProps {
  onWishlistAdded?: (newWishlistId: string) => void;
  className?: string;
}

export default function AddWishlist({
  className,
  onWishlistAdded,
}: AddWishlistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlistName, setWishlistName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setWishlistName("");
  };

  const handleCreateWishlist = async () => {
    if (!wishlistName.trim()) {
      showToast("Please enter a wishlist name", 1500);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/wishlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: wishlistName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create wishlist");
      }

      const data = await response.json();
      closeModal();
      showToast("New wishlist created");

      if (onWishlistAdded) {
        onWishlistAdded(data.wishlist.id);
      }

      router.refresh();
    } catch (error) {
      console.error("Error creating wishlist:", error);
      showToast("Failed to create wishlist", 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={openModal}
        variant="secondary"
        size="default"
        className={`${className}`}
      >
        <PlusIcon />
        <span>Add wishlist</span>
      </Button>

      {isOpen && (
        <Modal onClose={closeModal}>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Wishlist name:</h2>
            <BasicInput
              value={wishlistName}
              placeholder="Christmas 🎄"
              onChange={(e) => setWishlistName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  e.preventDefault();
                  handleCreateWishlist();
                }
              }}
            />

            <Button
              onClick={handleCreateWishlist}
              variant="primary"
              size="default"
              disabled={loading}
              className="mt-2"
            >
              {loading ? "Creating..." : "Add wishlist"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
