"use client";
import React from "react";
import Image from "next/image";
import HeartIcon from "../icons/HeartIcon";
import showToast from "../ui/Toast";

export default function ProductItem() {
  const mockProducts = [
    {
      id: "1",
      name: "Nike SB",
      category: "Sneakers",
      price: 3299,
      image:
        "https://static.flexdog.cz/flexdog-7/products/images/113bae92-5259-4a80-9be5-a7484ae092f5.png?width=1500&quality=80",
    },
    {
      id: "2",
      name: "New Balance Black Castlerock",
      category: "Running",
      price: 3999,
      image:
        "https://static.flexdog.cz/flexdog-2/products/images/61e5b479-2c72-4ba7-9297-0d7f22dd65bb.png?width=1500&quality=80",
    },
    {
      id: "3",
      name: "Nike Air Force 1",
      category: "Casual",
      price: 1899,
      image:
        "https://static.flexdog.cz/flexdog-d/products/images/1e77f94e-69fd-461b-aeec-991614c427e2_imager.jpeg?width=828&quality=80",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {mockProducts.map((product) => (
        <article
          key={product.id}
          className="group relative border border-gray-300 rounded-lg flex flex-col w-60 overflow-hidden"
        >
          <div className="w-full h-40 relative overflow-hidden group-hover:opacity-75 p-4 bg-gray-100 flex items-center justify-center">
            <button
              onClick={() => {
                showToast("Added to wishlist");
              }}
              className="absolute top-2 right-2 cursor-pointer"
            >
              <HeartIcon className="hover:stroke-red-500 hover:fill-red-500" />
            </button>
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={100}
                height={100}
                className="w-full h-full object-center object-cover"
              />
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
          <div className="flex flex-col gap-1 p-4">
            <div>
              <h3 className="text-sm text-gray-700">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              kč
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
