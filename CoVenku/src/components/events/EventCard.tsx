"use client";

import type { CultureEvent } from "@/types/api";
import { formatEventDate } from "@/hooks/useEvents";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: CultureEvent;
  isSelected?: boolean;
  onClick?: () => void;
}

export function EventCard({ event, isSelected, onClick }: EventCardProps) {
  const startDate = new Date(event.StartDate);
  const day = startDate.getDate();
  const month = startDate.toLocaleDateString("cs-CZ", { month: "short" });

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
        isSelected
          ? "border-red-500 bg-red-50 dark:bg-red-900/30 shadow-md"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600",
      )}
    >
      {/* Date badge */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-red-500 text-white rounded-lg">
        <span className="text-xl font-bold leading-none">{day}</span>
        <span className="text-xs uppercase">{month}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {event.Name}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {event.Description}
        </p>

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
            {event.Address?.City}, {event.Address?.Street}{" "}
            {event.Address?.HouseNumber}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{formatEventDate(event.StartDate)}</span>
        </div>

        {event.Organizer && (
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="truncate">{event.Organizer}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;
