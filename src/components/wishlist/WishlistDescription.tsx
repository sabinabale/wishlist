"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import EditIcon from "../icons/EditIcon";
import Modal from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import showToast from "../ui/Toast";

interface UpdateWishlistDescriptionProps {
  wishlistId: string;
  initialDescription?: string;
  onDescriptionUpdated?: () => void;
}

export default function UpdateWishlistDescription({
  wishlistId,
  initialDescription = "",
  onDescriptionUpdated,
}: UpdateWishlistDescriptionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/wishlists/${wishlistId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error("Failed to update description");
      }
      showToast("Wishlist description updated!", 1500);
      setIsModalOpen(false);
      onDescriptionUpdated?.();
    } catch (error) {
      console.error("Error updating wishlist description:", error);
      showToast("Failed to update wishlist description", 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {description ? (
        <p className="text-gray-600">{description}</p>
      ) : (
        <p className="text-gray-400">No description</p>
      )}
      <Button
        variant="secondary"
        size="none"
        onClick={() => setIsModalOpen(true)}
        className="h-8 w-8"
      >
        <EditIcon className="size-4" />
      </Button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Edit Wishlist Description</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for your wishlist..."
                className="min-h-[100px] w-full p-2 border rounded-md"
              />
              <div className="flex gap-4">
                <Button
                  variant="primary"
                  size="default"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving description ..." : "Save description"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
