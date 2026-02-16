"use client";

import type { CulturePlace } from "@/types/map";
import { getPlaceTypeIcon, getPlaceTypeColor } from "@/hooks/usePlaces";
import { cn } from "@/lib/utils";

interface PlaceCardProps {
  place: CulturePlace;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PlaceCard({ place, isSelected, onClick }: PlaceCardProps) {
  const icon = getPlaceTypeIcon(place.type);
  const color = getPlaceTypeColor(place.type);

  return (
    <div
      onClick={() => {
        console.log("PlaceCard clicked:", place.id);
        onClick?.();
      }}
      className={cn(
        "flex gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
        isSelected
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600",
      )}
    >
      {/* Icon badge */}
      <div
        className="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg"
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {place.name}
        </h3>

        <span
          className="inline-block text-xs px-2 py-0.5 rounded-full mt-1"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {place.type}
        </span>

        {place.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {place.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">
            {place.address?.city}, {place.address?.street}{" "}
            {place.address?.houseNumber}
          </span>
        </div>

        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 mt-1 text-xs text-primary hover:underline"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Webové stránky
          </a>
        )}
      </div>
    </div>
  );
}

export default PlaceCard;
