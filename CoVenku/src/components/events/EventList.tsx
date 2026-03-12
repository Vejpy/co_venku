import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

// Using a simplified interface for Event purely for display purposes based on API docs
interface EventItem {
  id: number;
  name: string | null;
  description: string | null;
  startDate?: string | null;
  endDate?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  type: string | null;
}

interface EventListProps {
  events: EventItem[];
  emptyMessage?: string;
}

export function EventList({ events, emptyMessage = "Žádné nadcházející události." }: EventListProps) {
  if (!events || events.length === 0) {
    return <p className="text-zinc-500 dark:text-zinc-400 py-4">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        const start = event.startDate || event.validFrom;
        const end = event.endDate || event.validTo;

        return (
          <div
            key={event.id}
            className="flex flex-col p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <div className="flex justify-between items-start gap-2 mb-3">
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1">
                {event.name}
              </h3>
              <span className="shrink-0 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {event.type}
              </span>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 flex-grow">
              {event.description}
            </p>

            {start && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500 mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={start}>
                  {format(new Date(start), "d. MMMM yyyy, HH:mm", { locale: cs })}
                </time>
                {end && (
                  <>
                    <span>-</span>
                    <time dateTime={end}>
                      {format(new Date(end), "HH:mm")}
                    </time>
                  </>
                )}
              </div>
            )}
            
            <Link 
              href={`/events/${event.id}`}
              className="mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
            >
              Zobrazit událost
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
