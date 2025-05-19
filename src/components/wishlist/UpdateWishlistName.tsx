import { Button } from "@/components/ui/Button";
import { BasicInput } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import showToast from "@/components/ui/Toast";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface UpdateWishlistNameProps {
  wishlistId: string;
  className?: string;
  onNameUpdated?: () => void;
}

export default function UpdateWishlistName({
  wishlistId,
  className,
  onNameUpdated,
}: UpdateWishlistNameProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setNewName("");
  };

  const handleUpdateWishlistName = async () => {
    if (!newName.trim()) {
      showToast("Please enter a wishlist name", 1500);
      return;
    }

    try {
      setLoading(true);

      // Add a cache-busting parameter
      const response = await fetch(
        `/api/wishlists/${wishlistId}?_=${Date.now()}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update wishlist name");
      }

      closeModal();

      if (onNameUpdated) {
        onNameUpdated();
      }

      showToast("Wishlist name updated");

      router.refresh();
    } catch (error) {
      console.error("Error updating wishlist name:", error);
      showToast("Failed to update wishlist name", 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={openModal}
        variant="secondary"
        size="none"
        className={className}
      >
        Edit name
      </Button>

      {isOpen && (
        <Modal onClose={closeModal}>
          <div
            className="flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">New wishlist name:</h2>
            <BasicInput
              placeholder="Christmas 🎄"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  e.preventDefault();
                  handleUpdateWishlistName();
                }
              }}
            />

            <Button
              variant="primary"
              size="default"
              onClick={handleUpdateWishlistName}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
