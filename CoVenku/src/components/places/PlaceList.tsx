"use client";

import type { CulturePlace } from "@/types/map";
import { PlaceCard } from "./PlaceCard";
import { cn } from "@/lib/utils";

interface PlaceListProps {
  places: CulturePlace[];
  selectedPlaceId?: number | null;
  onPlaceSelect?: (placeId: number) => void;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
}

export function PlaceList({
  places,
  selectedPlaceId,
  onPlaceSelect,
  isLoading,
  error,
  className,
}: PlaceListProps) {
  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-4 p-4", className)}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Chyba při načítání
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Žádná místa
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Momentálně nejsou k dispozici žádná kulturní místa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3 p-4", className)}>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Nalezeno {places.length} míst
      </div>
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          isSelected={selectedPlaceId === place.id}
          onClick={() => onPlaceSelect?.(place.id)}
        />
      ))}
    </div>
  );
}

export default PlaceList;
