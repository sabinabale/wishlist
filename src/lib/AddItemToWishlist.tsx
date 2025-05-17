import HeartIcon from "@/components/icons/HeartIcon";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import React, { useState } from "react";

export default function AddItemToWishlist({
  className,
}: {
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

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
            <Button variant="secondary" size="none">
              Favorites
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

// if the user is not signed in, redirect to the login page
