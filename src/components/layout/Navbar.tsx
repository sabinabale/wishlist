"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import UserIcon from "../icons/UserIcon";
import CartIcon from "../icons/CartIcon";
import HeartIcon from "../icons/HeartIcon";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-gray-200 ">
      <div className="flex justify-between max-w-[1860px] items-center w-full mx-auto px-4 py-4">
        <Link
          href="/"
          className={`font-medium ${
            pathname === "/" ? "text-cyan-600" : "hover:text-cyan-600"
          }`}
        >
          Products
        </Link>
        <div className="flex gap-8">
          <Link href="/app/profile">
            <UserIcon />
          </Link>
          <Link href="/wishlist">
            <HeartIcon />
          </Link>
          <Link href="/cart">
            <CartIcon />
          </Link>
        </div>
      </div>
    </nav>
  );
}
