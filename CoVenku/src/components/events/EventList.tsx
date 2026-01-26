"use client";

import type { CultureEvent } from "@/types/api";
import { EventCard } from "./EventCard";
import { cn } from "@/lib/utils";

interface EventListProps {
  events: CultureEvent[];
  selectedEventId?: number | null;
  onEventSelect?: (eventId: number) => void;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
}

export function EventList({
  events,
  selectedEventId,
  onEventSelect,
  isLoading,
  error,
  className,
}: EventListProps) {
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

  if (events.length === 0) {
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Žádné akce
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Momentálně nejsou k dispozici žádné kulturní akce.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3 p-4", className)}>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Nalezeno {events.length} akcí
      </div>
      {events.map((event) => (
        <EventCard
          key={event.Id}
          event={event}
          isSelected={selectedEventId === event.Id}
          onClick={() => onEventSelect?.(event.Id)}
        />
      ))}
    </div>
  );
}

export default EventList;
