import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import React, { useState } from "react";

export default function MoveItemToAnotherWishlist({
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

            <div className="flex flex-col gap-2">
              <Button variant="secondary" size="default">
                Favorites
              </Button>
              <Button variant="secondary" size="default">
                For later
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
