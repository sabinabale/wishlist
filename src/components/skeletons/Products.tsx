import React from "react";

export default function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="group relative border border-gray-300 rounded-lg overflow-hidden flex flex-col w-60"
        >
          <div className="relative overflow-hidden p-4 bg-gray-100 flex items-center justify-center w-full h-40"></div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-1 p-4">
              <div>
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mt-2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
