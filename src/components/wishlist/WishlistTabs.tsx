"use client";
import React, { useState, useRef, useEffect } from "react";
import Wishlist from "./Wishlist";

export default function WishlistTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabWidths, setTabWidths] = useState<number[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = ["Favorites", "For later"];

  useEffect(() => {
    const widths = tabRefs.current.map((ref) => ref?.offsetWidth ?? 0);
    setTabWidths(widths);
  }, []);

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 relative">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              onClick={() => setActiveTab(index)}
              className={`py-4 px-1 text-sm font-medium transition-colors duration-200 ${
                activeTab === index
                  ? "text-cyan-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
          <div
            className="absolute bottom-0 h-0.5 bg-cyan-600 transition-all duration-300 ease-in-out"
            style={{
              width: tabWidths[activeTab] || 0,
              left: tabRefs.current[activeTab]?.offsetLeft || 0,
            }}
          />
        </div>
      </div>
      <div className="mt-6">
        {activeTab === 0 ? (
          <Wishlist wishlist_name="Favorites" />
        ) : (
          <Wishlist wishlist_name="For later" />
        )}
      </div>
    </div>
  );
}
