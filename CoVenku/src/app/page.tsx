"use client";

import { useState } from "react";
import { usePlaces } from "@/hooks/usePlaces";
import { PlaceMap } from "@/components/places/PlaceMap";
import { PlaceList } from "@/components/places/PlaceList";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { places, geoJson, isLoading, error } = usePlaces();
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [showMobileList, setShowMobileList] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] mt-16">
      {/* Desktop Layout - Split View */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Left Panel - Place List */}
        <div className="w-[420px] flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-y-auto transition-colors">
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 transition-colors">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Kulturní místa
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Objevte kulturní místa ve vašem okolí
            </p>
          </div>
          <PlaceList
            places={places}
            selectedPlaceId={selectedPlaceId}
            onPlaceSelect={setSelectedPlaceId}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Right Panel - Map */}
        <div className="flex-1 relative">
          <PlaceMap
            geoJson={geoJson}
            selectedPlaceId={selectedPlaceId}
            onPlaceClick={setSelectedPlaceId}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Mobile Layout - Full screen map with bottom sheet */}
      <div className="lg:hidden flex flex-col flex-1 relative">
        {/* Map */}
        <div className="flex-1 relative">
          <PlaceMap
            geoJson={geoJson}
            selectedPlaceId={selectedPlaceId}
            onPlaceClick={(id) => {
              setSelectedPlaceId(id);
              setShowMobileList(true);
            }}
            className="w-full h-full"
          />

          {/* Toggle List Button */}
          <button
            onClick={() => setShowMobileList(!showMobileList)}
            className={cn(
              "absolute bottom-4 left-1/2 -translate-x-1/2 z-20",
              "px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700",
              "flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300",
              "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
            )}
          >
            <svg
              className={cn(
                "w-4 h-4 transition-transform",
                showMobileList ? "rotate-180" : "",
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            {showMobileList
              ? "Skrýt seznam"
              : `Zobrazit místa (${places.length})`}
          </button>
        </div>

        {/* Mobile Bottom Sheet */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl transition-transform duration-300",
            showMobileList ? "translate-y-0" : "translate-y-full",
          )}
          style={{ maxHeight: "60vh" }}
        >
          {/* Handle */}
          <div className="flex justify-center py-2">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Kulturní místa
              </h2>
              <button
                onClick={() => setShowMobileList(false)}
                className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(60vh - 80px)" }}
          >
            <PlaceList
              places={places}
              selectedPlaceId={selectedPlaceId}
              onPlaceSelect={(id) => {
                setSelectedPlaceId(id);
                setShowMobileList(false);
              }}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
