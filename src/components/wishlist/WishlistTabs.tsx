"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Wishlist from "./Wishlist";
import { useAuth } from "@/context/AuthContext";
import { WishlistData } from "@/types/types";
import AddWishlist from "./AddWishlist";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";

export default function WishlistTabs() {
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("activeWishlistTab");
      return savedTab ? parseInt(savedTab, 10) : 0;
    }
    return 0;
  });
  const [tabWidths, setTabWidths] = useState<number[]>([]);
  const [wishlists, setWishlists] = useState<WishlistData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const fetchWishlists = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/wishlists?_=${Date.now()}`);

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch wishlists");
      }

      const data = await response.json();
      setWishlists(data);
    } catch (err) {
      console.error("Error fetching wishlists:", err);
      setError("Failed to load wishlists");
    } finally {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists, refreshCounter]);

  const forceRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  useEffect(() => {
    if (wishlists.length > 0) {
      const widths = tabRefs.current.map((ref) => ref?.offsetWidth ?? 0);
      setTabWidths(widths);
    }
  }, [wishlists]);

  const handleWishlistDeleted = (deletedWishlistId: string) => {
    const deletedIndex = wishlists.findIndex((w) => w.id === deletedWishlistId);

    if (deletedIndex === activeTab) {
      if (deletedIndex === wishlists.length - 1) {
        setActiveTab(Math.max(0, deletedIndex - 1));
      }
    }

    forceRefresh();
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    localStorage.setItem("activeWishlistTab", index.toString());
  };

  if (loading && wishlists.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black-600"></div>
      </div>
    );
  }

  if (error && wishlists.length === 0) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (wishlists.length === 0) {
    return (
      <div className="max-w-[1000px] mx-auto text-center p-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
          No wishlists yet!
        </h2>
        <p className="text-gray-500 mb-6">
          Create your first wishlist to start saving products you love.
        </p>
        <AddWishlist onWishlistAdded={forceRefresh} />
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 relative">
          {wishlists.map((wishlist, index) => (
            <Button
              variant="secondary"
              size="none"
              key={wishlist.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              onClick={() => handleTabClick(index)}
              className={`py-4 px-1 text-sm font-medium transition-colors duration-200 ${
                activeTab === index
                  ? "text-cyan-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {wishlist.name}
            </Button>
          ))}
          <div
            className="absolute bottom-0 h-0.5 bg-cyan-600 transition-all duration-300 ease-in-out"
            style={{
              width: tabWidths[activeTab] || 0,
              left: tabRefs.current[activeTab]?.offsetLeft || 0,
            }}
          />
          <AddWishlist onWishlistAdded={forceRefresh} />
        </div>
      </div>
      <div className="mt-6">
        {wishlists.length > 0 && activeTab < wishlists.length && (
          <Wishlist
            wishlist_name={wishlists[activeTab].name}
            wishlistId={wishlists[activeTab].id}
            onNameUpdated={forceRefresh}
            onWishlistDeleted={handleWishlistDeleted}
            isFirstWishlist={activeTab === 0}
          />
        )}
      </div>
    </div>
  );
}
