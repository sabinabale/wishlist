import EditIcon from "@/components/icons/EditIcon";
import { Button } from "@/components/ui/Button";
import { BasicInput } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import React, { useState } from "react";

interface UpdateWishlistNameProps {
  wishlistId: string;
  className?: string;
}

export default function UpdateWishlistName({
  wishlistId,
  className,
}: UpdateWishlistNameProps) {
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
        <EditIcon className="size-5 stroke-gray-500" />
      </Button>

      {isOpen && (
        <Modal onClose={closeModal}>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">New wishlist name:</h2>
            <BasicInput placeholder="Christmas 🎄" />

            <Button variant="primary" size="default">
              Update
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
