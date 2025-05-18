import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import showToast from "@/components/ui/Toast";
import React, { useState } from "react";
import { Input } from "../ui/Input";
import PlusIcon from "../icons/PlusIcon";

interface AddWishlistProps {
  onWishlistAdded?: () => void;
  className?: string;
}

export default function AddWishlist({
  className,
  onWishlistAdded,
}: AddWishlistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlistName, setWishlistName] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button
        onClick={openModal}
        variant="primary"
        size="default"
        className={className}
      >
        <PlusIcon /> Add wishlist
      </Button>

      {isOpen && (
        <Modal onClose={closeModal}>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Wishlist name:</h2>
            <Input
              label="Wishlist name"
              value={wishlistName}
              onChange={(e) => setWishlistName(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              showToast("New wishlist created");
              onWishlistAdded?.();
              closeModal();
            }}
            variant="primary"
            size="default"
          >
            Add wishlist
          </Button>
        </Modal>
      )}
    </>
  );
}
