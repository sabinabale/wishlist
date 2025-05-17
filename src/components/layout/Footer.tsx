import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-8 mt-auto">
      <div className="flex justify-between max-w-[1860px] w-full mx-auto px-4">
        <small className="text-center text-gray-600">
          &copy; {new Date().getFullYear()} Sneaker Heaven.
        </small>
        <small className="text-center text-gray-600">
          All rights reserved.
        </small>
      </div>
    </footer>
  );
}
